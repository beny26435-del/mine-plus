import Link from "next/link";
import { PackageCheck } from "lucide-react";

export function ProductCard({
  product
}: {
  product: {
    title: string;
    slug: string;
    category: string;
    shortDescription: string;
    priceText?: string | null;
    stockStatus: string;
    image?: string | null;
  };
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-silver/70 bg-white shadow-panel transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-glow">
      <div className="grid h-52 place-items-center bg-gradient-to-br from-navy to-graphite p-4">
        {product.image ? <img src={product.image} alt={product.title} className="h-full w-full rounded-xl object-contain transition duration-500 group-hover:scale-[1.03]" /> : <PackageCheck className="text-gold" size={54} />}
      </div>
      <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-extrabold text-graphite">{product.category}</span>
        <PackageCheck className="text-gold" size={20} />
      </div>
      <h3 className="text-xl font-extrabold text-graphite">{product.title}</h3>
      <p className="mt-3 min-h-20 text-sm leading-8 text-steel">{product.shortDescription}</p>
      <p className="mt-4 font-extrabold text-navy">{product.priceText || "استعلام قیمت"}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/products/${product.slug}`} className="rounded-xl border border-silver px-4 py-2 text-sm font-extrabold text-graphite">
          جزئیات
        </Link>
        <Link href="/contact" className="rounded-xl bg-gold px-4 py-2 text-sm font-extrabold text-graphite">
          استعلام
        </Link>
      </div>
      </div>
    </article>
  );
}
