import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, breadcrumbSchema, faqSchema, jsonLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "قطعات ماینر | فن، پاور، کنترل برد، رایزر و تجهیزات",
  description: "تهیه قطعات ماینر شامل فن، پاور، کنترل برد، سیمولاتور، رایزر و تجهیزات جانبی با بررسی سازگاری دستگاه.",
  path: "/parts",
  keywords: ["فروش قطعات ماینر", "فن ماینر", "پاور ماینر", "کنترل برد واتس ماینر", "CB2 CB4 CB6"]
});

export default async function PartsPublicPage() {
  const parts = await prisma.product.findMany({ where: { kind: "part", status: "published" }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  const faqs = [
    {
      question: "قبل از خرید قطعه ماینر چه اطلاعاتی لازم است؟",
      answer: "مدل دقیق دستگاه، عکس قطعه فعلی، نوع خطا و در صورت امکان تصویر صفحه وضعیت کمک می‌کند قطعه سازگارتر انتخاب شود."
    },
    {
      question: "فن یا پاور ناسازگار چه مشکلی ایجاد می‌کند؟",
      answer: "قطعه ناسازگار ممکن است خطا را رفع نکند، باعث دمای بالا یا ناپایداری شود و حتی به قطعات دیگر فشار وارد کند."
    },
    {
      question: "اگر مطمئن نباشیم مشکل از قطعه است چه کار کنیم؟",
      answer: "بهتر است قبل از خرید قطعه، خطا و شرایط دستگاه بررسی شود تا هزینه تعویض اشتباه پرداخت نشود."
    }
  ];
  const breadcrumb = breadcrumbSchema([
    { name: "صفحه اصلی", path: "/" },
    { name: "قطعات ماینر", path: "/parts" }
  ]);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "قطعات ماینر ماین پلاس",
    itemListElement: parts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${product.slug}`),
      name: product.title
    }))
  };

  return (
    <section className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(itemListSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))} />
      <div className="container">
        <div className="mb-8 text-center">
          <p className="font-extrabold text-gold">قطعات ماینر</p>
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">خرید قطعه ماینر با بررسی سازگاری</h1>
          <p className="mx-auto mt-4 max-w-3xl leading-8 text-steel">فن، پاور، کنترل‌برد، رایزر و تجهیزات شبکه باید با مدل دستگاه و نوع خطا هماهنگ باشند. قبل از خرید، بهتر است مدل دقیق ماینر و عکس قطعه فعلی بررسی شود تا انتخاب اشتباه هزینه اضافه نسازد.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{parts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        {!parts.length ? (
          <div className="rounded-2xl border border-silver bg-white p-8 text-center shadow-panel">
            <h2 className="text-2xl font-extrabold text-graphite">قطعه‌ای برای نمایش ثبت نشده است</h2>
            <p className="mt-3 leading-8 text-steel">مدل دستگاه و قطعه موردنیازتان را بفرستید تا سازگاری، موجودی و قیمت روز بررسی شود.</p>
          </div>
        ) : null}
        <div className="mt-10 rounded-2xl border border-silver bg-white p-6 shadow-panel">
          <h2 className="text-2xl font-extrabold text-graphite">چطور قطعه درست را انتخاب کنیم؟</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {faqs.map((item) => (
              <div key={item.question} className="rounded-xl bg-soft p-4">
                <h3 className="font-extrabold leading-7 text-graphite">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-steel">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
