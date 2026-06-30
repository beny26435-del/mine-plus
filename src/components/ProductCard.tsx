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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-silver/70 bg-white shadow-panel transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-navy to-graphite p-4">
        <div className="grid h-full w-full place-items-center overflow-hidden rounded-xl bg-white/95">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="block max-h-full max-w-full object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <PackageCheck className="text-gold" size={54} />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-extrabold text-graphite">{product.category}</span>
        <PackageCheck className="text-gold" size={20} />
      </div>
      <h3 className="text-xl font-extrabold text-graphite">{product.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-8 text-steel">{product.shortDescription}</p>
      <p className="mt-4 font-extrabold text-navy">{product.priceText || "استعلام قیمت"}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link href={`/products/${product.slug}`} className="rounded-xl border border-silver px-4 py-2 text-sm font-extrabold text-graphite transition hover:border-gold/60">
          جزئیات
        </Link>
        <Link href="/contact" className="rounded-xl bg-gold px-4 py-2 text-sm font-extrabold text-graphite transition hover:bg-gold/90">
          استعلام
        </Link>
      </div>
      </div>
    </article>
  );
}
