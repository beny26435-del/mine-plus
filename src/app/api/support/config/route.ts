import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupportQuickReplies } from "@/lib/support-ai";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 }, select: { enableAiSupport: true } });
  return NextResponse.json({ enabled: settings?.enableAiSupport ?? true, quickReplies: getSupportQuickReplies() });
}
