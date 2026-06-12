import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/login
 *
 * 用户名 + 密码登录 (signInWithPassword)
 * 请求体: { username: string; password: string }
 * 响应:   { ok: true; user: { id, email, username } }
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

    const email = `${username.trim()}@shokz.design`;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: "用户名或密码错误" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "登录失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
