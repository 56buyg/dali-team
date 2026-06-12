import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-200">404</h1>
        <p className="mt-4 text-lg text-gray-500">页面未找到</p>
        <p className="mt-1 text-sm text-gray-400">
          请检查网址是否正确，或返回首页
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-[#1A1A1A] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            返回首页
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            登录
          </Link>
        </div>
      </div>
    </div>
  );
}
