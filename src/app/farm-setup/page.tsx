import { FarmForm } from "@/components/LeadForms";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";
import { getPublicContact } from "@/lib/site-contact";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "درخواست مشاوره فارم | خرید ماینر و راه‌اندازی فارم",
  description: "فرم کوتاه مشاوره برای خرید ماینر، انتخاب تجهیزات، بررسی برق، تهویه، شبکه و آماده‌سازی فارم.",
  path: "/farm-setup"
});

export default async function FarmSetupPage() {
  const [settings, contact] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getPublicContact()
  ]);
  return (
    <section className="py-12">
      <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-extrabold text-gold">مشاوره خرید و فارم</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-[1.4] text-graphite">برای خرید یا راه‌اندازی فارم راهنمایی می‌خواهید؟</h1>
          <p className="mt-4 leading-8 text-steel">لازم نیست فرم طولانی پر کنید. نام و شماره‌تان کافی است؛ جزئیات خرید دستگاه، قطعه یا فارم را در تماس می‌پرسیم.</p>
        </div>
        {settings?.enableFarmForm === false ? (
          <div className="rounded-2xl border border-silver bg-white p-6 shadow-panel">
            <h2 className="text-2xl font-extrabold">فرم فعلاً غیرفعال است</h2>
            <p className="mt-3 leading-8 text-steel">فعلاً در واتساپ پیام بدهید. اگر ظرفیت برق، شهر یا تعداد دستگاه مدنظرتان را می‌دانید همان‌جا بنویسید.</p>
            <a href={contact.whatsappLink} className="mt-5 inline-flex rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">پیام در واتساپ</a>
          </div>
        ) : <FarmForm />}
      </div>
    </section>
  );
}
