import { deleteFarmRequestAction, updateFarmRequestAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { farmRequestStatusOptions } from "@/lib/request-status";

export const dynamic = "force-dynamic";

export default async function AdminFarmRequestsPage() {
  await requireAdmin();
  const requests = await prisma.farmSetupRequest.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <AdminShell>
      <h1 className="text-3xl font-extrabold">درخواست‌های مشاوره و راه‌اندازی فارم</h1>
      <div className="mt-6 grid gap-4">
        {requests.map((item) => (
          <div key={item.id} className="rounded-2xl border border-silver bg-white p-4 shadow-panel">
            <form action={updateFarmRequestAction}>
              <input type="hidden" name="id" value={item.id} />
              <div className="grid gap-2 md:grid-cols-3">
                <p><b>{item.name}</b><br /><bdi dir="ltr">{item.phone}</bdi></p>
                <p className="text-sm text-steel">{item.city}<br />{item.capacity}</p>
                <select name="status" defaultValue={item.status} className="rounded-xl border border-silver px-3 py-2">{farmRequestStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
              </div>
              <p className="mt-3 rounded-xl bg-soft p-3 text-sm leading-7">{item.description}</p>
              <textarea name="adminNote" defaultValue={item.adminNote || ""} placeholder="یادداشت داخلی" rows={3} className="mt-3 w-full rounded-xl border border-silver px-3 py-2" />
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="rounded-xl bg-gold px-4 py-2 text-sm font-extrabold text-graphite">ذخیره</button>
              </div>
            </form>
            <form action={deleteFarmRequestAction} className="mt-2">
              <input type="hidden" name="id" value={item.id} />
              <button className="rounded-xl bg-red-50 px-4 py-2 text-sm font-extrabold text-red-700" type="submit">حذف درخواست</button>
            </form>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
