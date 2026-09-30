import type { Metadata } from "next";

/**
 * Site-wide SEO constants and helpers. SITE_URL comes from
 * NEXT_PUBLIC_SITE_URL when set (production), otherwise the local dev/start
 * port this project runs on. Trailing slashes are stripped so
 * `${SITE_URL}${path}` never doubles up.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001").replace(/\/+$/, "");

export const SITE_NAME = "Europa";
export const TITLE_SEPARATOR = " — ";
export const DEFAULT_TITLE = "EUROPA — Europe, Beyond the Postcard";
export const DEFAULT_DESCRIPTION =
  "An interactive, scroll-driven concept journey through ten of Europe's most unforgettable places — from Paris to Iceland.";

/** Confirmed present at public/paris/louvre.jpg — keep it JPEG (social crawlers). */
export const DEFAULT_OG_IMAGE = "/paris/louvre.jpg";
export const DEFAULT_OG_IMAGE_ALT = "The Louvre pyramid at daylight";

/** Absolute URL for a site-relative path ("/destinations" -> "https://…/destinations"). */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalized}`;
}

type PageMetadataInput = {
  /** Page title; the root layout template appends " — Europa" unless `absoluteTitle` is set. */
  title: string;
  description: string;
  /** Site-relative canonical path, e.g. "/journeys" (never include a query string). */
  path: string;
  /** Use `title` verbatim instead of passing it through the layout's title template. */
  absoluteTitle?: boolean;
  image?: string;
  imageAlt?: string;
  ogType?: "website" | "article";
};

/**
 * Per-page metadata with a canonical URL and COMPLETE openGraph/twitter
 * blocks — Next replaces a child segment's openGraph/twitter objects
 * wholesale rather than deep-merging them with the root layout's, so every
 * field has to be restated here.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title}${TITLE_SEPARATOR}${SITE_NAME}`;
  const imageUrl = absoluteUrl(image);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
      images: [{ url: imageUrl, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: imageUrl, alt: imageAlt }],
    },
  };
}
