import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HNG Backend Portfolio",
  description: "Backend engineering work across HNG14 stages and team product MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

