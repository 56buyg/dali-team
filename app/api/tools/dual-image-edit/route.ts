import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitTask } from "@/lib/runninghub/client";

/**
 * POST /api/tools/dual-image-edit
 *
 * 提交双图编辑任务，立即返回 taskId（异步模式）。
 * 前端通过 GET /api/tools/status?taskId=xxx 轮询结果。
 *
 * 请求体: { imageUrl1: string; imageUrl2: string; prompt?: string }
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
    const { imageUrl1, imageUrl2, prompt = "" } = body;

    if (!imageUrl1 || !imageUrl2) {
      return NextResponse.json(
        { error: "请提供两张图片地址（imageUrl1, imageUrl2）" },
        { status: 400 },
      );
    }

    // 提交任务，立即返回 taskId
    const { taskId } = await submitTask({
      webappId: "1999309334460985346", // Runninghub 双图编辑应用 ID
      inputs: { image_url1: imageUrl1, image_url2: imageUrl2, prompt },
    });

    return NextResponse.json({ taskId });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "提交任务失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
