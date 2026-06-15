import type { ToolManifest } from "@/lib/tools/registry";

const manifest: ToolManifest = {
  id: "image-to-image",
  name: "图生图",
  icon: "swap",
  description: "上传一张图片，AI 按你的描述生成新图——保留结构，变换风格",
  category: "design",
  enabled: true,
};

export default manifest;
