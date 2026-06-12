import type { ToolManifest } from "@/lib/tools/registry";

const manifest: ToolManifest = {
  id: "text-to-image",
  name: "文生图",
  icon: "image",
  description: "用文字描述你想要的画面，AI 即刻生成——支持风格、构图、光影的精准控制",
  category: "design",
  enabled: true,
};

export default manifest;
