import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Cpu, FileText, HardHat, PackageSearch, PlugZap, ShieldCheck, ShoppingBag, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, products, posts, cases] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.product.findMany({
      where: { status: "published", featured: true },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take: 6
    }),
    prisma.blogPost.findMany({ where: { status: "published" }, orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.caseStudy.findMany({ where: { status: "published" }, orderBy: { updatedAt: "desc" }, take: 2 })
  ]);

  const departments: Array<{ title: string; text: string; href: string; Icon: LucideIcon }> = [
    { title: "خرید ماینر", text: "مدل مناسب را بر اساس بودجه، برق و شرایط استفاده استعلام کنید.", href: "/miners", Icon: Cpu },
    { title: "قطعات و تجهیزات", text: "برای پاور، فن، کنترل‌برد و قطعات مصرفی، سازگاری را قبل از خرید چک کنید.", href: "/parts", Icon: PlugZap },
    { title: "ثبت تعمیر", text: "مشکل دستگاه را توضیح دهید و در صورت نیاز عکس یا ویدیو خطا بفرستید.", href: "/repair-request", Icon: Wrench },
    { title: "راه‌اندازی فارم", text: "قبل از خرید تعداد بالا، برق، تهویه، شبکه و چیدمان را بررسی کنید.", href: "/farm-setup", Icon: ShieldCheck }
  ];

  const serviceLines = [
    "برای خرید ماینر، فقط قیمت کافی نیست؛ مصرف برق، سلامت دستگاه و شرایط نگهداری هم بررسی می‌شود.",
    "برای قطعات، مدل دستگاه و سازگاری قطعه قبل از استعلام نهایی کنترل می‌شود.",
    "برای تعمیرات، توضیح مشکل و فایل خطا کمک می‌کند مسیر بررسی دقیق‌تر شروع شود.",
    "برای فارم، ظرفیت برق، تهویه، چیدمان و هزینه نگهداری قبل از اجرا باید روشن باشد."
  ];
  const contentItems = [...posts.slice(0, 2), ...cases.slice(0, 2)];

  return (
    <>
      <section className="tech-bg relative overflow-hidden py-10 text-white">
        <div className="absolute inset-0 grid-dots opacity-50" />
        <div className="container relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-extrabold text-gold">{settings?.heroEyebrow || "Mine Plus | فروش، تعمیر و راه‌اندازی"}</p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.35] md:text-6xl">{settings?.heroTitle || "فروش، تعمیر و راه‌اندازی تجهیزات استخراج"}</h1>
            <p className="mt-6 max-w-2xl text-base leading-9 text-silver">
              {settings?.heroText || "اگر قصد خرید ماینر، تامین قطعه، تعمیر دستگاه یا راه‌اندازی فارم دارید، Mine Plus کمک می‌کند مسیر درست را با اطلاعات فنی روشن‌تر انتخاب کنید."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">
                <ShoppingBag size={19} />
                ورود به فروشگاه
              </Link>
              <Link href="/repair-request" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-gold/40 bg-white/5 px-5 py-3 font-extrabold text-gold">
                <Wrench size={19} />
                ثبت تعمیر
              </Link>
              <Link href="/farm-setup" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-extrabold text-white">
                <HardHat size={19} />
                مشاوره فارم
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-gold/20 bg-white/[0.04] p-1.5 shadow-glow">
            <div className="relative aspect-[1640/720] overflow-hidden rounded-[1.25rem] bg-black/30">
              <Image src={settings?.bannerImage || "/images/mine-plus-banner.png"} alt="Mine Plus banner" fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-6 pb-10">
        <div className="container relative z-10 grid gap-4 md:grid-cols-4">
          {departments.map(({ title, text, href, Icon }) => (
            <Link key={title} href={href} className="group rounded-2xl border border-silver bg-white p-5 shadow-panel transition hover:-translate-y-1 hover:border-gold">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/15 text-gold"><Icon size={22} /></span>
                <ArrowLeft className="text-steel transition group-hover:text-gold" size={18} />
              </div>
              <h2 className="mt-5 font-extrabold text-graphite">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-steel">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-12">
        <div className="container grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="rounded-3xl border border-silver bg-white p-6 shadow-panel">
            <p className="font-extrabold text-gold">فروشگاه تخصصی</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-[1.45] text-graphite">{settings?.storeTitle || "ماینر و قطعه را با اطلاعات روشن‌تر انتخاب کنید"}</h2>
            <p className="mt-4 leading-8 text-steel">{settings?.storeText || "محصولات منتخب برای شروع استعلام نمایش داده شده‌اند. برای خرید دستگاه، تامین قطعه یا بررسی سازگاری، وارد بخش مربوط شوید."}</p>
            <div className="mt-6 grid gap-3">
              <Link href="/miners" className="inline-flex items-center justify-between rounded-xl bg-soft px-4 py-3 font-extrabold text-graphite">مشاهده ماینرها <Cpu size={18} /></Link>
              <Link href="/parts" className="inline-flex items-center justify-between rounded-xl bg-soft px-4 py-3 font-extrabold text-graphite">مشاهده قطعات <PackageSearch size={18} /></Link>
              <Link href="/products" className="inline-flex items-center justify-between rounded-xl bg-navy px-4 py-3 font-extrabold text-white">همه محصولات <ShoppingBag size={18} /></Link>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="font-extrabold text-gold">خدمات فنی و اجرایی</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-[1.45] text-graphite">{settings?.servicesTitle || "خدمات Mine Plus فقط فروش محصول نیست"}</h2>
            <p className="mt-4 max-w-2xl leading-8 text-steel">{settings?.servicesText || "اگر برای خرید، تعمیر یا راه‌اندازی فارم تصمیم می‌گیرید، بهتر است شرایط دستگاه، برق، تهویه و هزینه‌های احتمالی از ابتدا مشخص باشد."}</p>
            <div className="mt-7 grid gap-3">
              {serviceLines.map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-silver bg-soft p-4">
                  <CheckCircle2 className="mt-1 shrink-0 text-gold" size={20} />
                  <p className="leading-8 text-steel">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-silver bg-gradient-to-br from-navy to-graphite p-6 text-white shadow-panel">
              <Wrench className="text-gold" />
              <h3 className="mt-4 text-2xl font-extrabold">{settings?.repairCtaTitle || "دستگاه شما خطا دارد یا هش نمی‌دهد؟"}</h3>
              <p className="mt-3 leading-8 text-silver">{settings?.repairCtaText || "مشکل دستگاه را ثبت کنید و اگر عکس یا ویدیو از خطا دارید همان‌جا ارسال کنید تا بررسی اولیه دقیق‌تر انجام شود."}</p>
              <Link href="/repair-request" className="mt-5 inline-flex rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">ثبت درخواست تعمیر</Link>
            </div>
            <div className="rounded-3xl border border-silver bg-soft p-6">
              <HardHat className="text-gold" />
              <h3 className="mt-4 text-2xl font-extrabold text-graphite">{settings?.farmCtaTitle || "برای فارم، قبل از خرید تجهیزات برنامه‌ریزی کنید"}</h3>
              <p className="mt-3 leading-8 text-steel">{settings?.farmCtaText || "برق، تهویه، چیدمان، شبکه و نگهداری باید قبل از خرید تعداد بالا بررسی شوند تا هزینه‌های بعدی قابل کنترل باشد."}</p>
              <Link href="/farm-setup" className="mt-5 inline-flex rounded-xl border border-gold px-5 py-3 font-extrabold text-graphite">درخواست مشاوره</Link>
            </div>
          </div>
        </div>
      </section>

      {contentItems.length ? <section className="py-12">
        <div className="container grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-silver bg-white p-6 shadow-panel">
            <FileText className="text-gold" />
            <h2 className="mt-4 text-2xl font-extrabold text-graphite">{settings?.contentTitle || "راهنماها و نمونه‌کارهای Mine Plus"}</h2>
            <p className="mt-3 leading-8 text-steel">{settings?.contentText || "برای تصمیم بهتر، راهنماهای خرید، نکات نگهداری و نمونه‌کارهای تعمیرات را ببینید."}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/blog" className="rounded-xl bg-navy px-4 py-2 text-sm font-extrabold text-white">مقالات</Link>
              <Link href="/case-studies" className="rounded-xl border border-silver px-4 py-2 text-sm font-extrabold text-graphite">نمونه‌کارها</Link>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {contentItems.map((item) => {
              const isPost = "excerpt" in item;
              return (
                <Link key={item.id} href={isPost ? `/blog/${item.slug}` : "/case-studies"} className="rounded-2xl border border-silver bg-white p-5 shadow-panel">
                  <p className="text-sm font-extrabold text-gold">{isPost ? "مقاله" : "نمونه‌کار"}</p>
                  <h3 className="mt-3 text-xl font-extrabold leading-8 text-graphite">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-steel">{isPost ? item.excerpt : item.result}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section> : null}
    </>
  );
}
