import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { mobile } = await req.json();

    if (!mobile) {
      return NextResponse.json(
        { success: false, message: "Mobile number is required" },
        { status: 400 }
      );
    }

    // Dynamically require CJS SDK to avoid ESM/CJS interop issues at build time
    const { SendOtpService } = require("msg91-sdk") as {
      SendOtpService: new (authKey: string, templateId: string) => any;
    };

    const otpService = new SendOtpService(
      process.env.MSG91_AUTH_KEY!,
      process.env.MSG91_TEMPLATE_ID!
    );

    // mobile should include country code, e.g. "919876543210"
    const response = await otpService.sendOTP(mobile);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("MSG91 send OTP error:", error);
    return NextResponse.json(
      { success: false, message: error?.message ?? "Failed to send OTP" },
      { status: 500 }
    );
  }
}
