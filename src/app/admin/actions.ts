"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, requireAdmin, verifyAdminCredentials } from "@/lib/auth";
import { normalizeIranPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullable(formData: FormData, key: string) {
  return text(formData, key) || null;
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function loginAction(formData: FormData) {
  const user = await verifyAdminCredentials(text(formData, "email"), text(formData, "password"));
  if (!user) redirect("/admin/login?error=1");
  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      brandName: text(formData, "brandName"),
      slogan: text(formData, "slogan"),
      phone: normalizeIranPhone(text(formData, "phone")),
      whatsappLink: text(formData, "whatsappLink"),
      telegram: nullable(formData, "telegram"),
      instagram: nullable(formData, "instagram"),
      address: nullable(formData, "address"),
      workingHours: nullable(formData, "workingHours"),
      logoImage: text(formData, "logoImage") || "/images/mine-plus-logo.png",
      bannerImage: text(formData, "bannerImage") || "/images/mine-plus-banner.png",
      heroEyebrow: text(formData, "heroEyebrow"),
      heroTitle: text(formData, "heroTitle"),
      heroText: text(formData, "heroText"),
      storeTitle: text(formData, "storeTitle"),
      storeText: text(formData, "storeText"),
      servicesTitle: text(formData, "servicesTitle"),
      servicesText: text(formData, "servicesText"),
      repairCtaTitle: text(formData, "repairCtaTitle"),
      repairCtaText: text(formData, "repairCtaText"),
      farmCtaTitle: text(formData, "farmCtaTitle"),
      farmCtaText: text(formData, "farmCtaText"),
      contentTitle: text(formData, "contentTitle"),
      contentText: text(formData, "contentText"),
      defaultMetaTitle: text(formData, "defaultMetaTitle"),
      defaultMetaDescription: text(formData, "defaultMetaDescription"),
      enableStore: checked(formData, "enableStore"),
      enableRepairForm: checked(formData, "enableRepairForm"),
      enableFarmForm: checked(formData, "enableFarmForm"),
      showPrices: checked(formData, "showPrices")
    },
    create: {
      id: 1,
      brandName: text(formData, "brandName") || "Mine Plus",
      slogan: text(formData, "slogan") || "فروش ماینر، قطعات، تعمیرات و راه‌اندازی فارم",
      phone: normalizeIranPhone(text(formData, "phone") || "09127023327"),
      whatsappLink: text(formData, "whatsappLink") || "https://wa.me/989127023327",
      logoImage: text(formData, "logoImage") || "/images/mine-plus-logo.png",
      bannerImage: text(formData, "bannerImage") || "/images/mine-plus-banner.png",
      heroEyebrow: text(formData, "heroEyebrow") || "Mine Plus | فروش، تعمیر و راه‌اندازی",
      heroTitle: text(formData, "heroTitle") || "فروش، تعمیر و راه‌اندازی تجهیزات استخراج",
      heroText: text(formData, "heroText") || "اگر قصد خرید ماینر، تامین قطعه، تعمیر دستگاه یا راه‌اندازی فارم دارید، Mine Plus کمک می‌کند مسیر درست را با اطلاعات فنی روشن‌تر انتخاب کنید.",
      storeTitle: text(formData, "storeTitle") || "ماینر و قطعه را با اطلاعات روشن‌تر انتخاب کنید",
      storeText: text(formData, "storeText") || "محصولات منتخب برای شروع استعلام نمایش داده شده‌اند. برای خرید دستگاه، تامین قطعه یا بررسی سازگاری، وارد بخش مربوط شوید.",
      servicesTitle: text(formData, "servicesTitle") || "خدمات Mine Plus فقط فروش محصول نیست",
      servicesText: text(formData, "servicesText") || "اگر برای خرید، تعمیر یا راه‌اندازی فارم تصمیم می‌گیرید، بهتر است شرایط دستگاه، برق، تهویه و هزینه‌های احتمالی از ابتدا مشخص باشد.",
      repairCtaTitle: text(formData, "repairCtaTitle") || "دستگاه شما خطا دارد یا هش نمی‌دهد؟",
      repairCtaText: text(formData, "repairCtaText") || "مشکل دستگاه را ثبت کنید و اگر عکس یا ویدیو از خطا دارید همان‌جا ارسال کنید تا بررسی اولیه دقیق‌تر انجام شود.",
      farmCtaTitle: text(formData, "farmCtaTitle") || "برای فارم، قبل از خرید تجهیزات برنامه‌ریزی کنید",
      farmCtaText: text(formData, "farmCtaText") || "برق، تهویه، چیدمان، شبکه و نگهداری باید قبل از خرید تعداد بالا بررسی شوند تا هزینه‌های بعدی قابل کنترل باشد.",
      contentTitle: text(formData, "contentTitle") || "راهنماها و نمونه‌کارهای Mine Plus",
      contentText: text(formData, "contentText") || "برای تصمیم بهتر، راهنماهای خرید، نکات نگهداری و نمونه‌کارهای تعمیرات را ببینید."
    }
  });
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const kind = text(formData, "kind") || "miner";
  const data = {
    title: text(formData, "title"),
    slug: text(formData, "slug") || slugify(text(formData, "title")),
    category: text(formData, "category"),
    kind,
    shortDescription: text(formData, "shortDescription"),
    description: text(formData, "description"),
    image: nullable(formData, "image"),
    priceText: nullable(formData, "priceText"),
    stockStatus: text(formData, "stockStatus") || "inquiry",
    featured: checked(formData, "featured"),
    status: text(formData, "status") || "published",
    sortOrder: Number(text(formData, "sortOrder") || 0),
    metaTitle: nullable(formData, "metaTitle"),
    metaDescription: nullable(formData, "metaDescription")
  };
  if (id) await prisma.product.update({ where: { id }, data });
  else await prisma.product.create({ data });
  revalidatePath("/", "layout");
  redirect(kind === "part" ? "/admin/parts" : "/admin/miners");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/", "layout");
}

export async function savePostAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status") || "draft";
  const data = {
    title: text(formData, "title"),
    slug: text(formData, "slug") || slugify(text(formData, "title")),
    excerpt: text(formData, "excerpt"),
    content: text(formData, "content"),
    category: nullable(formData, "category"),
    coverImage: nullable(formData, "coverImage"),
    status,
    metaTitle: nullable(formData, "metaTitle"),
    metaDescription: nullable(formData, "metaDescription"),
    publishedAt: status === "published" ? new Date() : null
  };
  if (id) await prisma.blogPost.update({ where: { id }, data });
  else await prisma.blogPost.create({ data });
  revalidatePath("/", "layout");
  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/posts");
}

export async function saveCaseStudyAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const data = {
    title: text(formData, "title"),
    slug: text(formData, "slug") || slugify(text(formData, "title")),
    deviceModel: text(formData, "deviceModel"),
    repairType: text(formData, "repairType"),
    problem: text(formData, "problem"),
    diagnosis: text(formData, "diagnosis"),
    solution: text(formData, "solution"),
    result: text(formData, "result"),
    image: nullable(formData, "image"),
    videoUrl: nullable(formData, "videoUrl"),
    status: text(formData, "status") || "draft",
    metaTitle: nullable(formData, "metaTitle"),
    metaDescription: nullable(formData, "metaDescription")
  };
  if (id) await prisma.caseStudy.update({ where: { id }, data });
  else await prisma.caseStudy.create({ data });
  revalidatePath("/", "layout");
  redirect("/admin/case-studies");
}

export async function deleteCaseStudyAction(formData: FormData) {
  await requireAdmin();
  await prisma.caseStudy.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/case-studies");
}

export async function updateRepairRequestAction(formData: FormData) {
  await requireAdmin();
  await prisma.repairRequest.update({
    where: { id: text(formData, "id") },
    data: { status: text(formData, "status"), adminNote: nullable(formData, "adminNote") }
  });
  revalidatePath("/admin/repair-requests");
}

export async function updateFarmRequestAction(formData: FormData) {
  await requireAdmin();
  await prisma.farmSetupRequest.update({
    where: { id: text(formData, "id") },
    data: { status: text(formData, "status"), adminNote: nullable(formData, "adminNote") }
  });
  revalidatePath("/admin/farm-requests");
}
