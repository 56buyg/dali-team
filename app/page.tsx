"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import {
  toolRegistry,
  getToolsByCategory,
  CATEGORY_LABELS,
} from "@/lib/tools/registry";

/* ── Tool card helpers ── */

const TOOL_ICONS: Record<string, string> = {
  "text-to-image": "✨",
  "image-to-image": "🎨",
  "dual-image-edit": "🖼️",
  "image-upscaler": "🔍",
  "ai-video": "🎬",
};

const TOOL_COLORS: Record<string, { color: string; bg: string }> = {
  "text-to-image": { color: "#018DFF", bg: "#EEF5FF" },
  "image-to-image": { color: "#5F5DE7", bg: "#F3F2FF" },
  "dual-image-edit": { color: "#F5B442", bg: "#FFF8ED" },
  "image-upscaler": { color: "#44C67F", bg: "#EEFAF3" },
  "ai-video": { color: "#FF5310", bg: "#FFF5F0" },
};

/* ── Dashboard (authenticated) ── */

function DashboardPage() {
  const grouped = getToolsByCategory();
  const enabledTools = toolRegistry.filter((t) => t.enabled);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="space-y-10">
            {/* Welcome */}
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#343433" }}>
                你好，欢迎回来 👋
              </h1>
              <p className="mt-1.5 text-sm" style={{ color: "#848281" }}>
                今天想创作点什么？共 {enabledTools.length} 个工具可用
              </p>
            </div>

            {/* Tool cards */}
            {Array.from(grouped.entries()).map(([category, tools]) => (
              <section key={category}>
                <h2
                  className="mb-3 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "#848281" }}
                >
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => {
                    const c = TOOL_COLORS[tool.id] ?? {
                      color: "#343433",
                      bg: "#f2f0ed",
                    };
                    return (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className="group rounded-3xl border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md"
                        style={{ borderColor: "#EAEAEA" }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg"
                            style={{ backgroundColor: c.bg }}
                          >
                            {TOOL_ICONS[tool.id] ?? "🔧"}
                          </div>
                          <div>
                            <h3
                              className="font-semibold"
                              style={{ color: "#343433" }}
                            >
                              {tool.name}
                            </h3>
                            <p className="text-xs" style={{ color: "#848281" }}>
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Empty */}
            {grouped.size === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-5xl">🛠️</div>
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "#343433" }}
                >
                  还没有可用工具
                </h3>
                <p className="mt-1 text-sm" style={{ color: "#848281" }}>
                  工具正在配置中，请稍后再来
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Landing (unauthenticated) ── */

function LandingPage() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: "#FBFAF9" }}
    >
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4">
        {/* ── 3XL anchors + XL/2XL companions ── */}
        <div
          className="decor-shape decor-shape-3xl decor-star decor-gold decor-d1"
          style={{ top: "-12%", left: "-10%" }}
        />
        <div
          className="decor-shape decor-shape-lg decor-star decor-orange decor-d5"
          style={{ top: "16%", left: "14%" }}
        />
        <div
          className="decor-shape decor-shape-3xl decor-hexagon decor-purple decor-d2"
          style={{ top: "-10%", right: "-10%" }}
        />
        <div
          className="decor-shape decor-shape-xl decor-circle decor-pink decor-d10"
          style={{ top: "-8%", right: "20%" }}
        />
        <div
          className="decor-shape decor-shape-3xl decor-circle decor-orange decor-d3"
          style={{ bottom: "-12%", right: "-12%" }}
        />
        <div
          className="decor-shape decor-shape-3xl decor-octagon decor-green decor-d4"
          style={{ bottom: "-12%", left: "-6%" }}
        />
        {/* Bottom-right companions */}
        <div
          className="decor-shape decor-shape-lg decor-heart decor-pink decor-d6"
          style={{ bottom: "5%", right: "25%" }}
        />
        {/* Bottom-left companion */}
        <div
          className="decor-shape decor-shape-lg decor-circle decor-orange decor-d7"
          style={{ bottom: "13%", left: "24%" }}
        />
        {/* Right side near text: chat bubble */}
        <div
          className="decor-shape decor-shape-sm decor-circle decor-green decor-d9"
          style={{ top: "55%", right: "20%" }}
        />

        <div className="flex w-full max-w-6xl flex-col items-center gap-10 py-16 lg:flex-row lg:gap-16 lg:py-24">
          {/* Left: Text + CTA */}
          <div className="flex-1 space-y-8 text-center">
            <div className="flex items-center justify-center gap-2 animate-slide-up">
              {["#018DFF", "#44C67F", "#5F5DE7", "#FF5310", "#F5B442"].map(
                (color, i) => (
                  <span
                    key={i}
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ),
              )}
            </div>

            <p
              className="text-xs font-medium uppercase tracking-[0.2em] text-[#848281] animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              DALI · 韶音设计AI
            </p>

            <h1
              className="text-5xl font-bold leading-tight tracking-tight sm:text-7xl animate-slide-up"
              style={{ color: "#1A1A1A", animationDelay: "0.15s" }}
            >
              AI 加持 <br />灵感即刻呈现
            </h1>

            <p
              className="mx-auto max-w-lg text-lg leading-relaxed animate-slide-up"
              style={{ color: "#848281", animationDelay: "0.2s" }}
            >
              DALI
              为韶音设计师量身打造——输入文字、上传草图，即可快速生成高质量视觉素材。
              从概念探索到成品输出，让 AI 替你跑完重复劳动。
            </p>

            <div
              className="flex items-center justify-center pt-2 animate-slide-up"
              style={{ animationDelay: "0.25s" }}
            >
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full px-10 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#1A1A1A",
                  boxShadow: "var(--shadow-elevation-md)",
                }}
              >
                开始使用<span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="px-4 py-8 text-center"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
      >
        <p className="text-xs" style={{ color: "#848281" }}>
          © 2026 韶音科技 · 设计部内部工具
          <span className="mx-2" style={{ color: "#EAEAEA" }}>
            |
          </span>
          DALI · Design AI Lab
        </p>
      </footer>
    </div>
  );
}

/* ── Router (auth-aware) ── */

export default function HomePage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Loading — render nothing to avoid flash of wrong content
  if (user === undefined) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "#FBFAF9" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "#EAEAEA", borderTopColor: "#343433" }}
        />
      </div>
    );
  }

  if (user) {
    return <DashboardPage />;
  }

  return <LandingPage />;
}
