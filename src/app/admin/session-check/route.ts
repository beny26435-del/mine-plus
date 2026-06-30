import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminSessionCookieName, verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const token = store.get(adminSessionCookieName)?.value;
  const session = verifySessionToken(token);

  return NextResponse.json({
    hasCookie: Boolean(token),
    valid: Boolean(session),
    expiresAt: session ? new Date(session.expiresAt).toISOString() : null,
    authSecretConfigured: Boolean(process.env.AUTH_SECRET),
    nodeEnv: process.env.NODE_ENV
  });
}
