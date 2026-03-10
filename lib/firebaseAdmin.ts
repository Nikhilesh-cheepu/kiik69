import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const privateKey =
  rawPrivateKey && rawPrivateKey.length > 0
    ? rawPrivateKey
        // handle \n in env files
        .replace(/\\n/g, "\n")
        // strip accidental wrapping quotes
        .replace(/^"|"$/g, "")
    : undefined;

let app;

if (getApps().length === 0) {
  if (!privateKey) {
    throw new Error("FIREBASE_ADMIN_PRIVATE_KEY not set");
  }

  app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey,
    }),
  });
} else {
  app = getApps()[0];
}

export const firebaseAdminAuth = getAuth(app);

