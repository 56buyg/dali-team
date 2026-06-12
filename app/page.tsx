import Link from "next/link";
import { toolRegistry } from "@/lib/tools/registry";

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

// 动态从注册表读取启用工具（排除已禁用的）
const ENABLED_TOOLS = toolRegistry
  .filter((t) => t.enabled)
  .map((t) => ({
    ...t,
    icon: TOOL_ICONS[t.id] ?? "🔧",
    color: TOOL_COLORS[t.id]?.color ?? "#343433",
    bg: TOOL_COLORS[t.id]?.bg ?? "#f2f0ed",
  }));

const ACCENT_DOTS = ["#018DFF", "#44C67F", "#5F5DE7", "#FF5310", "#F5B442"];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#FBFAF9" }}>
      {/* ════ Hero Section ════ */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="max-w-2xl space-y-10 py-24">
          {/* Accent dots row */}
          <div className="flex items-center justify-center gap-2">
            {ACCENT_DOTS.map((color, i) => (
              <span
                key={i}
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Brand label */}
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#848281]">
            DALI · 韶音设计AI
          </p>

          {/* Tagline */}
          <h1
            className="text-5xl font-bold leading-tight tracking-tight sm:text-7xl"
            style={{ color: "#343433" }}
          >
            AI 加持，
            <br />
            灵感即刻呈现
          </h1>

          {/* Subtitle */}
          <p
            className="mx-auto max-w-lg text-lg leading-relaxed"
            style={{ color: "#848281" }}
          >
            DALI 为韶音设计师量身打造——输入文字、上传草图，即可快速生成高质量视觉素材。
            从概念探索到成品输出，让 AI 替你跑完重复劳动。
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: "#343433" }}
            >
              开始使用
              <span className="text-base">→</span>
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 rounded-xl border px-7 py-3 text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{ borderColor: "#EAEAEA", color: "#494440" }}
            >
              了解更多
            </a>
          </div>
        </div>
      </main>

      {/* ════ Tools Section ════ */}
      <section
        id="tools"
        className="px-4 py-24"
        style={{ background: "#FFFFFF", borderTop: "1px solid #EAEAEA" }}
      >
        <div className="mx-auto max-w-4xl space-y-14">
          {/* Section header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              {ACCENT_DOTS.slice(0, 3).map((color, i) => (
                <span
                  key={i}
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "#343433" }}
            >
              {ENABLED_TOOLS.length} 个工具，让创意更快落地
            </h2>
            <p style={{ color: "#848281" }}>
              从概念到成品，AI 为你加速每一个环节
            </p>
          </div>

          {/* Tool cards grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {ENABLED_TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="group rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#EAEAEA" }}
              >
                {/* Icon */}
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                  style={{ backgroundColor: tool.bg }}
                >
                  {tool.icon}
                </div>
                {/* Title with subtle colored underline on hover */}
                <h3
                  className="mb-2 text-lg font-semibold"
                  style={{ color: "#343433" }}
                >
                  <span className="bg-gradient-to-r bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-all group-hover:bg-[length:100%_2px]"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${tool.color}, ${tool.color})`,
                      paddingBottom: "2px",
                    }}
                  >
                    {tool.name}
                  </span>
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#848281" }}>
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════ Bottom CTA ════ */}
      <section
        className="px-4 py-24 text-center"
        style={{ borderTop: "1px dashed #EAEAEA" }}
      >
        <div className="mx-auto max-w-lg space-y-6">
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: "#343433" }}
          >
            准备好提升设计效率了吗？
          </h2>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ backgroundColor: "#343433" }}
          >
            免费开始
            <span className="text-lg">→</span>
          </Link>
          <p className="text-sm" style={{ color: "#848281" }}>
            韶音设计部内部工具，使用公司账号登录即可
          </p>
        </div>
      </section>

      {/* ════ Footer ════ */}
      <footer
        className="px-4 py-8 text-center"
        style={{ borderTop: "1px solid #EAEAEA" }}
      >
        <p className="text-xs" style={{ color: "#848281" }}>
          © 2026 韶音科技 · 设计部内部工具
          <span className="mx-2" style={{ color: "#EAEAEA" }}>|</span>
          DALI · Design AI Lab
        </p>
      </footer>
    </div>
  );
}
