import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const REGISTER_CAPTCHA = "Shokz Design-@123";
const EMAIL_SUFFIX = "@shokz.com";

export async function POST(request: NextRequest) {
  try {
    const { username, password, captcha } = await request.json();

    if (!username || typeof username !== "string" || username.trim().length < 2) {
      return NextResponse.json({ error: "用户名至少需要 2 个字符" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "密码至少需要 6 个字符" }, { status: 400 });
    }
    if (!captcha || captcha !== REGISTER_CAPTCHA) {
      return NextResponse.json({ error: "验证码错误" }, { status: 400 });
    }

    const safeName = username.trim();
    const emailLocal = safeName.replace(/[^a-zA-Z0-9._-]/g, "");

    if (!emailLocal) {
      return NextResponse.json({ error: "用户名无效，请使用字母、数字或 . _ -" }, { status: 400 });
    }

    const email = `${emailLocal}${EMAIL_SUFFIX}`;
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", safeName)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
    }

    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: safeName } },
      });

    if (signUpError) {
      if (signUpError.message?.includes("already") || signUpError.message?.includes("duplicate") || signUpError.message?.includes("exists")) {
        return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
      }
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    if (!signUpData?.user) {
      return NextResponse.json({ error: "创建用户失败" }, { status: 500 });
    }

    // Set session from signUp so RLS allows the profiles INSERT
    if (signUpData.session) {
      await supabase.auth.setSession({
        access_token: signUpData.session.access_token,
        refresh_token: signUpData.session.refresh_token,
      });
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: signUpData.user.id, username: safeName });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "注册成功，请登录",
      user: { id: signUpData.user.id, username: safeName },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "注册失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
