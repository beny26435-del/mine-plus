import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "published") notFound();
  return (
    <article className="py-12">
      <div className="container max-w-3xl rounded-2xl border border-silver bg-white p-6 shadow-panel">
        {post.coverImage ? <img src={post.coverImage} alt={post.title} className="mb-6 max-h-[420px] w-full rounded-2xl object-cover" /> : null}
        <p className="font-extrabold text-gold">{post.category || "مقاله"}</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.4] text-graphite">{post.title}</h1>
        <p className="mt-5 text-lg leading-9 text-steel">{post.excerpt}</p>
        <div className="mt-8 whitespace-pre-line leading-9 text-graphite">{post.content}</div>
      </div>
    </article>
  );
}
