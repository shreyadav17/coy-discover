
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coy Discover",
  description: "Connections that matter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
