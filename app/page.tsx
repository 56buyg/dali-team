import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FBFAF9" }}>
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4">
        {/* ── 11 geometric shapes, mixed sizes (3XL→SM), heart + star ── */}
        <div className="decor-shape decor-shape-xl decor-star decor-gold decor-d1" style={{ top: "-10%", left: "-8%" }} />
        <div className="decor-shape decor-shape-2xl decor-rounded decor-purple decor-d2" style={{ top: "-8%", right: "-10%" }} />
        <div className="decor-shape decor-shape-sm decor-circle decor-blue decor-d3" style={{ bottom: "8%", left: "5%" }} />
        <div className="decor-shape decor-shape-2xl decor-circle decor-orange decor-d4" style={{ bottom: "-12%", right: "-12%" }} />
        <div className="decor-shape decor-shape-lg decor-triangle decor-gold decor-d5" style={{ top: "35%", left: "55%" }} />
        <div className="decor-shape decor-shape-sm decor-capsule decor-pink decor-d6" style={{ top: "50%", left: "12%" }} />
        <div className="decor-shape decor-shape-md decor-star decor-gold decor-d7" style={{ top: "12%", right: "16%" }} />
        <div className="decor-shape decor-shape-md decor-heart decor-pink decor-d8" style={{ top: "42%", right: "16%" }} />
        <div className="decor-shape decor-shape-md decor-rounded decor-purple decor-d9" style={{ top: "44%", right: "22%" }} />
        <div className="decor-shape decor-shape-sm decor-circle decor-green decor-d10" style={{ top: "60%", right: "12%" }} />
        <div className="decor-shape decor-shape-sm decor-capsule decor-purple decor-d11" style={{ top: "78%", right: "18%" }} />

        <div className="flex w-full max-w-6xl flex-col items-center gap-10 py-16 lg:flex-row lg:gap-16 lg:py-24">
          {/* Left: Text + CTA */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 lg:justify-start animate-slide-up">
              {["#018DFF", "#44C67F", "#5F5DE7", "#FF5310", "#F5B442"].map((color, i) => (
                <span key={i} className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#848281] animate-slide-up" style={{ animationDelay: "0.1s" }}>
              DALI · 韶音设计AI
            </p>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-7xl animate-slide-up" style={{ color: "#1A1A1A", animationDelay: "0.15s" }}>
              AI 加持，<br />灵感即刻呈现
            </h1>

            <p className="mx-auto max-w-lg text-lg leading-relaxed lg:mx-0 animate-slide-up" style={{ color: "#848281", animationDelay: "0.2s" }}>
              DALI 为韶音设计师量身打造——输入文字、上传草图，即可快速生成高质量视觉素材。
              从概念探索到成品输出，让 AI 替你跑完重复劳动。
            </p>

            <div className="flex items-center justify-center pt-2 lg:justify-start animate-slide-up" style={{ animationDelay: "0.25s" }}>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full px-10 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "#1A1A1A", boxShadow: "var(--shadow-elevation-md)" }}
              >
                开始使用<span className="text-lg">→</span>
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 text-center" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <p className="text-xs" style={{ color: "#848281" }}>
          © 2026 韶音科技 · 设计部内部工具
          <span className="mx-2" style={{ color: "#EAEAEA" }}>|</span>
          DALI · Design AI Lab
        </p>
      </footer>
    </div>
  );
}
