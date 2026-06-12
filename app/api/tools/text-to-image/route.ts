import { NextRequest, NextResponse } from "next/server";
import { submitTask, waitForTask } from "@/lib/runninghub/client";

/**
 * POST /api/tools/text-to-image
 *
 * 请求体: { prompt: string; width?: number; height?: number; style?: string }
 * 响应:   { taskId: string; result?: { files: string[] } }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, width = 1024, height = 1024, style = "realistic" } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "请提供 prompt（文本描述）" },
        { status: 400 },
      );
    }

    // 提交 Runninghub 文生图任务
    const { taskId } = await submitTask({
      modelId: "2048642665947860994", // Runninghub 文生图模型 ID
      inputs: { prompt, width, height, style },
    });

    // 同步等待结果（生产环境建议用 webhook 异步处理）
    const result = await waitForTask(taskId);

    return NextResponse.json({ taskId, result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
