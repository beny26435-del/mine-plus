import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function renderArticleContent(content: string) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      if (line.startsWith("### ")) {
        return <h3 key={index} className="mt-8 text-xl font-extrabold leading-[1.7] text-graphite">{line.replace(/^### /, "")}</h3>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={index} className="mt-10 border-r-4 border-gold pr-4 text-2xl font-extrabold leading-[1.7] text-graphite">{line.replace(/^## /, "")}</h2>;
      }
      if (line.startsWith("- ")) {
        return <p key={index} className="relative pr-5 leading-9 text-graphite before:absolute before:right-0 before:top-4 before:h-2 before:w-2 before:rounded-full before:bg-gold">{line.replace(/^- /, "")}</p>;
      }
      return <p key={index} className="leading-9 text-graphite">{line}</p>;
    });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "published") notFound();
  return (
    <article className="py-12">
      <div className="container max-w-4xl rounded-2xl border border-silver bg-white p-5 shadow-panel md:p-8">
        {post.coverImage ? (
          <div className="mb-7 aspect-[16/9] overflow-hidden rounded-2xl bg-navy">
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
          </div>
        ) : null}
        <p className="font-extrabold text-gold">{post.category || "مقاله"}</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.4] text-graphite">{post.title}</h1>
        <p className="mt-5 text-lg leading-9 text-steel">{post.excerpt}</p>
        <div className="mt-8 space-y-4 text-[1.03rem] leading-9">{renderArticleContent(post.content)}</div>
      </div>
    </article>
  );
}
