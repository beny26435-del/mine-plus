import Image from "next/image";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-3">
      <span className={compact ? "relative h-10 w-10 overflow-hidden rounded-xl" : "relative h-12 w-12 overflow-hidden rounded-xl"}>
        <Image src="/images/mine-plus-logo.png" alt="Mine Plus" fill sizes="48px" className="object-cover" />
      </span>
      {!compact ? (
        <span className="leading-tight">
          <span className="block text-xl font-extrabold text-white">ماین پلاس</span>
          <span className="block text-[11px] font-bold text-gold">فروش | تعمیر | راه‌اندازی</span>
        </span>
      ) : (
        <span className="text-lg font-extrabold text-white">ماین<span className="text-gold"> پلاس</span></span>
      )}
    </div>
  );
}
