import { notFound } from "next/navigation";
import { getToolById } from "@/lib/tools/registry";
import ToolClient from "./client";

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

  return (
    <div className="relative space-y-4">
      {/* ── Geometric Decorations (8 shapes, varied, bright) ── */}
      <div className="decor-shape decor-shape-lg decor-circle decor-blue decor-d1" style={{ top: "-3%", right: "-2%" }} />
      <div className="decor-shape decor-shape-md decor-rounded decor-purple decor-d2" style={{ bottom: "15%", left: "-2%" }} />
      <div className="decor-shape decor-shape-sm decor-triangle decor-orange decor-d3" style={{ top: "25%", right: "5%" }} />
      <div className="decor-shape decor-shape-sm decor-capsule decor-green decor-d4" style={{ top: "8%", left: "5%" }} />
      <div className="decor-shape decor-shape-md decor-circle decor-gold decor-d5" style={{ bottom: "30%", right: "15%" }} />
      <div className="decor-shape decor-dot decor-blue decor-d6" style={{ top: "15%", right: "20%" }} />
      <div className="decor-shape decor-dot decor-purple decor-d7" style={{ bottom: "10%", left: "10%" }} />
      <div className="decor-shape decor-shape-sm decor-circle decor-pink decor-d8" style={{ top: "50%", left: "2%" }} />

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
