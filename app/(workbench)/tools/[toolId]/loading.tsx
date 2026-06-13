export default function ToolLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* 标题骨架 */}
      <div className="space-y-2">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-4 w-72 rounded bg-gray-200" />
      </div>
      {/* 内容骨架 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-4">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-32 w-full rounded bg-gray-200" />
          <div className="h-10 w-full rounded bg-gray-200" />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-4">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="flex flex-col items-center py-12">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="mt-3 h-4 w-32 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
