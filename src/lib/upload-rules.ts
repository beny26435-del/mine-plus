const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const videoTypes = ["video/mp4", "video/quicktime", "video/webm"];
const imageMax = 5 * 1024 * 1024;
const videoMax = 50 * 1024 * 1024;

export function validateLeadFiles(files: File[]) {
  if (files.length > 3) return "حداکثر ۳ فایل می‌توانید ارسال کنید.";
  for (const file of files) {
    if (imageTypes.includes(file.type) && file.size <= imageMax) continue;
    if (videoTypes.includes(file.type) && file.size <= videoMax) continue;
    if (![...imageTypes, ...videoTypes].includes(file.type)) return "فرمت فایل مجاز نیست. jpg، png، webp، mp4، mov و webm قابل قبول است.";
    return file.type.startsWith("image/") ? "حجم هر عکس باید حداکثر ۵ مگابایت باشد." : "حجم هر ویدیو باید حداکثر ۵۰ مگابایت باشد.";
  }
  return "";
}

export function validateProductImage(files: File[]) {
  if (files.length !== 1) return "برای محصول فقط یک تصویر انتخاب کنید.";
  const file = files[0];
  if (!imageTypes.includes(file.type)) return "فرمت تصویر محصول باید jpg، png یا webp باشد.";
  if (file.size > imageMax) return "حجم تصویر محصول باید حداکثر ۵ مگابایت باشد.";
  return "";
}
