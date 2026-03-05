import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Westman's Group Order | Office Bagel Run",
  description: "Place your bagel order for the office group order from Westman's Bagel & Coffee",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
