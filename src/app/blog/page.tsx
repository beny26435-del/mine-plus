import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, breadcrumbSchema, faqSchema, jsonLd, pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({
  title: "مقالات ماین پلاس | راهنمای خرید، تعمیر و نگهداری ماینر",
  description: "راهنماهای کاربردی برای خرید ماینر، انتخاب قطعات، نگهداری دستگاه، کنترل دما، پاور و خطاهای رایج ماینر.",
  path: "/blog",
  keywords: ["مقالات ماینینگ", "راهنمای خرید ماینر", "آموزش نگهداری ماینر", "خطاهای ماینر"]
});

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { status: "published" }, orderBy: { publishedAt: "desc" } });
  const breadcrumb = breadcrumbSchema([
    { name: "صفحه اصلی", path: "/" },
    { name: "مقالات", path: "/blog" }
  ]);
  const faqs = [
    {
      question: "مقاله‌های ماین پلاس درباره چه موضوعاتی هستند؟",
      answer: "موضوع‌ها روی خرید ماینر، انتخاب قطعه، نگهداری دستگاه، تعمیرات رایج و آماده‌سازی فارم متمرکز است."
    },
    {
      question: "آیا مطالب جایگزین بررسی فنی دستگاه هستند؟",
      answer: "خیر. مقاله‌ها برای تصمیم اولیه نوشته شده‌اند و برای خرید یا تعمیر، مدل و شرایط واقعی دستگاه باید بررسی شود."
    }
  ];
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "مقاله‌های ماین پلاس",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/blog/${post.slug}`),
      name: post.title
    }))
  };

  return (
    <section className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumb)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(itemListSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))} />
      <div className="container">
        <p className="font-extrabold text-gold">راهنمای خرید و نگهداری</p>
        <h1 className="mt-2 text-4xl font-extrabold text-graphite">مقاله‌های ماین پلاس</h1>
        <p className="mt-4 max-w-3xl leading-8 text-steel">این بخش برای تصمیم‌های واقعی نوشته شده است: خرید دستگاه، انتخاب قطعه، کنترل دما، تشخیص خطا و آماده‌سازی فارم. تلاش می‌کنیم متن‌ها کوتاه‌گویی تبلیغاتی نباشند و به سوال‌های عملی کاربر جواب بدهند.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-silver bg-white shadow-panel transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-glow">
              <div className="aspect-[16/9] overflow-hidden bg-navy">
                {post.coverImage ? <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /> : null}
              </div>
              <div className="p-5">
                <p className="text-sm font-bold text-gold">{post.category || "راهنما"}</p>
                <h2 className="mt-3 text-xl font-extrabold">{post.title}</h2>
                <p className="mt-3 text-sm leading-7 text-steel">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        {!posts.length ? (
          <div className="mt-8 rounded-2xl border border-silver bg-white p-8 text-center shadow-panel">
            <h2 className="text-2xl font-extrabold text-graphite">هنوز مقاله‌ای منتشر نشده است</h2>
            <p className="mt-3 leading-8 text-steel">به‌زودی راهنماهای خرید، نگهداری و تعمیر ماینر اینجا قرار می‌گیرد.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
