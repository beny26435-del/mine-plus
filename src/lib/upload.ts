import { validateLeadFiles, validateProductImage } from "@/lib/upload-rules";

export type UploadedFile = {
  url: string;
  type: "image" | "video";
  filename: string;
  size: number;
};

function normalizeFileUrl(url: string) {
  const publicBaseUrl = process.env.UPLOAD_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (url.startsWith("/") && publicBaseUrl) return `${publicBaseUrl}${url}`;
  return url;
}

function normalizeUploadedFiles(value: unknown): UploadedFile[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((file) => {
      if (!file || typeof file !== "object") return null;
      const item = file as Record<string, unknown>;
      if (typeof item.url !== "string" || typeof item.filename !== "string" || typeof item.size !== "number") return null;
      return {
        url: normalizeFileUrl(item.url),
        type: item.type === "video" ? "video" : "image",
        filename: item.filename,
        size: item.size
      };
    })
    .filter(Boolean) as UploadedFile[];
}

async function uploadFiles(files: File[]) {
  const uploadApiUrl = process.env.UPLOAD_API_URL;
  const uploadApiKey = process.env.UPLOAD_API_KEY;
  if (!uploadApiUrl || !uploadApiKey) {
    throw new Error("آپلود فایل فعلاً فعال نیست. می‌توانید فایل را در واتساپ ارسال کنید.");
  }

  const body = new FormData();
  files.forEach((file) => body.append("files", file, file.name));

  let response: Response;
  try {
    response = await fetch(uploadApiUrl, { method: "POST", headers: { "x-api-key": uploadApiKey }, body });
  } catch {
    throw new Error("ارتباط با سرور آپلود برقرار نشد. لطفاً دوباره تلاش کنید.");
  }

  const payload = (await response.json().catch(() => null)) as { success?: boolean; message?: string; files?: unknown } | null;
  if (!response.ok || !payload?.success) throw new Error(payload?.message || "آپلود فایل انجام نشد.");

  const uploadedFiles = normalizeUploadedFiles(payload.files);
  if (!uploadedFiles.length) throw new Error("لینک معتبر از سرور آپلود دریافت نشد.");
  return uploadedFiles;
}

export async function uploadLeadFiles(files: File[]) {
  const error = validateLeadFiles(files);
  if (error) throw new Error(error);
  return uploadFiles(files);
}

export async function uploadProductImage(files: File[]) {
  const error = validateProductImage(files);
  if (error) throw new Error(error);
  return uploadFiles(files);
}
