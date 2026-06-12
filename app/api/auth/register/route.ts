import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** 固定的注册验证码 */
const REGISTER_CAPTCHA = "Shokz Design-@123";

/** 内部邮箱后缀 */
const EMAIL_SUFFIX = "@shokz.design";

/**
 * POST /api/auth/register
 *
 * 账号注册：用户名 + 密码 + 验证码
 * 请求体: { username: string; password: string; captcha: string }
 * 响应:   { ok: true; user: { id, username } } 或 { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password, captcha } = await request.json();

    // ── 参数校验 ──
    if (!username || typeof username !== "string" || username.trim().length < 2) {
      return NextResponse.json(
        { error: "用户名至少需要 2 个字符" },
        { status: 400 },
      );
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "密码至少需要 6 个字符" },
        { status: 400 },
      );
    }
    if (!captcha || captcha !== REGISTER_CAPTCHA) {
      return NextResponse.json(
        { error: "验证码错误" },
        { status: 400 },
      );
    }

    const email = `${username.trim()}.${EMAIL_SUFFIX}`;

    // ── 检查用户名是否已存在 ──
    const supabaseServer = await createClient();
    const { data: existing } = await supabaseServer
      .from("profiles")
      .select("id")
      .eq("username", username.trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "该用户名已被注册" },
        { status: 409 },
      );
    }

    // ── 使用 admin client 创建用户（跳过邮箱验证） ──
    let adminClient;
    try {
      adminClient = createAdminClient();
    } catch {
      return NextResponse.json(
        { error: "服务端配置缺失，请联系管理员设置 SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 },
      );
    }

    const { data: userData, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // 跳过邮箱验证
        user_metadata: { username: username.trim() },
      });

    if (createError) {
      // 用户名重复可能是邮箱冲突
      if (createError.message?.includes("already") || createError.message?.includes("duplicate")) {
        return NextResponse.json(
          { error: "该用户名已被注册" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: createError.message },
        { status: 400 },
      );
    }

    if (!userData?.user) {
      return NextResponse.json(
        { error: "创建用户失败" },
        { status: 500 },
      );
    }

    // ── 写入 profiles 表 ──
    const { error: profileError } = await adminClient
      .from("profiles")
      .insert({
        id: userData.user.id,
        username: username.trim(),
      });

    if (profileError) {
      // 回滚：删除已创建的 auth 用户
      await adminClient.auth.admin.deleteUser(userData.user.id);
      return NextResponse.json(
        { error: "创建用户资料失败，请重试" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "注册成功，请登录",
      user: {
        id: userData.user.id,
        username: username.trim(),
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "注册失败，请稍后重试";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
