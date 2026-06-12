import { NextRequest, NextResponse } from "next/server";
import { getTaskStatus } from "@/lib/runninghub/client";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/tools/status?taskId=xxx
 *
 * 查询 Runninghub 任务状态（供前端轮询）
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "缺少 taskId 参数" },
        { status: 400 },
      );
    }

    const status = await getTaskStatus(taskId);

    return NextResponse.json(status);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "查询状态失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
