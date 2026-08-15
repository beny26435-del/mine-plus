import type { Metadata } from "next";

const fallbackSiteUrl = "http://localhost:3000";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function cleanText(value?: string | null, fallback = "") {
  return (value || fallback).replace(/\s+/g, " ").trim();
}

export function limitText(value: string, max = 155) {
  const text = cleanText(value);
  return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
}

export function pageMetadata({
  title,
  description,
  path,
  image
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image || "/images/mine-plus-banner.png");

  return {
    title,
    description: limitText(description),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: limitText(description),
      url,
      siteName: "Mine Plus",
      locale: "fa_IR",
      images: [{ url: ogImage }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: limitText(description),
      images: [ogImage]
    }
  };
}

export function jsonLd(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c")
  };
}
