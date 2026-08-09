import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AV Survey 3D Planner - Technical Room Survey & AV System Design",
  description:
    "Web Application nội bộ khảo sát công trình, lập bản vẽ và bố trí hệ thống Audio Visual 3D chuyên nghiệp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="antialiased bg-background text-text-primary overflow-hidden">
        {children}
      </body>
    </html>
  );
}
