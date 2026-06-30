ALTER TABLE "SiteSettings" ADD COLUMN "enableAiSupport" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "SupportLead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "messages" TEXT NOT NULL DEFAULT '[]',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportLead_pkey" PRIMARY KEY ("id")
);
