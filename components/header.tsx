"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.username) {
          setUsername(data.user.username);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
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

  const initial = username?.charAt(0)?.toUpperCase() ?? "U";

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

      {/* User */}
      <div className="flex items-center gap-3">
        {username && (
          <span className="text-xs font-medium" style={{ color: "#494440" }}>
            {username}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#343433" }}
          title="退出登录"
        >
          {initial}
        </button>
      </div>
    </header>
  );
}
