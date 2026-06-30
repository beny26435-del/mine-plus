import { deleteSupportLeadAction, updateSupportLeadAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { farmRequestStatusOptions, requestStatusLabel } from "@/lib/request-status";
import { parseSupportMessages } from "@/lib/support-ai";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  await requireAdmin();
  const leads = await prisma.supportLead.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="font-extrabold text-gold">گفت‌وگوهای سایت</p>
          <h1 className="mt-2 text-3xl font-extrabold">ساپورت سایت</h1>
          <p className="mt-2 max-w-2xl leading-8 text-steel">کاربر قبل از فعال شدن ساپورت، نام و شماره تماس وارد می‌کند. مکالمه و اطلاعات تماس اینجا ذخیره می‌شود.</p>
        </div>
        <div className="rounded-2xl border border-silver bg-white px-4 py-3 text-sm font-extrabold shadow-panel">
          {leads.length} گفت‌وگو
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {leads.length ? leads.map((lead) => {
          const messages = parseSupportMessages(lead.messages);
          return (
            <section key={lead.id} className="rounded-2xl border border-silver bg-white p-4 shadow-panel">
              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-extrabold">{lead.fullName}</h2>
                      <p className="mt-1 text-sm text-steel"><bdi dir="ltr">{lead.phone}</bdi> | {lead.createdAt.toLocaleDateString("fa-IR")}</p>
                    </div>
                    <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-extrabold text-graphite">{requestStatusLabel(lead.status)}</span>
                  </div>
                  <div className="mt-4 max-h-80 space-y-3 overflow-y-auto rounded-2xl bg-soft p-3">
                    {messages.length ? messages.map((message, index) => (
                      <div key={`${lead.id}-${index}`} className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
                        <p className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-7 ${message.role === "user" ? "bg-gold text-graphite" : "bg-white text-steel"}`}>
                          {message.text}
                        </p>
                      </div>
                    )) : <p className="text-sm text-steel">هنوز پیامی ثبت نشده است.</p>}
                  </div>
                </div>
                <div className="rounded-2xl border border-silver bg-white p-3">
                  <form action={updateSupportLeadAction}>
                    <input type="hidden" name="id" value={lead.id} />
                    <label className="grid gap-2 text-sm font-extrabold">
                      وضعیت
                      <select name="status" defaultValue={lead.status} className="rounded-xl border border-silver px-3 py-2">
                        {farmRequestStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </label>
                    <label className="mt-3 grid gap-2 text-sm font-extrabold">
                      یادداشت داخلی
                      <textarea name="adminNote" rows={5} defaultValue={lead.adminNote || ""} className="rounded-xl border border-silver px-3 py-2" />
                    </label>
                    <button className="mt-3 w-full rounded-xl bg-gold px-4 py-2 text-sm font-extrabold text-graphite">ذخیره</button>
                  </form>
                  <form action={deleteSupportLeadAction} className="mt-2">
                    <input type="hidden" name="id" value={lead.id} />
                    <button className="w-full rounded-xl bg-red-50 px-4 py-2 text-sm font-extrabold text-red-700" type="submit">حذف گفت‌وگو</button>
                  </form>
                </div>
              </div>
            </section>
          );
        }) : (
          <div className="rounded-2xl border border-silver bg-white p-6 text-center shadow-panel">
            <h2 className="text-xl font-extrabold">هنوز گفت‌وگویی ثبت نشده است.</h2>
            <p className="mt-2 text-sm leading-7 text-steel">بعد از فعال شدن بابل ساپورت در سایت، اطلاعات کاربران اینجا نمایش داده می‌شود.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
