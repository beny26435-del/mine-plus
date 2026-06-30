-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'miner',
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "priceText" TEXT,
    "stockStatus" TEXT NOT NULL DEFAULT 'inquiry',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'published',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "deviceModel" TEXT NOT NULL,
    "issueType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mediaLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmSetupRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "powerStatus" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmSetupRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairRequestAttachment" (
    "id" TEXT NOT NULL,
    "repairRequestId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepairRequestAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "coverImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deviceModel" TEXT NOT NULL,
    "repairType" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "image" TEXT,
    "videoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- AddForeignKey
ALTER TABLE "RepairRequestAttachment" ADD CONSTRAINT "RepairRequestAttachment_repairRequestId_fkey" FOREIGN KEY ("repairRequestId") REFERENCES "RepairRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
