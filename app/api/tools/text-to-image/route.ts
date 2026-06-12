import { NextRequest, NextResponse } from "next/server";
import { submitTask } from "@/lib/runninghub/client";

/**
 * POST /api/tools/text-to-image
 *
 * 提交文生图任务，立即返回 taskId（异步模式）。
 * 前端通过 GET /api/tools/status?taskId=xxx 轮询结果。
 *
 * 请求体: { prompt: string; width?: number; height?: number; style?: string }
 * 响应:   { taskId: string }
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

    // 提交 Runninghub 文生图任务，立即返回 taskId
    const { taskId } = await submitTask({
      modelId: "2048642665947860994", // Runninghub 文生图模型 ID
      inputs: { prompt, width, height, style },
    });

    return NextResponse.json({ taskId });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "提交任务失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
