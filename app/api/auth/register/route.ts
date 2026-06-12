import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const VALID_CAPTCHA = "Shokz Design-@123";

/**
 * POST /api/auth/register
 *
 * 用户名 + 密码 + 验证码注册
 * 请求体: { username: string; password: string; captcha: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password, captcha } = await request.json();

    // 参数校验
    if (!username || typeof username !== "string" || username.trim().length < 2) {
      return NextResponse.json(
        { error: "用户名至少需要 2 个字符" },
        { status: 400 },
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "密码至少需要 6 位" },
        { status: 400 },
      );
    }

    // 验证码校验（固定值）
    if (!captcha || captcha !== VALID_CAPTCHA) {
      return NextResponse.json(
        { error: "验证码错误" },
        { status: 400 },
      );
    }

    const email = `${username.trim()}@shokz.design`;

    // 使用 admin client（service_role）创建用户，绕过邮箱确认
    const adminClient = createAdminClient();
    const { data: authUser, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError) {
      // 用户名已被使用的常见错误
      if (createError.message?.includes("already")) {
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

    if (!authUser.user) {
      return NextResponse.json(
        { error: "创建用户失败，请稍后重试" },
        { status: 500 },
      );
    }

    // 在 profiles 表中创建记录（使用普通 server client）
    const supabase = await createClient();
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: authUser.user.id,
        username: username.trim(),
      });

    if (profileError) {
      // 回滚：删除刚创建的用户
      await adminClient.auth.admin.deleteUser(authUser.user.id);
      if (profileError.message?.includes("duplicate")) {
        return NextResponse.json(
          { error: "该用户名已被注册" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "注册成功，请登录",
      user: {
        id: authUser.user.id,
        username: username.trim(),
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "注册失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
