import type { Metadata } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Mine Plus | فروش ماینر، قطعات و تعمیرات تخصصی",
  description: "فروش و استعلام ماینر و قطعات، پذیرش تعمیرات تخصصی و راه‌اندازی فارم ماینینگ با بررسی فنی.",
  openGraph: {
    title: "Mine Plus",
    description: "فروش ماینر، قطعات، تعمیرات و راه‌اندازی فارم",
    images: ["/images/mine-plus-banner.png"],
    locale: "fa_IR"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
