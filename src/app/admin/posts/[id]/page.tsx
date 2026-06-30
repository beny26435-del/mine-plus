import { notFound } from "next/navigation";
import { savePostAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <AdminShell>
      <form action={savePostAction} className="grid gap-4 rounded-2xl border border-silver bg-white p-5 shadow-panel">
        <h1 className="text-3xl font-extrabold">ویرایش مقاله</h1>
        <input type="hidden" name="id" defaultValue={post.id} />
        <input name="title" required defaultValue={post.title} className="rounded-xl border border-silver px-3 py-2" />
        <input name="slug" defaultValue={post.slug} dir="ltr" className="rounded-xl border border-silver px-3 py-2 text-left" />
        <input name="category" defaultValue={post.category || ""} className="rounded-xl border border-silver px-3 py-2" />
        <textarea name="excerpt" required rows={3} defaultValue={post.excerpt} className="rounded-xl border border-silver px-3 py-2" />
        <textarea name="content" required rows={14} defaultValue={post.content} className="rounded-xl border border-silver px-3 py-2" />
        <input name="coverImage" defaultValue={post.coverImage || ""} dir="ltr" className="rounded-xl border border-silver px-3 py-2 text-left" />
        <select name="status" defaultValue={post.status} className="rounded-xl border border-silver px-3 py-2"><option value="draft">پیش‌نویس</option><option value="published">منتشر شده</option></select>
        <input name="metaTitle" defaultValue={post.metaTitle || ""} className="rounded-xl border border-silver px-3 py-2" />
        <textarea name="metaDescription" rows={2} defaultValue={post.metaDescription || ""} className="rounded-xl border border-silver px-3 py-2" />
        <button className="rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">ذخیره</button>
      </form>
    </AdminShell>
  );
}
