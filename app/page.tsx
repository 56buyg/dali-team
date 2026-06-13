import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FBFAF9" }}>
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4">
        {/* ── Geometric background decorations (8 shapes, varied, bright) ── */}
        <div className="decor-shape decor-shape-xl decor-circle decor-blue decor-d1" style={{ top: "-6%", right: "-4%" }} />
        <div className="decor-shape decor-shape-lg decor-rounded decor-purple decor-d2" style={{ bottom: "8%", left: "-3%" }} />
        <div className="decor-shape decor-shape-md decor-circle decor-gold decor-d3" style={{ top: "35%", left: "3%" }} />
        <div className="decor-shape decor-shape-sm decor-capsule decor-green decor-d4" style={{ top: "15%", right: "8%" }} />
        <div className="decor-shape decor-shape-md decor-triangle decor-orange decor-d5" style={{ bottom: "30%", right: "12%" }} />
        <div className="decor-shape decor-dot decor-purple decor-d6" style={{ top: "12%", right: "30%" }} />
        <div className="decor-shape decor-dot decor-gold decor-d7" style={{ top: "50%", left: "15%" }} />
        <div className="decor-shape decor-shape-sm decor-circle decor-pink decor-d8" style={{ bottom: "5%", right: "25%" }} />

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
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "#1A1A1A", boxShadow: "var(--shadow-elevation-md)" }}
              >
                开始使用<span className="text-lg">→</span>
              </Link>
            </div>
          </div>

          {/* Right: Geometric cluster replacing hero illustration */}
          <div className="relative flex-shrink-0 h-[320px] w-[320px] sm:h-[480px] sm:w-[480px] lg:h-[560px] lg:w-[560px] animate-float">
            <div className="decor-shape decor-shape-xl decor-circle decor-blue" style={{ top: "10%", left: "5%" }} />
            <div className="decor-shape decor-shape-lg decor-capsule decor-purple" style={{ top: "5%", right: "10%", animationDelay: "0.1s" }} />
            <div className="decor-shape decor-shape-md decor-triangle decor-orange" style={{ bottom: "15%", left: "20%", animationDelay: "0.15s" }} />
            <div className="decor-shape decor-shape-lg decor-rounded decor-green" style={{ bottom: "10%", right: "5%", animationDelay: "0.2s" }} />
            <div className="decor-shape decor-shape-sm decor-circle decor-gold" style={{ top: "45%", left: "40%", animationDelay: "0.25s" }} />
            <div className="decor-shape decor-shape-md decor-circle decor-pink" style={{ top: "30%", left: "50%", animationDelay: "0.3s" }} />
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
