import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DALI · 韶音设计AI — 让创意更快落地",
  description:
    "DALI 是韶音设计部专属 AI 创作平台，支持文生图、风格转绘、高清放大——让设计师专注创意，AI 搞定重复劳动。",
  keywords: ["韶音", "Shokz", "AI设计工具", "文生图", "图生图", "超分辨率", "设计效率"],
  openGraph: {
    title: "DALI · 韶音设计AI",
    description: "AI 加持，灵感即刻呈现",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "#FBFAF9", color: "#494440" }}>
        {children}
      </body>
    </html>
  );
}
