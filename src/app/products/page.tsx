import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, breadcrumbSchema, faqSchema, jsonLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "فروشگاه ماین پلاس | خرید ماینر، قطعات و خدمات ماینینگ",
  description: "مشاهده ماینرها، قطعات مصرفی و خدمات فنی ماین پلاس برای خرید، تعمیر و راه‌اندازی فارم با هماهنگی قیمت روز.",
  path: "/products",
  keywords: ["فروشگاه ماینر", "خرید واتس ماینر", "فروش قطعات ماینر", "پاور ماینر", "فن ماینر"]
});

const productFaqs = [
  {
    question: "قیمت محصولات ماین پلاس چطور اعلام می‌شود؟",
    answer: "قیمت ماینر و قطعات به موجودی و وضعیت بازار وابسته است. برای هر محصول، قیمت روز و شرایط تحویل بعد از هماهنگی اعلام می‌شود."
  },
  {
    question: "قبل از خرید ماینر چه اطلاعاتی لازم است؟",
    answer: "مدل مدنظر، تعداد دستگاه، شهر، شرایط برق و محل نصب کمک می‌کند پیشنهاد دقیق‌تر و کم‌ریسک‌تری دریافت کنید."
  },
  {
    question: "برای خرید قطعه، سازگاری با دستگاه بررسی می‌شود؟",
    answer: "بله. بهتر است مدل دقیق دستگاه و عکس قطعه فعلی را ارسال کنید تا پاور، فن، کنترل‌برد یا کابل ناسازگار انتخاب نشود."
  }
];

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ kind?: string; q?: string }> }) {
  const query = await searchParams;
  const search = query.q?.trim() || "";
  const products = await prisma.product.findMany({
    where: {
      status: "published",
      kind: query.kind || undefined,
      OR: search
        ? [
            { title: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
            { shortDescription: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
          ]
        : undefined
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
  });
  const breadcrumb = breadcrumbSchema([
    { name: "صفحه اصلی", path: "/" },
    { name: "فروشگاه", path: "/products" }
  ]);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "محصولات ماین پلاس",
    itemListElement: products.map((product, index) => ({
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
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(productFaqs))} />
      <div className="container">
        <div className="mb-7 text-center">
          <p className="font-extrabold text-gold">فروشگاه</p>
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">ماینر، قطعات و خدمات ماین پلاس</h1>
          <p className="mx-auto mt-4 max-w-3xl leading-8 text-steel">اینجا برای انتخاب ماینر، قطعه یا خدمات فنی طراحی شده است؛ نه فقط دیدن چند کارت محصول. مدل دستگاه، شرایط برق، سازگاری قطعه و موجودی روز قبل از خرید بررسی می‌شود تا انتخابتان بر اساس اطلاعات روشن باشد.</p>
        </div>
        <form action="/products" className="mx-auto mb-5 flex max-w-2xl gap-2 rounded-2xl border border-silver bg-white p-2 shadow-panel">
          {query.kind ? <input type="hidden" name="kind" value={query.kind} /> : null}
          <input
            name="q"
            defaultValue={search}
            placeholder="جستجو؛ مثلا M30، پاور، فن ۱۴، کنترل‌برد"
            className="min-h-12 flex-1 rounded-xl border border-transparent bg-soft px-4 text-right outline-none focus:border-gold"
          />
          <button className="rounded-xl bg-gold px-5 font-extrabold text-graphite">جستجو</button>
        </form>
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {[
            ["همه", "/products"],
            ["ماینرها", "/products?kind=miner"],
            ["قطعات", "/products?kind=part"],
            ["خدمات", "/products?kind=service"]
          ].map(([label, href]) => (
            <a key={href} href={href} className="rounded-xl border border-silver bg-white px-4 py-2 text-sm font-extrabold text-graphite">{label}</a>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {!products.length ? (
          <div className="rounded-2xl border border-silver bg-white p-8 text-center shadow-panel">
            <h2 className="text-2xl font-extrabold text-graphite">موردی با این جستجو پیدا نشد</h2>
            <p className="mt-3 leading-8 text-steel">اگر مدل یا قطعه خاصی مدنظر دارید، نام دقیق آن را در واتساپ بفرستید تا موجودی و جایگزین‌های قابل تهیه بررسی شود.</p>
          </div>
        ) : null}
        <div className="mt-10 grid gap-4 rounded-2xl border border-silver bg-white p-6 shadow-panel md:grid-cols-3">
          {productFaqs.map((item) => (
            <div key={item.question}>
              <h2 className="font-extrabold leading-7 text-graphite">{item.question}</h2>
              <p className="mt-2 text-sm leading-7 text-steel">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
