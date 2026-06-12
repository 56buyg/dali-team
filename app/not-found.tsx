import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#FBFAF9" }}
    >
      <div className="text-center">
        <h1 className="text-8xl font-bold" style={{ color: "#EAEAEA" }}>
          404
        </h1>
        <p className="mt-4 text-lg font-medium" style={{ color: "#343433" }}>
          页面不存在
        </p>
        <p className="mt-1 text-sm" style={{ color: "#848281" }}>
          你访问的页面可能已移除或地址有误
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ backgroundColor: "#343433" }}
          >
            返回首页
          </Link>
          <Link
            href="/auth/login"
            className="rounded-xl border px-6 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{ borderColor: "#EAEAEA", color: "#494440" }}
          >
            去登录
          </Link>
        </div>
      </div>
    </div>
  );
}
