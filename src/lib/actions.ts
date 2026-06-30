"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isValidIranMobile, normalizeIranPhone } from "@/lib/phone";

const repairSchema = z.object({
  name: z.string().min(2, "نام را وارد کنید."),
  phone: z.string().refine(isValidIranMobile, "شماره موبایل معتبر نیست."),
  city: z.string().min(2, "شهر را وارد کنید."),
  deviceModel: z.string().min(2, "مدل دستگاه را وارد کنید."),
  issueType: z.string().min(2, "نوع مشکل را وارد کنید."),
  description: z.string().min(10, "توضیح مشکل کوتاه است.")
});

const farmSchema = z.object({
  name: z.string().min(2, "نام را وارد کنید."),
  phone: z.string().refine(isValidIranMobile, "شماره موبایل معتبر نیست."),
  city: z.string().min(2, "شهر را وارد کنید."),
  capacity: z.string().min(1, "ظرفیت تقریبی را وارد کنید."),
  powerStatus: z.string().min(2, "وضعیت برق را بنویسید."),
  location: z.string().min(2, "وضعیت محل نصب را وارد کنید."),
  description: z.string().min(10, "توضیح پروژه کوتاه است.")
});

export type FormState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function values(formData: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((key) => [key, text(formData, key)]));
}

function fieldErrors(error: z.ZodError) {
  const result: Record<string, string> = {};
  for (const issue of error.errors) {
    const key = String(issue.path[0] || "form");
    result[key] ||= issue.message;
  }
  return result;
}

function parseUploadedFiles(formData: FormData) {
  const value = text(formData, "uploadedFiles");
  if (!value) return [];
  let parsed: Array<{ url: string; type: string; filename: string; size: number }> = [];
  try {
    parsed = JSON.parse(value);
  } catch {
    return [];
  }
  return parsed
    .filter((file) => file.url && file.filename && typeof file.size === "number")
    .slice(0, 3)
    .map((file) => ({ url: file.url, type: file.type === "video" ? "video" : "image", filename: file.filename, size: file.size }));
}

export async function submitRepairRequest(_: FormState, formData: FormData): Promise<FormState> {
  const keys = ["name", "phone", "city", "deviceModel", "issueType", "description"];
  const raw = values(formData, keys);
  const parsed = repairSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "اطلاعات فرم را بررسی کنید.", fieldErrors: fieldErrors(parsed.error), values: raw };
  }

  try {
    const attachments = parseUploadedFiles(formData);
    await prisma.repairRequest.create({
      data: {
        ...parsed.data,
        phone: normalizeIranPhone(parsed.data.phone),
        attachments: attachments.length ? { create: attachments } : undefined
      }
    });
  } catch {
    return { ok: false, message: "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.", values: raw };
  }
  return { ok: true, message: "درخواست تعمیر ثبت شد. برای هماهنگی سریع‌تر می‌توانید در واتساپ هم پیام بدهید." };
}

export async function submitFarmSetupRequest(_: FormState, formData: FormData): Promise<FormState> {
  const keys = ["name", "phone", "city", "capacity", "powerStatus", "location", "description"];
  const raw = values(formData, keys);
  const parsed = farmSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "اطلاعات فرم را بررسی کنید.", fieldErrors: fieldErrors(parsed.error), values: raw };
  }

  try {
    await prisma.farmSetupRequest.create({ data: { ...parsed.data, phone: normalizeIranPhone(parsed.data.phone) } });
  } catch {
    return { ok: false, message: "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.", values: raw };
  }
  return { ok: true, message: "درخواست راه‌اندازی فارم ثبت شد. تیم Mine Plus برای بررسی اولیه با شما هماهنگ می‌کند." };
}
