"use client";

import dynamic from "next/dynamic";

export default function ToolClient({ toolId }: { toolId: string }) {
  const ToolComponent = dynamic(
    () =>
      import(`@/tools/${toolId}/page`).catch(() => ({
        default: () => (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="mb-3 text-4xl">🚧</p>
            <p className="text-lg font-medium text-gray-500">即将上线</p>
            <p className="mt-2 text-sm text-gray-400">
              该工具正在开发中，敬请期待
            </p>
          </div>
        ),
      })),
    {
      loading: () => (
        <div className="animate-pulse space-y-4">
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
