import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/user/images?tool_type=xxx&limit=20&offset=0
 *
 * 获取当前登录用户生成的图片历史（按时间倒序）
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const toolType = searchParams.get("tool_type");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    let query = supabase
      .from("user_images")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (toolType) {
      query = query.eq("tool_type", toolType);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "查询失败" },
        { status: 500 },
      );
    }

    return NextResponse.json({ images: data ?? [] });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "查询失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/user/images
 *
 * 保存生成的图片记录
 * 请求体: { tool_type: string; prompt?: string; image_urls: string[] }
 * 响应:   { ok: true; id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 },
      );
    }

    const { tool_type, prompt, image_urls } = await request.json();

    if (!tool_type || !Array.isArray(image_urls)) {
      return NextResponse.json(
        { error: "请提供 tool_type 和 image_urls" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_images")
      .insert({
        user_id: user.id,
        tool_type,
        prompt: prompt ?? null,
        image_urls,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "保存失败" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "保存失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
