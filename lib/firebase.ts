import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) &&
  firebaseConfig.apiKey !== "your_api_key" &&
  Boolean(firebaseConfig.projectId) &&
  firebaseConfig.projectId !== "your_project_id";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (typeof window !== "undefined" || isFirebaseConfigured) {
  try {
    app = getApps().length
      ? getApps()[0]
      : initializeApp(
          isFirebaseConfigured
            ? firebaseConfig
            : {
                apiKey: "AIzaSyFakeKeyForDevelopmentPreviewOnly1234",
                projectId: "detale-preview",
                appId: "1:1234567890:web:abcdef123456",
              }
        );
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (err) {
    console.warn("Firebase client initialization warning:", err);
  }
}

export { app, auth, db, storage };
export default app;
