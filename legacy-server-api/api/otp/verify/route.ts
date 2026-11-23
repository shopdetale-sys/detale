import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { mobile, otp } = await req.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, message: "Mobile and OTP are required" },
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

    const response = await otpService.verifyOTP(mobile, otp);

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("MSG91 verify OTP error:", error);
    return NextResponse.json(
      { success: false, message: error?.message ?? "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
