import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    title: "Antminer S19 Pro",
    slug: "antminer-s19-pro",
    category: "ماینر",
    kind: "miner",
    shortDescription: "گزینه‌ای شناخته‌شده برای استخراج SHA-256؛ مناسب وقتی برق و تهویه استاندارد دارید.",
    description:
      "Antminer S19 Pro برای خرید مطمئن نیاز به بررسی هش‌ریت پایدار، سلامت هشبردها، وضعیت پاور، فن‌ها و سابقه کارکرد دارد. قبل از استعلام نهایی، بهتر است ظرفیت برق، تهویه و محل نصب مشخص باشد تا انتخاب دستگاه با شرایط واقعی شما هماهنگ شود.",
    priceText: "استعلامی",
    stockStatus: "inquiry",
    featured: true,
    image: "/images/products/antminer-s19-pro.jpg"
  },
  {
    title: "Whatsminer M30S++",
    slug: "whatsminer-m30s-plus-plus",
    category: "ماینر",
    kind: "miner",
    shortDescription: "ماینر Whatsminer برای کارکرد پایدار؛ مناسب فارم‌هایی با برق و تهویه حساب‌شده.",
    description:
      "Whatsminer M30S++ در صورت تامین برق پایدار و تهویه مناسب می‌تواند انتخاب قابل بررسی برای فارم باشد. قبل از خرید، وضعیت دستگاه، دمای کارکرد، لاگ خطا، فن‌ها و شرایط نگهداری باید بررسی شود.",
    priceText: "استعلامی",
    stockStatus: "inquiry",
    featured: true,
    image: "/images/products/whatsminer-m30s-plus-plus.jpg"
  },
  {
    title: "پاور ماینر",
    slug: "miner-power-supply",
    category: "قطعات",
    kind: "part",
    shortDescription: "استعلام پاور سازگار با مدل دستگاه؛ مناسب رفع روشن نشدن یا ناپایداری زیر بار.",
    description:
      "انتخاب پاور باید بر اساس مدل دستگاه، توان مصرفی، کابل‌ها و وضعیت برق انجام شود. اگر دستگاه روشن نمی‌شود یا زیر بار قطع می‌کند، قبل از خرید پاور بهتر است اتصالات، افت ولتاژ و وضعیت هشبرد هم بررسی شود.",
    priceText: "استعلامی",
    stockStatus: "inquiry",
    featured: true,
    image: "/images/products/miner-power-supply.jpg"
  },
  {
    title: "فن ماینر",
    slug: "miner-fan",
    category: "قطعات",
    kind: "part",
    shortDescription: "فن مناسب برای خطای fan، صدای غیرعادی، دمای بالا و تهویه نامناسب دستگاه.",
    description:
      "فن سالم برای کنترل دمای ماینر حیاتی است. خطای فن، صدای غیرعادی یا دور نامناسب می‌تواند باعث افت هش‌ریت یا توقف دستگاه شود.",
    priceText: "استعلامی",
    stockStatus: "inquiry",
    featured: true,
    image: "/images/products/miner-fan.jpg"
  },
  {
    title: "کنترل برد ماینر",
    slug: "miner-control-board",
    category: "قطعات",
    kind: "part",
    shortDescription: "کنترل‌برد برای مشکلات بوت، شبکه، firmware و ارتباط دستگاه با هشبردها.",
    description:
      "قبل از تعویض کنترل‌برد باید firmware، شبکه، کابل دیتا و وضعیت هشبرد بررسی شود تا از تعویض اشتباه قطعه جلوگیری شود.",
    priceText: "استعلامی",
    stockStatus: "inquiry",
    featured: false,
    image: "/images/products/miner-control-board.jpg"
  },
  {
    title: "راه‌اندازی فارم ماینینگ",
    slug: "mining-farm-setup",
    category: "خدمات",
    kind: "service",
    shortDescription: "بررسی و طراحی زیرساخت فارم؛ از برق و تهویه تا چیدمان، شبکه و نگهداری.",
    description:
      "راه‌اندازی فارم نیاز به بررسی دقیق ظرفیت برق، تهویه، ایمنی، چیدمان دستگاه‌ها، کابل‌کشی و برنامه نگهداری دارد. Mine Plus می‌تواند نیاز پروژه را بررسی و مسیر اجرایی مناسب پیشنهاد کند.",
    priceText: "برآورد بعد از بررسی",
    stockStatus: "inquiry",
    featured: true,
    image: "/images/products/mining-farm-setup.jpg"
  }
];

const posts = [
  {
    title: "قبل از خرید ماینر چه چیزهایی را بررسی کنیم؟",
    slug: "before-buying-asic-miner",
    excerpt: "یک چک‌لیست ساده برای اینکه قبل از خرید ماینر، فقط به قیمت نگاه نکنید و دستگاه مناسب شرایط خودتان انتخاب کنید.",
    content:
      "خرید ماینر وقتی مطمئن‌تر است که قبل از پرداخت، چند مورد روشن باشد: مدل دستگاه، مصرف برق، وضعیت هش‌ریت، سلامت فن‌ها، شرایط تهویه و هزینه نگهداری. اگر دستگاه کارکرده است، تست پایدار و لاگ خطا اهمیت بیشتری دارد.\n\nاول ظرفیت برق و محل نصب را بررسی کنید. دستگاهی که روی کاغذ سودده است، اگر در محیط گرم یا برق ناپایدار کار کند، می‌تواند هزینه تعمیر و توقف زیادی ایجاد کند. بعد از آن وضعیت پاور، فن، هشبرد و صدای دستگاه را بررسی کنید.\n\nاگر برای فارم خرید می‌کنید، فقط یک دستگاه را مبنا قرار ندهید. هزینه کابل‌کشی، تابلو برق، تهویه، سرویس دوره‌ای و مدیریت دما روی نتیجه نهایی اثر دارد. بهتر است قبل از خرید تعداد بالا، شرایط محیط و برنامه نگهداری مشخص شود.",
    category: "خرید ماینر",
    coverImage: "/images/blog/buy-miner-guide.jpg"
  },
  {
    title: "چطور دمای ماینر را کنترل کنیم؟",
    slug: "miner-cooling-and-fan-guide",
    excerpt: "دمای بالا فقط باعث صدای زیاد نمی‌شود؛ افت هش‌ریت، خطای فن و آسیب به قطعات هم می‌تواند نتیجه تهویه ضعیف باشد.",
    content:
      "ماینر برای کار پایدار به جریان هوای مناسب نیاز دارد. اگر هوای گرم اطراف دستگاه جمع شود، فن‌ها با دور بالاتر کار می‌کنند، صدا بیشتر می‌شود و احتمال افت هش‌ریت یا توقف دستگاه بالا می‌رود.\n\nاول مسیر ورود و خروج هوا را بررسی کنید. دستگاه نباید هوای گرم خروجی خودش یا دستگاه‌های دیگر را دوباره وارد کند. گردوغبار روی فن و هیت‌سینک هم باعث کاهش خنک‌کاری می‌شود و بهتر است سرویس دوره‌ای جدی گرفته شود.\n\nاگر خطای فن، دمای غیرعادی یا نوسان هش‌ریت دارید، قبل از تعویض قطعه، وضعیت فن‌ها، کابل‌ها، سنسور دما و تهویه محیط را بررسی کنید. در بسیاری از موارد مشکل فقط خود فن نیست و شرایط نصب هم نقش دارد.",
    category: "نگهداری",
    coverImage: "/images/blog/miner-cooling-guide.jpg"
  },
  {
    title: "نشانه‌های خرابی پاور ماینر چیست؟",
    slug: "miner-power-supply-symptoms",
    excerpt: "روشن نشدن دستگاه، قطع شدن زیر بار و ناپایداری هش‌ریت می‌تواند به پاور مربوط باشد، اما همیشه نباید سریع پاور را تعویض کرد.",
    content:
      "پاور ماینر وظیفه تامین برق پایدار برای دستگاه را دارد. اگر دستگاه روشن نمی‌شود، زیر بار خاموش می‌شود، فن‌ها رفتار غیرعادی دارند یا هش‌ریت پایدار نیست، پاور یکی از مواردی است که باید بررسی شود.\n\nقبل از نتیجه‌گیری، کابل برق، کانکتورها، افت ولتاژ، شرایط برق ورودی و وضعیت هشبردها را چک کنید. گاهی مشکل از اتصالات یا برق محیط است و تعویض پاور بدون بررسی دقیق فقط هزینه اضافه ایجاد می‌کند.\n\nاگر پاور بوی سوختگی دارد، صدای غیرعادی می‌دهد یا دستگاه زیر بار قطع می‌کند، بهتر است بررسی تخصصی انجام شود. در زمان خرید پاور جدید هم سازگاری با مدل دستگاه و توان مصرفی اهمیت زیادی دارد.",
    category: "تعمیرات",
    coverImage: "/images/blog/power-supply-guide.jpg"
  }
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@mineplus.ir";
  const password = process.env.ADMIN_PASSWORD || "change-this-password";
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: await bcrypt.hash(password, 12) },
    create: { email, passwordHash: await bcrypt.hash(password, 12), name: "مدیر Mine Plus" }
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      slogan: "فروش، تعمیر و راه‌اندازی تجهیزات استخراج",
      phone: "09127023327",
      whatsappLink: "https://wa.me/989127023327",
      logoImage: "/images/mine-plus-logo.png",
      bannerImage: "/images/mine-plus-banner.png",
      heroEyebrow: "Mine Plus | فروش، تعمیر و راه‌اندازی",
      heroTitle: "فروش، تعمیر و راه‌اندازی تجهیزات استخراج",
      heroText: "اگر قصد خرید ماینر، تامین قطعه، تعمیر دستگاه یا راه‌اندازی فارم دارید، Mine Plus کمک می‌کند مسیر درست را با اطلاعات فنی روشن‌تر انتخاب کنید.",
      storeTitle: "ماینر و قطعه را با اطلاعات روشن‌تر انتخاب کنید",
      storeText: "محصولات منتخب برای شروع استعلام نمایش داده شده‌اند. برای خرید دستگاه، تامین قطعه یا بررسی سازگاری، وارد بخش مربوط شوید.",
      servicesTitle: "خدمات Mine Plus فقط فروش محصول نیست",
      servicesText: "اگر برای خرید، تعمیر یا راه‌اندازی فارم تصمیم می‌گیرید، بهتر است شرایط دستگاه، برق، تهویه و هزینه‌های احتمالی از ابتدا مشخص باشد.",
      repairCtaTitle: "دستگاه شما خطا دارد یا هش نمی‌دهد؟",
      repairCtaText: "مشکل دستگاه را ثبت کنید و اگر عکس یا ویدیو از خطا دارید همان‌جا ارسال کنید تا بررسی اولیه دقیق‌تر انجام شود.",
      farmCtaTitle: "برای فارم، قبل از خرید تجهیزات برنامه‌ریزی کنید",
      farmCtaText: "برق، تهویه، چیدمان، شبکه و نگهداری باید قبل از خرید تعداد بالا بررسی شوند تا هزینه‌های بعدی قابل کنترل باشد.",
      contentTitle: "راهنماها و نمونه‌کارهای Mine Plus",
      contentText: "برای تصمیم بهتر، راهنماهای خرید، نکات نگهداری و نمونه‌کارهای تعمیرات را ببینید."
    },
    create: {
      id: 1,
      brandName: "Mine Plus",
      slogan: "فروش، تعمیر و راه‌اندازی تجهیزات استخراج",
      phone: "09127023327",
      whatsappLink: "https://wa.me/989127023327",
      telegram: "https://t.me/minefix_ir",
      instagram: "https://instagram.com/minefix.ir",
      logoImage: "/images/mine-plus-logo.png",
      bannerImage: "/images/mine-plus-banner.png",
      heroEyebrow: "Mine Plus | فروش، تعمیر و راه‌اندازی",
      heroTitle: "فروش، تعمیر و راه‌اندازی تجهیزات استخراج",
      heroText: "اگر قصد خرید ماینر، تامین قطعه، تعمیر دستگاه یا راه‌اندازی فارم دارید، Mine Plus کمک می‌کند مسیر درست را با اطلاعات فنی روشن‌تر انتخاب کنید.",
      storeTitle: "ماینر و قطعه را با اطلاعات روشن‌تر انتخاب کنید",
      storeText: "محصولات منتخب برای شروع استعلام نمایش داده شده‌اند. برای خرید دستگاه، تامین قطعه یا بررسی سازگاری، وارد بخش مربوط شوید.",
      servicesTitle: "خدمات Mine Plus فقط فروش محصول نیست",
      servicesText: "اگر برای خرید، تعمیر یا راه‌اندازی فارم تصمیم می‌گیرید، بهتر است شرایط دستگاه، برق، تهویه و هزینه‌های احتمالی از ابتدا مشخص باشد.",
      repairCtaTitle: "دستگاه شما خطا دارد یا هش نمی‌دهد؟",
      repairCtaText: "مشکل دستگاه را ثبت کنید و اگر عکس یا ویدیو از خطا دارید همان‌جا ارسال کنید تا بررسی اولیه دقیق‌تر انجام شود.",
      farmCtaTitle: "برای فارم، قبل از خرید تجهیزات برنامه‌ریزی کنید",
      farmCtaText: "برق، تهویه، چیدمان، شبکه و نگهداری باید قبل از خرید تعداد بالا بررسی شوند تا هزینه‌های بعدی قابل کنترل باشد.",
      contentTitle: "راهنماها و نمونه‌کارهای Mine Plus",
      contentText: "برای تصمیم بهتر، راهنماهای خرید، نکات نگهداری و نمونه‌کارهای تعمیرات را ببینید."
    }
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { ...post, status: "published", publishedAt: new Date() },
      create: { ...post, status: "published", publishedAt: new Date() }
    });
  }

  await prisma.caseStudy.upsert({
    where: { slug: "s19-power-diagnosis" },
    update: {},
    create: {
      title: "عیب‌یابی روشن نشدن Antminer S19",
      slug: "s19-power-diagnosis",
      deviceModel: "Antminer S19",
      repairType: "پاور و اتصالات",
      problem: "دستگاه روشن نمی‌شد و فن‌ها واکنش نداشتند.",
      diagnosis: "ابتدا برق ورودی، کابل‌ها، پاور و مسیر تغذیه بررسی شد.",
      solution: "اتصالات معیوب اصلاح و پاور زیر بار تست شد.",
      result: "دستگاه پس از تست پایدار روشن شد و گزارش تست ثبت شد.",
      status: "published"
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
