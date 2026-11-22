import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (session && session.value === "authenticated_detale_admin") {
    return NextResponse.json({
      authenticated: true,
      username: process.env.ADMIN_USERNAME || "admin",
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
