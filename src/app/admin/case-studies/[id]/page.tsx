import { notFound } from "next/navigation";
import { saveCaseStudyAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const item = await prisma.caseStudy.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <AdminShell>
      <form action={saveCaseStudyAction} className="grid gap-4 rounded-2xl border border-silver bg-white p-5 shadow-panel">
        <h1 className="text-3xl font-extrabold">ویرایش نمونه‌کار</h1>
        <input type="hidden" name="id" value={item.id} />
        <input name="title" required defaultValue={item.title} className="rounded-xl border border-silver px-3 py-2" />
        <input name="slug" defaultValue={item.slug} dir="ltr" className="rounded-xl border border-silver px-3 py-2 text-left" />
        <input name="deviceModel" required defaultValue={item.deviceModel} className="rounded-xl border border-silver px-3 py-2" />
        <input name="repairType" required defaultValue={item.repairType} className="rounded-xl border border-silver px-3 py-2" />
        <textarea name="problem" required rows={3} defaultValue={item.problem} className="rounded-xl border border-silver px-3 py-2" />
        <textarea name="diagnosis" required rows={3} defaultValue={item.diagnosis} className="rounded-xl border border-silver px-3 py-2" />
        <textarea name="solution" required rows={3} defaultValue={item.solution} className="rounded-xl border border-silver px-3 py-2" />
        <textarea name="result" required rows={3} defaultValue={item.result} className="rounded-xl border border-silver px-3 py-2" />
        <input name="image" defaultValue={item.image || ""} dir="ltr" className="rounded-xl border border-silver px-3 py-2 text-left" />
        <input name="videoUrl" defaultValue={item.videoUrl || ""} dir="ltr" className="rounded-xl border border-silver px-3 py-2 text-left" />
        <select name="status" defaultValue={item.status} className="rounded-xl border border-silver px-3 py-2"><option value="draft">پیش‌نویس</option><option value="published">منتشر شده</option></select>
        <button className="rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">ذخیره</button>
      </form>
    </AdminShell>
  );
}
