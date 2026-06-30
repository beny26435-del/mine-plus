import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  const cases = await prisma.caseStudy.findMany({ where: { status: "published" }, orderBy: { updatedAt: "desc" } });
  return (
    <section className="py-12">
      <div className="container">
        <h1 className="text-4xl font-extrabold text-graphite">نمونه‌کارهای تعمیرات</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {cases.map((item) => (
            <article key={item.id} className="rounded-2xl border border-silver bg-white p-5 shadow-panel">
              <p className="text-sm font-bold text-gold">{item.deviceModel} | {item.repairType}</p>
              <h2 className="mt-3 text-2xl font-extrabold">{item.title}</h2>
              <p className="mt-3 leading-8 text-steel">{item.problem}</p>
              <div className="mt-4 rounded-xl bg-soft p-4 text-sm leading-7"><b>نتیجه:</b> {item.result}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
