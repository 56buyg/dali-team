import Link from "next/link";

const ACCENT_DOTS = ["#018DFF", "#44C67F", "#5F5DE7", "#FF5310", "#F5B442"];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FBFAF9" }}>
      {/* Hero Section — absurd.design style, illustration-dense */}
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4">
        {/* Background: scattered hand-drawn decorations */}
        <img
          src="/illustrations/decor-dots.svg"
          alt=""
          className="pointer-events-none absolute left-4 top-8 w-24 animate-fade-in opacity-40 sm:left-12 sm:w-32"
          aria-hidden="true"
        />
        <img
          src="/illustrations/decor-dots.svg"
          alt=""
          className="pointer-events-none absolute bottom-16 right-4 w-20 rotate-45 animate-fade-in opacity-30 sm:right-12 sm:w-28"
          aria-hidden="true"
        />

        <div className="flex w-full max-w-6xl flex-col items-center gap-10 py-16 lg:flex-row lg:gap-16 lg:py-24">
          {/* Left: Text + CTA */}
          <div className="flex-1 space-y-8 text-center">
            <div className="flex items-center justify-center gap-2">
              {ACCENT_DOTS.map((color, i) => (
                <span key={i} className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#848281]">DALI · 韶音设计AI</p>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-7xl" style={{ color: "#343433" }}>
              AI 加持，<br />灵感即刻呈现
            </h1>

            <p className="mx-auto max-w-lg text-lg leading-relaxed" style={{ color: "#848281" }}>
              DALI 为韶音设计师量身打造——输入文字、上传草图，即可快速生成高质量视觉素材。
              从概念探索到成品输出，让 AI 替你跑完重复劳动。
            </p>

            <div className="flex items-center justify-center pt-2">
              <Link href="/auth/login" className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ backgroundColor: "#343433" }}>
                开始使用<span className="text-lg">→</span>
              </Link>
            </div>
          </div>

          {/* Right: absurd.design hand-drawn surreal hero illustration */}
          <div className="flex-shrink-0">
            <img
              src="/illustrations/hero.svg"
              alt=""
              className="w-full max-w-[320px] animate-float sm:max-w-[480px] lg:max-w-[640px]"
              aria-hidden="true"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 text-center" style={{ borderTop: "1px solid #EAEAEA" }}>
        <p className="text-xs" style={{ color: "#848281" }}>
          © 2026 韶音科技 · 设计部内部工具
          <span className="mx-2" style={{ color: "#EAEAEA" }}>|</span>
          DALI · Design AI Lab
        </p>
      </footer>
    </div>
  );
}
