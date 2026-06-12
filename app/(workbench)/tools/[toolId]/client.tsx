"use client";

import dynamic from "next/dynamic";

export default function ToolClient({ toolId }: { toolId: string }) {
  const ToolComponent = dynamic(
    () =>
      import(`@/tools/${toolId}/page`).catch(() => ({
        default: () => (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl mb-3">🚧</p>
            <p className="text-lg font-medium text-gray-500">页面尚未实现</p>
            <p className="text-sm text-gray-400 mt-1">
              请在 tools/{toolId}/page.tsx 中实现此工具的前端界面
            </p>
          </div>
        ),
      })),
    {
      loading: () => (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-32 w-full rounded bg-gray-200" />
        </div>
      ),
      ssr: false,
    },
  );

  return <ToolComponent />;
}
