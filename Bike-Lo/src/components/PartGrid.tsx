import { useState, useMemo } from "react";
import PartCard from "./PartCard";
import type { SparePartResponse } from "@/types/api";

interface PartGridProps {
  parts: SparePartResponse[];
  onPartClick?: (partId: number) => void;
}

type SortOption = "newest" | "price-asc" | "price-desc";

export default function PartGrid({ parts, onPartClick }: PartGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const sortedParts = useMemo(() => {
    const copy = [...parts];
    if (sortBy === "price-asc") return copy.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return copy.sort((a, b) => b.price - a.price);
    return copy.sort((a, b) => b.id - a.id); // newest first by ID
  }, [parts, sortBy]);

  return (
    <div className="space-y-12">
      {/* Shop Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-0.5 w-8 bg-[#f7931e] rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Hardware Archive</span>
          </div>
          <h1
            className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase text-white leading-none"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Genuine Parts
          </h1>
          <p className="text-neutral-500 text-[10px] tracking-[0.2em] uppercase font-black">
            {parts.length > 0
              ? `Curating ${sortedParts.length} verified hardware components`
              : "Inventory Depleted. Check back later."}
          </p>
        </div>
        
        {parts.length > 0 && (
          <div className="flex items-center gap-4 bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl px-5 py-3 shadow-xl">
            <span className="text-[9px] uppercase font-black tracking-[0.25em] text-neutral-500 whitespace-nowrap">Sort Logic</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent border-0 text-xs font-black text-[#f7931e] uppercase tracking-widest focus:ring-0 cursor-pointer outline-none min-w-[140px]"
            >
              <option value="newest" className="bg-neutral-950">Recent Arrivals</option>
              <option value="price-desc" className="bg-neutral-950">Valuation: High</option>
              <option value="price-asc" className="bg-neutral-950">Valuation: Base</option>
            </select>
          </div>
        )}
      </div>

      {/* Grid or Empty State */}
      {sortedParts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-neutral-900/20 rounded-[3rem] border border-dashed border-neutral-800">
          <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center mb-6 shadow-2xl border border-white/5">
            <svg className="w-10 h-10 text-[#f7931e] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-black italic text-white mb-2 uppercase" style={{ fontFamily: "'Noto Serif', serif" }}>
            Zero Components Found
          </h3>
          <p className="text-sm text-neutral-500 max-w-xs font-medium">No verified components match your current criteria. Broaden your search parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
          {sortedParts.map((part) => (
            <PartCard
              key={part.id}
              part={part}
              onClick={() => onPartClick && onPartClick(part.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
