import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, jsonLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "خرید ماینر | مدل‌های Whatsminer و دستگاه‌های مناسب فارم",
  description: "مشاهده مدل‌های ماینر، بررسی مصرف برق، سلامت دستگاه، شرایط تحویل و هماهنگی قیمت روز قبل از خرید.",
  path: "/miners"
});

export default async function MinersPublicPage() {
  const miners = await prisma.product.findMany({ where: { kind: "miner", status: "published" }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
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
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(itemListSchema)} />
      <div className="container">
        <div className="mb-8 text-center">
          <p className="font-extrabold text-gold">فروش ماینر</p>
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">ماینر مناسب کار شما</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-steel">قبل از خرید، فقط اسم مدل و قیمت مهم نیست؛ مصرف برق، سلامت دستگاه، تهویه و شرایط تحویل هم باید روشن باشد.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{miners.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        {!miners.length ? (
          <div className="rounded-2xl border border-silver bg-white p-8 text-center shadow-panel">
            <h2 className="text-2xl font-extrabold text-graphite">ماینری برای نمایش ثبت نشده است</h2>
            <p className="mt-3 leading-8 text-steel">مدل مدنظرتان را در واتساپ بفرستید تا موجودی، قیمت روز و شرایط تحویل بررسی شود.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
