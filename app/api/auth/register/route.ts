import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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
      return NextResponse.json({ error: "用户名无效" }, { status: 400 });
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

    let userId: string | null = null;
    let accessToken: string | null = null;

    // Path A: admin client (bypasses rate limits, needs SERVICE_ROLE_KEY)
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey) {
      const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
        email, password, email_confirm: true,
        user_metadata: { username: safeName },
      });
      if (adminError) {
        if (adminError.message?.includes("already")) {
          return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
        }
        return NextResponse.json({ error: adminError.message }, { status: 400 });
      }
      userId = adminData.user?.id ?? null;
      // For admin-created users, write profile with admin client (bypasses RLS)
      const { error: pErr } = await adminClient.from("profiles").insert({ id: userId, username: safeName });
      if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });
    } else {
      // Path B: signUp (anon key, may hit rate limits)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email, password,
        options: { data: { username: safeName } },
      });
      if (signUpError) {
        if (signUpError.message?.includes("already")) {
          return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
        }
        return NextResponse.json({ error: signUpError.message }, { status: 400 });
      }
      if (!signUpData?.user) {
        return NextResponse.json({ error: "创建用户失败" }, { status: 500 });
      }
      userId = signUpData.user.id;
      accessToken = signUpData.session?.access_token ?? null;

      if (accessToken) {
        const authClient = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
        );
        const { error: pErr } = await authClient.from("profiles").insert({ id: userId, username: safeName });
        if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });
      } else {
        return NextResponse.json({
          error: "邮箱确认未关闭，请在 Supabase Auth Settings 中禁用 Email Confirmations",
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      ok: true, message: "注册成功，请登录",
      user: { id: userId, username: safeName },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "注册失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
