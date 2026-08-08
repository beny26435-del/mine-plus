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

function whatsappFromPhone(phone: string) {
  return `https://wa.me/98${phone.replace(/^0/, "")}`;
}

function whatsappValue(formData: FormData, phone: string) {
  const value = text(formData, "whatsappLink");
  if (!value || /^https:\/\/wa\.me\/(?:98)?9\d{9}$/.test(value)) {
    return whatsappFromPhone(phone);
  }
  return value;
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
  const normalizedPhone = normalizeIranPhone(text(formData, "phone") || "09201863207");
  const normalizedWhatsApp = whatsappValue(formData, normalizedPhone);

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      brandName: text(formData, "brandName"),
      slogan: text(formData, "slogan"),
      phone: normalizedPhone,
      whatsappLink: normalizedWhatsApp,
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
      enableAiSupport: checked(formData, "enableAiSupport"),
      showPrices: checked(formData, "showPrices")
    },
    create: {
      id: 1,
      brandName: text(formData, "brandName") || "Mine Plus",
      slogan: text(formData, "slogan") || "فروش، تعمیر و راه‌اندازی ماینینگ",
      phone: normalizedPhone,
      whatsappLink: normalizedWhatsApp,
      logoImage: text(formData, "logoImage") || "/images/mine-plus-logo.png",
      bannerImage: text(formData, "bannerImage") || "/images/mine-plus-banner.png",
      heroEyebrow: text(formData, "heroEyebrow") || "ماین پلاس | فروش، تعمیر و راه‌اندازی فارم",
      heroTitle: text(formData, "heroTitle") || "خرید ماینر، قطعات و خدمات فارم بدون سردرگمی",
      heroText: text(formData, "heroText") || "اگر دنبال دستگاه، قطعه، تعمیر یا راه‌اندازی فارم هستید، اول مدل و شرایط کارتان را بررسی می‌کنیم؛ بعد موجودی، قیمت روز و مسیر درست را شفاف می‌گوییم.",
      storeTitle: text(formData, "storeTitle") || "ماینر و قطعه را با خیال راحت‌تر انتخاب کنید",
      storeText: text(formData, "storeText") || "قبل از خرید، سازگاری قطعه، سلامت دستگاه، مصرف برق و شرایط تحویل را چک می‌کنیم تا انتخابتان فقط بر اساس حدس و قیمت نباشد.",
      servicesTitle: text(formData, "servicesTitle") || "فروش، تعمیر و زیرساخت در یک مسیر مشخص",
      servicesText: text(formData, "servicesText") || "از انتخاب دستگاه تا تعمیر و آماده‌سازی فارم، تمرکز ما روی تصمیم‌های قابل اجراست؛ چیزی که با برق، فضا و بودجه شما جور دربیاید.",
      repairCtaTitle: text(formData, "repairCtaTitle") || "ماینر خطا می‌دهد یا هش‌ریت افت کرده؟",
      repairCtaText: text(formData, "repairCtaText") || "مدل دستگاه، توضیح خطا و اگر دارید عکس یا ویدیو بفرستید تا قبل از هر هزینه‌ای مسیر بررسی روشن شود.",
      farmCtaTitle: text(formData, "farmCtaTitle") || "قبل از خرید تعداد بالا، زیرساخت را حساب کنید",
      farmCtaText: text(formData, "farmCtaText") || "برق، تهویه، صدا، شبکه و محل نصب اگر از اول درست دیده نشوند، بعداً هزینه‌ساز می‌شوند.",
      contentTitle: text(formData, "contentTitle") || "راهنماها و نمونه‌کارهای کاربردی",
      contentText: text(formData, "contentText") || "چند راهنمای کوتاه و چند نمونه از کارهای انجام‌شده را اینجا می‌گذاریم تا تصمیم‌گیری ساده‌تر شود."
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
  revalidatePath("/admin");
  revalidatePath("/admin/repair-requests");
}

export async function deleteRepairRequestAction(formData: FormData) {
  await requireAdmin();
  await prisma.repairRequest.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin");
  revalidatePath("/admin/repair-requests");
  redirect("/admin/repair-requests");
}

export async function updateFarmRequestAction(formData: FormData) {
  await requireAdmin();
  await prisma.farmSetupRequest.update({
    where: { id: text(formData, "id") },
    data: { status: text(formData, "status"), adminNote: nullable(formData, "adminNote") }
  });
  revalidatePath("/admin");
  revalidatePath("/admin/farm-requests");
}

export async function deleteFarmRequestAction(formData: FormData) {
  await requireAdmin();
  await prisma.farmSetupRequest.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin");
  revalidatePath("/admin/farm-requests");
  redirect("/admin/farm-requests");
}

export async function updateSupportLeadAction(formData: FormData) {
  await requireAdmin();
  await prisma.supportLead.update({
    where: { id: text(formData, "id") },
    data: { status: text(formData, "status"), adminNote: nullable(formData, "adminNote") }
  });
  revalidatePath("/admin");
  revalidatePath("/admin/support");
}

export async function deleteSupportLeadAction(formData: FormData) {
  await requireAdmin();
  await prisma.supportLead.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin");
  revalidatePath("/admin/support");
  redirect("/admin/support");
}
