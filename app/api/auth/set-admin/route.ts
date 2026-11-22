import { NextRequest, NextResponse } from "next/server";
import { isFirebaseAdminConfigured, adminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const { uid, secret } = await req.json();
  if (secret !== (process.env.ADMIN_SECRET || "detale_admin_secret_2026")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (isFirebaseAdminConfigured && adminAuth) {
    await adminAuth.setCustomUserClaims(uid, { role: "admin" });
  }
  return NextResponse.json({ success: true });
}
