import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const EMAIL_SUFFIX = "@shokz.com";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "请输入用户名" }, { status: 400 });
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "请输入密码" }, { status: 400 });
    }

    const emailLocal = username.trim().replace(/[^a-zA-Z0-9._-]/g, "");
    const email = `${emailLocal}${EMAIL_SUFFIX}`;
    const supabase = await createClient();

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // Auto-confirm if email not confirmed (fixes old test accounts)
    if (error?.message?.includes("Email not confirmed")) {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (serviceKey) {
        const adminClient = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey,
          { auth: { autoRefreshToken: false, persistSession: false } }
        );
        // Find the user by email
        const { data: users } = await adminClient.auth.admin.listUsers();
        const user = users?.users?.find((u: { email?: string }) => u.email === email);
        if (user) {
          await adminClient.auth.admin.updateUserById(user.id, { email_confirm: true });
          // Retry login
          const retry = await supabase.auth.signInWithPassword({ email, password });
          data = retry.data;
          error = retry.error;
        }
      }
    }

    if (error) {
      const msg = error.message?.includes("Invalid login") || error.message?.includes("invalid")
        ? "用户名或密码错误" : error.message;
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", data.user.id)
      .maybeSingle();

    return NextResponse.json({
      user: { id: data.user.id, username: profile?.username ?? username.trim() },
      session: { expires_at: data.session?.expires_at },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "登录失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
