import type { Metadata } from "next";
import JourneyExperience from "@/components/JourneyExperience";
import JsonLd from "@/components/JsonLd";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, absoluteUrl, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: DEFAULT_TITLE,
  absoluteTitle: true,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          alternateName: DEFAULT_TITLE,
          url: absoluteUrl("/"),
          description: DEFAULT_DESCRIPTION,
          inLanguage: "en",
        }}
      />
      <JourneyExperience />
    </main>
  );
}
