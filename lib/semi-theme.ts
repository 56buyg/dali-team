/**
 * DALI Design System — Brand Tokens
 *
 * 品牌：DALI · 韶音设计AI
 * 视觉方向：warm minimalism（参考 family.co）
 * 配色：暖白/米色背景 + 暖深灰文字 + 多色活力点缀
 */

export const colors = {
  /* ── Warm Base ── */
  heading: "#343433" as const,
  body: "#494440" as const,
  muted: "#848281" as const,
  beige: "#FBFAF9" as const,
  beigeDark: "#EAEAEA" as const,
  grayLight: "#f2f0ed" as const,
  white: "#FFFFFF" as const,
  black: "#1A1A1A" as const,

  /* ── Vibrant Accents ── */
  orange: "#FF5310" as const,
  blue: "#018DFF" as const,
  green: "#44C67F" as const,
  purple: "#5F5DE7" as const,
  gold: "#F5B442" as const,
  pink: "#F966AC" as const,

  /* ── Brand Orange (Shokz heritage, kept as accent) ── */
  brandOrange: "#FF6A00" as const,
} as const;

/**
 * 覆盖 Semi Design 的 CSS 变量
 * 主色用暖深灰替代橙色，保持组件温润质感
 */
export const semiThemeOverrides = {
  "--semi-color-primary": colors.heading,
  "--semi-color-primary-hover": colors.body,
  "--semi-color-primary-active": colors.black,
  "--semi-color-primary-light-default": "rgba(52, 52, 51, 0.06)",
  "--semi-color-primary-light-hover": "rgba(52, 52, 51, 0.10)",
  "--semi-color-primary-light-active": "rgba(52, 52, 51, 0.14)",
  "--semi-color-focus-border": colors.heading,
  "--semi-color-bg-0": colors.white,
  "--semi-color-bg-1": colors.beige,
  "--semi-color-bg-2": colors.grayLight,
  "--semi-color-text-0": colors.heading,
  "--semi-color-text-1": colors.body,
  "--semi-color-text-2": colors.muted,
  "--semi-color-border": colors.beigeDark,
} as const;
