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

    // Check duplicate
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", safeName)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (serviceKey) {
      // Path A: admin client (bypasses rate limits, email confirm)
      const adminClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data: ad, error: ae } = await adminClient.auth.admin.createUser({
        email, password, email_confirm: true,
        user_metadata: { username: safeName },
      });
      if (ae) {
        if (ae.message?.includes("already")) {
          return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
        }
        return NextResponse.json({ error: ae.message }, { status: 400 });
      }
      return NextResponse.json({
        ok: true, message: "注册成功，请登录",
        user: { id: ad.user?.id, username: safeName },
      });
    }

    // Path B: signUp (anon key) — profiles auto-created by DB trigger
    const { data: d, error: e } = await supabase.auth.signUp({
      email, password,
      options: { data: { username: safeName } },
    });
    if (e) {
      if (e.message?.includes("already") || e.message?.includes("duplicate")) {
        return NextResponse.json({ error: "该用户名已被注册" }, { status: 409 });
      }
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    if (!d?.user) {
      return NextResponse.json({ error: "创建用户失败" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true, message: "注册成功，请登录",
      user: { id: d.user.id, username: safeName },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "注册失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
