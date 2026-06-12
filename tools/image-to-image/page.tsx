"use client";

export default function ImageToImagePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        <p>🔄 AI 图生图工具 — 前端 UI 由 大师级审美前端开发 实现</p>
        <p className="mt-1 text-xs text-gray-400">
          接入 Runninghub 图生图 API，支持风格迁移、图片增强、修复
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
        <p className="text-4xl mb-3">🖼️→🖼️</p>
        <p className="text-lg font-medium text-gray-500">等待前端实现</p>
        <p className="text-sm text-gray-400 mt-1">
          上传原图 → 选择风格 → 生成新图
        </p>
      </div>
    </div>
  );
}
