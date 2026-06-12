import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin 客户端 —— 使用 service_role key，可执行管理操作。
 * 用于注册流程中创建用户和写入 profiles 表。
 *
 * 需要环境变量: SUPABASE_SERVICE_ROLE_KEY
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量，管理员操作不可用");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
