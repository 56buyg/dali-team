import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 如果 Supabase 环境变量未配置，跳过中间件，让非 auth 页面正常渲染
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 允许公开访问的路径
  const publicPaths = [
    "/auth/login",
    "/auth/callback",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
  ];

  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  // 静态资源由 proxy.ts 的 matcher 排除，这里不需要处理

  // 未登录用户访问受保护路径 → 重定向到登录页
  if (!user && !isPublic) {
    // 对于 API 请求，返回 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 },
      );
    }
    // 对于页面请求，重定向到登录页
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 已登录用户访问登录页 → 重定向到首页
  if (user && pathname.startsWith("/auth/login")) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return supabaseResponse;
}
