import { toolRegistry, getToolsByCategory, CATEGORY_LABELS } from "@/lib/tools/registry";
import Link from "next/link";

const TOOL_ICONS: Record<string, string> = {
  "text-to-image": "✨",
  "image-to-image": "🎨",
  "dual-image-edit": "🖼️",
  "image-upscaler": "🔍",
  "ai-video": "🎬",
};

const TOOL_COLORS: Record<string, { color: string; bg: string; cardBg: string; accentClass: string }> = {
  "text-to-image":    { color: "#018DFF", bg: "#EEF5FF", cardBg: "#F8FBFF", accentClass: "card-blue" },
  "image-to-image":   { color: "#5F5DE7", bg: "#F3F2FF", cardBg: "#F9F8FF", accentClass: "card-purple" },
  "dual-image-edit":  { color: "#F5B442", bg: "#FFF8ED", cardBg: "#FFFCF5", accentClass: "card-gold" },
  "image-upscaler":   { color: "#44C67F", bg: "#EEFAF3", cardBg: "#F6FCF8", accentClass: "card-green" },
  "ai-video":         { color: "#FF5310", bg: "#FFF5F0", cardBg: "#FFF9F7", accentClass: "card-orange" },
};

export default function DashboardPage() {
  const grouped = getToolsByCategory();
  const enabledTools = toolRegistry.filter((t) => t.enabled);

  return (
    <div className="relative space-y-10">
      {/* ── Geometric Decorations (background layer) ── */}
      <div className="decor-shape decor-shape-lg decor-rounded decor-blue decor-d1" style={{ top: "-2%", right: "-3%" }} />
      <div className="decor-shape decor-shape-md decor-circle decor-purple decor-d2" style={{ bottom: "15%", left: "-2%" }} />
      <div className="decor-shape decor-shape-sm decor-rounded decor-gold decor-d3" style={{ top: "40%", right: "5%" }} />
      <div className="decor-shape decor-dot decor-green" style={{ top: "25%", right: "15%" }} />
      <div className="decor-shape decor-dot decor-orange" style={{ bottom: "30%", left: "10%" }} />

      {/* Welcome */}
      <div className="relative z-[1] animate-slide-up">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1A1A1A" }}>
          你好，欢迎回来 👋
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "#848281" }}>
          今天想创作点什么？共 {enabledTools.length} 个工具可用
        </p>
      </div>

      {/* Tool cards */}
      {Array.from(grouped.entries()).map(([category, tools]) => (
        <section key={category} className="relative z-[1]">
          <h2
            className="mb-4 text-[11px] font-semibold uppercase tracking-wider animate-slide-up"
            style={{ color: "#848281" }}
          >
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 card-stagger">
            {tools.map((tool) => {
              const c = TOOL_COLORS[tool.id] ?? { color: "#1A1A1A", bg: "#f2f0ed", cardBg: "#FFFFFF", accentClass: "" };
              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className={`group dashboard-card rounded-2xl p-5 ${c.accentClass}`}
                  style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: c.cardBg }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-lg transition-transform group-hover:scale-110"
                      style={{ backgroundColor: c.bg }}
                    >
                      {TOOL_ICONS[tool.id] ?? "🔧"}
                    </div>
                    <div>
                      <h3
                        className="font-semibold tracking-tight"
                        style={{ color: "#1A1A1A" }}
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
        <div className="relative z-[1] flex flex-col items-center justify-center py-20 text-center animate-slide-up">
          <div className="mb-4 text-5xl">🛠️</div>
          <h3 className="text-lg font-semibold" style={{ color: "#1A1A1A" }}>
            还没有可用工具
          </h3>
          <p className="mt-1 text-sm" style={{ color: "#848281" }}>
            工具正在配置中，请稍后再来
          </p>
        </div>
      )}
    </div>
  );
}
