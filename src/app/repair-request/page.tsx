import { RepairForm } from "@/components/LeadForms";
import { whatsappLink } from "@/lib/contact";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RepairRequestPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return (
    <section className="py-12">
      <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-extrabold text-gold">تعمیرات تخصصی</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-[1.4] text-graphite">ثبت درخواست تعمیر ماینر</h1>
          <p className="mt-4 leading-8 text-steel">اگر دستگاه روشن نمی‌شود، هش نمی‌دهد، داغ می‌کند یا خطای فن، پاور، هشبرد یا کنترل‌برد دارد، اطلاعات دستگاه را ثبت کنید. ارسال عکس یا ویدیو خطا اختیاری است اما به بررسی اولیه کمک می‌کند.</p>
        </div>
        {settings?.enableRepairForm === false ? (
          <div className="rounded-2xl border border-silver bg-white p-6 shadow-panel">
            <h2 className="text-2xl font-extrabold">فرم فعلاً غیرفعال است</h2>
            <p className="mt-3 leading-8 text-steel">در حال حاضر می‌توانید توضیح مشکل، مدل دستگاه و تصویر خطا را در واتساپ ارسال کنید.</p>
            <a href={whatsappLink} className="mt-5 inline-flex rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">پیام در واتساپ</a>
          </div>
        ) : <RepairForm />}
      </div>
    </section>
  );
}
