"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function HelpSearchBox() {
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="max-w-lg mx-auto relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#857467]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help articles..."
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-transparent rounded-2xl text-sm focus:outline-none focus:border-[#f4a460] shadow-artisan"
        />
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[#857467]">
        Popular:
        {["Track my order", "Return policy", "Artisan certification"].map((tag) => (
          <button key={tag} className="text-[#f4a460] hover:underline">
            {tag}
          </button>
        ))}
      </div>
    </>
  );
}
