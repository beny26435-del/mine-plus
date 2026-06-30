import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { status: "published" }, orderBy: { publishedAt: "desc" } });
  return (
    <section className="py-12">
      <div className="container">
        <h1 className="text-4xl font-extrabold text-graphite">مقالات Mine Plus</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="overflow-hidden rounded-2xl border border-silver bg-white shadow-panel">
              {post.coverImage ? <img src={post.coverImage} alt={post.title} className="h-48 w-full object-cover" /> : null}
              <div className="p-5">
                <p className="text-sm font-bold text-gold">{post.category || "آموزشی"}</p>
                <h2 className="mt-3 text-xl font-extrabold">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-steel">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
