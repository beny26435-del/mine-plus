import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidIranMobile, normalizeIranPhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { createSupportMessage, supportWelcomeMessage } from "@/lib/support-ai";

export const dynamic = "force-dynamic";

const schema = z.object({
  fullName: z.string().min(2, "نام و نام خانوادگی را وارد کنید."),
  phone: z.string().refine(isValidIranMobile, "شماره موبایل معتبر نیست.")
});

export async function POST(request: Request) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 }, select: { enableAiSupport: true } });
  if (settings?.enableAiSupport === false) {
    return NextResponse.json({ success: false, message: "ساپورت هوشمند فعلاً غیرفعال است." }, { status: 403 });
  }

  const payload = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.errors) fieldErrors[String(issue.path[0])] ||= issue.message;
    return NextResponse.json({ success: false, message: "اطلاعات را بررسی کنید.", fieldErrors }, { status: 400 });
  }

  const welcome = supportWelcomeMessage(parsed.data.fullName.trim());
  const lead = await prisma.supportLead.create({
    data: {
      fullName: parsed.data.fullName.trim(),
      phone: normalizeIranPhone(parsed.data.phone),
      messages: JSON.stringify([createSupportMessage("assistant", welcome)])
    }
  });

  return NextResponse.json({ success: true, leadId: lead.id, message: welcome });
}
