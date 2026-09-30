import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import AmbientBackground from "@/components/AmbientBackground";
import MotionProvider from "@/components/MotionProvider";
import { analyticsConfig } from "@/lib/analytics";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  TITLE_SEPARATOR,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s${TITLE_SEPARATOR}${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          <AmbientBackground />
          <CustomCursor />
          <SiteHeader />
          {children}
        </MotionProvider>
        {/* Opt-in, cookieless Umami — rendered only when NEXT_PUBLIC_UMAMI_WEBSITE_ID is set. */}
        {analyticsConfig && (
          <Script
            src={analyticsConfig.scriptUrl}
            data-website-id={analyticsConfig.websiteId}
            data-do-not-track="true"
            {...(analyticsConfig.domain ? { "data-domains": analyticsConfig.domain } : {})}
            strategy="afterInteractive"
            defer
          />
        )}
      </body>
    </html>
  );
}
