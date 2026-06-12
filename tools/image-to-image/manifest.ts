import type { ToolManifest } from "@/lib/tools/registry";

const manifest: ToolManifest = {
  id: "image-to-image",
  name: "AI 图生图",
  icon: "swap",
  description: "上传图片进行风格转换、增强、修复，支持多种风格迁移",
  category: "design",
  enabled: true,
};

export default manifest;
