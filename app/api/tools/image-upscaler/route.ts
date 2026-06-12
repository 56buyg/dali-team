import { NextRequest, NextResponse } from "next/server";
import { submitTask, waitForTask } from "@/lib/runninghub/client";

/**
 * POST /api/tools/image-upscaler
 *
 * 请求体: { imageUrl: string; scale?: 2 | 4 }
 * 响应:   { taskId: string; result?: { files: string[] } }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, scale = 2 } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "请提供 imageUrl（图片地址）" },
        { status: 400 },
      );
    }

    const { taskId } = await submitTask({
      modelId: "image-upscaler-real-esrgan", // Runninghub 超分模型 ID
      inputs: { image_url: imageUrl, scale: Math.min(scale, 4) },
    });

    const result = await waitForTask(taskId);

    return NextResponse.json({ taskId, result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
