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
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{tool.name}</h1>
        <p className="text-sm text-gray-500">{tool.description}</p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <ToolClient toolId={toolId} />
      </div>
    </div>
  );
}
