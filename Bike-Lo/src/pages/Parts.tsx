import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PartGrid from "@/components/PartGrid";
import BenefitsSection from "@/components/BenefitsSection";
import { getSpareParts } from "@/services/sparePartService";
import type { SparePartResponse } from "@/types/api";

export default function Parts() {
  const [parts, setParts] = useState<SparePartResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("All Brands");
  const [selectedCondition, setSelectedCondition] = useState<string>("All Conditions");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getSpareParts()
      .then((data) => {
        if (!mounted) return;
        setParts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load spare parts", err);
        if (!mounted) return;
        setLoading(false);
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Unauthorized") || msg.includes("Invalid") || msg.includes("expired")) {
          navigate("/login", { replace: true });
        }
      });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const brands = useMemo(() => {
    const b = new Set(parts.map(p => p.brand));
    return ["All Brands", ...Array.from(b).sort()];
  }, [parts]);

  const conditions = ["All Conditions", "New", "Refurbished", "Used"];

  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      const matchesSearch = !searchQuery || 
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.compatible_models.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBrand = selectedBrand === "All Brands" || part.brand === selectedBrand;
      const matchesCondition = selectedCondition === "All Conditions" || part.condition === selectedCondition;

      return matchesSearch && matchesBrand && matchesCondition;
    });
  }, [parts, searchQuery, selectedBrand, selectedCondition]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f7931e]/20 border-t-[#f7931e] rounded-full animate-spin" />
          <p className="text-[#f7931e] font-black uppercase tracking-widest text-xs">Accessing Inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-transparent text-white">
      <div className="container mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        {/* Superior Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-[#f7931e] transition-colors" />
            <Input 
              placeholder="Search components, compatibility, or hardware ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-16 pl-14 pr-6 bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl text-lg group-focus-within:border-[#f7931e]/40 transition-all duration-500 ring-1 ring-white/5"
            />
          </div>

          <div className="flex gap-4 w-full lg:w-auto">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-16 px-6 bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-white focus:border-[#f7931e]/40 outline-none cursor-pointer flex-1 lg:min-w-[200px]"
            >
              {brands.map(b => <option key={b} value={b} className="bg-neutral-950">{b}</option>)}
            </select>

            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="h-16 px-6 bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-white focus:border-[#f7931e]/40 outline-none cursor-pointer flex-1 lg:min-w-[200px]"
            >
              {conditions.map(c => <option key={c} value={c} className="bg-neutral-950">{c}</option>)}
            </select>

            {(searchQuery || selectedBrand !== "All Brands" || selectedCondition !== "All Conditions") && (
              <Button 
                variant="ghost" 
                onClick={() => { setSearchQuery(""); setSelectedBrand("All Brands"); setSelectedCondition("All Conditions"); }}
                className="h-16 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl border border-red-500/10"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-24">
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PartGrid 
              parts={filteredParts} 
              onPartClick={(id) => navigate(`/parts/${id}`)} 
            />
          </section>

          <section className="pt-24 border-t border-white/5">
            <BenefitsSection />
          </section>
        </div>
      </div>
    </div>
  );
}
