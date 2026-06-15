"use client";

import { useState } from "react";
import ToolShell, { ToolInput, ToolResult } from "@/components/tool-shell";
import { pollTaskStatus } from "@/lib/poll-task";

export default function DualImageEditPage() {
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  /** 保存生成结果到用户数据库 */
  const saveToDb = async (resultFiles: string[]) => {
    try {
      await fetch("/api/user/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_type: "dual-image-edit",
          prompt: prompt.trim() || `${imageUrl1} + ${imageUrl2}`,
          image_urls: resultFiles,
        }),
      });
    } catch {
      // 静默失败
    }
  };

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

      // 异步模式：轮询任务状态，完成后保存到数据库
      pollTaskStatus(
        data.taskId,
        (resultFiles) => {
          setFiles(resultFiles);
          saveToDb(resultFiles);
        },
        (errMsg) => setError(errMsg),
        () => setLoading(false),
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "请求失败");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl px-8 py-10" style={{ backgroundColor: "#FBFAF9" }}>
        {/* Decor: blue + green — merging, harmony */}
        <div className="decor-shape decor-shape-xl decor-circle decor-blue decor-d1" style={{ bottom: "-8%", right: "-6%", opacity: 0.15 }} />
        <div className="decor-shape decor-shape-md decor-star decor-green decor-d2" style={{ bottom: "12%", right: "14%", opacity: 0.22 }} />
        <div className="decor-shape decor-shape-sm decor-hexagon decor-purple decor-d3" style={{ bottom: "24%", right: "4%", opacity: 0.12 }} />
        <h1 className="relative z-10 text-2xl font-bold" style={{ color: "#343433" }}>
          双图编辑 · AI 智能合成
        </h1>
        <p className="relative z-10 mt-1.5 text-sm" style={{ color: "#848281" }}>
          上传两张图片，AI 智能融合——替换背景、合成元素、风格迁移，一次完成
        </p>
      </div>

      <ToolShell>
        <ToolInput title="两张图片">
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "#343433" }}>
              图片 1（底图/源图）
            </label>
            <input
              type="url"
              value={imageUrl1}
              onChange={(e) => setImageUrl1(e.target.value)}
              placeholder="https://example.com/image1.png"
              className="w-full rounded-2xl border px-6 py-2.5 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
              style={{ borderColor: "#EAEAEA", backgroundColor: "#FFFFFF", color: "#343433" }}
            />
            {imageUrl1 && (
              <img
                src={imageUrl1}
                alt="预览 1"
                className="mt-2 w-full rounded-2xl border max-h-40 object-contain"
                style={{ borderColor: "#EAEAEA" }}
              />
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "#343433" }}>
              图片 2（叠加/参考图）
            </label>
            <input
              type="url"
              value={imageUrl2}
              onChange={(e) => setImageUrl2(e.target.value)}
              placeholder="https://example.com/image2.png"
              className="w-full rounded-2xl border px-6 py-2.5 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
              style={{ borderColor: "#EAEAEA", backgroundColor: "#FFFFFF", color: "#343433" }}
            />
            {imageUrl2 && (
              <img
                src={imageUrl2}
                alt="预览 2"
                className="mt-2 w-full rounded-2xl border max-h-40 object-contain"
                style={{ borderColor: "#EAEAEA" }}
              />
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "#343433" }}>
              编辑描述 <span className="font-normal" style={{ color: "#848281" }}>（选填）</span>
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="如：将图2的人物合成到图1的背景中..."
              className="w-full rounded-2xl border px-6 py-2.5 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
              style={{ borderColor: "#EAEAEA", backgroundColor: "#FFFFFF", color: "#343433" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-full py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ backgroundColor: "#343433" }}
          >
            {loading ? "AI 正在为你编辑……" : "开始编辑"}
          </button>
          <p className="text-center text-xs" style={{ color: "#848281" }}>
            支持 JPG、PNG、WebP 格式
          </p>
        </ToolInput>

        <ToolResult loading={loading} error={error} files={files} />
      </ToolShell>
    </div>
  );
}
