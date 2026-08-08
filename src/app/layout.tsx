import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { getPublicContact } from "@/lib/site-contact";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Mine Plus | فروش ماینر، قطعات و تعمیرات تخصصی",
  description: "فروش ماینر و قطعات، ثبت درخواست تعمیر و مشاوره راه‌اندازی فارم با بررسی فنی قبل از تصمیم‌گیری.",
  openGraph: {
    title: "Mine Plus",
    description: "فروش ماینر، قطعات، تعمیرات و راه‌اندازی فارم",
    images: ["/images/mine-plus-banner.png"],
    locale: "fa_IR"
  }
};

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
