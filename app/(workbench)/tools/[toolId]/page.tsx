import { notFound } from "next/navigation";
import { getToolById } from "@/lib/tools/registry";

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

  const ToolComponent = tool.component;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{tool.name}</h1>
        <p className="text-sm text-gray-500">{tool.description}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <ToolComponent />
      </div>
    </div>
  );
}
