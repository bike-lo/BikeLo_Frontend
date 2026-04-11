import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { brands, yearOptions } from "@/data/mockBikes";

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availableBrands?: string[];
  maxPriceLimit?: number;
}

export default function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandsChange,
  selectedYear,
  onYearChange,
  searchQuery,
  onSearchChange,
  availableBrands = [],
  maxPriceLimit = 3,
}: FilterSidebarProps) {
  const [minPrice, setMinPrice] = useState(priceRange[0].toString());
  const [maxPrice, setMaxPrice] = useState(priceRange[1].toString());

  // Use dynamic brands if provided, otherwise fallback to mock data
  const displayedBrands = availableBrands.length > 0 ? availableBrands : brands;

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = parseFloat(value) || 0;
    if (type === "min") {
      setMinPrice(value);
      onPriceRangeChange([numValue, priceRange[1]]);
    } else {
      setMaxPrice(value);
      onPriceRangeChange([priceRange[0], numValue]);
    }
  };

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  const handleReset = () => {
    onSearchChange("");
    onPriceRangeChange([0, maxPriceLimit]);
    setMinPrice("0");
    setMaxPrice(maxPriceLimit.toString());
    onBrandsChange([]);
    onYearChange(null);
  };

  const FilterContent = (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#f7931e]">Direct Search</p>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-[#f7931e] transition-colors" />
          <Input
            id="search"
            type="text"
            placeholder="Search brand or model..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-neutral-900/60 border-neutral-800 focus:border-[#f7931e]/50 focus:ring-[#f7931e]/20 text-white placeholder:text-neutral-500 rounded-xl h-11 transition-all"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#f7931e]">Price Range (₹Lakhs)</p>
          <span className="text-[10px] font-mono text-neutral-500 font-bold">
            ₹{priceRange[0].toFixed(1)}L – ₹{priceRange[1].toFixed(1)}L
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1.5">
            <span className="text-[9px] text-neutral-500 uppercase font-black px-1 tracking-widest">Min</span>
            <Input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="bg-neutral-900/60 border-neutral-800 text-white h-11 text-sm rounded-xl focus:border-[#f7931e]/50 transition-all font-bold"
              min={0}
              step={0.1}
            />
          </div>
          <span className="text-neutral-600 text-lg mt-7 font-black italic">–</span>
          <div className="flex-1 space-y-1.5">
            <span className="text-[9px] text-neutral-500 uppercase font-black px-1 tracking-widest">Max</span>
            <Input
              type="number"
              placeholder={maxPriceLimit.toString()}
              value={maxPrice}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="bg-neutral-900/60 border-neutral-800 text-white h-11 text-sm rounded-xl focus:border-[#f7931e]/50 transition-all font-bold"
              min={0}
              step={0.1}
            />
          </div>
        </div>
      </div>

      {/* Brand */}
      <div className="space-y-4">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#f7931e]">Manufacturers</p>
        <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar scrollbar-premium">
          {displayedBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandToggle(brand)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all duration-300 ${
                selectedBrands.includes(brand)
                  ? "bg-[#f7931e] border-[#f7931e] text-white shadow-[0_4px_12px_rgba(247,147,30,0.3)]"
                  : "bg-neutral-800/40 border-neutral-800 text-neutral-400 hover:border-[#f7931e]/50 hover:text-[#f7931e] hover:bg-neutral-800/60"
              }`}
            >
              {brand}
            </button>
          ))}
          {displayedBrands.length === 0 && (
            <p className="text-xs text-neutral-500 italic">No manufacturers found</p>
          )}
        </div>
      </div>

      {/* Year */}
      <div className="space-y-4">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#f7931e]">Model Year</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onYearChange(null)}
            className={`py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all duration-300 ${
              selectedYear === null
                ? "bg-[#f7931e] border-[#f7931e] text-white shadow-[0_4px_12px_rgba(247,147,30,0.3)]"
                : "bg-neutral-800/40 border-neutral-800 text-neutral-500 hover:border-[#f7931e]/50 hover:bg-neutral-800/60"
            }`}
          >
            All Era
          </button>
          {yearOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onYearChange(opt.value)}
              className={`py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all duration-300 ${
                selectedYear === opt.value
                  ? "bg-[#f7931e] border-[#f7931e] text-white shadow-[0_4px_12px_rgba(247,147,30,0.3)]"
                  : "bg-neutral-800/40 border-neutral-800 text-neutral-500 hover:border-[#f7931e]/50 hover:bg-neutral-800/60"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="w-full py-4 bg-transparent border-2 border-neutral-800 hover:border-[#f7931e]/40 text-neutral-400 hover:text-[#f7931e] text-[11px] font-black uppercase tracking-[0.3em] rounded-xl active:scale-[0.98] transition-all group"
        style={{ fontFamily: "'Noto Serif', serif" }}
      >
        <span className="group-hover:tracking-[0.35em] transition-all">Reset All Filters</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 xl:w-80 flex-shrink-0 h-[calc(100vh-6rem)] sticky top-24 overflow-y-auto p-8 gap-2 bg-neutral-900/50 backdrop-blur-xl border border-white/5 dark:border-neutral-800/60 rounded-[2rem] shadow-2xl">
        <div className="mb-6">
          <h2
            className="text-2xl font-black italic tracking-tight text-white uppercase leading-none"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Refine Search
          </h2>
          <div className="h-1 w-12 bg-[#f7931e] mt-3 rounded-full" />
        </div>
        <div className="pt-2">
          {FilterContent}
        </div>
      </aside>

      {/* Mobile Sheet */}
      <div className="block lg:hidden w-full mb-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 h-14 text-sm font-black uppercase tracking-[0.2em] border-neutral-800 bg-neutral-900/70 backdrop-blur-md rounded-2xl shadow-xl hover:bg-neutral-900 transition-all group"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              <SlidersHorizontal className="h-5 w-5 text-[#f7931e] group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-white">Precision Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[400px] overflow-y-auto bg-neutral-950 border-r border-neutral-800 p-0">
            <div className="p-8">
              <SheetHeader className="text-left mb-8">
                <SheetTitle
                  className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  Filters
                </SheetTitle>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500 mt-2">Refine Your Architecture</p>
                <div className="h-1 w-16 bg-[#f7931e] mt-4 rounded-full" />
              </SheetHeader>
              <div className="mt-4">{FilterContent}</div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
