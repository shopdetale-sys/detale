"use client";

import { MessageCircle } from "lucide-react";

export default function ProductExpertWidget() {
  const handleClick = () => {
    // Open WhatsApp or contact support
    window.open("https://wa.me/919876543210?text=Hi%20Detale,%20I%20have%20a%20question%20about%20car%20care%20products", "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={handleClick}
        className="group bg-white hover:bg-neutral-100 text-black px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2.5 border border-neutral-300 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {/* Avatar with status indicator */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 border border-neutral-300 flex items-center justify-center">
            <span className="text-sm select-none">👩‍💼</span>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>

        {/* Text and WhatsApp icon */}
        <div className="flex items-center gap-1.5">
          <MessageCircle size={15} className="text-green-600 fill-green-500" />
          <span className="text-xs font-bold text-neutral-900 tracking-tight">
            Ask a product expert
          </span>
        </div>
      </button>
    </div>
  );
}
