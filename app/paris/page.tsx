import type { Metadata } from "next";
import ParisExperience from "@/components/paris/ParisExperience";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Paris in Motion — Europa",
  description:
    "A scroll-driven cinematic deep-dive into Paris — its icons and its neighborhoods, told as one continuous camera journey.",
};

export default function ParisPage() {
  return (
    <main className="bg-void">
      {/* The visible titles are timed, client-only act cards (h2) inside the
          scroll experience, so the page's one <h1> is rendered here on the
          server for screen readers and crawlers. */}
      <h1 className="sr-only">Paris in Motion</h1>
      <ParisExperience />
      <SiteFooter />
    </main>
  );
}
