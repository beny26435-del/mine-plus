import Link from "next/link";
import { MiningCalculator } from "@/components/MiningCalculator";
import { breadcrumbSchema, faqSchema, jsonLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "ماشین حساب ماینینگ | محاسبه درآمد ماینر با قیمت روز",
  description: "محاسبه تقریبی درآمد ماینر با قیمت بیت‌کوین، نرخ دلار، سختی شبکه، هش‌ریت، مصرف برق و هزینه برق.",
  path: "/mining-calculator",
  keywords: ["ماشین حساب ماینینگ", "محاسبه درآمد ماینر", "سود استخراج بیت کوین", "هزینه برق ماینر"]
});

export default function MiningCalculatorPage() {
  const faqs = [
    {
      question: "ماشین حساب ماینینگ برای تصمیم خرید کافی است؟",
      answer: "خیر. عدد ماشین حساب برای برآورد اولیه است. سلامت دستگاه، مصرف واقعی، تهویه، قطعی، کارمزد استخر و شرایط برق هم باید بررسی شود."
    },
    {
      question: "کدام ورودی بیشترین اثر را روی نتیجه دارد؟",
      answer: "هش‌ریت، مصرف برق، هزینه برق و نرخ دلار اثر زیادی روی خروجی دارند. برای خرید دستگاه، بهتر است چند سناریو را همزمان مقایسه کنید."
    }
  ];
  const breadcrumb = breadcrumbSchema([
    { name: "صفحه اصلی", path: "/" },
    { name: "ماشین حساب ماینینگ", path: "/mining-calculator" }
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))} />
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
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((item) => (
              <details key={item.question} className="rounded-2xl border border-silver bg-white p-5 shadow-panel">
                <summary className="cursor-pointer font-extrabold leading-7 text-graphite">{item.question}</summary>
                <p className="mt-3 text-sm leading-7 text-steel">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
