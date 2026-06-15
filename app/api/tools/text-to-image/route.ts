import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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
    // 鉴权
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, negative_prompt, width = 1024, height = 1024 } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "请提供 prompt（文本描述）" },
        { status: 400 },
      );
    }

    // 构建 inputs（仅传模型需要的字段，不传 style——该模型直出任何风格）
    const inputs: Record<string, unknown> = {
      prompt,
      negative_prompt: negative_prompt ?? "",
      width,
      height,
    };

    // 提交 Runninghub 文生图任务，立即返回 taskId
    const { taskId } = await submitTask({
      modelId: "2048647046302801921", // Runninghub 文生图模型 ID
      inputs,
    });

    return NextResponse.json({ taskId, _inputs: inputs });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "提交任务失败";
    console.error("[text-to-image] submit error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
