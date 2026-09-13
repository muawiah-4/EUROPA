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
      <ParisExperience />
      <SiteFooter />
    </main>
  );
}
