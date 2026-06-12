"use client";

import { useState } from "react";
import ToolShell, { ToolInput, ToolResult } from "@/components/tool-shell";
import { pollTaskStatus } from "@/lib/poll-task";

const QUICK_EXAMPLES = [
  "一副韶音OpenRun运动耳机悬浮在液态金属表面，深色背景，橙色光束勾勒轮廓，产品摄影质感",
  "极简风格海报，白色背景上一道橙色声波扩散，文艺现代，留白充足",
  "户外越野跑场景，清晨逆光，佩戴韶音耳机的跑者剪影，电影感色调",
];

const STYLES = ["不限", "摄影写实", "插画", "3D渲染", "扁平", "线稿"];
const RATIOS = [
  { label: "1:1 正方形", value: "1024x1024" },
  { label: "3:4 竖版", value: "768x1024" },
  { label: "16:9 横版", value: "1024x768" },
];

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [ratio, setRatio] = useState("1024x1024");
  const [style, setStyle] = useState("不限");
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
          tool_type: "text-to-image",
          prompt: prompt.trim(),
          image_urls: resultFiles,
        }),
      });
    } catch {
      // 静默失败，不影响主流程
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError("请在上方输入框中描述你想要的画面");
      return;
    }
    setError("");
    setLoading(true);
    setFiles([]);
    try {
      const [w, h] = ratio.split("x").map(Number);
      const res = await fetch("/api/tools/text-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, negative_prompt: negativePrompt, width: w, height: h }),
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#343433" }}>
            文生图 · AI 图像生成
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: "#848281" }}>
            用文字描述你想要的画面，AI 为你生成多张候选
          </p>
        </div>
        <img
          src="/illustrations/tool-text-to-image.svg"
          alt=""
          className="w-full max-w-[240px] animate-fade-in self-end sm:max-w-[300px] lg:max-w-[400px]"
          aria-hidden="true"
        />
      </div>

      <ToolShell>
        <ToolInput title="创作描述">
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你想要的画面……"
              rows={4}
              className="w-full rounded-xl border px-4 py-3 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
              style={{ borderColor: "#EAEAEA", backgroundColor: "#FBFAF9", color: "#343433" }}
            />
            <p className="mt-1.5 text-xs" style={{ color: "#848281" }}>
              试试描述主体、风格、构图、光影——越具体，越精准
            </p>
          </div>

          {/* Quick examples */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#848281" }}>
              快捷示例
            </p>
            {QUICK_EXAMPLES.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="block w-full rounded-xl border px-3.5 py-2.5 text-left text-xs leading-relaxed transition-colors hover:border-[#343433]"
                style={{ borderColor: "#EAEAEA", color: "#848281", backgroundColor: "#FFFFFF" }}
              >
                {example}
              </button>
            ))}
          </div>

          {/* Negative prompt */}
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "#343433" }}>
              负面提示词 <span className="font-normal" style={{ color: "#848281" }}>（选填）</span>
            </label>
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="不希望出现的元素……"
              className="w-full rounded-xl border px-4 py-2.5 text-sm transition-colors placeholder:text-[#848281] focus:outline-none focus:ring-2"
              style={{ borderColor: "#EAEAEA", backgroundColor: "#FFFFFF", color: "#343433" }}
            />
          </div>

          {/* Options */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#343433" }}>画面比例</label>
              <select
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2"
                style={{ borderColor: "#EAEAEA", backgroundColor: "#FFFFFF", color: "#343433" }}
              >
                {RATIOS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#343433" }}>风格</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2"
                style={{ borderColor: "#EAEAEA", backgroundColor: "#FFFFFF", color: "#343433" }}
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ backgroundColor: "#343433" }}
          >
            {loading ? "AI 正在为你生成……" : "生成图片"}
          </button>
          <p className="text-center text-xs" style={{ color: "#848281" }}>
            每次最多生成 4 张
          </p>
        </ToolInput>

        <ToolResult loading={loading} error={error} files={files} />
      </ToolShell>
    </div>
  );
}
