"use client";

import { useState } from "react";
import ToolShell, { ToolInput, ToolResult } from "@/components/tool-shell";

export default function DualImageEditPage() {
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!imageUrl1 || !imageUrl2) {
      setError("请提供两张图片地址");
      return;
    }
    setError("");
    setLoading(true);
    setFiles([]);
    try {
      const res = await fetch("/api/tools/dual-image-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl1, imageUrl2, prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFiles(data.result?.files ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell>
      <ToolInput>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            图片 1（底图/源图）
          </label>
          <input
            type="url"
            value={imageUrl1}
            onChange={(e) => setImageUrl1(e.target.value)}
            placeholder="https://example.com/image1.png"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          {imageUrl1 && (
            <img
              src={imageUrl1}
              alt="预览 1"
              className="mt-2 w-full rounded-lg border border-gray-200 max-h-40 object-contain"
            />
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            图片 2（叠加/参考图）
          </label>
          <input
            type="url"
            value={imageUrl2}
            onChange={(e) => setImageUrl2(e.target.value)}
            placeholder="https://example.com/image2.png"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          {imageUrl2 && (
            <img
              src={imageUrl2}
              alt="预览 2"
              className="mt-2 w-full rounded-lg border border-gray-200 max-h-40 object-contain"
            />
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            编辑描述（可选）
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="如：将图2的人物合成到图1的背景中..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-lg bg-[#1A1A1A] py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "编辑中..." : "开始编辑"}
        </button>
      </ToolInput>
      <ToolResult loading={loading} error={error} files={files} />
    </ToolShell>
  );
}
