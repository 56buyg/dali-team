import { NextRequest, NextResponse } from "next/server";
import { submitTask, waitForTask } from "@/lib/runninghub/client";

/**
 * POST /api/tools/ai-video
 *
 * 请求体: { prompt?: string; imageUrl?: string; duration?: number }
 * 响应:   { taskId: string; result?: { files: string[] } }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, imageUrl, duration = 5 } = body;

    if (!prompt && !imageUrl) {
      return NextResponse.json(
        { error: "请提供 prompt 或 imageUrl" },
        { status: 400 },
      );
    }

    const { taskId } = await submitTask({
      modelId: "video-generation-cog", // Runninghub 视频生成模型 ID
      inputs: {
        prompt,
        image_url: imageUrl,
        duration: Math.min(duration, 10), // 限制最长 10 秒
      },
    });

    const result = await waitForTask(taskId, 3000, 600_000); // 视频生成耗时更长

    return NextResponse.json({ taskId, result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
