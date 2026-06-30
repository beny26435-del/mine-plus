import { FarmForm } from "@/components/LeadForms";
import { whatsappLink } from "@/lib/contact";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FarmSetupPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return (
    <section className="py-12">
      <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-extrabold text-gold">مشاوره خرید و فارم</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-[1.4] text-graphite">برای خرید یا راه‌اندازی فارم راهنمایی می‌خواهید؟</h1>
          <p className="mt-4 leading-8 text-steel">لازم نیست فرم طولانی پر کنید. نام و شماره تماس را بگذارید تا برای خرید ماینر، انتخاب قطعه یا بررسی اولیه فارم با شما هماهنگ شود.</p>
        </div>
        {settings?.enableFarmForm === false ? (
          <div className="rounded-2xl border border-silver bg-white p-6 shadow-panel">
            <h2 className="text-2xl font-extrabold">فرم فعلاً غیرفعال است</h2>
            <p className="mt-3 leading-8 text-steel">برای بررسی اولیه، ظرفیت تقریبی، شهر و وضعیت برق محل را در واتساپ ارسال کنید.</p>
            <a href={whatsappLink} className="mt-5 inline-flex rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">پیام در واتساپ</a>
          </div>
        ) : <FarmForm />}
      </div>
    </section>
  );
}
