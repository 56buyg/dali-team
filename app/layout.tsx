import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "韶音设计·Shokz Design",
  description: "韶音设计部门 AI 工具集成平台 — Shokz Design AI Workspace",
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
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
