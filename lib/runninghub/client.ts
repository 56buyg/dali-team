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

export interface TaskSubmitParams {
  /** 工作流 ID */
  workflowId: string;
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
 *
 * 对齐 Runninghub 官方 API:
 * - 端点: POST /task/openapi/create
 * - 鉴权: Header Bearer + Body apiKey 双重校验
 */
export async function submitTask(
  params: TaskSubmitParams,
): Promise<{ taskId: string }> {
  const config = getConfig();
  return request<{ taskId: string }>("/task/openapi/create", {
    method: "POST",
    body: JSON.stringify({
      ...params,
      apiKey: config.apiKey,
    }),
  });
}

/**
 * 查询任务状态
 */
export async function getTaskStatus(taskId: string): Promise<TaskStatus> {
  return request<TaskStatus>(`/task/status/${taskId}`);
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
