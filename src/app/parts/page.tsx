import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PartsPublicPage() {
  const parts = await prisma.product.findMany({ where: { kind: "part", status: "published" }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-8 text-center">
          <p className="font-extrabold text-gold">قطعات ماینر</p>
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">قطعه‌ای که واقعاً به دستگاه بخورد</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-steel">مدل ماینر و نوع خرابی را بفرستید تا پاور، فن، کنترل‌برد یا کابل اشتباه انتخاب نشود.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{parts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        {!parts.length ? (
          <div className="rounded-2xl border border-silver bg-white p-8 text-center shadow-panel">
            <h2 className="text-2xl font-extrabold text-graphite">قطعه‌ای برای نمایش ثبت نشده است</h2>
            <p className="mt-3 leading-8 text-steel">مدل دستگاه و قطعه موردنیازتان را بفرستید تا سازگاری و قیمت بررسی شود.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
