"use client";

import { useState } from "react";
import ToolShell, { ToolInput, ToolResult } from "@/components/tool-shell";
import { pollTaskStatus } from "@/lib/poll-task";

export default function ImageToImagePage() {
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [strength, setStrength] = useState(70);
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
          tool_type: "image-to-image",
          prompt: prompt.trim() || imageUrl,
          image_urls: resultFiles,
        }),
      });
    } catch {
      // 静默失败
    }
  };

  const handleSubmit = async () => {
    if (!imageUrl) {
      setError("请先上传一张图片");
      return;
    }
    setError("");
    setLoading(true);
    setFiles([]);
    try {
      const res = await fetch("/api/tools/image-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, prompt, strength: strength / 100 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成失败，请稍后重试");

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
      setError(e instanceof Error ? e.message : "网络连接异常，请检查网络后重试");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl px-8 py-10" style={{ backgroundColor: "#FBFAF9" }}>
        {/* Decor: orange + gold — transformation, warmth */}
        <div className="decor-shape decor-shape-xl decor-circle decor-orange decor-d1" style={{ bottom: "-8%", left: "-6%", opacity: 0.16 }} />
        <div className="decor-shape decor-shape-md decor-star decor-gold decor-d2" style={{ bottom: "12%", left: "14%", opacity: 0.24 }} />
        <div className="decor-shape decor-shape-sm decor-hexagon decor-pink decor-d3" style={{ bottom: "24%", left: "2%", opacity: 0.12 }} />
        <h1 className="relative z-10 text-2xl font-bold" style={{ color: "#343433" }}>
          风格转绘 · 以图生图
        </h1>
        <p className="relative z-10 mt-1.5 text-sm" style={{ color: "#848281" }}>
          上传一张图片作为起点，AI 按你的描述重新演绎——保留结构，改变风格
        </p>
      </div>

      <ToolShell>
        <ToolInput title="参考图片">
          {/* Upload area */}
          {!imageUrl && (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors"
              style={{ borderColor: "#EAEAEA" }}
            >
              <p className="text-3xl mb-2">🖼️</p>
              <p className="text-sm font-medium" style={{ color: "#494440" }}>
                拖拽图片到此处，或点击上传
              </p>
              <p className="mt-1 text-xs" style={{ color: "#848281" }}>
                支持 JPG、PNG、WebP，单张不超过 20MB
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: "#343433" }}>
              图片地址
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/original.png"
              className="w-full rounded-2xl border px-7 py-3 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
              style={{ borderColor: "#EAEAEA", backgroundColor: "#FFFFFF", color: "#343433" }}
            />
            {imageUrl && (
              <div className="mt-2 space-y-2">
                <img src={imageUrl} alt="预览" className="w-full rounded-2xl border" style={{ borderColor: "#EAEAEA" }} />
                <button
                  onClick={() => setImageUrl("")}
                  className="text-xs hover:underline"
                  style={{ color: "#848281" }}
                >
                  清除
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: "#343433" }}>
              想要什么风格？ <span className="font-normal" style={{ color: "#848281" }}>（选填）</span>
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：转换为赛博朋克风格、改为浅色背景、增强光影对比……"
              className="w-full rounded-2xl border px-7 py-3 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
              style={{ borderColor: "#EAEAEA", backgroundColor: "#FFFFFF", color: "#343433" }}
            />
            <p className="mt-1 text-xs" style={{ color: "#848281" }}>
              留空则 AI 自动优化；填写则按你的意图转绘
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: "#343433" }}>
              保留原图程度：{strength}%
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#343433" }}
            />
            <div className="flex justify-between text-xs" style={{ color: "#848281" }}>
              <span>轻度参考</span>
              <span>高度还原</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-full py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ backgroundColor: "#343433" }}
          >
            {loading ? "AI 正在转绘……" : "开始转绘"}
          </button>
        </ToolInput>

        <ToolResult loading={loading} error={error} files={files} />
      </ToolShell>
    </div>
  );
}
