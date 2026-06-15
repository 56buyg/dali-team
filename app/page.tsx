import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Logged-in users: show workbench dashboard instead of landing page
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#FBFAF9" }}>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2" style={{ color: "#343433" }}>欢迎回来</h2>
          <p className="text-sm mb-6" style={{ color: "#848281" }}>前往工具开始创作</p>
          <div className="flex gap-3 justify-center">
            <Link href="/tools/text-to-image" className="rounded-xl px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "#343433" }}>
              文生图
            </Link>
            <Link href="/tools/image-to-image" className="rounded-xl px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: "#343433" }}>
              风格转绘
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged-out users: landing page
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FBFAF9" }}>
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4">
        <div className="decor-shape decor-shape-3xl decor-star decor-gold decor-d1" style={{ top: "-12%", left: "-10%" }} />
        <div className="decor-shape decor-shape-lg decor-star decor-orange decor-d5" style={{ top: "16%", left: "14%" }} />
        <div className="decor-shape decor-shape-3xl decor-hexagon decor-purple decor-d2" style={{ top: "-10%", right: "-10%" }} />
        <div className="decor-shape decor-shape-xl decor-circle decor-pink decor-d10" style={{ top: "-8%", right: "20%" }} />
        <div className="decor-shape decor-shape-3xl decor-circle decor-orange decor-d3" style={{ bottom: "-12%", right: "-12%" }} />
        <div className="decor-shape decor-shape-3xl decor-octagon decor-green decor-d4" style={{ bottom: "-12%", left: "-6%" }} />
        <div className="decor-shape decor-shape-lg decor-heart decor-pink decor-d6" style={{ bottom: "5%", right: "25%" }} />
        <div className="decor-shape decor-shape-lg decor-circle decor-orange decor-d7" style={{ bottom: "13%", left: "24%" }} />
        <div className="decor-shape decor-shape-sm decor-circle decor-green decor-d9" style={{ top: "55%", right: "20%" }} />
        <div className="relative z-10 text-center max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            {["#018DFF", "#44C67F", "#5F5DE7"].map((color, i) => (
              <span key={i} className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            ))}
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#848281" }}>
            DALI · 韶音设计AI
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: "#343433" }}>
            AI 加持，灵感即刻呈现
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#848281" }}>
            用先进的生成式 AI，把想法变成视觉——从草图到成品，更快、更自由。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/login" className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: "#343433" }}>
              开始使用
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-xs" style={{ color: "#848281" }}>
        2026 韶音科技 · 设计部内部工具 | DALI · Design AI Lab
      </footer>
    </div>
  );
}
