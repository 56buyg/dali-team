/**
 * Semi Design 品牌主题配置
 *
 * 品牌：韶音（Shokz）
 * 配色：白色为主色调，黑白搭配，橙色点缀
 *
 * 参考：https://semi.design/zh-CN/start/customize-theme
 */

export const shokzBrand = {
  /** 品牌橙色 — 交互态、强调、CTA 按钮 */
  orange: "#FF6A00" as const,
  orangeLight: "#FF8F33" as const, // hover 态
  orangeDark: "#CC5500" as const, // active 态

  /** 中性色 — 用于文字和背景 */
  white: "#FFFFFF" as const,
  black: "#1A1A1A" as const,
  gray50: "#F5F5F5" as const,
  gray100: "#EBEBEB" as const,
  gray200: "#D4D4D4" as const,
  gray300: "#BDBDBD" as const,
  gray400: "#A3A3A3" as const,
  gray500: "#8C8C8C" as const,
  gray600: "#737373" as const,
  gray700: "#525252" as const,
  gray800: "#404040" as const,
  gray900: "#262626" as const,
} as const;

/**
 * 覆盖 Semi Design 的 CSS 变量，注入品牌色
 * 在 layout.tsx 的 ConfigProvider 中引用
 */
export const semiThemeOverrides = {
  // 主色 — 用品牌橙色替代 Semi 默认蓝色
  "--semi-color-primary": shokzBrand.orange,
  "--semi-color-primary-hover": shokzBrand.orangeLight,
  "--semi-color-primary-active": shokzBrand.orangeDark,
  "--semi-color-primary-light-default": "rgba(255, 106, 0, 0.08)",
  "--semi-color-primary-light-hover": "rgba(255, 106, 0, 0.12)",
  "--semi-color-primary-light-active": "rgba(255, 106, 0, 0.16)",

  // 聚焦环 — 橙色
  "--semi-color-focus-border": shokzBrand.orange,

  // 背景 — 白色系
  "--semi-color-bg-0": shokzBrand.white,
  "--semi-color-bg-1": shokzBrand.gray50,
  "--semi-color-bg-2": shokzBrand.gray100,

  // 文字 — 黑色系
  "--semi-color-text-0": shokzBrand.black,
  "--semi-color-text-1": shokzBrand.gray800,
  "--semi-color-text-2": shokzBrand.gray600,

  // 边框 — 灰色
  "--semi-color-border": shokzBrand.gray200,
} as const;
