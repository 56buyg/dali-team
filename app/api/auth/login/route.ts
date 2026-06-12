import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** 内部邮箱后缀，用于将用户名映射为 Supabase Auth 邮箱 */
const EMAIL_SUFFIX = "@shokz.design";

/**
 * POST /api/auth/login
 *
 * 账号密码登录
 * 请求体: { username: string; password: string }
 * 响应:   { user: { id, username }, session } 或 { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "请输入用户名" },
        { status: 400 },
      );
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "请输入密码" },
        { status: 400 },
      );
    }

    const email = `${username.trim()}.${EMAIL_SUFFIX}`;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg =
        error.message?.includes("Invalid login") ||
        error.message?.includes("invalid")
          ? "用户名或密码错误"
          : error.message;
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    // 获取 profile 中的用户名
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", data.user.id)
      .maybeSingle();

    return NextResponse.json({
      user: {
        id: data.user.id,
        username: profile?.username ?? username.trim(),
      },
      session: {
        expires_at: data.session?.expires_at,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "登录失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
