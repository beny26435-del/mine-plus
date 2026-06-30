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
          <h1 className="mt-2 text-4xl font-extrabold text-graphite">قطعه درست را با سازگاری مطمئن‌تر انتخاب کنید</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-steel">برای پاور، فن، کنترل‌برد، کابل و قطعات مصرفی، مدل دستگاه و نوع مشکل را اعلام کنید تا قطعه مناسب‌تر استعلام شود.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{parts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </div>
    </section>
  );
}
