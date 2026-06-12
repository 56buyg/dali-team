"use client";

import { useState } from "react";
import ToolShell, { ToolInput, ToolResult } from "@/components/tool-shell";

export default function ImageUpscalerPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [scale, setScale] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!imageUrl) {
      setError("请提供图片地址");
      return;
    }
    setError("");
    setLoading(true);
    setFiles([]);
    try {
      const res = await fetch("/api/tools/image-upscaler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, scale }),
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
          <label className="mb-1 block text-sm font-medium text-gray-700">图片地址</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.png"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            放大倍率: {scale}×
          </label>
          <input
            type="range"
            min={2}
            max={4}
            step={2}
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>2×</span>
            <span>4×</span>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-lg bg-[#FF6A00] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#CC5500] disabled:opacity-50"
        >
          {loading ? "放大中..." : "开始放大"}
        </button>
      </ToolInput>
      <ToolResult loading={loading} error={error} files={files} />
    </ToolShell>
  );
}
