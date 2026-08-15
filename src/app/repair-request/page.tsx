import { RepairForm } from "@/components/LeadForms";
import { prisma } from "@/lib/prisma";
import { breadcrumbSchema, faqSchema, jsonLd, pageMetadata } from "@/lib/seo";
import { getPublicContact } from "@/lib/site-contact";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "ثبت درخواست تعمیر ماینر | هشبرد، پاور، فن و کنترل برد",
  description: "ثبت درخواست تعمیر ماینر با ارسال عکس یا ویدیو خطا؛ بررسی روشن نشدن، هش ندادن، دمای بالا، خطای پاور، فن، هشبرد و کنترل‌برد.",
  path: "/repair-request",
  keywords: ["تعمیر ماینر", "تعمیر هشبرد", "تعمیر پاور ماینر", "خطای فن ماینر"]
});

export default async function RepairRequestPage() {
  const [settings, contact] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getPublicContact()
  ]);
  const faqs = [
    {
      question: "برای ثبت تعمیر چه اطلاعاتی لازم است؟",
      answer: "نام، شماره تماس، شهر، مدل دستگاه، نوع مشکل و توضیح کوتاه کافی است. اگر عکس یا ویدیو از خطا دارید، همان‌جا آپلود کنید."
    },
    {
      question: "آیا ارسال فایل برای تعمیر اجباری است؟",
      answer: "خیر. ارسال عکس یا ویدیو اختیاری است، اما صفحه وضعیت، خطا یا صدای فن می‌تواند بررسی اولیه را دقیق‌تر کند."
    },
    {
      question: "بعد از ثبت درخواست چه اتفاقی می‌افتد؟",
      answer: "درخواست در پنل ثبت می‌شود و برای هماهنگی بعدی با شما تماس گرفته می‌شود یا از طریق واتساپ پیگیری می‌شود."
    }
  ];
  const breadcrumb = breadcrumbSchema([
    { name: "صفحه اصلی", path: "/" },
    { name: "ثبت درخواست تعمیر", path: "/repair-request" }
  ]);
  return (
    <section className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))} />
      <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-extrabold text-gold">تعمیرات تخصصی</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-[1.4] text-graphite">ثبت درخواست تعمیر ماینر</h1>
          <p className="mt-4 leading-8 text-steel">اگر ماینر روشن نمی‌شود، هش نمی‌دهد، داغ می‌کند یا خطای فن، پاور، هشبرد یا کنترل‌برد دارد، مشخصات دستگاه را بفرستید. عکس یا ویدیو از خطا کمک می‌کند سریع‌تر بفهمیم از کجا باید شروع کرد.</p>
        </div>
        {settings?.enableRepairForm === false ? (
          <div className="rounded-2xl border border-silver bg-white p-6 shadow-panel">
            <h2 className="text-2xl font-extrabold">فرم فعلاً غیرفعال است</h2>
            <p className="mt-3 leading-8 text-steel">فعلاً در واتساپ پیام بدهید و مدل دستگاه، توضیح خطا و اگر دارید عکس یا ویدیو را ارسال کنید.</p>
            <a href={contact.whatsappLink} className="mt-5 inline-flex rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">پیام در واتساپ</a>
          </div>
        ) : <RepairForm />}
      </div>
      <div className="container mt-10 grid gap-4 md:grid-cols-3">
        {faqs.map((item) => (
          <details key={item.question} className="rounded-2xl border border-silver bg-white p-5 shadow-panel">
            <summary className="cursor-pointer font-extrabold leading-7 text-graphite">{item.question}</summary>
            <p className="mt-3 text-sm leading-7 text-steel">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
