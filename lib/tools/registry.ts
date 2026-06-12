import type { ComponentType } from "react";

/**
 * 工具注册清单接口
 *
 * 新增工具只需在此文件追加一个 ToolManifest 条目，
 * 即可自动在 Sidebar、路由和仪表盘中出现。
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
  /** 动态导入的工具页面组件 */
  component: ComponentType;
  /** 是否启用（可动态关闭） */
  enabled: boolean;
}

/**
 * 工具注册表
 *
 * 所有 AI 工具在此注册。后端新增工具只需：
 * 1. 在 tools/[tool-id]/ 下创建 manifest.ts 和 page.tsx
 * 2. 在此数组追加一个条目
 *
 * 当前为空 — 后续业务工具从 P2 开始填充
 */
export const toolRegistry: ToolManifest[] = [
  // 示例（后续取消注释并替换）：
  // {
  //   id: "image-compressor",
  //   name: "AI 图片压缩",
  //   icon: "image",
  //   description: "智能压缩图片，保持视觉质量",
  //   category: "design",
  //   component: dynamic(() => import("@/tools/image-compressor/page")),
  //   enabled: true,
  // },
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
