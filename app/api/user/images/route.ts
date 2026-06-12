import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/user/images — 保存生成结果到 user_images 表
 * GET  /api/user/images — 获取当前用户的所有图片
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

    const body = await request.json();
    const { imageUrl, prompt, toolId } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "缺少 imageUrl" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_images")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        prompt: prompt || null,
        tool_id: toolId || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, image: data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "保存失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const { data, error } = await supabase
      .from("user_images")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ images: data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "获取图片失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
