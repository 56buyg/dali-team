"use client";

import { useState } from "react";
import ToolShell, { ToolInput, ToolResult } from "@/components/tool-shell";

export default function AIVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!prompt.trim() && !imageUrl) {
      setError("请提供文本描述或图片链接（至少一项）");
      return;
    }
    setError("");
    setLoading(true);
    setFiles([]);
    try {
      const res = await fetch("/api/tools/ai-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageUrl, duration }),
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
          <label className="mb-1 block text-sm font-medium text-gray-700">文本描述</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要的视频内容..."
            rows={3}
            className="w-full rounded-2xl border border-gray-300 px-6 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">图片链接（可选）</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/frame.png"
            className="w-full rounded-2xl border border-gray-300 px-6 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            视频时长: {duration} 秒
          </label>
          <input
            type="range"
            min={3}
            max={10}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>3s</span>
            <span>5s</span>
            <span>10s</span>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-full bg-[#FF6A00] py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#CC5500] disabled:opacity-50"
        >
          {loading ? "生成中..." : "开始生成"}
        </button>
      </ToolInput>
      <ToolResult loading={loading} error={error} files={files} />
    </ToolShell>
  );
}
