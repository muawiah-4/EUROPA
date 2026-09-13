import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import AmbientBackground from "@/components/AmbientBackground";

export const metadata: Metadata = {
  title: "EUROPA — Europe, Beyond the Postcard",
  description: "An interactive journey through Europe's most unforgettable places.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AmbientBackground />
        <LoadingScreen />
        <CustomCursor />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
