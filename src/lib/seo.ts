import type { Metadata } from "next";

const fallbackSiteUrl = "http://localhost:3000";
const defaultOgImage = "/images/mine-plus-banner.png";
const brandName = "Mine Plus";
const brandNameFa = "ماین پلاس";

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

export function keywordText(keywords: string[]) {
  return keywords.map((item) => item.trim()).filter(Boolean).join(", ");
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  keywords = []
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image || defaultOgImage);
  const safeDescription = limitText(description);

  return {
    metadataBase: new URL(siteUrl()),
    title,
    description: safeDescription,
    applicationName: brandName,
    authors: [{ name: brandName }],
    creator: brandName,
    publisher: brandName,
    category: "mining equipment",
    keywords: keywordText([
      brandName,
      brandNameFa,
      "خرید ماینر",
      "فروش ماینر",
      "قطعات ماینر",
      "تعمیر ماینر",
      "راه‌اندازی فارم",
      ...keywords
    ]),
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    openGraph: {
      title,
      description: safeDescription,
      url,
      siteName: brandName,
      locale: "fa_IR",
      type: "website",
      images: [{ url: ogImage, width: 1640, height: 720, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: safeDescription,
      images: [ogImage]
    },
    other: {
      "theme-color": "#0B1220",
      "format-detection": "telephone=no"
    }
  };
}

export function jsonLd(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c")
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: cleanText(item.answer)
      }
    }))
  };
}

export function organizationSchema({
  logo,
  sameAs = []
}: {
  logo?: string | null;
  sameAs?: Array<string | null | undefined>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    alternateName: brandNameFa,
    url: absoluteUrl("/"),
    logo: absoluteUrl(logo || "/images/mine-plus-logo.png"),
    sameAs: sameAs.filter(Boolean)
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandName,
    alternateName: brandNameFa,
    url: absoluteUrl("/"),
    inLanguage: "fa-IR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/products")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}
