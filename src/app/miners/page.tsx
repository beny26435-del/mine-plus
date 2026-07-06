import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MinersPublicPage() {
  const miners = await prisma.product.findMany({ where: { kind: "miner", status: "published" }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-8 text-center">
          <p className="font-extrabold text-gold">فروش ماینر</p>
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">ماینر مناسب کار شما</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-steel">قبل از خرید، فقط مدل و قیمت را نمی‌بینیم؛ مصرف برق، وضعیت فنی، تهویه و شرایط تحویل هم مهم است.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{miners.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        {!miners.length ? (
          <div className="rounded-2xl border border-silver bg-white p-8 text-center shadow-panel">
            <h2 className="text-2xl font-extrabold text-graphite">ماینری برای نمایش ثبت نشده است</h2>
            <p className="mt-3 leading-8 text-steel">مدل مدنظرتان را در واتساپ بفرستید تا موجودی و قیمت روز بررسی شود.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
