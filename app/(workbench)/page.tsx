import { toolRegistry, getToolsByCategory, CATEGORY_LABELS } from "@/lib/tools/registry";
import Link from "next/link";

export default function DashboardPage() {
  const grouped = getToolsByCategory();

  return (
    <div className="space-y-8">
      {/* 欢迎区 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="mt-1 text-sm text-gray-500">
          设计部门 AI 工具集成平台 · 共 {toolRegistry.filter((t) => t.enabled).length} 个工具可用
        </p>
      </div>

      {/* 工具卡片列表 */}
      {Array.from(grouped.entries()).map(([category, tools]) => (
        <section key={category}>
          <h2 className="mb-3 text-sm font-medium uppercase text-gray-400">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-lg">
                    🔧
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-[#FF6A00] transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-500">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* 空状态 */}
      {grouped.size === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🛠️</div>
          <h3 className="text-lg font-medium text-gray-900">暂无工具</h3>
          <p className="mt-1 text-sm text-gray-500">
            在 <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">lib/tools/registry.ts</code> 中注册新的 AI 工具
          </p>
        </div>
      )}
    </div>
  );
}
