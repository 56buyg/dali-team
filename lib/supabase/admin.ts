import { createClient } from "@supabase/supabase-js";

/**
 * 服务端 Supabase Admin 客户端 — 使用 SERVICE_ROLE_KEY
 *
 * ⚠️ 仅用于服务端 API 路由，绝不暴露给浏览器。
 * SERVICE_ROLE_KEY 绕过 RLS，拥有数据库完全访问权限。
 *
 * 用法:
 *   const supabaseAdmin = createAdminClient()
 *   await supabaseAdmin.auth.admin.createUser({ ... })
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "服务端配置缺失：SUPABASE_SERVICE_ROLE_KEY 环境变量未设置。" +
        "请在部署平台（Vercel → Settings → Environment Variables）中添加此变量，" +
        "值从 Supabase Dashboard → Project Settings → API → service_role key 获取。",
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
