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
          <p className="mt-4 leading-8 text-steel">اگر ماینر روشن نمی‌شود، هش نمی‌دهد، داغ می‌کند یا خطای فن، پاور، هشبرد یا کنترل‌برد دارد، مشخصات دستگاه را بفرستید. عکس یا ویدیو از خطا کمک می‌کند سریع‌تر بفهمیم از کجا باید شروع کرد.</p>
        </div>
        {settings?.enableRepairForm === false ? (
          <div className="rounded-2xl border border-silver bg-white p-6 shadow-panel">
            <h2 className="text-2xl font-extrabold">فرم فعلاً غیرفعال است</h2>
            <p className="mt-3 leading-8 text-steel">فعلاً از واتساپ پیام بدهید و مدل دستگاه، توضیح خطا و اگر دارید عکس یا ویدیو را ارسال کنید.</p>
            <a href={whatsappLink} className="mt-5 inline-flex rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">پیام در واتساپ</a>
          </div>
        ) : <RepairForm />}
      </div>
    </section>
  );
}
