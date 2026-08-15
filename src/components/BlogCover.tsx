import Image from "next/image";

export function BlogCover({
  src,
  title,
  priority = false
}: {
  src?: string | null;
  title: string;
  priority?: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-navy">
      {src ? (
        <img src={src} alt={title} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-navy via-graphite to-black" />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent" />
      <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-xl border border-gold/25 bg-black/55 px-3 py-2 text-white shadow-glow backdrop-blur-sm">
        <span className="relative h-8 w-8 overflow-hidden rounded-lg bg-black">
          <Image src="/images/mine-plus-logo.png" alt="" fill sizes="32px" className="object-cover" priority={priority} />
        </span>
        <span className="leading-none">
          <span className="block text-sm font-extrabold">Mine Plus</span>
          <span className="mt-1 block text-[10px] font-bold tracking-[0.24em] text-gold">BUILD | CONNECT | POWER</span>
        </span>
      </div>
    </div>
  );
}
