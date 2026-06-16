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
  code: number;
  msg: string;
  /** completed / running / queued / failed */
  status: "completed" | "running" | "queued" | "failed";
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
 * 获取 AI 应用的节点列表
 *
 * 对应 Runninghub 官方的 get_nodo 函数：
 * GET /api/webapp/apiCallDemo?apiKey={apiKey}&webappId={webappId}
 */
export async function getNodeList(webappId: string): Promise<AppNode[]> {
  const config = getConfig();
  const url = `${config.baseUrl}/api/webapp/apiCallDemo?apiKey=${encodeURIComponent(config.apiKey)}&webappId=${encodeURIComponent(webappId)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`getNodeList HTTP ${res.status}`);
    }
    const raw = await res.json();
    const data = (raw.data ?? raw) as Record<string, unknown>;
    const nodes = (data.nodeInfoList ?? []) as Record<string, unknown>[];
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
    return [];
  }
}

/**
 * 将用户输入映射为 nodeInfoList
 */
export function mapInputsToNodes(
  nodes: AppNode[],
  inputs: Record<string, string | number | undefined | null>,
): NodeInfo[] {
  const result: NodeInfo[] = [];

  for (const [key, value] of Object.entries(inputs)) {
    if (value === undefined || value === null) continue;

    let node = nodes.find(
      (n) => n.fieldName === key || n.fieldName === camelToSnake(key),
    );

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
      result.push({
        nodeId: "",
        fieldName: key,
        fieldValue: String(value),
      });
    }
  }

  return result;
}

function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

const INPUT_ALIASES: Record<string, string> = {
  imageUrl: "image",
  image_url: "image",
  style: "model",
  negative_prompt: "negative_prompt",
  negativePrompt: "negative_prompt",
};

/**
 * 提交生成任务
 *
 * 对应 Runninghub submit_task：
 * POST /task/openapi/ai-app/run
 * Body: { webappId, apiKey, nodeInfoList }
 */
export async function submitTask(
  params: TaskSubmitParams,
): Promise<{ taskId: string; promptTips?: string }> {
  const config = getConfig();
  const raw = await request<Record<string, unknown>>("/task/openapi/ai-app/run", {
    method: "POST",
    body: JSON.stringify({
      webappId: params.webappId,
      apiKey: config.apiKey,
      nodeInfoList: params.nodeInfoList,
    }),
  });

  if ((raw.code as number) !== 0) {
    throw new Error(
      `Runninghub submit error (${raw.code}): ${raw.msg ?? JSON.stringify(raw).slice(0, 200)}`,
    );
  }

  const data = (raw.data ?? raw) as Record<string, unknown>;
  const taskId = (data.taskId ?? data.task_id ?? data.id) as string;
  if (!taskId) {
    throw new Error(`Runninghub submit returned no taskId: ${JSON.stringify(raw).slice(0, 200)}`);
  }
  return { taskId, promptTips: data.promptTips as string | undefined };
}

/**
 * 查询任务输出 / 状态
 *
 * 对应 Runninghub query_task_outputs：
 * POST /task/openapi/outputs
 * Body: { apiKey, taskId }
 *
 * 返回码：
 *   code 0   → 成功，data[0].fileUrl
 *   code 804 → 运行中
 *   code 813 → 排队中
 *   code 805 → 失败
 */
export async function getTaskStatus(
  taskId: string,
): Promise<TaskStatus> {
  const config = getConfig();
  const raw = await request<Record<string, unknown>>("/task/openapi/outputs", {
    method: "POST",
    body: JSON.stringify({ apiKey: config.apiKey, taskId }),
  });

  const code = (raw.code ?? raw.status ?? -1) as number;

  if (code === 0) {
    const data = (raw.data as unknown[]) ?? [];
    const files: string[] = [];
    if (Array.isArray(data)) {
      for (const item of data) {
        const file = item as Record<string, unknown>;
        if (file.fileUrl) files.push(file.fileUrl as string);
      }
    }
    return { taskId, code, msg: "success", status: "completed", result: { files } };
  }

  if (code === 804) {
    return { taskId, code, msg: "运行中", status: "running" };
  }

  if (code === 813) {
    return { taskId, code, msg: "排队中", status: "queued" };
  }

  if (code === 805) {
    const data = raw.data as Record<string, unknown> | null;
    const failedReason = data?.failedReason as Record<string, unknown> | undefined;
    return {
      taskId,
      code,
      msg: "任务失败",
      status: "failed",
      error: failedReason
        ? `${failedReason.node_name ?? ""}: ${failedReason.exception_message ?? "未知错误"}`
        : (raw.msg as string) ?? "任务执行失败",
    };
  }

  // 未知状态，视为等待中
  return { taskId, code, msg: (raw.msg as string) ?? "未知", status: "running" };
}

/**
 * 轮询等待任务完成
 */
export async function waitForTask(
  taskId: string,
  pollIntervalMs = 5000, // Python 脚本每 5 秒轮询
  maxWaitMs = 600_000,    // 10 分钟超时（对齐 Python 脚本）
): Promise<TaskResult> {
  const start = Date.now();

  while (Date.now() - start < maxWaitMs) {
    const status = await getTaskStatus(taskId);

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
