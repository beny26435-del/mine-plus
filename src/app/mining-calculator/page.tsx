import Link from "next/link";
import { MiningCalculator } from "@/components/MiningCalculator";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ماشین حساب ماینینگ | Mine Plus",
  description: "محاسبه درآمد استخراج بیت‌کوین با داده زنده قیمت BTC، سختی شبکه، هش‌ریت دستگاه، مصرف برق و هزینه برق."
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
            درآمد احتمالی ماینر را با داده زنده شبکه بیت‌کوین، قیمت BTC، هش‌ریت دستگاه، مصرف برق، کارمزد استخر و هزینه برق محاسبه کنید.
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
          <div className="mt-6 rounded-3xl border border-silver bg-white p-5 shadow-panel">
            <h2 className="text-xl font-extrabold text-graphite">این محاسبه چه محدودیت‌هایی دارد؟</h2>
            <div className="mt-3 grid gap-3 text-sm leading-8 text-steel md:grid-cols-2">
              <p>درآمد استخراج به سختی شبکه، شانس استخر، fee تراکنش‌ها، قطعی دستگاه، دمای محیط، افت هش‌ریت و کارمزد استخر وابسته است.</p>
              <p>عدد نهایی برای تصمیم خرید کافی نیست؛ قبل از خرید دستگاه، وضعیت فنی، مصرف برق واقعی، تهویه و شرایط نگهداری باید بررسی شود.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
