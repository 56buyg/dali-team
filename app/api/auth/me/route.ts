import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/me
 *
 * 获取当前登录用户信息（验证 session 是否有效）
 * 同时查询 profiles 表返回 username
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 },
      );
    }

    // 查询 profiles 表获取 username
    let username: string | null = null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      username = profile.username;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        username,
        created_at: user.created_at,
      },
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 },
    );
  }
}
