# Mine Plus

سایت فروشگاهی و خدماتی جداگانه برای برند Mine Plus.

امکانات اصلی:

- نمایش و فروش ماینرها در بخش جداگانه `/miners`
- نمایش و فروش قطعات در بخش جداگانه `/parts`
- فروشگاه کلی `/products`
- ماشین حساب ماینینگ واقعی در `/mining-calculator`
- فرم درخواست تعمیر با امکان آپلود عکس/ویدیو روی VPS
- فرم درخواست مشاوره و راه‌اندازی فارم
- پشتیبانی شناور سایت در همه صفحات، با گرفتن نام و شماره تماس قبل از شروع گفت‌وگو
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

شماره تماس، لینک واتساپ، لوگو، بنر و متن‌های اصلی سایت از همین بخش خوانده می‌شوند. اگر شماره را در پنل تغییر دادید، سایت هم همان مقدار را نشان می‌دهد؛ نیازی به تغییر کد یا env برای شماره تماس نیست.

## پشتیبانی سایت بدون هزینه

این پروژه فعلاً از سرویس پولی خارجی برای پاسخ‌گویی استفاده نمی‌کند. بابل «مشاوره سریع» در همه صفحات عمومی نمایش داده می‌شود، اول نام و شماره تماس کاربر را می‌گیرد و بعد گفت‌وگو را در پنل ذخیره می‌کند. پاسخ‌های اولیه با یک موتور داخلی و سناریومحور ساخته می‌شوند تا سوال‌های رایج درباره خرید ماینر، قطعات، تعمیرات و راه‌اندازی فارم سریع‌تر جواب بگیرند.

مزیت این روش:

- هیچ هزینه API ندارد.
- روی Vercel اجرا می‌شود.
- کلید OpenAI، سرویس پولی یا سرور جدا لازم ندارد.
- اطلاعات مشتری در دیتابیس خود سایت ذخیره می‌شود.
- از پنل ادمین قابل خاموش/روشن شدن است.

محدودیت مهم:

این نسخه «LLM واقعی» نیست؛ یعنی مثل ChatGPT آزاد فکر نمی‌کند. پاسخ‌ها بر اساس کلمات کلیدی و متن‌های آماده تخصصی سایت ساخته می‌شوند. برای شروع، ثبت لید و پاسخ اولیه کافی و بدون هزینه است. اگر بعداً خواستید پاسخ‌های آزادتر داشته باشید، می‌توان همین UI و دیتابیس را نگه داشت و فقط موتور پاسخ‌گویی را به یک مدل AI وصل کرد.

فعال/غیرفعال کردن:

```text
/admin/settings
```

گزینه «پشتیبانی سایت فعال باشد» را تغییر دهید و ذخیره کنید.

دیدن لیدها و مکالمه‌ها:

```text
/admin/support
```

در این بخش نام، شماره تماس، متن مکالمه، وضعیت پیگیری و یادداشت داخلی نمایش داده می‌شود.

## ماشین حساب ماینینگ

مسیر:

```text
/mining-calculator
```

این صفحه برای محاسبه تقریبی درآمد استخراج بیت‌کوین ساخته شده و عدد ساختگی تولید نمی‌کند. داده‌های زنده از این منابع گرفته می‌شوند:

- قیمت BTC/USD از CoinGecko
- سختی شبکه، هش‌ریت شبکه و ارتفاع بلاک از mempool.space
- نرخ دلار از TGJU، اگر API آن در دسترس باشد

نرخ دلار اگر از منبع زنده دریافت شود به‌صورت خودکار داخل فرم می‌آید، اما کاربر همچنان می‌تواند آن را اصلاح کند. قیمت برق هم ورودی کاربر است، چون تعرفه واقعی به نوع مصرف، محل، قرارداد و شرایط بهره‌برداری وابسته است. اگر APIهای زنده اصلی در دسترس نباشند، صفحه خطای شفاف نمایش می‌دهد و محاسبه فیک انجام نمی‌دهد.

اگر در local خطای Prisma گرفتید که `DATABASE_URL` باید با `postgresql://` شروع شود، یعنی `.env` هنوز مقدار قدیمی SQLite مثل `file:...` دارد. این پروژه در نسخه فعلی با PostgreSQL اجرا می‌شود؛ مقدار `DATABASE_URL` را با connection string دیتابیس Neon یا PostgreSQL جایگزین کنید.

بعد از هر تغییری که مدل‌های دیتابیس را عوض کند، production migration باید اجرا شود:

```bash
DATABASE_URL="postgresql://..." npm run prisma:deploy
```

اگر seed هم می‌زنید:

```bash
DATABASE_URL="postgresql://..." ADMIN_EMAIL="admin@mineplus.ir" ADMIN_PASSWORD="رمز قوی" npm run db:seed
```

Seed برای تولید محتوای اولیه و مقاله‌های جدید idempotent است: اگر تنظیمات سایت، محصولات یا مقاله‌ها قبلاً از پنل ویرایش شده باشند، اجرای دوباره seed آن‌ها را بازنویسی نمی‌کند و فقط رکوردهای جدید را می‌سازد.

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
UPLOAD_API_URL="http://YOUR_VPS_IP:4000/api/upload"
UPLOAD_API_KEY="same-as-vps"
UPLOAD_PUBLIC_BASE_URL="http://YOUR_VPS_IP:4000"
```

نکته تماس: شماره قابل نمایش و لینک واتساپ از پنل مدیریت ذخیره می‌شوند. در Vercel فقط `DATABASE_URL` باید به همان دیتابیسی وصل باشد که تنظیمات پنل داخل آن ذخیره شده است.

اگر connection string دیتابیس یا کلید آپلود را در چت یا جای عمومی فرستادید، در Neon یا VPS مقدار جدید بسازید و در Vercel هم جایگزین کنید.

## SEO و تغییر دامنه

سایت برای SEO پایه آماده شده است:

- `robots.txt` در مسیر `/robots.txt`
- sitemap داینامیک در مسیر `/sitemap.xml`
- canonical داینامیک بر اساس `NEXT_PUBLIC_SITE_URL`
- metadata اختصاصی برای صفحه اصلی، فروشگاه، ماینرها، قطعات، مقاله‌ها، محصول، تماس، تعمیر و مشاوره فارم
- OpenGraph و Twitter card برای نمایش بهتر لینک‌ها
- JSON-LD برای صفحه اصلی، محصول‌ها، مقاله‌ها و لیست‌های محصول/مقاله

قبل از تغییر دامنه، تولید محتوا، متن صفحات، محصول‌ها و schema قابل انجام است. بعد از تغییر دامنه این مقدار را در Vercel عوض کنید:

```env
NEXT_PUBLIC_SITE_URL="https://your-new-domain.com"
```

بعد از deploy دامنه جدید، این آدرس‌ها را باز کنید و در Google Search Console ثبت کنید:

```text
https://your-new-domain.com/sitemap.xml
https://your-new-domain.com/robots.txt
```
