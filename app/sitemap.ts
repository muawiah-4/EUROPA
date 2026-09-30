import type { MetadataRoute } from "next";
import { DESTINATION_IDS } from "@/lib/journey";
import { absoluteUrl } from "@/lib/site";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/destinations", priority: 0.9 },
  { path: "/paris", priority: 0.8 },
  { path: "/journeys", priority: 0.7 },
  { path: "/experiences", priority: 0.7 },
  { path: "/about", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map(({ path, priority }) => ({ url: absoluteUrl(path), priority })),
    ...DESTINATION_IDS.map((id) => ({ url: absoluteUrl(`/destinations/${id}`), priority: 0.8 })),
  ];
}
