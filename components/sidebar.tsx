"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getToolsByCategory,
  CATEGORY_LABELS,
} from "@/lib/tools/registry";

const TOOL_ICONS: Record<string, string> = {
  "text-to-image": "✨",
  "image-to-image": "🎨",
  "dual-image-edit": "🖼️",
  "image-upscaler": "🔍",
  "ai-video": "🎬",
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const pathname = usePathname();
  const grouped = getToolsByCategory();

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

  const displayName = username ?? "用户";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside
      className={`flex flex-col border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
      style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "#FFFFFF" }}
    >
      {/* ── Brand ── */}
      <div
        className="flex h-14 items-center gap-3 border-b px-4"
        style={{ borderColor: "rgba(0,0,0,0.04)" }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white transition-transform hover:scale-105"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          D
        </div>
        {!collapsed && (
          <span className="text-base font-bold tracking-tight" style={{ color: "#1A1A1A", fontFamily: "var(--font-heading)" }}>
            DALI
          </span>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <NavItem
          href="/"
          icon="←"
          label="首页"
          collapsed={collapsed}
          active={pathname === "/"}
        />

        {Array.from(grouped.entries()).map(([category, tools]) => (
          <div key={category} className="mt-4">
            {!collapsed && (
              <p
                className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "#848281" }}
              >
                {CATEGORY_LABELS[category] ?? category}
              </p>
            )}
            {tools.map((tool) => (
              <NavItem
                key={tool.id}
                href={`/tools/${tool.id}`}
                icon={TOOL_ICONS[tool.id] ?? "🔧"}
                label={tool.name}
                collapsed={collapsed}
                active={pathname === `/tools/${tool.id}`}
              />
            ))}
          </div>
        ))}

        {grouped.size === 0 && !collapsed && (
          <p className="mt-4 px-3 text-xs" style={{ color: "#848281" }}>
            暂无可用工具
          </p>
        )}
      </nav>

      {/* ── User ── */}
      <div
        className="border-t p-3"
        style={{ borderColor: "rgba(0,0,0,0.04)" }}
      >
        {collapsed ? (
          <div
            className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
            style={{ backgroundColor: "#f2f0ed", color: "#848281" }}
          >
            {initial}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#f2f0ed", color: "#848281" }}
            >
              {initial}
            </div>
            <div className="flex-1 text-sm leading-tight">
              <p className="font-medium" style={{ color: "#1A1A1A" }}>{displayName}</p>
              <p className="text-xs" style={{ color: "#848281" }}>设计部</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-8 items-center justify-center border-t text-xs transition-colors hover:bg-gray-50"
        style={{ borderColor: "rgba(0,0,0,0.04)", color: "#848281" }}
      >
        {collapsed ? "→" : "←"}
      </button>
    </aside>
  );
}

function NavItem({
  href,
  icon,
  label,
  collapsed,
  active,
}: {
  href: string;
  icon: string;
  label: string;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
        collapsed ? "justify-center" : ""
      }`}
      style={
        active
          ? { backgroundColor: "#f2f0ed", color: "#1A1A1A", fontWeight: 600 }
          : { color: "#494440" }
      }
      title={collapsed ? label : undefined}
    >
      <span className="flex-shrink-0 text-base">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
