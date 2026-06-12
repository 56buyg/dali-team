import { toolRegistry, getToolsByCategory, CATEGORY_LABELS } from "@/lib/tools/registry";
import Link from "next/link";

const TOOL_ICONS: Record<string, string> = {
  "text-to-image": "✨",
  "image-to-image": "🎨",
  "image-upscaler": "🔍",
  "ai-video": "🎬",
};

const TOOL_COLORS: Record<string, { color: string; bg: string }> = {
  "text-to-image": { color: "#018DFF", bg: "#EEF5FF" },
  "image-to-image": { color: "#5F5DE7", bg: "#F3F2FF" },
  "image-upscaler": { color: "#44C67F", bg: "#EEFAF3" },
  "ai-video": { color: "#FF5310", bg: "#FFF5F0" },
};

export default function DashboardPage() {
  const grouped = getToolsByCategory();
  const enabledTools = toolRegistry.filter((t) => t.enabled);

  return (
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
              const c = TOOL_COLORS[tool.id] ?? { color: "#343433", bg: "#f2f0ed" };
              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="group rounded-2xl border bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-md"
                  style={{ borderColor: "#EAEAEA" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-lg"
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
          <h3 className="text-lg font-semibold" style={{ color: "#343433" }}>
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
