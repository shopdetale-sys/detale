import type { Metadata } from "next";
import StaticFeatureNotice from "@/app/components/StaticFeatureNotice";

export const metadata: Metadata = {
  title: "Checkout unavailable",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <StaticFeatureNotice
      title="Online checkout is unavailable"
      description="This static catalog supports browsing and saving items to your cart, but it cannot process orders or payments. Please contact support@detale.in for ordering assistance."
    />
  );
}
