import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calculator, CheckCircle2, Cpu, FileText, HardHat, MessagesSquare, PackageSearch, PlugZap, ShieldCheck, ShoppingBag, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const homepageCopy = {
  heroEyebrow: "Mine Plus | فروش، تعمیر و راه‌اندازی فارم",
  heroTitle: "فروش ماینر، قطعات و راه‌اندازی فارم",
  heroText:
    "برای خرید ماینر، تأمین قطعه یا تعمیر دستگاه، اول شرایط برق، مدل دستگاه و نیاز واقعی شما را بررسی می‌کنیم؛ بعد قیمت و مسیر انجام کار را شفاف می‌گوییم.",
  storeTitle: "ماینر و قطعه را با خیال راحت‌تر استعلام کنید",
  storeText:
    "مدل دستگاه، موجودی و سازگاری قطعه را قبل از خرید چک می‌کنیم تا وقت و هزینه‌تان صرف انتخاب اشتباه نشود.",
  servicesTitle: "کنار فروش، کار فنی هم انجام می‌دهیم",
  servicesText:
    "از انتخاب دستگاه تا تعمیر و چیدمان فارم، تمرکز ما روی تصمیم‌های عملی است؛ چیزی که با برق، فضا و بودجه شما جور دربیاید.",
  repairCtaTitle: "ماینر خطا می‌دهد یا هش‌ریت افت کرده؟",
  repairCtaText:
    "مدل دستگاه، توضیح خطا و اگر دارید عکس یا ویدیو بفرستید تا قبل از هر هزینه‌ای مسیر بررسی مشخص شود.",
  farmCtaTitle: "برای فارم، قبل از خرید تعداد بالا حساب‌وکتاب کنید",
  farmCtaText:
    "برق، تهویه، صدا، شبکه و محل نصب اگر از اول درست دیده نشوند، بعداً هزینه‌ساز می‌شوند.",
  contentTitle: "راهنماها و نمونه‌کارهای کاربردی",
  contentText:
    "چند راهنمای کوتاه و چند نمونه از کارهای انجام‌شده را اینجا می‌گذاریم تا تصمیم‌گیری ساده‌تر شود."
};

const staleCopy = new Set([
  "Mine Plus | فروش، تعمیر و راه‌اندازی",
  "فروش، تعمیر و راه‌اندازی تجهیزات استخراج",
  "فروش ماینر، قطعات، تعمیرات و راه‌اندازی فارم",
  "Mine Plus برای خرید و استعلام دستگاه ماینر، قطعات مصرفی، تعمیرات تخصصی و طراحی زیرساخت فارم ساخته شده است.",
  "اگر قصد خرید ماینر، تامین قطعه، تعمیر دستگاه یا راه‌اندازی فارم دارید، Mine Plus کمک می‌کند مسیر درست را با اطلاعات فنی روشن‌تر انتخاب کنید.",
  "ماینر و قطعه را با اطلاعات روشن‌تر انتخاب کنید",
  "محصولات منتخب برای شروع استعلام نمایش داده شده‌اند. برای خرید دستگاه، تامین قطعه یا بررسی سازگاری، وارد بخش مربوط شوید.",
  "خدمات Mine Plus فقط فروش محصول نیست",
  "اگر برای خرید، تعمیر یا راه‌اندازی فارم تصمیم می‌گیرید، بهتر است شرایط دستگاه، برق، تهویه و هزینه‌های احتمالی از ابتدا مشخص باشد.",
  "دستگاه شما خطا دارد یا هش نمی‌دهد؟",
  "مشکل دستگاه را ثبت کنید و اگر عکس یا ویدیو از خطا دارید همان‌جا ارسال کنید تا بررسی اولیه دقیق‌تر انجام شود.",
  "برای فارم، قبل از خرید تجهیزات برنامه‌ریزی کنید",
  "برق، تهویه، چیدمان، شبکه و نگهداری باید قبل از خرید تعداد بالا بررسی شوند تا هزینه‌های بعدی قابل کنترل باشد.",
  "راهنماها و نمونه‌کارهای Mine Plus",
  "برای تصمیم بهتر، راهنماهای خرید، نکات نگهداری و نمونه‌کارهای تعمیرات را ببینید."
]);

function copy(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  if (!trimmed || staleCopy.has(trimmed)) return fallback;
  return trimmed;
}

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
    { title: "خرید ماینر", text: "مدل، مصرف برق و شرایط تحویل را قبل از استعلام نهایی با هم چک می‌کنیم.", href: "/miners", Icon: Cpu },
    { title: "قطعات و تجهیزات", text: "پاور، فن، کنترل‌برد و کابل را بر اساس مدل دستگاه انتخاب کنید، نه حدس و تجربه ناقص.", href: "/parts", Icon: PlugZap },
    { title: "ماشین حساب", text: "درآمد تقریبی دستگاه را با قیمت زنده بیت‌کوین، نرخ دلار و هزینه برق حساب کنید.", href: "/mining-calculator", Icon: Calculator },
    { title: "ثبت تعمیر", text: "علائم خرابی را بنویسید و اگر عکس یا ویدیو دارید، همان‌جا آپلود کنید.", href: "/repair-request", Icon: Wrench },
    { title: "مشاوره خرید", text: "نام و شماره بگذارید؛ جزئیات خرید یا فارم را در تماس کوتاه می‌پرسیم.", href: "/farm-setup", Icon: MessagesSquare },
    { title: "راه‌اندازی فارم", text: "برق، تهویه، صدا، شبکه و چیدمان را قبل از خرید تعداد بالا بررسی کنید.", href: "/farm-setup", Icon: ShieldCheck }
  ];

  const serviceLines = [
    "در خرید ماینر، قیمت تنها معیار نیست؛ مصرف برق، سلامت دستگاه و شرایط نگهداری هم مهم است.",
    "در قطعات، اول مدل دستگاه و سازگاری قطعه مشخص می‌شود تا خرید اشتباه پیش نیاید.",
    "در تعمیرات، توضیح مشکل و فایل خطا کمک می‌کند سریع‌تر بفهمیم از کجا باید شروع کرد.",
    "در فارم، ظرفیت برق و تهویه اگر درست حساب نشود، سود روی کاغذ خیلی زود از بین می‌رود."
  ];
  const contentItems = [...posts.slice(0, 2), ...cases.slice(0, 2)];
  const heroEyebrow = copy(settings?.heroEyebrow, homepageCopy.heroEyebrow);
  const heroTitle = copy(settings?.heroTitle, homepageCopy.heroTitle);
  const heroText = copy(settings?.heroText, homepageCopy.heroText);
  const storeTitle = copy(settings?.storeTitle, homepageCopy.storeTitle);
  const storeText = copy(settings?.storeText, homepageCopy.storeText);
  const servicesTitle = copy(settings?.servicesTitle, homepageCopy.servicesTitle);
  const servicesText = copy(settings?.servicesText, homepageCopy.servicesText);
  const repairCtaTitle = copy(settings?.repairCtaTitle, homepageCopy.repairCtaTitle);
  const repairCtaText = copy(settings?.repairCtaText, homepageCopy.repairCtaText);
  const farmCtaTitle = copy(settings?.farmCtaTitle, homepageCopy.farmCtaTitle);
  const farmCtaText = copy(settings?.farmCtaText, homepageCopy.farmCtaText);
  const contentTitle = copy(settings?.contentTitle, homepageCopy.contentTitle);
  const contentText = copy(settings?.contentText, homepageCopy.contentText);

  return (
    <>
      <section className="tech-bg relative overflow-hidden py-10 text-white">
        <div className="absolute inset-0 grid-dots opacity-50" />
        <div className="container relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-extrabold text-gold">{heroEyebrow}</p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.35] md:text-6xl">{heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-base leading-9 text-silver">
              {heroText}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite sm:w-auto">
                <ShoppingBag size={19} />
                ورود به فروشگاه
              </Link>
              <Link href="/repair-request" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-gold/40 bg-white/5 px-5 py-3 font-extrabold text-gold sm:w-auto">
                <Wrench size={19} />
                ثبت تعمیر
              </Link>
              <Link href="/farm-setup" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-extrabold text-white sm:w-auto">
                <HardHat size={19} />
                درخواست مشاوره
              </Link>
            </div>
          </div>
          <div className="hero-banner-frame relative overflow-hidden rounded-3xl border border-gold/10 bg-black/30 p-px">
            <div className="relative z-10 aspect-[1640/720] overflow-hidden rounded-[1.43rem] bg-black/30">
              <Image src={settings?.bannerImage || "/images/mine-plus-banner.png"} alt="Mine Plus banner" fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-6 pb-10">
        <div className="container relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <h2 className="mt-2 text-3xl font-extrabold leading-[1.45] text-graphite">{storeTitle}</h2>
            <p className="mt-4 leading-8 text-steel">{storeText}</p>
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
            <h2 className="mt-2 text-3xl font-extrabold leading-[1.45] text-graphite">{servicesTitle}</h2>
            <p className="mt-4 max-w-2xl leading-8 text-steel">{servicesText}</p>
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
              <h3 className="mt-4 text-2xl font-extrabold">{repairCtaTitle}</h3>
              <p className="mt-3 leading-8 text-silver">{repairCtaText}</p>
              <Link href="/repair-request" className="mt-5 inline-flex rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">ثبت درخواست تعمیر</Link>
            </div>
            <div className="rounded-3xl border border-silver bg-soft p-6">
              <HardHat className="text-gold" />
              <h3 className="mt-4 text-2xl font-extrabold text-graphite">{farmCtaTitle}</h3>
              <p className="mt-3 leading-8 text-steel">{farmCtaText}</p>
              <Link href="/farm-setup" className="mt-5 inline-flex rounded-xl border border-gold px-5 py-3 font-extrabold text-graphite">درخواست مشاوره</Link>
            </div>
          </div>
        </div>
      </section>

      {contentItems.length ? <section className="py-12">
        <div className="container grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-silver bg-white p-6 shadow-panel">
            <FileText className="text-gold" />
            <h2 className="mt-4 text-2xl font-extrabold text-graphite">{contentTitle}</h2>
            <p className="mt-3 leading-8 text-steel">{contentText}</p>
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
