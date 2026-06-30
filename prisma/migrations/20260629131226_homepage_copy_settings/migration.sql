-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "brandName" TEXT NOT NULL DEFAULT 'Mine Plus',
    "slogan" TEXT NOT NULL DEFAULT 'فروش ماینر، قطعات، تعمیرات و راه‌اندازی فارم',
    "phone" TEXT NOT NULL DEFAULT '09127023327',
    "whatsappLink" TEXT NOT NULL DEFAULT 'https://wa.me/989127023327',
    "telegram" TEXT,
    "instagram" TEXT,
    "address" TEXT,
    "workingHours" TEXT,
    "logoImage" TEXT NOT NULL DEFAULT '/images/mine-plus-logo.png',
    "bannerImage" TEXT NOT NULL DEFAULT '/images/mine-plus-banner.png',
    "heroEyebrow" TEXT NOT NULL DEFAULT 'Mine Plus | فروش، تعمیر و راه‌اندازی',
    "heroTitle" TEXT NOT NULL DEFAULT 'فروش ماینر، قطعات، تعمیرات و راه‌اندازی فارم',
    "heroText" TEXT NOT NULL DEFAULT 'Mine Plus برای خرید و استعلام دستگاه ماینر، قطعات مصرفی، تعمیرات تخصصی و طراحی زیرساخت فارم ساخته شده است.',
    "storeTitle" TEXT NOT NULL DEFAULT 'ماینر و قطعه را با اطلاعات روشن‌تر انتخاب کنید',
    "storeText" TEXT NOT NULL DEFAULT 'محصولات منتخب برای شروع استعلام نمایش داده شده‌اند. برای خرید دستگاه، تامین قطعه یا بررسی سازگاری، وارد بخش مربوط شوید.',
    "servicesTitle" TEXT NOT NULL DEFAULT 'خدمات Mine Plus فقط فروش محصول نیست',
    "servicesText" TEXT NOT NULL DEFAULT 'اگر برای خرید، تعمیر یا راه‌اندازی فارم تصمیم می‌گیرید، بهتر است شرایط دستگاه، برق، تهویه و هزینه‌های احتمالی از ابتدا مشخص باشد.',
    "repairCtaTitle" TEXT NOT NULL DEFAULT 'دستگاه شما خطا دارد یا هش نمی‌دهد؟',
    "repairCtaText" TEXT NOT NULL DEFAULT 'مشکل دستگاه را ثبت کنید و اگر عکس یا ویدیو از خطا دارید همان‌جا ارسال کنید تا بررسی اولیه دقیق‌تر انجام شود.',
    "farmCtaTitle" TEXT NOT NULL DEFAULT 'برای فارم، قبل از خرید تجهیزات برنامه‌ریزی کنید',
    "farmCtaText" TEXT NOT NULL DEFAULT 'برق، تهویه، چیدمان، شبکه و نگهداری باید قبل از خرید تعداد بالا بررسی شوند تا هزینه‌های بعدی قابل کنترل باشد.',
    "contentTitle" TEXT NOT NULL DEFAULT 'راهنماها و نمونه‌کارهای Mine Plus',
    "contentText" TEXT NOT NULL DEFAULT 'برای تصمیم بهتر، راهنماهای خرید، نکات نگهداری و نمونه‌کارهای تعمیرات را ببینید.',
    "defaultMetaTitle" TEXT NOT NULL DEFAULT 'Mine Plus | فروش ماینر، قطعات و تعمیرات تخصصی',
    "defaultMetaDescription" TEXT NOT NULL DEFAULT 'فروش و استعلام ماینر و قطعات، پذیرش تعمیرات تخصصی و راه‌اندازی فارم ماینینگ با بررسی فنی.',
    "enableStore" BOOLEAN NOT NULL DEFAULT true,
    "enableRepairForm" BOOLEAN NOT NULL DEFAULT true,
    "enableFarmForm" BOOLEAN NOT NULL DEFAULT true,
    "showPrices" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("address", "bannerImage", "brandName", "createdAt", "defaultMetaDescription", "defaultMetaTitle", "enableFarmForm", "enableRepairForm", "enableStore", "heroText", "heroTitle", "id", "instagram", "logoImage", "phone", "showPrices", "slogan", "telegram", "updatedAt", "whatsappLink", "workingHours") SELECT "address", "bannerImage", "brandName", "createdAt", "defaultMetaDescription", "defaultMetaTitle", "enableFarmForm", "enableRepairForm", "enableStore", "heroText", "heroTitle", "id", "instagram", "logoImage", "phone", "showPrices", "slogan", "telegram", "updatedAt", "whatsappLink", "workingHours" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
