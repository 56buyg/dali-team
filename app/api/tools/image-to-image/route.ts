import { NextRequest, NextResponse } from "next/server";
import { submitTask, waitForTask } from "@/lib/runninghub/client";

/**
 * POST /api/tools/image-to-image
 *
 * 请求体: { imageUrl: string; style: string; strength?: number }
 * 响应:   { taskId: string; result?: { files: string[] } }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, style = "anime", strength = 0.7 } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "请提供 imageUrl（原始图片地址）" },
        { status: 400 },
      );
    }

    const { taskId } = await submitTask({
      modelId: "image-to-image-sd", // Runninghub 图生图模型 ID
      inputs: { image_url: imageUrl, style, strength },
    });

    const result = await waitForTask(taskId);

    return NextResponse.json({ taskId, result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
