import * as jose from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const JWT_SECRET =
  process.env.USER_JWT_SECRET || "change-me-admin-session-secret";

type AdminSessionPayload = {
  sub: string;
  email: string;
  isAdmin: true;
};

async function signToken(payload: AdminSessionPayload) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

async function verifyToken(token: string): Promise<AdminSessionPayload | null> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    const typed = payload as AdminSessionPayload;
    if (!typed.isAdmin) return null;
    return typed;
  } catch {
    return null;
  }
}

export async function setAdminSession(payload: AdminSessionPayload) {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHENTICATED_ADMIN");
  }
  return session;
}

