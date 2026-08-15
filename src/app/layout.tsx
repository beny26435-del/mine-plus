import type { Metadata } from "next";
import type { Viewport } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { prisma } from "@/lib/prisma";
import { jsonLd, organizationSchema, pageMetadata, websiteSchema } from "@/lib/seo";
import { getPublicContact } from "@/lib/site-contact";
import "./globals.css";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B1220"
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } }).catch(() => null);
  return pageMetadata({
    title: settings?.defaultMetaTitle || "Mine Plus | فروش ماینر، قطعات و تعمیرات تخصصی",
    description: settings?.defaultMetaDescription || "فروش ماینر و قطعات، ثبت درخواست تعمیر و مشاوره راه‌اندازی فارم با بررسی فنی قبل از تصمیم‌گیری.",
    path: "/",
    image: settings?.bannerImage,
    keywords: ["واتس ماینر", "Whatsminer", "ماشین حساب ماینینگ", "مشاوره فارم"]
  });
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [contact, settings] = await Promise.all([
    getPublicContact(),
    prisma.siteSettings.findUnique({ where: { id: 1 } }).catch(() => null)
  ]);

  return (
    <html lang="fa-IR" dir="rtl">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationSchema({ logo: settings?.logoImage, sameAs: [settings?.instagram, settings?.telegram] }))} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteSchema())} />
        <SiteChrome contact={contact}>{children}</SiteChrome>
      </body>
    </html>
  );
}
