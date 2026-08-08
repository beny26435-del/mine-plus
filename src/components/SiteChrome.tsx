"use client";

import { usePathname } from "next/navigation";
import { AiSupportWidget } from "@/components/AiSupportWidget";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { PublicContact } from "@/lib/contact";

export function SiteChrome({ children, contact }: { children: React.ReactNode; contact: PublicContact }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header contact={contact} />
      <main>{children}</main>
      <Footer contact={contact} />
      <AiSupportWidget />
    </>
  );
}
