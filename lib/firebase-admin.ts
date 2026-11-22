import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

export const isFirebaseAdminConfigured =
  Boolean(process.env.FIREBASE_PROJECT_ID) &&
  process.env.FIREBASE_PROJECT_ID !== "your_project_id" &&
  Boolean(process.env.FIREBASE_CLIENT_EMAIL) &&
  process.env.FIREBASE_CLIENT_EMAIL !== "your_service_account_email" &&
  Boolean(process.env.FIREBASE_PRIVATE_KEY) &&
  !process.env.FIREBASE_PRIVATE_KEY?.includes("your_private_key");

let adminApp: App | undefined;
let adminDb: Firestore | undefined;
let adminAuth: Auth | undefined;

if (isFirebaseAdminConfigured && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    adminApp = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          }),
        });
    adminDb = getFirestore(adminApp);
    adminAuth = getAuth(adminApp);
  } catch (e) {
    console.warn("Firebase Admin SDK init warning:", e);
  }
}

export { adminApp, adminDb, adminAuth };
