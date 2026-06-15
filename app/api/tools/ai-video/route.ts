import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitTask, waitForTask } from "@/lib/runninghub/client";

/**
 * POST /api/tools/ai-video
 *
 * 请求体: { prompt?: string; imageUrl?: string; duration?: number }
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
    const { prompt, imageUrl, duration = 5 } = body;

    if (!prompt && !imageUrl) {
      return NextResponse.json(
        { error: "请提供 prompt 或 imageUrl" },
        { status: 400 },
      );
    }

    const { taskId } = await submitTask({
      workflowId: "video-generation-cog", // Runninghub 视频生成工作流 ID
      inputs: {
        prompt,
        image_url: imageUrl,
        duration: Math.min(duration, 10), // 限制最长 10 秒
      },
    });

    const result = await waitForTask(taskId, 3000, 600_000); // 视频生成耗时更长

    // 同步保存结果到数据库
    if (result?.files?.length) {
      await supabase.from("user_images").insert({
        user_id: auth.user.id,
        tool_type: "ai-video",
        prompt: prompt ?? imageUrl ?? "",
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
