"use client";

export default function ToolShell({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {children}
    </div>
  );
}

export function ToolInput({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        输入参数
      </h3>
      {children}
    </div>
  );
}

export function ToolResult({
  loading,
  error,
  files,
}: {
  loading?: boolean;
  error?: string;
  files?: string[];
}) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        生成结果
      </h3>
      {loading && (
        <div className="flex flex-col items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">生成中...</p>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      {files && files.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {files.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`生成结果 ${i + 1}`}
              className="w-full rounded-lg border border-gray-200"
            />
          ))}
        </div>
      )}
      {!loading && !error && !files && (
        <div className="flex flex-col items-center py-12 text-gray-400">
          <p className="text-3xl mb-2">🖼️</p>
          <p className="text-sm">输入参数后点击生成</p>
        </div>
      )}
    </div>
  );
}
