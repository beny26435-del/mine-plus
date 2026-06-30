# Mine Plus

سایت فروشگاهی و خدماتی جداگانه برای برند Mine Plus.

امکانات اصلی:

- فروش و استعلام ماینرها در بخش جداگانه `/miners`
- فروش و استعلام قطعات در بخش جداگانه `/parts`
- فروشگاه کلی `/products`
- فرم درخواست تعمیر با امکان آپلود عکس/ویدیو روی VPS
- فرم درخواست مشاوره و راه‌اندازی فارم
- ساپورت هوشمند شناور در همه صفحات، با گرفتن نام و شماره تماس قبل از شروع چت
- پنل ادمین برای مدیریت محصولات، قطعات، مقاله‌ها، نمونه‌کارها، درخواست‌ها و تنظیمات سایت

## اجرای Local

این پروژه برای production روی PostgreSQL آماده شده است. برای local هم ساده‌ترین راه این است که از همان دیتابیس Neon یا یک دیتابیس PostgreSQL جدا استفاده کنید.

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
- `/admin/support` لیدها و مکالمه‌های ساپورت سایت
- `/admin/settings` تنظیمات برند، بنر، لوگو، شماره تماس و فعال/غیرفعال کردن بخش‌ها

## ساپورت هوشمند بدون هزینه

این پروژه فعلاً از سرویس پولی خارجی برای AI استفاده نمی‌کند. بابل «ساپورت AI» در همه صفحات عمومی نمایش داده می‌شود، اول نام و شماره تماس کاربر را می‌گیرد، سپس با یک موتور پاسخ‌گویی داخلی و سناریومحور به سوالات اولیه درباره خرید ماینر، قطعات، تعمیرات و راه‌اندازی فارم جواب می‌دهد.

مزیت این روش:

- هیچ هزینه API ندارد.
- روی Vercel اجرا می‌شود.
- کلید OpenAI، سرویس پولی یا سرور جدا لازم ندارد.
- اطلاعات مشتری در دیتابیس خود سایت ذخیره می‌شود.
- از پنل ادمین قابل خاموش/روشن شدن است.

محدودیت مهم:

این نسخه «LLM واقعی» نیست؛ یعنی مثل ChatGPT آزاد فکر نمی‌کند. پاسخ‌ها بر اساس کلمات کلیدی و متن‌های آماده تخصصی سایت ساخته می‌شوند. برای شروع و جذب لید کافی و بدون هزینه است. اگر بعداً خواستید پاسخ‌های آزاد و هوشمندتر داشته باشید، می‌توان همین UI و دیتابیس را نگه داشت و فقط موتور پاسخ‌گویی را به یک مدل AI وصل کرد.

فعال/غیرفعال کردن:

```text
/admin/settings
```

گزینه «ساپورت هوشمند فعال باشد» را تغییر دهید و ذخیره کنید.

دیدن لیدها و مکالمه‌ها:

```text
/admin/support
```

در این بخش نام، شماره تماس، متن مکالمه، وضعیت پیگیری و یادداشت داخلی نمایش داده می‌شود.

بعد از اضافه شدن ساپورت، production migration باید اجرا شود:

```bash
DATABASE_URL="postgresql://..." npm run prisma:deploy
```

اگر seed هم می‌زنید:

```bash
DATABASE_URL="postgresql://..." ADMIN_EMAIL="admin@mineplus.ir" ADMIN_PASSWORD="رمز قوی" npm run db:seed
```

## دستورات

```bash
npm run lint
npm run build
npm run prisma:migrate
npm run db:seed
npm run db:studio
```

## Deploy

برای production باید `DATABASE_URL` را به PostgreSQL مثل Neon یا Supabase وصل کنید. مقدار Neon شبیه این است:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
```

بعد از اولین deploy یا بعد از تغییر دیتابیس، migration و seed را اجرا کنید:

```bash
DATABASE_URL="postgresql://..." npm run prisma:deploy
DATABASE_URL="postgresql://..." ADMIN_EMAIL="admin@mineplus.ir" ADMIN_PASSWORD="رمز قوی" npm run db:seed
```

در Vercel این envها را تنظیم کنید:

```env
DATABASE_URL="postgresql://..."
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

اگر connection string دیتابیس یا کلید آپلود را در چت یا جای عمومی فرستادید، در Neon یا VPS مقدار جدید بسازید و در Vercel هم جایگزین کنید.
