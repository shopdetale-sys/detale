import StaticFeatureNotice from "@/app/components/StaticFeatureNotice";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  void children;
  return (
    <StaticFeatureNotice
      title="Admin tools are unavailable"
      description="Product editing and order management require a secure server backend and are disabled on this static catalog."
    />
  );
}
