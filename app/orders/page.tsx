import StaticFeatureNotice from "@/app/components/StaticFeatureNotice";

export default function OrdersPage() {
  return (
    <StaticFeatureNotice
      title="Order tracking is unavailable"
      description="Order records and tracking require a live backend. For help with an existing order, contact support@detale.in."
    />
  );
}
