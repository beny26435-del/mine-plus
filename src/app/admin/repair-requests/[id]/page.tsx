import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { updateRepairRequestAction } from "@/app/admin/actions";
import { CopyLinkButton } from "@/components/admin/AdminFields";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatBytes } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function RepairRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const request = await prisma.repairRequest.findUnique({ where: { id }, include: { attachments: true } });
  if (!request) notFound();
  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-silver bg-white p-5 shadow-panel">
          <h1 className="text-2xl font-extrabold">جزئیات درخواست تعمیر</h1>
          <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            <Info label="نام" value={request.name} />
            <Info label="شماره" value={<bdi dir="ltr">{request.phone}</bdi>} />
            <Info label="شهر" value={request.city} />
            <Info label="مدل دستگاه" value={request.deviceModel} />
            <Info label="نوع مشکل" value={request.issueType} />
            <Info label="تاریخ" value={request.createdAt.toLocaleDateString("fa-IR")} />
          </dl>
          <div className="mt-5 rounded-xl bg-soft p-4 leading-8">{request.description}</div>
          <section className="mt-6">
            <h2 className="font-extrabold">فایل‌های ارسالی مشتری</h2>
            {request.attachments.length ? (
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {request.attachments.map((file) => (
                  <div key={file.id} className="rounded-2xl border border-silver p-3">
                    {file.type === "image" ? <img src={file.url} alt={file.filename} className="h-44 w-full rounded-xl object-cover" /> : <video src={file.url} controls className="h-44 w-full rounded-xl bg-black" />}
                    <p className="mt-3 truncate text-sm font-bold">{file.filename}</p>
                    <p className="text-xs text-steel">{formatBytes(file.size)}</p>
                    <div className="mt-3 flex gap-2"><a href={file.url} target="_blank" className="rounded-lg bg-gold px-3 py-2 text-xs font-extrabold text-graphite">مشاهده فایل</a><CopyLinkButton url={file.url} /></div>
                  </div>
                ))}
              </div>
            ) : <p className="mt-3 rounded-xl bg-soft p-4 text-sm text-steel">فایلی ارسال نشده است.</p>}
          </section>
        </section>
        <form action={updateRepairRequestAction} className="h-fit rounded-2xl border border-silver bg-white p-5 shadow-panel">
          <input type="hidden" name="id" value={request.id} />
          <label className="grid gap-2 font-bold">وضعیت<select name="status" defaultValue={request.status} className="rounded-xl border border-silver px-3 py-2"><option value="new">جدید</option><option value="contacted">تماس گرفته شد</option><option value="diagnosing">در حال بررسی</option><option value="quoted">اعلام هزینه</option><option value="repairing">در حال تعمیر</option><option value="done">انجام شده</option><option value="canceled">لغو شده</option></select></label>
          <label className="mt-4 grid gap-2 font-bold">یادداشت داخلی<textarea name="adminNote" rows={6} defaultValue={request.adminNote || ""} className="rounded-xl border border-silver px-3 py-2" /></label>
          <button className="mt-4 w-full rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">ذخیره وضعیت</button>
        </form>
      </div>
    </AdminShell>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return <div className="rounded-xl bg-soft p-3"><dt className="text-steel">{label}</dt><dd className="mt-1 font-bold">{value}</dd></div>;
}
