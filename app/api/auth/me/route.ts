import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/me
 *
 * 获取当前登录用户信息（验证 session 是否有效）
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

    // 获取 profile 中的用户名
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        username: profile?.username ?? user.user_metadata?.username ?? null,
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
