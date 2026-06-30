import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function MinersPublicPage() {
  const miners = await prisma.product.findMany({ where: { kind: "miner", status: "published" }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-8 text-center">
          <p className="font-extrabold text-gold">فروش ماینر</p>
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">انتخاب ماینر مناسب برای شرایط شما</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-steel">قبل از خرید، مدل دستگاه، وضعیت فنی، مصرف برق، تهویه محل نصب و شرایط تحویل بررسی می‌شود تا انتخاب دقیق‌تری داشته باشید.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{miners.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </div>
    </section>
  );
}
