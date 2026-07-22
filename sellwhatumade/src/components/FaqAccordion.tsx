"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface Faq {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3 mb-12">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-artisan overflow-hidden">
          <button
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="text-sm font-semibold text-[#1b1c1a]">{faq.q}</span>
            {openFaq === i ? (
              <ChevronUp size={16} className="text-[#8d4f11] shrink-0" />
            ) : (
              <ChevronDown size={16} className="text-[#857467] shrink-0" />
            )}
          </button>
          {openFaq === i && (
            <div className="px-5 pb-4">
              <p className="text-sm text-[#534439] leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
