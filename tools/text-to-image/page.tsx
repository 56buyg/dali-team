"use client";

import { useState } from "react";
import ToolShell, { ToolInput, ToolResult } from "@/components/tool-shell";

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("请输入图片描述（prompt）");
      return;
    }
    setError("");
    setLoading(true);
    setFiles([]);
    try {
      const [w, h] = size.split("x").map(Number);
      const res = await fetch("/api/tools/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, negative_prompt: negativePrompt, width: w, height: h }),
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
          <label className="mb-1 block text-sm font-medium text-gray-700">图片描述（Prompt）</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要的图片..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">负面提示词（可选）</label>
          <input
            type="text"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="不希望出现的元素..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">尺寸</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="1024x1024">1024×1024 (方形)</option>
            <option value="1024x768">1024×768 (横版)</option>
            <option value="768x1024">768×1024 (竖版)</option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-lg bg-[#FF6A00] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#CC5500] disabled:opacity-50"
        >
          {loading ? "生成中..." : "开始生成"}
        </button>
      </ToolInput>
      <ToolResult loading={loading} error={error} files={files} />
    </ToolShell>
  );
}
