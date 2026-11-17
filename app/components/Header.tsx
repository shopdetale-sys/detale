import Image from "next/image";

export default function Header() {
  return (
    <div className="fixed top-4 left-4 z-20">
      <Image src="/logo.png" alt="Detale Logo" width={80} height={80} className="object-contain" />
    </div>
  );
}

