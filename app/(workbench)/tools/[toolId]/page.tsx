import { notFound } from "next/navigation";
import { getToolById } from "@/lib/tools/registry";
import ToolClient from "./client";

const TOOL_ACCENT: Record<string, string> = {
  "text-to-image":   "decor-blue",
  "image-to-image":  "decor-purple",
  "dual-image-edit": "decor-gold",
  "image-upscaler":  "decor-green",
  "ai-video":        "decor-orange",
};

export default async function ToolPage({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const { toolId } = await params;
  const tool = getToolById(toolId);

  if (!tool) {
    notFound();
  }

  const accent = TOOL_ACCENT[toolId] ?? "decor-blue";

  return (
    <div className="relative space-y-4">
      {/* ── Geometric Decorations ── */}
      <div className={`decor-shape decor-shape-lg decor-rounded ${accent} decor-d1`} style={{ top: "-3%", right: "-2%" }} />
      <div className="decor-shape decor-shape-sm decor-circle decor-d2" style={{ bottom: "20%", left: "-1%", background: "var(--color-accent-purple-light)" }} />
      <div className="decor-shape decor-dot decor-d3" style={{ top: "30%", right: "8%", background: "var(--color-accent-gold)" }} />

      {/* Header */}
      <div className="relative z-[1] animate-slide-up">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: "#1A1A1A" }}>{tool.name}</h1>
        <p className="text-sm" style={{ color: "#848281" }}>{tool.description}</p>
      </div>

      {/* Tool content */}
      <div
        className="relative z-[1] rounded-2xl border bg-white p-6"
        style={{ borderColor: "rgba(0,0,0,0.06)", boxShadow: "var(--shadow-elevation-sm)" }}
      >
        <ToolClient toolId={toolId} />
      </div>
    </div>
  );
}
