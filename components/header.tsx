"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface UserInfo {
  id: string;
  email: string;
  username: string | null;
  created_at: string;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/auth/login");
  };

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "首页", href: "/" },
    ...segments.map((seg, i) => ({
      label: seg === "tools" ? "工具" : decodeURIComponent(seg),
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  const displayName = user?.username || user?.email?.split("@")[0] || "U";

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

        {/* User avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#343433" }}
            title={displayName}
          >
            {displayName.charAt(0).toUpperCase()}
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div
                className="absolute right-0 top-full mt-2 z-20 min-w-[160px] rounded-xl border bg-white py-1 shadow-lg"
                style={{ borderColor: "#EAEAEA" }}
              >
                <div className="px-4 py-2 border-b" style={{ borderColor: "#f2f0ed" }}>
                  <p className="text-sm font-medium" style={{ color: "#343433" }}>
                    {displayName}
                  </p>
                  <p className="text-xs" style={{ color: "#848281" }}>
                    设计部
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50"
                  style={{ color: "#EF4444" }}
                >
                  退出登录
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
