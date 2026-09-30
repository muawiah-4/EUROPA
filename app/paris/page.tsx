import type { Metadata } from "next";
import Link from "next/link";
import ParisExperience from "@/components/paris/ParisExperience";
import SiteFooter from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/site";

// Distinct from /destinations/paris (the destination overview): this is the
// long-form, scroll-driven deep-dive. The two pages cross-link rather than
// canonicalize to each other — they're different content.
export const metadata: Metadata = pageMetadata({
  title: "Paris in Motion — A Scroll-Driven Deep-Dive",
  description:
    "A long-form cinematic scroll through Paris — the Eiffel Tower, the Louvre, Notre-Dame, then the neighborhoods — told as one continuous camera journey.",
  path: "/paris",
  image: "/paris/eiffel.jpg",
  imageAlt: "The Eiffel Tower, grass and blue sky",
});

export default function ParisPage() {
  return (
    <main className="bg-void">
      {/* The visible titles are timed, client-only act cards (h2) inside the
          scroll experience, so the page's one <h1> is rendered here on the
          server for screen readers and crawlers. */}
      <h1 className="sr-only">Paris in Motion</h1>
      <ParisExperience />
      <section className="border-t border-white/[0.06] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/destinations/paris"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-mist transition-colors hover:text-bone"
          >
            Paris at a glance — history, culture &amp; best season →
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
