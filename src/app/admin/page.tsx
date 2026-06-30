import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  await requireAdmin();
  const [miners, parts, repairs, farms, posts, cases, latestRepairs] = await Promise.all([
    prisma.product.count({ where: { kind: "miner" } }),
    prisma.product.count({ where: { kind: "part" } }),
    prisma.repairRequest.count(),
    prisma.farmSetupRequest.count(),
    prisma.blogPost.count(),
    prisma.caseStudy.count(),
    prisma.repairRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { attachments: true } })
  ]);
  const cards = [
    ["ماینرها", miners, "/admin/miners"],
    ["قطعات", parts, "/admin/parts"],
    ["درخواست تعمیر", repairs, "/admin/repair-requests"],
    ["درخواست فارم", farms, "/admin/farm-requests"],
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
      <section className="mt-8 rounded-2xl border border-silver bg-white p-5 shadow-panel">
        <h2 className="font-extrabold">آخرین درخواست‌های تعمیر</h2>
        <div className="mt-4 grid gap-3">
          {latestRepairs.map((item) => (
            <Link key={item.id} href={`/admin/repair-requests/${item.id}`} className="rounded-xl border border-silver p-3 text-sm">
              <b>{item.name}</b> | <bdi dir="ltr">{item.phone}</bdi> | {item.deviceModel} {item.attachments.length ? <span className="mr-2 rounded-full bg-gold/20 px-2 py-1 text-xs font-bold">دارای فایل</span> : null}
            </Link>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
