import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, breadcrumbSchema, cleanText, faqSchema, jsonLd, limitText, pageMetadata } from "@/lib/seo";
import { getPublicContact } from "@/lib/site-contact";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || product.status !== "published") {
    return pageMetadata({
      title: "محصول پیدا نشد | ماین پلاس",
      description: "صفحه محصول موردنظر در ماین پلاس پیدا نشد.",
      path: `/products/${slug}`
    });
  }

  return pageMetadata({
    title: product.metaTitle || `${product.title} | خرید و هماهنگی قیمت روز در ماین پلاس`,
    description: product.metaDescription || product.shortDescription || product.description,
    path: `/products/${product.slug}`,
    image: product.image,
    keywords: [product.title, product.category, product.kind === "miner" ? "خرید ماینر" : "خرید قطعه ماینر"]
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, contact] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    getPublicContact()
  ]);
  if (!product || product.status !== "published") notFound();
  const description = cleanText(product.metaDescription || product.shortDescription || product.description);
  const sectionPath = product.kind === "miner" ? "/miners" : product.kind === "part" ? "/parts" : "/products";
  const sectionName = product.kind === "miner" ? "ماینرها" : product.kind === "part" ? "قطعات ماینر" : "فروشگاه";
  const faqs = [
    {
      question: `برای خرید ${product.title} چه اطلاعاتی لازم است؟`,
      answer: `برای هماهنگی ${product.title} بهتر است مدل دقیق، تعداد موردنیاز، شهر و اگر دستگاه یا قطعه جایگزین دارید عکس آن را ارسال کنید.`
    },
    {
      question: "قیمت نهایی چطور اعلام می‌شود؟",
      answer: "قیمت ماینر و قطعات با توجه به موجودی و شرایط بازار تغییر می‌کند. قیمت روز و شرایط تحویل بعد از هماهنگی اعلام می‌شود."
    },
    {
      question: "اگر قطعه با دستگاه سازگار نباشد چه می‌شود؟",
      answer: "قطعه ناسازگار ممکن است خطا را رفع نکند یا به دستگاه فشار بیاورد. برای همین قبل از خرید، مدل دستگاه و علائم مشکل بررسی می‌شود."
    }
  ];
  const breadcrumb = breadcrumbSchema([
    { name: "صفحه اصلی", path: "/" },
    { name: sectionName, path: sectionPath },
    { name: product.title, path: `/products/${product.slug}` }
  ]);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: limitText(description, 500),
    image: product.image ? [absoluteUrl(product.image)] : undefined,
    category: product.category,
    brand: { "@type": "Brand", name: "Mine Plus" },
    url: absoluteUrl(`/products/${product.slug}`),
    sku: product.slug,
    inLanguage: "fa-IR",
    offers: {
      "@type": "Offer",
      availability: product.stockStatus === "unavailable" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      priceCurrency: "IRR",
      price: product.priceText && /\d/.test(product.priceText) ? product.priceText.replace(/[^\d]/g, "") : undefined,
      url: absoluteUrl(`/products/${product.slug}`)
    }
  };

  return (
    <article className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))} />
      <div className="container grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-silver bg-white p-6 shadow-panel">
          <nav aria-label="breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm font-bold text-steel">
            <Link href="/">صفحه اصلی</Link>
            <span>/</span>
            <Link href={sectionPath}>{sectionName}</Link>
            <span>/</span>
            <span className="text-graphite">{product.title}</span>
          </nav>
          <div className="mb-6 grid aspect-[4/3] max-h-[420px] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-graphite p-4">
            <div className="grid h-full w-full place-items-center overflow-hidden rounded-xl bg-white/95 p-4">
              {product.image ? (
                <img src={product.image} alt={product.title} className="block max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-gold">ماین پلاس</span>
              )}
            </div>
          </div>
          <p className="font-extrabold text-gold">{product.category}</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-[1.4] text-graphite">{product.title}</h1>
          <p className="mt-4 text-lg leading-8 text-steel">{product.shortDescription}</p>
          <p className="mt-5 leading-9 text-steel">{product.description}</p>
          <div className="mt-6 rounded-2xl bg-soft p-4 font-bold text-graphite">
            وضعیت: {product.stockStatus === "available" ? "موجود" : product.stockStatus === "unavailable" ? "ناموجود" : "نیازمند هماهنگی"} | قیمت: {product.priceText || "تماس بگیرید"}
          </div>
          <section className="mt-8 rounded-2xl border border-silver bg-soft p-5">
            <h2 className="text-2xl font-extrabold text-graphite">قبل از خرید این مورد را چک کنید</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {faqs.map((item) => (
                <div key={item.question} className="rounded-xl bg-white p-4">
                  <h3 className="font-extrabold leading-7 text-graphite">{item.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-steel">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="h-fit rounded-2xl border border-silver bg-white p-5 shadow-panel">
          <h2 className="text-xl font-extrabold text-graphite">هماهنگی خرید</h2>
          <p className="mt-3 text-sm leading-7 text-steel">مدل یا قطعه موردنظر را بفرستید تا موجودی، قیمت روز و سازگاری با دستگاه بررسی شود.</p>
          <Link href={contact.whatsappLink} className="mt-5 inline-flex w-full justify-center rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">پیام در واتساپ</Link>
          <Link href="/repair-request" className="mt-3 inline-flex w-full justify-center rounded-xl border border-silver px-5 py-3 font-extrabold text-graphite">نیاز به تعمیر دارم</Link>
        </aside>
      </div>
    </article>
  );
}
