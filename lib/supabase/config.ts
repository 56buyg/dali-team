/**
 * Supabase 配置验证
 *
 * 在服务端 API 路由中调用 validateSupabaseConfig() 检查所有必需的环境变量，
 * 缺失时返回明确的错误提示。
 */

export interface SupabaseConfigStatus {
  valid: boolean;
  missing: string[];
  errors: string[];
}

/**
 * 验证 Supabase 环境变量是否完整。
 *
 * - NEXT_PUBLIC_SUPABASE_URL: 前端和服务端共用
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: 前端和服务端共用
 * - SUPABASE_SERVICE_ROLE_KEY: 仅服务端，用于 admin 操作（用户管理、RLS 绕过等）
 */
export function validateSupabaseConfig(): SupabaseConfigStatus {
  const missing: string[] = [];
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
    errors.push(
      "缺少 NEXT_PUBLIC_SUPABASE_URL — 请在环境变量中设置 Supabase 项目 URL",
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    errors.push(
      "缺少 NEXT_PUBLIC_SUPABASE_ANON_KEY — 请在环境变量中设置 Supabase 匿名密钥",
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
    errors.push(
      "服务端配置缺失，请联系管理员设置 SUPABASE_SERVICE_ROLE_KEY。" +
        "该密钥在 Supabase Dashboard → Project Settings → API → service_role key 获取。" +
        "在 Vercel 部署时，请在项目 Settings → Environment Variables 中添加。",
    );
  }

  return { valid: missing.length === 0, missing, errors };
}
