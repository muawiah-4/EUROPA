import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EUROPE — An Interactive Journey",
  description: "An interactive journey through Europe's most unforgettable places.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
