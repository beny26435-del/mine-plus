import Link from "next/link";
import { deleteCaseStudyAction, saveCaseStudyAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminCasesPage() {
  await requireAdmin();
  const cases = await prisma.caseStudy.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section>
          <h1 className="text-3xl font-extrabold">نمونه‌کارها</h1>
          <div className="mt-6 grid gap-3">
            {cases.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-silver bg-white p-4">
                <div><b>{item.title}</b><p className="text-sm text-steel">{item.deviceModel} | {item.status}</p></div>
                <div className="flex gap-2"><Link href={`/admin/case-studies/${item.id}`} className="rounded-lg border border-silver px-3 py-2 text-sm font-bold">ویرایش</Link><form action={deleteCaseStudyAction}><input type="hidden" name="id" value={item.id} /><button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">حذف</button></form></div>
              </div>
            ))}
          </div>
        </section>
        <CaseForm />
      </div>
    </AdminShell>
  );
}

function CaseForm() {
  return (
    <form action={saveCaseStudyAction} className="grid h-fit gap-3 rounded-2xl border border-silver bg-white p-5 shadow-panel">
      <h2 className="font-extrabold">نمونه‌کار جدید</h2>
      <input name="title" required placeholder="عنوان" className="rounded-xl border border-silver px-3 py-2" />
      <input name="slug" placeholder="slug" dir="ltr" className="rounded-xl border border-silver px-3 py-2 text-left" />
      <input name="deviceModel" required placeholder="مدل دستگاه" className="rounded-xl border border-silver px-3 py-2" />
      <input name="repairType" required placeholder="نوع تعمیر" className="rounded-xl border border-silver px-3 py-2" />
      <textarea name="problem" required rows={2} placeholder="مشکل" className="rounded-xl border border-silver px-3 py-2" />
      <textarea name="diagnosis" required rows={2} placeholder="عیب‌یابی" className="rounded-xl border border-silver px-3 py-2" />
      <textarea name="solution" required rows={2} placeholder="اقدام انجام‌شده" className="rounded-xl border border-silver px-3 py-2" />
      <textarea name="result" required rows={2} placeholder="نتیجه" className="rounded-xl border border-silver px-3 py-2" />
      <input name="image" placeholder="تصویر" dir="ltr" className="rounded-xl border border-silver px-3 py-2 text-left" />
      <input name="videoUrl" placeholder="ویدیو" dir="ltr" className="rounded-xl border border-silver px-3 py-2 text-left" />
      <select name="status" defaultValue="draft" className="rounded-xl border border-silver px-3 py-2"><option value="draft">پیش‌نویس</option><option value="published">منتشر شده</option></select>
      <button className="rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">ذخیره</button>
    </form>
  );
}
