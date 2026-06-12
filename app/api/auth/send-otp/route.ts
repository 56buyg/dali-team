import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/send-otp
 *
 * 别名路由 — 与 /api/auth/login 功能相同。
 * 发送邮箱验证码（OTP）。
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "请提供有效的邮箱地址" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "验证码已发送到您的邮箱，请查收",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "发送验证码失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
