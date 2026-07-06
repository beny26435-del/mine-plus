import Link from "next/link";
import { MiningCalculator } from "@/components/MiningCalculator";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ماشین حساب ماینینگ | Mine Plus",
  description: "برآورد درآمد ماینر با قیمت زنده بیت‌کوین، نرخ دلار، سختی شبکه، هش‌ریت دستگاه و هزینه برق."
};

export default function MiningCalculatorPage() {
  return (
    <>
      <section className="tech-bg relative overflow-hidden py-12 text-white">
        <div className="absolute inset-0 grid-dots opacity-40" />
        <div className="container relative">
          <p className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-extrabold text-gold">محاسبه سود استخراج</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.35] md:text-6xl">ماشین حساب درآمد ماینر</h1>
          <p className="mt-5 max-w-2xl leading-9 text-silver">
            درآمد تقریبی دستگاه را با قیمت زنده بیت‌کوین، سختی شبکه، نرخ دلار، مصرف برق و کارمزد استخر حساب کنید. عدد نهایی برای تصمیم اولیه است، نه وعده سود قطعی.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/miners" className="rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">مشاهده ماینرها</Link>
            <Link href="/farm-setup" className="rounded-xl border border-white/15 px-5 py-3 font-extrabold text-white">مشاوره خرید و فارم</Link>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <MiningCalculator />
        </div>
      </section>
    </>
  );
}
