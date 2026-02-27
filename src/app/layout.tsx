import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local 10 Starter",
  description: "A starter application for union workers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
