/**
 * Runninghub API 客户端
 *
 * Runninghub 是 AI 智能体驱动的内容创作平台，提供 ComfyUI 工作流、模型 API 等。
 * 文档：https://www.runninghub.cn/call-api
 *
 * 使用方式：
 *   设置环境变量 RUNNINGHUB_API_KEY 后即可调用。
 */

const RUNNINGHUB_BASE = "https://www.runninghub.cn";

export interface RunninghubConfig {
  apiKey: string;
  baseUrl?: string;
}

/** ComfyUI 节点参数 */
export interface NodeInfo {
  /** 节点编号（来自工作流 JSON） */
  nodeId: string;
  /** 字段名 */
  fieldName: string;
  /** 字段值 */
  fieldValue: string;
}

/** API 返回的完整节点信息 */
export interface AppNode {
  nodeId: string;
  nodeName: string;
  fieldName: string;
  fieldValue: string;
  fieldType: "IMAGE" | "STRING" | "LIST" | "NUMBER" | string;
  description?: string;
}

export interface TaskSubmitParams {
  /** AI 应用 ID（对应 Runninghub 平台的 webapp_id） */
  webappId: string;
  /** ComfyUI 节点参数列表（对齐 OpenAPI nodeInfoList） */
  nodeInfoList: NodeInfo[];
  /** 回调 URL（可选） */
  webhook?: string;
}

export interface TaskStatus {
  taskId: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number; // 0-100
  result?: TaskResult;
  error?: string;
}

export interface TaskResult {
  /** 输出文件 URL 列表 */
  files: string[];
  /** 额外元数据 */
  metadata?: Record<string, unknown>;
}

/**
 * 获取配置
 */
function getConfig(): RunninghubConfig {
  const apiKey = process.env.RUNNINGHUB_API_KEY;
  if (!apiKey) {
    throw new Error("RUNNINGHUB_API_KEY 环境变量未设置");
  }
  return { apiKey, baseUrl: RUNNINGHUB_BASE };
}

/**
 * 获取 AI 应用的节点列表
 *
 * 对应 Runninghub get_nodo / getJsonApiFormat API，
 * 返回工作流的完整节点结构（nodeId, fieldName, fieldType 等）。
 */
export async function getNodeList(webappId: string): Promise<AppNode[]> {
  const config = getConfig();
  try {
    const raw = await request<unknown>("/api/openapi/getJsonApiFormat", {
      method: "POST",
      body: JSON.stringify({ webappId, apiKey: config.apiKey }),
    });
    const r = raw as Record<string, unknown>;
    // 处理 { code, data } 包装
    const d = (r.data ?? r) as Record<string, unknown>;
    const nodes = (d.nodeInfoList ?? d.nodes ?? d.node_list ?? []) as Record<string, unknown>[];
    return nodes.map((n) => ({
      nodeId: (n.nodeId ?? n.node_id ?? "") as string,
      nodeName: (n.nodeName ?? n.node_name ?? "") as string,
      fieldName: (n.fieldName ?? n.field_name ?? "") as string,
      fieldValue: (n.fieldValue ?? n.field_value ?? "") as string,
      fieldType: (n.fieldType ?? n.field_type ?? "STRING") as AppNode["fieldType"],
      description: (n.description ?? "") as string,
    }));
  } catch (e) {
    console.warn("[getNodeList] 获取节点列表失败，将使用回退映射:", e instanceof Error ? e.message : e);
    return []; // 回退：让 mapInputsToNodes 使用 fieldName 直传
  }
}

/**
 * 将用户输入映射为 nodeInfoList
 *
 * 优先在节点列表中查找 fieldName 匹配，取真实的 nodeId。
 * 如果节点列表为空或无匹配，则回退到直接构建（nodeId 为空字符串）。
 */
export function mapInputsToNodes(
  nodes: AppNode[],
  inputs: Record<string, string | number | undefined | null>,
): NodeInfo[] {
  const result: NodeInfo[] = [];

  for (const [key, value] of Object.entries(inputs)) {
    if (value === undefined || value === null) continue;

    // 尝试精确匹配 fieldName
    let node = nodes.find(
      (n) => n.fieldName === key || n.fieldName === camelToSnake(key),
    );

    // 常见别名映射
    if (!node) {
      const alias = INPUT_ALIASES[key];
      if (alias) {
        node = nodes.find(
          (n) => n.fieldName === alias || n.fieldName === camelToSnake(alias),
        );
      }
    }

    if (node) {
      result.push({
        nodeId: node.nodeId,
        fieldName: node.fieldName,
        fieldValue: String(value),
      });
    } else {
      // 回退：无法匹配节点时，使用 key 作为 fieldName，nodeId 留空
      console.warn(
        `[mapInputsToNodes] 回退映射: key="${key}", 可用节点: ${nodes.map((n) => `${n.nodeId}:${n.fieldName}`).join(", ") || "(无)"}`,
      );
      result.push({
        nodeId: "",
        fieldName: key,
        fieldValue: String(value),
      });
    }
  }

  return result;
}

/** camelCase → snake_case */
function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

/** 常见输入 key 到节点 fieldName 的别名映射 */
const INPUT_ALIASES: Record<string, string> = {
  imageUrl: "image",
  image_url: "image",
  style: "model",
  negative_prompt: "negative_prompt",
  negativePrompt: "negative_prompt",
};

/**
 * 通用请求封装
 */
async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const config = getConfig();
  const url = `${config.baseUrl}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Runninghub API error ${res.status}: ${body.slice(0, 200)}`,
    );
  }

  return res.json();
}

/**
 * 提交生成任务
 *
 * 对齐 Runninghub 官方 API:
 * - 端点: POST /task/openapi/create
 * - 鉴权: Header Bearer + Body apiKey 双重校验
 */
export async function submitTask(
  params: TaskSubmitParams,
): Promise<{ taskId: string }> {
  const config = getConfig();
  const raw = await request<unknown>("/task/openapi/create", {
    method: "POST",
    body: JSON.stringify({
      ...params,
      apiKey: config.apiKey,
    }),
  });
  const r = raw as Record<string, unknown>;
  // 处理 { code, data } 包装
  const d = (r.data as Record<string, unknown>) ?? r;
  const taskId = (d.taskId ?? d.task_id ?? d.id) as string;
  if (!taskId) {
    throw new Error(`Runninghub submit returned no taskId: ${JSON.stringify(raw).slice(0, 200)}`);
  }
  return { taskId };
}

/**
 * 查询任务状态（含原始响应，用于调试）
 */
export async function getTaskStatus(
  taskId: string,
): Promise<{ parsed: TaskStatus; raw: unknown }> {
  const raw = await request<unknown>(`/task/status/${taskId}`);
  // 处理常见的 { code, data } 包装
  const r0 = raw as Record<string, unknown>;
  const r = (r0.data as Record<string, unknown>) ?? r0;
  // 尝试规范化 Runninghub 返回的字段名
  const parsed: TaskStatus = {
    taskId: (r.taskId ?? r.task_id ?? r.id ?? taskId) as string,
    status: (r.status ?? r.state ?? "pending") as TaskStatus["status"],
    progress: (r.progress ?? r.percent ?? 0) as number,
    result: r.result
      ? {
          files: (r.result as Record<string, unknown>).files as string[] ?? [],
          metadata: (r.result as Record<string, unknown>).metadata as Record<string, unknown> | undefined,
        }
      : r.output
        ? {
            files: Array.isArray(r.output) ? r.output as string[] : [r.output as string],
          }
        : r.files
          ? { files: r.files as string[] }
          : undefined,
    error: (r.error ?? r.message) as string | undefined,
  };
  return { parsed, raw };
}

/**
 * 轮询等待任务完成
 */
export async function waitForTask(
  taskId: string,
  pollIntervalMs = 2000,
  maxWaitMs = 300_000, // 5 分钟超时
): Promise<TaskResult> {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const { parsed: status } = await getTaskStatus(taskId);

    if (status.status === "completed") {
      return status.result!;
    }
    if (status.status === "failed") {
      throw new Error(status.error ?? "任务执行失败");
    }

    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }

  throw new Error(`任务超时: ${taskId}`);
}
