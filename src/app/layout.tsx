import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";
import { getPublicContact } from "@/lib/site-contact";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } }).catch(() => null);
  return pageMetadata({
    title: settings?.defaultMetaTitle || "Mine Plus | فروش ماینر، قطعات و تعمیرات تخصصی",
    description: settings?.defaultMetaDescription || "فروش ماینر و قطعات، ثبت درخواست تعمیر و مشاوره راه‌اندازی فارم با بررسی فنی قبل از تصمیم‌گیری.",
    path: "/",
    image: settings?.bannerImage
  });
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const contact = await getPublicContact();

  return (
    <html lang="fa-IR" dir="rtl">
      <body>
        <SiteChrome contact={contact}>{children}</SiteChrome>
      </body>
    </html>
  );
}
