import type { Metadata } from "next";
import StaticFeatureNotice from "@/app/components/StaticFeatureNotice";

export const metadata: Metadata = {
  title: "Sign in unavailable",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <StaticFeatureNotice
      title="Sign in is unavailable"
      description="This static catalog does not have a login service. You can browse products and manage a cart in this browser without signing in."
    />
  );
}
