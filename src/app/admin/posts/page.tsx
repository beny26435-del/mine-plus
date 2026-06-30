import Link from "next/link";
import type { BlogPost } from "@prisma/client";
import { deletePostAction, savePostAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  await requireAdmin();
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section>
          <h1 className="text-3xl font-extrabold">مقالات</h1>
          <div className="mt-6 grid gap-3">
            {posts.map((post) => (
              <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-silver bg-white p-4">
                <div><b>{post.title}</b><p className="text-sm text-steel">{post.status} | /blog/{post.slug}</p></div>
                <div className="flex gap-2"><Link href={`/admin/posts/${post.id}`} className="rounded-lg border border-silver px-3 py-2 text-sm font-bold">ویرایش</Link><form action={deletePostAction}><input type="hidden" name="id" value={post.id} /><button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">حذف</button></form></div>
              </div>
            ))}
          </div>
        </section>
        <PostForm />
      </div>
    </AdminShell>
  );
}

function PostForm({ post }: { post?: BlogPost | null }) {
  return (
    <form action={savePostAction} className="grid h-fit gap-3 rounded-2xl border border-silver bg-white p-5 shadow-panel">
      <h2 className="font-extrabold">{post ? "ویرایش مقاله" : "مقاله جدید"}</h2>
      <input type="hidden" name="id" defaultValue={post?.id} />
      <input name="title" required defaultValue={post?.title} placeholder="عنوان" className="rounded-xl border border-silver px-3 py-2" />
      <input name="slug" defaultValue={post?.slug} placeholder="slug" dir="ltr" className="rounded-xl border border-silver px-3 py-2 text-left" />
      <input name="category" defaultValue={post?.category || ""} placeholder="دسته" className="rounded-xl border border-silver px-3 py-2" />
      <textarea name="excerpt" required rows={3} defaultValue={post?.excerpt} placeholder="خلاصه" className="rounded-xl border border-silver px-3 py-2" />
      <textarea name="content" required rows={10} defaultValue={post?.content} placeholder="محتوای مقاله" className="rounded-xl border border-silver px-3 py-2" />
      <input name="coverImage" defaultValue={post?.coverImage || ""} placeholder="تصویر شاخص" dir="ltr" className="rounded-xl border border-silver px-3 py-2 text-left" />
      <select name="status" defaultValue={post?.status || "draft"} className="rounded-xl border border-silver px-3 py-2"><option value="draft">پیش‌نویس</option><option value="published">منتشر شده</option></select>
      <input name="metaTitle" defaultValue={post?.metaTitle || ""} placeholder="Meta title" className="rounded-xl border border-silver px-3 py-2" />
      <textarea name="metaDescription" rows={2} defaultValue={post?.metaDescription || ""} placeholder="Meta description" className="rounded-xl border border-silver px-3 py-2" />
      <button className="rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">ذخیره</button>
    </form>
  );
}
