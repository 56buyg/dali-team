import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin 客户端 — 使用 service_role key
 * 用于注册时创建用户等需要管理员权限的操作
 *
 * 环境变量 SUPABASE_SERVICE_ROLE_KEY 需要在部署时配置
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
