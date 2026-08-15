import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [products, posts, latestCase] = await Promise.all([
    prisma.product.findMany({ where: { status: "published" }, select: { slug: true, kind: true, image: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { status: "published" }, select: { slug: true, coverImage: true, updatedAt: true } }),
    prisma.caseStudy.findFirst({ where: { status: "published" }, orderBy: { updatedAt: "desc" }, select: { updatedAt: true } })
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/products"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/miners"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/parts"), lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: absoluteUrl("/mining-calculator"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/repair-request"), lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl("/farm-setup"), lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: absoluteUrl("/case-studies"), lastModified: latestCase?.updatedAt || now, changeFrequency: "weekly", priority: 0.65 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 }
  ];

  return [
    ...staticRoutes,
    ...products.map((item) => ({
      url: absoluteUrl(`/products/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: "weekly" as const,
      priority: item.kind === "miner" ? 0.86 : item.kind === "part" ? 0.84 : 0.78,
      images: item.image ? [absoluteUrl(item.image)] : undefined
    })),
    ...posts.map((item) => ({
      url: absoluteUrl(`/blog/${item.slug}`),
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.72,
      images: item.coverImage ? [absoluteUrl(item.coverImage)] : undefined
    }))
  ];
}
