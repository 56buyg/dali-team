"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getToolsByCategory,
  CATEGORY_LABELS,
  type ToolManifest,
} from "@/lib/tools/registry";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const grouped = getToolsByCategory();

  return (
    <aside
      className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* 品牌区 */}
      <div className="flex h-14 items-center gap-3 border-b border-gray-100 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6A00] text-sm font-bold text-white">
          韶
        </div>
        {!collapsed && (
          <span className="text-base font-bold text-gray-900">韶音设计</span>
        )}
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {/* 仪表盘 */}
        <NavItem
          href="/"
          icon="📊"
          label="仪表盘"
          collapsed={collapsed}
          active={pathname === "/"}
        />

        {/* 工具分组 */}
        {Array.from(grouped.entries()).map(([category, tools]) => (
          <div key={category} className="mt-3">
            {!collapsed && (
              <p className="mb-1 px-3 text-xs font-medium uppercase text-gray-400">
                {CATEGORY_LABELS[category] ?? category}
              </p>
            )}
            {tools.map((tool) => (
              <NavItem
                key={tool.id}
                href={`/tools/${tool.id}`}
                icon="🔧"
                label={tool.name}
                collapsed={collapsed}
                active={pathname === `/tools/${tool.id}`}
              />
            ))}
          </div>
        ))}

        {/* 空状态提示 */}
        {grouped.size === 0 && !collapsed && (
          <p className="mt-4 px-3 text-xs text-gray-400">
            暂无工具 — 在 registry.ts 中注册
          </p>
        )}
      </nav>

      {/* 底部用户区 */}
      <div className="border-t border-gray-100 p-3">
        {collapsed ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 mx-auto">
            U
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
              U
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium text-gray-900">用户</p>
              <p className="text-xs text-gray-500">设计部</p>
            </div>
          </div>
        )}
      </div>

      {/* 折叠按钮 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-8 items-center justify-center border-t border-gray-100 text-xs text-gray-400 hover:text-gray-600"
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
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-orange-50 text-[#FF6A00] font-medium"
          : "text-gray-700 hover:bg-gray-50"
      } ${collapsed ? "justify-center" : ""}`}
      title={collapsed ? label : undefined}
    >
      <span className="text-base flex-shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
