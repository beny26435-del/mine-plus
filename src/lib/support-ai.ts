export type SupportMessage = {
  role: "user" | "assistant";
  text: string;
  at: string;
};

const quickReplies = [
  "برای خرید ماینر چه اطلاعاتی بدهم؟",
  "درخواست تعمیر چطور ثبت می‌شود؟",
  "برای قطعه چه چیزی لازم است؟",
  "درباره راه‌اندازی فارم مشاوره می‌خواهم"
];

export function supportWelcomeMessage(name: string) {
  return `${name} عزیز، خوش آمدی. سوالت را همینجا بنویس؛ اگر مدل دستگاه یا قطعه را هم داری، کار سریع‌تر پیش می‌رود.`;
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
    return "برای قیمت دقیق، مدل دستگاه یا قطعه را بنویسید. قیمت ماینر و قطعات با موجودی روز تغییر می‌کند. اگر موضوع تعمیر است، هزینه بعد از بررسی ایراد اعلام می‌شود.";
  }

  if (hasAny(text, ["خرید", "ماینر", "دستگاه", "asic", "انتخاب مدل"])) {
    return "برای خرید ماینر، مدل مدنظر، بودجه تقریبی و وضعیت برق محل را بفرستید. فقط قیمت مهم نیست؛ مصرف برق، سلامت دستگاه، تهویه و قطعات قابل تأمین هم باید دیده شود.";
  }

  if (hasAny(text, ["قطعه", "پاور", "فن", "کنترل", "هشبرد", "کابل", "سوکت"])) {
    return "برای قطعه، مدل ماینر و نام قطعه را بنویسید. اگر عکس لیبل دستگاه یا قطعه را دارید، در واتساپ بفرستید تا قطعه اشتباه انتخاب نشود.";
  }

  if (hasAny(text, ["تعمیر", "خراب", "روشن", "هش", "ارور", "خطا", "داغ", "صدا"])) {
    return "برای تعمیر، مدل دستگاه، نوع خطا و وضعیت هش‌ریت را بفرستید. اگر عکس یا ویدیو از صفحه status دارید، در فرم تعمیر آپلود کنید تا بهتر بفهمیم مشکل از کجا شروع شده است.";
  }

  if (hasAny(text, ["فارم", "راه اندازی", "راه‌اندازی", "برق", "تهویه", "سالن", "استخراج"])) {
    return "برای فارم، قبل از خرید تعداد بالا باید برق، تهویه، صدا، شبکه و چیدمان مشخص شود. برای شروع، شهر و ظرفیت تقریبی برق یا تعداد دستگاه مدنظرتان را بنویسید.";
  }

  if (hasAny(text, ["ارسال", "شهرستان", "تحویل", "پست", "باربری"])) {
    return "برای ارسال دستگاه می‌شود هماهنگ کرد. قبل از ارسال، مدل دستگاه و مشکل را ثبت کنید. بسته‌بندی باید محکم باشد و روی فن، سوکت‌ها و بدنه فشار نیاید.";
  }

  if (hasAny(text, ["سلام", "درود", "وقت بخیر"])) {
    return "سلام، خوش آمدی. درباره خرید ماینر، قطعه، تعمیرات یا فارم سوال داری؟ اگر مدل دستگاه یا قطعه را بنویسی، بهتر راهنمایی می‌کنم.";
  }

  return "پیامت ثبت شد. برای اینکه بهتر راهنمایی کنم، بنویس موضوع درباره خرید ماینر، قطعه، تعمیر دستگاه یا راه‌اندازی فارم است. مدل دستگاه هم اگر داری اضافه کن.";
}

function hasAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}
