import type { ToolManifest } from "@/lib/tools/registry";

const manifest: ToolManifest = {
  id: "ai-video",
  name: "AI 视频生成",
  icon: "video",
  description: "通过文本或图片生成短视频，适用于社交媒体和广告素材",
  category: "design",
  enabled: false,
};

export default manifest;
