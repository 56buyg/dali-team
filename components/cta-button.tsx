"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * CTA 按钮 —— 首页"开始使用"
 *
 * 根据登录态决定跳转目标：
 * - 已登录 → 工作台 /tools/text-to-image
 * - 未登录 / 加载中 → /auth/login（安全默认值）
 */
export default function CtaButton() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setLoggedIn(true);
        }
      })
      .catch(() => {});
  }, []);

  const href = loggedIn ? "/tools/text-to-image" : "/auth/login";

  return (
    <Link
      href={href}
      prefetch={loggedIn}
      className="inline-flex items-center gap-2 rounded-full px-10 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
      style={{ backgroundColor: "#1A1A1A", boxShadow: "var(--shadow-elevation-md)" }}
    >
      开始使用<span className="text-lg">→</span>
    </Link>
  );
}
