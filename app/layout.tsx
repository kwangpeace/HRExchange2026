import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HR Exchange 2026 Summary",
  description: "HR Exchange 2026 핵심 강연 요약",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={noto.variable}>
      <body className={`${noto.className} antialiased`}>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
