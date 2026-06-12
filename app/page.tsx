import { shokzBrand } from "@/lib/semi-theme";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center space-y-6">
        {/* 品牌标题 */}
        <h1
          className="text-6xl font-bold tracking-tight"
          style={{ color: shokzBrand.black }}
        >
          韶音设计
        </h1>
        <p
          className="text-xl font-medium"
          style={{ color: shokzBrand.orange }}
        >
          Shokz Design
        </p>
        <p className="text-gray-500 text-sm">
          AI 工具集成平台 · Next.js + Semi Design + Supabase
        </p>

        {/* 品牌色预览 */}
        <div className="flex gap-3 justify-center pt-4">
          <div
            className="w-10 h-10 rounded-full border border-gray-200"
            style={{ backgroundColor: shokzBrand.white }}
            title="白色主调"
          />
          <div
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: shokzBrand.black }}
            title="黑色"
          />
          <div
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: shokzBrand.orange }}
            title="橙色点缀"
          />
        </div>

        {/* CTA 按钮 */}
        <div className="flex gap-4 justify-center pt-6">
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: shokzBrand.orange }}
          >
            邮箱登录
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            进入工作台
          </a>
        </div>
      </div>
    </main>
  );
}
