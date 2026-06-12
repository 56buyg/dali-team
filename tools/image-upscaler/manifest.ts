import type { ToolManifest } from "@/lib/tools/registry";

const manifest: ToolManifest = {
  id: "image-upscaler",
  name: "AI 超分放大",
  icon: "zoom-in",
  description: "无损放大图片至 2×/4× 分辨率，保持画质清晰",
  category: "design",
  enabled: true,
};

export default manifest;
