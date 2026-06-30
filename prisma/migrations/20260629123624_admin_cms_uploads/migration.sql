-- AlterTable
ALTER TABLE "FarmSetupRequest" ADD COLUMN "adminNote" TEXT;

-- AlterTable
ALTER TABLE "RepairRequest" ADD COLUMN "adminNote" TEXT;

-- CreateTable
CREATE TABLE "RepairRequestAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repairRequestId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RepairRequestAttachment_repairRequestId_fkey" FOREIGN KEY ("repairRequestId") REFERENCES "RepairRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettings" (
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
    "heroTitle" TEXT NOT NULL DEFAULT 'فروش ماینر، قطعات، تعمیرات و راه‌اندازی فارم',
    "heroText" TEXT NOT NULL DEFAULT 'Mine Plus برای خرید و استعلام دستگاه ماینر، قطعات مصرفی، تعمیرات تخصصی و طراحی زیرساخت فارم ساخته شده است.',
    "defaultMetaTitle" TEXT NOT NULL DEFAULT 'Mine Plus | فروش ماینر، قطعات و تعمیرات تخصصی',
    "defaultMetaDescription" TEXT NOT NULL DEFAULT 'فروش و استعلام ماینر و قطعات، پذیرش تعمیرات تخصصی و راه‌اندازی فارم ماینینگ با بررسی فنی.',
    "enableStore" BOOLEAN NOT NULL DEFAULT true,
    "enableRepairForm" BOOLEAN NOT NULL DEFAULT true,
    "enableFarmForm" BOOLEAN NOT NULL DEFAULT true,
    "showPrices" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "coverImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "createdAt", "description", "featured", "id", "image", "kind", "priceText", "shortDescription", "slug", "status", "stockStatus", "title", "updatedAt") SELECT "category", "createdAt", "description", "featured", "id", "image", "kind", "priceText", "shortDescription", "slug", "status", "stockStatus", "title", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");
