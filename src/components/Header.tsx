"use client";

import Link from "next/link";
import { Menu, MessageCircle, PhoneCall, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { phone, telHref, whatsappLink } from "@/lib/contact";

const links = [
  ["صفحه اصلی", "/"],
  ["ماینرها", "/miners"],
  ["قطعات", "/parts"],
  ["درخواست تعمیر", "/repair-request"],
  ["راه‌اندازی فارم", "/farm-setup"],
  ["مقالات", "/blog"],
  ["نمونه‌کارها", "/case-studies"],
  ["تماس", "/contact"]
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  function closeMenu() {
    setClosing(true);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      closeTimerRef.current = null;
    }, 220);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) closeMenu();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy text-white shadow-sm">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Mine Plus">
          <Logo compact />
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-bold md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-silver transition hover:text-gold">
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href={telHref()} className="inline-flex items-center gap-2 text-sm font-bold">
            <PhoneCall size={17} />
            <bdi dir="ltr">{phone}</bdi>
          </a>
          <Link href={whatsappLink} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gold px-4 py-2 text-sm font-extrabold text-graphite">
            <MessageCircle size={17} />
            واتساپ
          </Link>
        </div>
        <button
          type="button"
          onClick={() => {
            setClosing(false);
            setOpen(true);
          }}
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-gold transition duration-300 hover:border-gold/50 hover:bg-white/5 md:hidden"
          aria-label="باز کردن منو"
        >
          <Menu size={22} />
        </button>
      </div>
      {open ? (
        <div className={`mobile-menu-overlay fixed inset-0 z-50 bg-black/55 md:hidden ${closing ? "is-closing" : ""}`}>
          <div ref={panelRef} className={`mobile-menu-panel mr-0 ml-auto flex h-full w-[min(86vw,360px)] flex-col border-l border-white/10 bg-navy p-5 shadow-glow ${closing ? "is-closing" : ""}`}>
            <div className="flex items-center justify-between gap-3">
              <Logo compact />
              <button type="button" onClick={closeMenu} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-gold transition duration-300 hover:border-gold/50 hover:bg-white/5" aria-label="بستن منو">
                <X size={20} />
              </button>
            </div>
            <nav className="mt-8 grid gap-2 text-base font-extrabold">
              {links.map(([label, href]) => (
                <Link key={href} href={href} onClick={closeMenu} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-silver transition duration-300 hover:border-gold/40 hover:bg-gold/10 hover:text-white">
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto grid gap-3">
              <a href={telHref()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 font-extrabold transition duration-300 hover:border-gold/40 hover:bg-white/5">
                <PhoneCall size={17} />
                <bdi dir="ltr">{phone}</bdi>
              </a>
              <Link href={whatsappLink} onClick={closeMenu} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 font-extrabold text-graphite transition duration-300 hover:-translate-y-0.5 hover:shadow-glow">
                <MessageCircle size={17} />
                واتساپ
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
