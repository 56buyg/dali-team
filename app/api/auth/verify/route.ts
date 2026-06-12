import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/verify
 *
 * 验证邮箱验证码并登录
 * 请求体: { email: string; token: string }
 * 响应:   { user: { id, email }, session } 或 { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "请提供邮箱和验证码" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: String(token).trim(),
      type: "email",
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 },
      );
    }

    return NextResponse.json({
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      session: {
        expires_at: data.session?.expires_at,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "验证失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
