import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminRepairRequestsPage() {
  await requireAdmin();
  const requests = await prisma.repairRequest.findMany({ orderBy: { createdAt: "desc" }, include: { attachments: true } });
  return (
    <AdminShell>
      <h1 className="text-3xl font-extrabold">درخواست‌های تعمیر</h1>
      <div className="mt-6 grid gap-3">
        {requests.map((item) => (
          <Link key={item.id} href={`/admin/repair-requests/${item.id}`} className="rounded-2xl border border-silver bg-white p-4 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><b>{item.name}</b> | <bdi dir="ltr">{item.phone}</bdi><p className="mt-1 text-sm text-steel">{item.deviceModel} | {item.issueType}</p></div>
              <div className="flex gap-2"><span className="rounded-full bg-soft px-3 py-1 text-xs font-bold">{item.status}</span>{item.attachments.length ? <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-bold">دارای فایل</span> : null}</div>
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
