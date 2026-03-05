import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seattle Office Bagel Day!",
  description: "Place your bagel order for Seattle Office Bagel Day! Powered by Westman's Bagel & Coffee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
