import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitTask } from "@/lib/runninghub/client";

/**
 * POST /api/tools/image-to-image
 *
 * 提交图生图任务，立即返回 taskId（异步模式）。
 * 前端通过 GET /api/tools/status?taskId=xxx 轮询结果。
 *
 * 请求体: { imageUrl: string; style: string; strength?: number }
 * 响应:   { taskId: string }
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
    const { imageUrl, style = "anime", strength = 0.7 } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "请提供 imageUrl（原始图片地址）" },
        { status: 400 },
      );
    }

    // 提交任务，立即返回 taskId
    const { taskId } = await submitTask({
      webappId: "2061356087495974914", // Runninghub 图生图应用 ID
      inputs: { image_url: imageUrl, style, strength },
    });

    return NextResponse.json({ taskId });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "提交任务失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
