import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSupportMessage, generateSupportAnswer, parseSupportMessages } from "@/lib/support-ai";

export const dynamic = "force-dynamic";

const schema = z.object({
  leadId: z.string().min(1),
  message: z.string().min(1, "پیام را بنویسید.").max(700, "پیام خیلی طولانی است.")
});

export async function POST(request: Request) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 }, select: { enableAiSupport: true } });
  if (settings?.enableAiSupport === false) {
    return NextResponse.json({ success: false, message: "ساپورت هوشمند فعلاً غیرفعال است." }, { status: 403 });
  }

  const payload = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.errors[0]?.message || "پیام معتبر نیست." }, { status: 400 });
  }

  const lead = await prisma.supportLead.findUnique({ where: { id: parsed.data.leadId } });
  if (!lead) return NextResponse.json({ success: false, message: "گفت‌وگو پیدا نشد." }, { status: 404 });

  const userMessage = parsed.data.message.trim();
  const reply = generateSupportAnswer(userMessage);
  const messages = [
    ...parseSupportMessages(lead.messages),
    createSupportMessage("user", userMessage),
    createSupportMessage("assistant", reply)
  ].slice(-60);

  await prisma.supportLead.update({
    where: { id: lead.id },
    data: { messages: JSON.stringify(messages) }
  });

  return NextResponse.json({ success: true, message: reply });
}
