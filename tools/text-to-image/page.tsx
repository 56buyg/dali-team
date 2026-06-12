"use client";

export default function TextToImagePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        <p>🖼️ AI 文生图工具 — 前端 UI 由 大师级审美前端开发 实现</p>
        <p className="mt-1 text-xs text-gray-400">
          接入 Runninghub 文生图 API，支持 Flux / SDXL 等模型
        </p>
      </div>

      {/* 占位：前端 agent 将在此处实现输入表单 + 结果展示 */}
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
        <p className="text-4xl mb-3">🎨</p>
        <p className="text-lg font-medium text-gray-500">等待前端实现</p>
        <p className="text-sm text-gray-400 mt-1">
          输入提示词 → 选择风格/尺寸 → 生成图片
        </p>
      </div>
    </div>
  );
}
