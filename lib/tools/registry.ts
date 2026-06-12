/**
 * 工具注册清单接口
 *
 * 新增工具步骤：
 * 1. 在 tools/[tool-id]/ 下创建 manifest.ts + page.tsx
 * 2. 在 app/api/tools/[tool-id]/route.ts 创建 API 路由
 * 3. 在此数组追加 import 和 manifest 条目
 */
export interface ToolManifest {
  /** 唯一标识，作为路由 /tools/[id] 的路径段 */
  id: string;
  /** 显示名称（Sidebar + 仪表盘卡片） */
  name: string;
  /** Semi Design 图标名称 */
  icon: string;
  /** 简短描述 */
  description: string;
  /** 分类分组 */
  category: "design" | "development" | "productivity" | "other";
  /** 是否启用（可动态关闭） */
  enabled: boolean;
}

import textToImage from "@/tools/text-to-image/manifest";
import imageToImage from "@/tools/image-to-image/manifest";
import imageUpscaler from "@/tools/image-upscaler/manifest";

/**
 * 工具注册表
 *
 * Runninghub AI 出图工具已注册。
 * 新增工具：创建 tools/[id]/manifest.ts → 在此追加导入和条目即可。
 */
export const toolRegistry: ToolManifest[] = [
  textToImage,
  imageToImage,
  imageUpscaler,
];

/** 按分类分组的工具列表（Sidebar 渲染用） */
export function getToolsByCategory(): Map<string, ToolManifest[]> {
  const grouped = new Map<string, ToolManifest[]>();
  for (const tool of toolRegistry.filter((t) => t.enabled)) {
    const list = grouped.get(tool.category) ?? [];
    list.push(tool);
    grouped.set(tool.category, list);
  }
  return grouped;
}

/** 根据 ID 查找工具 */
export function getToolById(id: string): ToolManifest | undefined {
  return toolRegistry.find((t) => t.id === id && t.enabled);
}

export const CATEGORY_LABELS: Record<string, string> = {
  design: "设计工具",
  development: "开发工具",
  productivity: "效率工具",
  other: "其他",
};
