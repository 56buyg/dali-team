import type { ToolManifest } from "@/lib/tools/registry";

const manifest: ToolManifest = {
  id: "text-to-image",
  name: "AI 文生图",
  icon: "image",
  description: "通过文本描述生成高质量图片，支持多种风格和尺寸",
  category: "design",
  enabled: true,
};

export default manifest;
