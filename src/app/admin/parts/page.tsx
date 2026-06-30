import Link from "next/link";
import { deleteProductAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PartsPage() {
  await requireAdmin();
  const items = await prisma.product.findMany({ where: { kind: "part" }, orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] });
  return (
    <AdminShell>
      <div className="flex items-center justify-between gap-4"><h1 className="text-3xl font-extrabold">مدیریت قطعات</h1><Link href="/admin/parts/new" className="rounded-xl bg-gold px-4 py-2 font-extrabold text-graphite">قطعه جدید</Link></div>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-silver bg-white p-4">
            <div><b>{item.title}</b><p className="text-sm text-steel">{item.status} | {item.priceText || "استعلامی"}</p></div>
            <div className="flex gap-2"><Link href={`/admin/parts/${item.id}`} className="rounded-lg border border-silver px-3 py-2 text-sm font-bold">ویرایش</Link><form action={deleteProductAction}><input type="hidden" name="id" value={item.id} /><button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">حذف</button></form></div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
