"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "首页", href: "/" },
    ...segments.map((seg, i) => ({
      label: seg === "tools" ? "工具" : decodeURIComponent(seg),
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <header
      className="flex h-14 items-center justify-between border-b bg-white px-6"
      style={{ borderColor: "#EAEAEA" }}
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <span style={{ color: "#EAEAEA" }}>/</span>}
            {i === breadcrumbs.length - 1 ? (
              <span className="font-medium" style={{ color: "#343433" }}>
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="transition-colors hover:text-[#343433]"
                style={{ color: "#848281" }}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          className="rounded-xl p-2 transition-colors hover:bg-gray-50"
          style={{ color: "#848281" }}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        <Link
          href="/auth/login"
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#343433" }}
        >
          U
        </Link>
      </div>
    </header>
  );
}
