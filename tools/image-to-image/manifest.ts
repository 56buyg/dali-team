import type { ToolManifest } from "@/lib/tools/registry";

const manifest: ToolManifest = {
  id: "image-to-image",
  name: "风格转绘",
  icon: "swap",
  description: "上传参考图或草图，AI 按你的意图重新渲染——保持结构，焕新风格",
  category: "design",
  enabled: true,
};

export default manifest;
