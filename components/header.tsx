"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // 从路径生成面包屑
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "首页", href: "/" },
    ...segments.map((seg, i) => ({
      label: seg === "tools" ? "工具" : decodeURIComponent(seg),
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-6">
      {/* 面包屑 */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-300">/</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-900">{crumb.label}</span>
            ) : (
              <a
                href={crumb.href}
                className="text-gray-500 hover:text-[#FF6A00] transition-colors"
              >
                {crumb.label}
              </a>
            )}
          </span>
        ))}
      </nav>

      {/* 操作区 */}
      <div className="flex items-center gap-3">
        {/* 帮助 */}
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* 通知 */}
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* 头像 */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6A00] text-xs font-bold text-white">
          U
        </div>
      </div>
    </header>
  );
}
