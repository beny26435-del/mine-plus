import { saveSettingsAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const query = await searchParams;
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="font-extrabold text-gold">مدیریت محتوای سایت</p>
          <h1 className="mt-2 text-3xl font-extrabold">تنظیمات Mine Plus</h1>
          <p className="mt-2 max-w-2xl leading-8 text-steel">متن‌های اصلی صفحه اول، مسیر لوگو و بنر، لینک‌های تماس و وضعیت فرم‌ها از این بخش تغییر می‌کند.</p>
        </div>
        {query.saved ? <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">تنظیمات ذخیره شد.</p> : null}
      </div>

      <form action={saveSettingsAction} className="mt-6 grid gap-6">
        <SettingsCard title="هویت برند و تماس" description="اطلاعاتی که در هدر، فوتر و صفحه تماس استفاده می‌شود.">
          <Field label="نام برند"><input name="brandName" defaultValue={settings?.brandName || "Mine Plus"} className="input" /></Field>
          <Field label="شعار کوتاه"><input name="slogan" defaultValue={settings?.slogan || ""} className="input" /></Field>
          <Field label="شماره تماس"><input name="phone" dir="ltr" defaultValue={settings?.phone || "09127023327"} className="input text-left" /></Field>
          <Field label="لینک واتساپ"><input name="whatsappLink" dir="ltr" defaultValue={settings?.whatsappLink || "https://wa.me/989127023327"} className="input text-left" /></Field>
          <Field label="تلگرام"><input name="telegram" dir="ltr" defaultValue={settings?.telegram || ""} className="input text-left" /></Field>
          <Field label="اینستاگرام"><input name="instagram" dir="ltr" defaultValue={settings?.instagram || ""} className="input text-left" /></Field>
          <Field label="آدرس" wide><input name="address" defaultValue={settings?.address || ""} className="input" /></Field>
          <Field label="ساعات کاری"><input name="workingHours" defaultValue={settings?.workingHours || ""} className="input" /></Field>
        </SettingsCard>

        <SettingsCard title="تصاویر برند" description="بنر صفحه اول نباید لوگوی هدر باشد. لوگو و بنر مسیرهای جدا دارند.">
          <Field label="مسیر لوگو"><input name="logoImage" dir="ltr" defaultValue={settings?.logoImage || "/images/mine-plus-logo.png"} className="input text-left" /></Field>
          <Field label="مسیر بنر"><input name="bannerImage" dir="ltr" defaultValue={settings?.bannerImage || "/images/mine-plus-banner.png"} className="input text-left" /></Field>
        </SettingsCard>

        <SettingsCard title="متن‌های صفحه اصلی" description="این متن‌ها مستقیم در صفحه اول سایت دیده می‌شوند؛ کوتاه، روشن و مشتری‌محور بنویسید.">
          <Field label="برچسب بالای Hero"><input name="heroEyebrow" defaultValue={settings?.heroEyebrow || "Mine Plus | فروش، تعمیر و راه‌اندازی"} className="input" /></Field>
          <Field label="عنوان اصلی Hero"><input name="heroTitle" defaultValue={settings?.heroTitle || ""} className="input" /></Field>
          <Field label="توضیح Hero" wide><textarea name="heroText" rows={4} defaultValue={settings?.heroText || ""} className="input" /></Field>
          <Field label="عنوان بخش فروشگاه"><input name="storeTitle" defaultValue={settings?.storeTitle || ""} className="input" /></Field>
          <Field label="متن بخش فروشگاه"><textarea name="storeText" rows={3} defaultValue={settings?.storeText || ""} className="input" /></Field>
          <Field label="عنوان خدمات"><input name="servicesTitle" defaultValue={settings?.servicesTitle || ""} className="input" /></Field>
          <Field label="متن خدمات"><textarea name="servicesText" rows={3} defaultValue={settings?.servicesText || ""} className="input" /></Field>
          <Field label="عنوان CTA تعمیر"><input name="repairCtaTitle" defaultValue={settings?.repairCtaTitle || ""} className="input" /></Field>
          <Field label="متن CTA تعمیر"><textarea name="repairCtaText" rows={3} defaultValue={settings?.repairCtaText || ""} className="input" /></Field>
          <Field label="عنوان CTA فارم"><input name="farmCtaTitle" defaultValue={settings?.farmCtaTitle || ""} className="input" /></Field>
          <Field label="متن CTA فارم"><textarea name="farmCtaText" rows={3} defaultValue={settings?.farmCtaText || ""} className="input" /></Field>
          <Field label="عنوان محتوا و نمونه‌کار"><input name="contentTitle" defaultValue={settings?.contentTitle || ""} className="input" /></Field>
          <Field label="متن محتوا و نمونه‌کار"><textarea name="contentText" rows={3} defaultValue={settings?.contentText || ""} className="input" /></Field>
        </SettingsCard>

        <SettingsCard title="سئو و فعال‌سازی بخش‌ها" description="اگر بخشی فعال نباشد، مسیر مربوطه همچنان کنترل‌شده و بدون خطای بد نمایش داده می‌شود.">
          <Field label="Meta title"><input name="defaultMetaTitle" defaultValue={settings?.defaultMetaTitle || ""} className="input" /></Field>
          <Field label="Meta description" wide><textarea name="defaultMetaDescription" rows={3} defaultValue={settings?.defaultMetaDescription || ""} className="input" /></Field>
          <label className="toggle"><input name="enableStore" type="checkbox" defaultChecked={settings?.enableStore ?? true} /> فروشگاه فعال باشد</label>
          <label className="toggle"><input name="enableRepairForm" type="checkbox" defaultChecked={settings?.enableRepairForm ?? true} /> فرم تعمیر فعال باشد</label>
          <label className="toggle"><input name="enableFarmForm" type="checkbox" defaultChecked={settings?.enableFarmForm ?? true} /> فرم فارم فعال باشد</label>
          <label className="toggle"><input name="showPrices" type="checkbox" defaultChecked={settings?.showPrices ?? false} /> قیمت‌ها نمایش داده شود</label>
        </SettingsCard>

        <button className="rounded-2xl bg-gold px-6 py-4 text-base font-extrabold text-graphite shadow-panel">ذخیره همه تنظیمات</button>
      </form>
    </AdminShell>
  );
}

function SettingsCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-silver bg-white p-5 shadow-panel">
      <div className="mb-5">
        <h2 className="text-xl font-extrabold">{title}</h2>
        <p className="mt-1 text-sm leading-7 text-steel">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <label className={`grid gap-2 text-sm font-extrabold ${wide ? "md:col-span-2" : ""}`}><span>{label}</span>{children}</label>;
}
