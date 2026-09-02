import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMIS — Smart IV Monitoring",
  description: "Real-time IV fluid monitoring for hospital wards",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-background font-body">{children}</body>
    </html>
  );
}
