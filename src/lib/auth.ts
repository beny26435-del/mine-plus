import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const adminSessionCookieName = "mine_plus_admin_session";
const maxAge = 60 * 60 * 8;

function getSecret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET باید در production تنظیم شود.");
  return "mine-plus-development-secret-change-me";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function verifySessionToken(token?: string) {
  if (!token) return null;
  const [userId, expires, signature] = token.split(".");
  if (!userId || !expires || !signature) return null;
  const payload = `${userId}.${expires}`;
  const expected = sign(payload);
  const valid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid || Number(expires) < Date.now()) return null;
  return { userId, expiresAt: Number(expires) };
}

export function createSessionToken(userId: string) {
  const expires = Date.now() + maxAge * 1000;
  const payload = `${userId}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/"
  };
}

export async function createSession(userId: string) {
  const token = createSessionToken(userId);
  const store = await cookies();
  store.set(adminSessionCookieName, token, adminSessionCookieOptions());
}

export async function destroySession() {
  const store = await cookies();
  store.delete(adminSessionCookieName);
}

export async function getAdminUser() {
  const store = await cookies();
  const token = store.get(adminSessionCookieName)?.value;
  const session = verifySessionToken(token);
  if (!session) return null;
  return { id: session.userId };
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function verifyAdminCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}
