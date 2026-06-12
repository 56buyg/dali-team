import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitTask, waitForTask } from "@/lib/runninghub/client";

/**
 * POST /api/tools/image-upscaler
 *
 * 请求体: { imageUrl: string; scale?: 2 | 4 }
 * 响应:   { taskId: string; result?: { files: string[] } }
 */
export async function POST(request: NextRequest) {
  try {
    // 鉴权
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

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

    // 同步保存结果到数据库
    if (result?.files?.length) {
      await supabase.from("user_images").insert({
        user_id: auth.user.id,
        tool_type: "image-upscaler",
        prompt: imageUrl, // 原图 URL 作为 prompt
        image_urls: result.files,
      });
    }

    return NextResponse.json({ taskId, result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
