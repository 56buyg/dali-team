/**
 * Runninghub API 客户端
 *
 * Runninghub 是 AI 智能体驱动的内容创作平台，提供 ComfyUI 工作流、模型 API 等。
 * 文档：https://www.runninghub.cn/call-api
 *
 * 使用方式：
 *   设置环境变量 RUNNINGHUB_API_KEY 后即可调用。
 */

const RUNNINGHUB_BASE = "https://www.runninghub.cn/api";

export interface RunninghubConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface TaskSubmitParams {
  /** 模型/工作流 ID */
  modelId: string;
  /** 输入参数 */
  inputs: Record<string, unknown>;
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
 */
export async function submitTask(
  params: TaskSubmitParams,
): Promise<{ taskId: string }> {
  const raw = await request<unknown>("/task/submit", {
    method: "POST",
    body: JSON.stringify(params),
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
