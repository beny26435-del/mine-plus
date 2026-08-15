import { RepairForm } from "@/components/LeadForms";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";
import { getPublicContact } from "@/lib/site-contact";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "ثبت درخواست تعمیر ماینر | ارسال عکس و ویدیو خطا",
  description: "ثبت درخواست تعمیر ماینر، پاور، فن، هشبرد و کنترل برد با امکان ارسال عکس یا ویدیو خطای دستگاه.",
  path: "/repair-request"
});

export default async function RepairRequestPage() {
  const [settings, contact] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getPublicContact()
  ]);
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
            <p className="mt-3 leading-8 text-steel">فعلاً در واتساپ پیام بدهید و مدل دستگاه، توضیح خطا و اگر دارید عکس یا ویدیو را ارسال کنید.</p>
            <a href={contact.whatsappLink} className="mt-5 inline-flex rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">پیام در واتساپ</a>
          </div>
        ) : <RepairForm />}
      </div>
    </section>
  );
}
