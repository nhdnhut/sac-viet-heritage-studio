import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SẮC VIỆT STUDIO — Phối Việt phục theo cách của bạn, hiểu câu chuyện phía sau",
  description: "Nền tảng thiết kế và remix Việt phục đương đại kết hợp Áo ngũ thân tay chẽn triều Nguyễn và Áo dài hiện đại với Google GenAI SDK và không gian 3D tương tác.",
  keywords: ["Việt phục", "Áo ngũ thân", "Áo dài", "Remix", "Cổ phục Việt Nam", "Next.js", "Three.js", "Gemini API"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-silkDark-950 text-parchment-100 antialiased selection:bg-lacquer-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
