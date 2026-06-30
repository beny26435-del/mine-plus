import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const query = await searchParams;
  const products = await prisma.product.findMany({
    where: { status: "published", kind: query.kind || undefined },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }]
  });
  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-7 text-center">
          <p className="font-extrabold text-gold">فروشگاه</p>
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">ماینر، قطعات و خدمات قابل استعلام</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-steel">محصول موردنظر را انتخاب کنید تا درباره موجودی، سازگاری با دستگاه، شرایط تحویل و قیمت روز هماهنگی انجام شود.</p>
        </div>
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
      </div>
    </section>
  );
}
