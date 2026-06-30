import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { whatsappLink } from "@/lib/contact";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || product.status !== "published") notFound();
  return (
    <article className="py-12">
      <div className="container grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-silver bg-white p-6 shadow-panel">
          <div className="mb-6 grid aspect-[4/3] max-h-[420px] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-graphite p-4">
            <div className="grid h-full w-full place-items-center overflow-hidden rounded-xl bg-white/95 p-4">
              {product.image ? (
                <img src={product.image} alt={product.title} className="block max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-gold">Mine Plus</span>
              )}
            </div>
          </div>
          <p className="font-extrabold text-gold">{product.category}</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-[1.4] text-graphite">{product.title}</h1>
          <p className="mt-5 leading-9 text-steel">{product.description}</p>
          <div className="mt-6 rounded-2xl bg-soft p-4 font-bold text-graphite">
            وضعیت: {product.stockStatus === "available" ? "موجود" : "استعلامی"} | قیمت: {product.priceText || "استعلامی"}
          </div>
        </div>
        <aside className="h-fit rounded-2xl border border-silver bg-white p-5 shadow-panel">
          <h2 className="text-xl font-extrabold text-graphite">استعلام و هماهنگی</h2>
          <p className="mt-3 text-sm leading-7 text-steel">برای قیمت روز، سازگاری قطعه یا شرایط خرید دستگاه پیام بدهید.</p>
          <Link href={whatsappLink} className="mt-5 inline-flex w-full justify-center rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">استعلام در واتساپ</Link>
          <Link href="/repair-request" className="mt-3 inline-flex w-full justify-center rounded-xl border border-silver px-5 py-3 font-extrabold text-graphite">نیاز به تعمیر دارم</Link>
        </aside>
      </div>
    </article>
  );
}
