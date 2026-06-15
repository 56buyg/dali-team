"use client";

import { useState } from "react";
import ToolShell, { ToolInput, ToolResult } from "@/components/tool-shell";

const SCALES = [2, 4, 8];
const MODES = ["通用", "人像增强", "文字增强"];

export default function ImageUpscalerPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [scale, setScale] = useState(2);
  const [mode, setMode] = useState("通用");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!imageUrl) {
      setError("请先拖入或选择需要放大的图片");
      return;
    }
    setError("");
    setLoading(true);
    setFiles([]);
    try {
      const res = await fetch("/api/tools/image-upscaler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, scale, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成失败，请稍后重试");
      setFiles(data.result?.files ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "网络连接异常，请检查网络后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl px-8 py-10" style={{ backgroundColor: "#FBFAF9" }}>
        {/* Decor: green + purple — precision, enhancement */}
        <div className="decor-shape decor-shape-xl decor-circle decor-green decor-d1" style={{ bottom: "-8%", left: "-6%", opacity: 0.16 }} />
        <div className="decor-shape decor-shape-md decor-hexagon decor-purple decor-d2" style={{ bottom: "12%", left: "14%", opacity: 0.22 }} />
        <div className="decor-shape decor-shape-sm decor-star decor-blue decor-d3" style={{ bottom: "24%", left: "4%", opacity: 0.14 }} />
        <h1 className="relative z-10 text-2xl font-bold" style={{ color: "#343433" }}>
          高清放大 · 超分辨率
        </h1>
        <p className="relative z-10 mt-1.5 text-sm" style={{ color: "#848281" }}>
          低分辨率素材一键提升至高清，细节增强，满足印刷和展示需求
        </p>
      </div>

      <ToolShell>
        <ToolInput title="上传图片">
          {!imageUrl && (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors"
              style={{ borderColor: "#EAEAEA" }}
            >
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm font-medium" style={{ color: "#494440" }}>
                拖入需要放大的图片
              </p>
              <p className="mt-1 text-xs" style={{ color: "#848281" }}>
                支持 JPG、PNG、WebP，建议分辨率不低于 512×512 px
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
              placeholder="https://example.com/image.png"
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
              放大倍数
            </label>
            <div className="flex gap-2">
              {SCALES.map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className="flex-1 rounded-2xl px-7 py-3 text-sm font-medium transition-all"
                  style={
                    scale === s
                      ? { backgroundColor: "#343433", color: "#FFFFFF" }
                      : { backgroundColor: "#FFFFFF", color: "#494440", border: "1px solid #EAEAEA" }
                  }
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: "#343433" }}>
              增强模式
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-2xl border px-7 py-3 text-sm transition-colors focus:outline-none focus:ring-2"
              style={{ borderColor: "#EAEAEA", backgroundColor: "#FFFFFF", color: "#343433" }}
            >
              {MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-full py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ backgroundColor: "#343433" }}
          >
            {loading ? "AI 正在放大……" : "开始放大"}
          </button>
        </ToolInput>

        <ToolResult loading={loading} error={error} files={files} />
      </ToolShell>
    </div>
  );
}
