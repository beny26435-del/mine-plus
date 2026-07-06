import Link from "next/link";
import { Logo } from "@/components/Logo";
import { phone, telHref, whatsappLink } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="bg-graphite py-12 text-silver">
      <div className="container grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-md text-sm leading-8 text-silver">
            Mine Plus برای خرید ماینر، تأمین قطعه، تعمیر دستگاه و راه‌اندازی فارم کنار شماست؛ با تمرکز روی بررسی فنی قبل از تصمیم‌گیری.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-extrabold text-white">دسترسی سریع</h3>
          <div className="grid gap-2 text-sm">
            <Link href="/products">فروشگاه</Link>
            <Link href="/miners">ماینرها</Link>
            <Link href="/parts">قطعات</Link>
            <Link href="/mining-calculator">ماشین حساب ماینینگ</Link>
            <Link href="/blog">مقالات</Link>
            <Link href="/case-studies">نمونه‌کارها</Link>
            <Link href="/repair-request">درخواست تعمیر</Link>
            <Link href="/farm-setup">راه‌اندازی فارم</Link>
            <Link href="/contact">تماس</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-extrabold text-white">تماس</h3>
          <a href={telHref()} className="block font-bold text-white" dir="ltr">{phone}</a>
          <a href={whatsappLink} className="mt-3 inline-flex rounded-xl bg-gold px-4 py-2 text-sm font-extrabold text-graphite">پیام در واتساپ</a>
        </div>
      </div>
    </footer>
  );
}
