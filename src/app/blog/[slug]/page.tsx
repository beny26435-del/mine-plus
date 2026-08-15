import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCover } from "@/components/BlogCover";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, breadcrumbSchema, faqSchema, jsonLd, pageMetadata } from "@/lib/seo";

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "published") {
    return pageMetadata({
      title: "مقاله پیدا نشد | ماین پلاس",
      description: "مقاله موردنظر در ماین پلاس پیدا نشد.",
      path: `/blog/${slug}`
    });
  }

  return pageMetadata({
    title: post.metaTitle || `${post.title} | ماین پلاس`,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    keywords: [post.title, post.category || "راهنمای ماینینگ", "راهنمای خرید ماینر", "تعمیر ماینر"]
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "published") notFound();
  const relatedPosts = await prisma.blogPost.findMany({
    where: { status: "published", slug: { not: post.slug }, category: post.category || undefined },
    orderBy: { publishedAt: "desc" },
    take: 3
  });
  const fallbackRelated = relatedPosts.length
    ? relatedPosts
    : await prisma.blogPost.findMany({ where: { status: "published", slug: { not: post.slug } }, orderBy: { publishedAt: "desc" }, take: 3 });
  const faqs = [
    {
      question: "آیا با خواندن مقاله می‌توان تصمیم قطعی گرفت؟",
      answer: "مقاله برای تصمیم اولیه کمک می‌کند، اما برای خرید دستگاه، انتخاب قطعه یا تعمیر، بهتر است مدل دقیق و شرایط واقعی دستگاه بررسی شود."
    },
    {
      question: "برای مشاوره یا بررسی اولیه چه اطلاعاتی بفرستیم؟",
      answer: "مدل دستگاه، شهر، توضیح مشکل یا هدف خرید و اگر دارید عکس صفحه وضعیت، قطعه یا خطای دستگاه را ارسال کنید."
    },
    {
      question: "ماین پلاس فقط فروش محصول دارد؟",
      answer: "خیر. فروش ماینر و قطعات، ثبت تعمیر و مشاوره راه‌اندازی فارم در کنار هم ارائه می‌شود تا تصمیم خرید و نگهداری دقیق‌تر باشد."
    }
  ];
  const breadcrumb = breadcrumbSchema([
    { name: "صفحه اصلی", path: "/" },
    { name: "مقالات", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` }
  ]);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.coverImage ? [absoluteUrl(post.coverImage)] : [absoluteUrl("/images/mine-plus-banner.png")],
    datePublished: (post.publishedAt || post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Mine Plus" },
    inLanguage: "fa-IR",
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: "Mine Plus",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/mine-plus-logo.png")
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`)
    }
  };

  return (
    <article className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))} />
      <div className="container max-w-4xl rounded-2xl border border-silver bg-white p-5 shadow-panel md:p-8">
        <nav aria-label="breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm font-bold text-steel">
          <Link href="/">صفحه اصلی</Link>
          <span>/</span>
          <Link href="/blog">مقالات</Link>
          <span>/</span>
          <span className="text-graphite">{post.title}</span>
        </nav>
        {post.coverImage ? (
          <div className="mb-7 aspect-[16/9] overflow-hidden rounded-2xl bg-navy">
            <BlogCover src={post.coverImage} title={post.title} priority />
          </div>
        ) : null}
        <p className="font-extrabold text-gold">{post.category || "مقاله"}</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.4] text-graphite">{post.title}</h1>
        <p className="mt-5 text-lg leading-9 text-steel">{post.excerpt}</p>
        <div className="mt-8 space-y-4 text-[1.03rem] leading-9">{renderArticleContent(post.content)}</div>
        <section className="mt-10 rounded-2xl border border-silver bg-soft p-5">
          <h2 className="text-2xl font-extrabold text-graphite">برای تصمیم بعدی</h2>
          <p className="mt-3 leading-8 text-steel">اگر بعد از خواندن این راهنما هنوز بین خرید، تعمیر یا انتخاب قطعه مردد هستید، مسیر بعدی را ساده انتخاب کنید.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/miners" className="rounded-xl bg-gold px-5 py-3 font-extrabold text-graphite">خرید ماینر</Link>
            <Link href="/parts" className="rounded-xl border border-silver bg-white px-5 py-3 font-extrabold text-graphite">قطعات ماینر</Link>
            <Link href="/repair-request" className="rounded-xl border border-silver bg-white px-5 py-3 font-extrabold text-graphite">ثبت تعمیر</Link>
          </div>
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-extrabold text-graphite">سوال‌های رایج</h2>
          <div className="mt-4 grid gap-3">
            {faqs.map((item) => (
              <details key={item.question} className="rounded-xl border border-silver bg-white p-4">
                <summary className="cursor-pointer font-extrabold text-graphite">{item.question}</summary>
                <p className="mt-3 leading-8 text-steel">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
        {fallbackRelated.length ? (
          <section className="mt-10">
            <h2 className="text-2xl font-extrabold text-graphite">مقاله‌های مرتبط</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {fallbackRelated.map((item) => (
                <Link key={item.id} href={`/blog/${item.slug}`} className="rounded-xl border border-silver bg-soft p-4 transition hover:border-gold">
                  <h3 className="font-extrabold leading-7 text-graphite">{item.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-steel">{item.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
