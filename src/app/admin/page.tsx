import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dashboardHiddenRequestStatuses } from "@/lib/request-status";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const [miners, parts, repairs, farms, support, posts, cases, latestRepairs, latestFarms] = await Promise.all([
    prisma.product.count({ where: { kind: "miner" } }),
    prisma.product.count({ where: { kind: "part" } }),
    prisma.repairRequest.count(),
    prisma.farmSetupRequest.count(),
    prisma.supportLead.count(),
    prisma.blogPost.count(),
    prisma.caseStudy.count(),
    prisma.repairRequest.findMany({
      where: { status: { notIn: dashboardHiddenRequestStatuses } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { attachments: true }
    }),
    prisma.farmSetupRequest.findMany({
      where: { status: { notIn: dashboardHiddenRequestStatuses } },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);
  const cards = [
    ["ماینرها", miners, "/admin/miners"],
    ["قطعات", parts, "/admin/parts"],
    ["درخواست تعمیر", repairs, "/admin/repair-requests"],
    ["درخواست فارم", farms, "/admin/farm-requests"],
    ["ساپورت سایت", support, "/admin/support"],
    ["مقالات", posts, "/admin/posts"],
    ["نمونه‌کارها", cases, "/admin/case-studies"]
  ];
  return (
    <AdminShell>
      <h1 className="text-3xl font-extrabold">داشبورد مدیریت</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map(([label, count, href]) => (
          <Link key={String(label)} href={String(href)} className="rounded-2xl border border-silver bg-white p-5 shadow-panel">
            <p className="text-sm font-bold text-steel">{label}</p>
            <p className="mt-3 text-3xl font-extrabold text-graphite">{count}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-silver bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-extrabold">آخرین درخواست‌های تعمیر</h2>
            <Link href="/admin/repair-requests" className="text-sm font-bold text-gold">همه</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {latestRepairs.length ? latestRepairs.map((item) => (
              <Link key={item.id} href={`/admin/repair-requests/${item.id}`} className="rounded-xl border border-silver p-3 text-sm transition hover:border-gold">
                <b>{item.name}</b> | <bdi dir="ltr">{item.phone}</bdi> | {item.deviceModel} {item.attachments.length ? <span className="mr-2 rounded-full bg-gold/20 px-2 py-1 text-xs font-bold">دارای فایل</span> : null}
              </Link>
            )) : <p className="rounded-xl bg-soft p-3 text-sm text-steel">درخواست تعمیر پیگیری‌نشده‌ای وجود ندارد.</p>}
          </div>
        </section>
        <section className="rounded-2xl border border-silver bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-extrabold">آخرین مشاوره‌ها</h2>
            <Link href="/admin/farm-requests" className="text-sm font-bold text-gold">همه</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {latestFarms.length ? latestFarms.map((item) => (
              <Link key={item.id} href="/admin/farm-requests" className="rounded-xl border border-silver p-3 text-sm transition hover:border-gold">
                <b>{item.name}</b> | <bdi dir="ltr">{item.phone}</bdi>
                <p className="mt-1 text-xs leading-6 text-steel">{item.description}</p>
              </Link>
            )) : <p className="rounded-xl bg-soft p-3 text-sm text-steel">مشاوره پیگیری‌نشده‌ای وجود ندارد.</p>}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
