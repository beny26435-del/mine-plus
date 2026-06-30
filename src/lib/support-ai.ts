export type SupportMessage = {
  role: "user" | "assistant";
  text: string;
  at: string;
};

const quickReplies = [
  "برای خرید ماینر چه اطلاعاتی لازم است؟",
  "چطور درخواست تعمیر ثبت کنم؟",
  "برای قطعه قیمت می‌خواهم",
  "مشاوره راه‌اندازی فارم می‌خواهم"
];

export function supportWelcomeMessage(name: string) {
  return `${name} عزیز، خوش آمدید. من دستیار Mine Plus هستم. می‌توانم درباره خرید ماینر، قطعات، تعمیرات و راه‌اندازی فارم راهنمایی اولیه بدهم.`;
}

export function getSupportQuickReplies() {
  return quickReplies;
}

export function createSupportMessage(role: SupportMessage["role"], text: string): SupportMessage {
  return { role, text, at: new Date().toISOString() };
}

export function parseSupportMessages(value: string | null | undefined): SupportMessage[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as SupportMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => (item.role === "user" || item.role === "assistant") && typeof item.text === "string")
      .map((item) => ({ role: item.role, text: item.text, at: item.at || new Date().toISOString() }));
  } catch {
    return [];
  }
}

export function generateSupportAnswer(question: string) {
  const text = question.toLowerCase().replace(/[ي]/g, "ی").replace(/[ك]/g, "ک");

  if (hasAny(text, ["قیمت", "چند", "هزینه", "استعلام", "مبلغ"])) {
    return "برای قیمت دقیق، مدل دستگاه یا قطعه و وضعیت موجودی باید بررسی شود. اگر درباره ماینر یا قطعه می‌پرسید، مدل دقیق را بنویسید. اگر تعمیر است، هزینه بعد از بررسی ایراد اعلام می‌شود.";
  }

  if (hasAny(text, ["خرید", "ماینر", "دستگاه", "asic", "انتخاب مدل"])) {
    return "برای خرید ماینر بهتر است فقط به قیمت نگاه نکنید. مصرف برق، وضعیت فنی، هش‌ریت واقعی، شرایط تهویه و قطعات قابل تامین مهم‌اند. مدل مدنظر، بودجه تقریبی و وضعیت برق محل را بنویسید تا مشاوره دقیق‌تر شود.";
  }

  if (hasAny(text, ["قطعه", "پاور", "فن", "کنترل", "هشبرد", "کابل", "سوکت"])) {
    return "برای قطعات، سازگاری با مدل دستگاه مهم است. نام قطعه، مدل ماینر و اگر امکان دارد عکس قطعه یا لیبل دستگاه را آماده کنید. برای استعلام نهایی معمولاً هماهنگی واتساپ یا تماس سریع‌تر است.";
  }

  if (hasAny(text, ["تعمیر", "خراب", "روشن", "هش", "ارور", "خطا", "داغ", "صدا"])) {
    return "برای تعمیر، لطفاً مدل دستگاه، نوع خطا، وضعیت هش‌ریت و اگر دارید عکس یا ویدیو از صفحه وضعیت دستگاه را ثبت کنید. مسیر درست این است: ثبت درخواست تعمیر، بررسی اولیه، اعلام مسیر بررسی و هماهنگی برای ارسال یا تحویل.";
  }

  if (hasAny(text, ["فارم", "راه اندازی", "راه‌اندازی", "برق", "تهویه", "سالن", "استخراج"])) {
    return "برای راه‌اندازی فارم، قبل از خرید تعداد بالا باید ظرفیت برق، تهویه، نویز، شبکه، چیدمان و نگهداری بررسی شود. برای شروع، ظرفیت تقریبی برق و شهر یا شرایط محل را بنویسید.";
  }

  if (hasAny(text, ["ارسال", "شهرستان", "تحویل", "پست", "باربری"])) {
    return "امکان هماهنگی برای ارسال دستگاه وجود دارد. بهتر است دستگاه با بسته‌بندی محکم، محافظ فن و بدون فشار روی سوکت‌ها ارسال شود. قبل از ارسال، مدل دستگاه و مشکل را ثبت کنید تا هماهنگی انجام شود.";
  }

  if (hasAny(text, ["سلام", "درود", "وقت بخیر"])) {
    return "سلام، خوش آمدید. درباره خرید ماینر، قطعات، تعمیرات یا راه‌اندازی فارم سوال دارید؟ اگر مدل دستگاه یا قطعه را بنویسید، بهتر راهنمایی می‌کنم.";
  }

  return "سوال شما ثبت شد. برای پاسخ دقیق‌تر لطفاً مشخص کنید موضوع درباره خرید ماینر، قطعه، تعمیر دستگاه یا راه‌اندازی فارم است. اگر مدل دستگاه یا قطعه را هم بنویسید راهنمایی بهتر می‌شود.";
}

function hasAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}
