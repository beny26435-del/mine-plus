import { NextResponse } from "next/server";
import { adminSessionCookieName, adminSessionCookieOptions, createSessionToken, verifyAdminCredentials } from "@/lib/auth";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const user = await verifyAdminCredentials(text(formData, "email"), text(formData, "password"));
  const target = new URL(user ? "/admin" : "/admin/login?error=1", request.url);
  const response = NextResponse.redirect(target, { status: 303 });

  if (user) {
    response.cookies.set(adminSessionCookieName, createSessionToken(user.id), adminSessionCookieOptions());
  }

  return response;
}
