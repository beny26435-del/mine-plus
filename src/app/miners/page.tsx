import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, breadcrumbSchema, faqSchema, jsonLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "خرید ماینر Whatsminer | M20، M30، M50 و M60",
  description: "خرید و هماهنگی قیمت روز ماینرهای Whatsminer با بررسی هش‌ریت، مصرف برق، سلامت پاور، فن، هشبرد و شرایط تحویل.",
  path: "/miners",
  keywords: ["خرید واتس ماینر", "Whatsminer M30", "Whatsminer M50", "Whatsminer M60", "ماینر کارکرده"]
});

export default async function MinersPublicPage() {
  const miners = await prisma.product.findMany({ where: { kind: "miner", status: "published" }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  const faqs = [
    {
      question: "برای خرید ماینر کارکرده چه چیزی مهم‌تر است؟",
      answer: "سلامت هشبردها، پایداری هش‌ریت زیر بار، وضعیت پاور، دمای کارکرد، صدای فن و سابقه تعمیر مهم‌تر از یک قیمت پایین ظاهری است."
    },
    {
      question: "کدام مدل Whatsminer برای فارم مناسب‌تر است؟",
      answer: "انتخاب مدل به ظرفیت برق، تهویه، بودجه، تعداد دستگاه و هدف شما بستگی دارد. قبل از خرید تعداد بالا، بهتر است زیرساخت فارم بررسی شود."
    },
    {
      question: "قیمت ماینرها در سایت قطعی است؟",
      answer: "بازار ماینر نوسان دارد. قیمت و موجودی نهایی بعد از هماهنگی و بررسی مدل موردنظر اعلام می‌شود."
    }
  ];
  const breadcrumb = breadcrumbSchema([
    { name: "صفحه اصلی", path: "/" },
    { name: "خرید ماینر", path: "/miners" }
  ]);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ماینرهای ماین پلاس",
    itemListElement: miners.map((product, index) => ({
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
          <p className="font-extrabold text-gold">فروش ماینر</p>
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">خرید ماینر مناسب فارم یا شروع کار</h1>
          <p className="mx-auto mt-4 max-w-3xl leading-8 text-steel">در انتخاب ماینر، فقط نام مدل و قیمت کافی نیست. مصرف برق، هش‌ریت پایدار، سلامت پاور و فن، دمای محیط و شرایط تحویل باید کنار هم دیده شوند؛ مخصوصاً وقتی دستگاه کارکرده یا تعداد بالا می‌خرید.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{miners.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        {!miners.length ? (
          <div className="rounded-2xl border border-silver bg-white p-8 text-center shadow-panel">
            <h2 className="text-2xl font-extrabold text-graphite">ماینری برای نمایش ثبت نشده است</h2>
            <p className="mt-3 leading-8 text-steel">مدل مدنظرتان را در واتساپ بفرستید تا موجودی، قیمت روز و شرایط تحویل بررسی شود.</p>
          </div>
        ) : null}
        <div className="mt-10 rounded-2xl border border-silver bg-white p-6 shadow-panel">
          <h2 className="text-2xl font-extrabold text-graphite">راهنمای کوتاه خرید ماینر</h2>
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
