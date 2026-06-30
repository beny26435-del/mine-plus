# Mine Plus

سایت فروشگاهی و خدماتی جداگانه برای برند Mine Plus.

امکانات اصلی:

- فروش و استعلام ماینرها در بخش جداگانه `/miners`
- فروش و استعلام قطعات در بخش جداگانه `/parts`
- فروشگاه کلی `/products`
- فرم درخواست تعمیر با امکان آپلود عکس/ویدیو روی VPS
- فرم درخواست مشاوره و راه‌اندازی فارم
- پنل ادمین برای مدیریت محصولات، قطعات، مقاله‌ها، نمونه‌کارها، درخواست‌ها و تنظیمات سایت

## اجرای Local

```bash
cp .env.example .env
npm install
npm run prisma:migrate
npm run db:seed
npm run dev -- --port 3010
```

آدرس سایت:

```text
http://localhost:3010
```

## ورود به پنل ادمین

مسیر:

```text
/admin/login
```

اطلاعات اولیه از `.env` خوانده می‌شود:

```env
ADMIN_EMAIL="admin@mineplus.ir"
ADMIN_PASSWORD="change-this-password"
AUTH_SECRET=""
```

برای `AUTH_SECRET` یک مقدار قوی بسازید:

```bash
openssl rand -base64 32
```

## فایل‌های برند

لوگو و بنر جدید در این مسیرها هستند:

```text
public/images/mine-plus-logo.png
public/images/mine-plus-banner.png
```

مسیر این تصاویر از پنل ادمین در بخش تنظیمات قابل تغییر است.

## آپلود روی VPS

فایل‌ها داخل Vercel ذخیره نمی‌شوند. سایت فایل را به API آپلود VPS می‌فرستد و فقط URL فایل در دیتابیس ذخیره می‌شود.

Envهای لازم در سایت:

```env
UPLOAD_API_URL="http://YOUR_VPS_IP:4000/api/upload"
UPLOAD_API_KEY="replace-with-strong-secret"
UPLOAD_PUBLIC_BASE_URL="http://YOUR_VPS_IP:4000"
```

اگر این envها تنظیم نباشند، فرم بدون فایل کار می‌کند و هنگام انتخاب فایل پیام خطای فارسی نمایش داده می‌شود.

برای VPS می‌توانید از `upload-server` پروژه اصلی MineFix استفاده کنید؛ همان API با فیلد multipart `files` و هدر `x-api-key` پشتیبانی می‌شود.

## پنل ادمین

مسیرهای مهم:

- `/admin` داشبورد
- `/admin/miners` مدیریت ماینرها
- `/admin/parts` مدیریت قطعات
- `/admin/posts` مدیریت مقالات
- `/admin/case-studies` مدیریت نمونه‌کارها
- `/admin/repair-requests` درخواست‌های تعمیر و فایل‌های آپلودی مشتری
- `/admin/farm-requests` درخواست‌های مشاوره/راه‌اندازی فارم
- `/admin/settings` تنظیمات برند، بنر، لوگو، شماره تماس و فعال/غیرفعال کردن بخش‌ها

## دستورات

```bash
npm run lint
npm run build
npm run prisma:migrate
npm run db:seed
npm run db:studio
```

## Deploy

برای production بهتر است `DATABASE_URL` را به PostgreSQL مثل Neon یا Supabase وصل کنید. سپس:

```bash
npm run build
npm run db:seed
```

در Vercel این envها را تنظیم کنید:

```env
DATABASE_URL=""
ADMIN_EMAIL="admin@mineplus.ir"
ADMIN_PASSWORD="یک رمز قوی"
AUTH_SECRET="یک secret قوی"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
MINE_PLUS_PHONE="09127023327"
MINE_PLUS_WHATSAPP_LINK="https://wa.me/989127023327"
UPLOAD_API_URL="http://YOUR_VPS_IP:4000/api/upload"
UPLOAD_API_KEY="same-as-vps"
UPLOAD_PUBLIC_BASE_URL="http://YOUR_VPS_IP:4000"
```
