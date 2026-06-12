import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAL - 韶音",
  description: "DAL 品牌平台",
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
