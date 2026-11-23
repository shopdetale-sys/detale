import StaticFeatureNotice from "@/app/components/StaticFeatureNotice";

export default function PaymentCallbackPage() {
  return (
    <StaticFeatureNotice
      title="Online payments are unavailable"
      description="Payment confirmation requires a secure backend and is not enabled on this static catalog."
    />
  );
}
