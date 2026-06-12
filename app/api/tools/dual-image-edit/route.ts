import { NextRequest, NextResponse } from "next/server";
import { submitTask, waitForTask } from "@/lib/runninghub/client";

/**
 * POST /api/tools/dual-image-edit
 *
 * 双图编辑 — 融合两张图片，AI 智能合成
 * 请求体: { imageUrl1: string; imageUrl2: string; prompt?: string }
 * 响应:   { taskId: string; result?: { files: string[] } }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl1, imageUrl2, prompt = "" } = body;

    if (!imageUrl1 || !imageUrl2) {
      return NextResponse.json(
        { error: "请提供两张图片地址（imageUrl1, imageUrl2）" },
        { status: 400 },
      );
    }

    const { taskId } = await submitTask({
      modelId: "1999309334460985346", // Runninghub 双图编辑模型 ID
      inputs: { image_url1: imageUrl1, image_url2: imageUrl2, prompt },
    });

    const result = await waitForTask(taskId);

    return NextResponse.json({ taskId, result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
