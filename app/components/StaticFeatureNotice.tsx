import Link from "next/link";

export default function StaticFeatureNotice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="min-h-[65vh] bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="max-w-lg rounded-3xl border border-neutral-800 bg-[#141414] p-8 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#9D6EFF]">
          Detale online catalog
        </p>
        <h1 className="mb-3 text-2xl font-extrabold">{title}</h1>
        <p className="mb-7 text-sm leading-relaxed text-neutral-400">
          {description}
        </p>
        <Link
          href="/products"
          className="inline-flex rounded-lg bg-[#4D2C9C] px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-[#6D3EE6]"
        >
          Browse products
        </Link>
      </div>
    </section>
  );
}
