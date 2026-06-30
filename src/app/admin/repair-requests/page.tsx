import Link from "next/link";
import { deleteRepairRequestAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requestStatusLabel } from "@/lib/request-status";

export const dynamic = "force-dynamic";

export default async function AdminRepairRequestsPage() {
  await requireAdmin();
  const requests = await prisma.repairRequest.findMany({ orderBy: { createdAt: "desc" }, include: { attachments: true } });
  return (
    <AdminShell>
      <h1 className="text-3xl font-extrabold">درخواست‌های تعمیر</h1>
      <div className="mt-6 grid gap-3">
        {requests.map((item) => (
          <div key={item.id} className="rounded-2xl border border-silver bg-white p-4 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href={`/admin/repair-requests/${item.id}`} className="min-w-0 flex-1">
                <b>{item.name}</b> | <bdi dir="ltr">{item.phone}</bdi><p className="mt-1 text-sm text-steel">{item.deviceModel} | {item.issueType}</p>
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-soft px-3 py-1 text-xs font-bold">{requestStatusLabel(item.status)}</span>
                {item.attachments.length ? <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-bold">دارای فایل</span> : null}
                <Link href={`/admin/repair-requests/${item.id}`} className="rounded-lg border border-silver px-3 py-2 text-xs font-extrabold">مشاهده</Link>
                <form action={deleteRepairRequestAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="rounded-lg bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700" type="submit">حذف</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
