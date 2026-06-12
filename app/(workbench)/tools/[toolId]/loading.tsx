export default function ToolLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* 标题骨架 */}
      <div className="space-y-2">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-4 w-64 rounded bg-gray-200" />
      </div>
      {/* 内容骨架 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-32 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
}
