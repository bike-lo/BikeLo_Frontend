import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "@/components/FilterSidebar";
import BikeGrid from "@/components/BikeGrid";
import BenefitsSection from "@/components/BenefitsSection";
import { getBikes, mapBikeResponseToBike } from "@/services/bikeService";
import type { Bike } from "@/types/bike";

export default function Buy() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistedBikes, setWishlistedBikes] = useState<Set<string>>(() => {
    const savedWishlist = localStorage.getItem("bikeWishlist");
    if (savedWishlist) {
      try {
        return new Set(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
    return new Set();
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bikeWishlist", JSON.stringify(Array.from(wishlistedBikes)));
  }, [wishlistedBikes]);

  const [bikes, setBikes] = useState<Bike[]>([]);
  const navigate = useNavigate();

  // Dynamic filter metadata
  const availableBrands = useMemo(() => {
    return Array.from(new Set(bikes.map(b => b.brand))).sort();
  }, [bikes]);

  const maxPriceLimit = useMemo(() => {
    const listMax = Math.max(...bikes.map(b => b.price), 0);
    return Math.max(listMax, 3); // Fallback to 3 if no higher bikes present
  }, [bikes]);

  // Adjust max price range if new bikes are loaded that exceed our current max
  useEffect(() => {
    if (priceRange[1] < maxPriceLimit) {
      setPriceRange([priceRange[0], maxPriceLimit]);
    }
  }, [maxPriceLimit]);

  // Fetch bikes from API (requires auth)
  useEffect(() => {
    let mounted = true;
    getBikes()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setBikes(list.map(mapBikeResponseToBike));
      })
      .catch((err) => {
        console.error("Failed to load bikes", err);
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Unauthorized") || msg.includes("Invalid") || msg.includes("expired")) {
          navigate("/login", { replace: true });
        }
      });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Filter bikes based on all criteria
  const filteredBikes = useMemo(() => {
    return bikes.filter((bike) => {
      // Price filter
      if (bike.price < priceRange[0] || (priceRange[1] < maxPriceLimit && bike.price > priceRange[1])) {
        // Only filter by max if user has explicitly decreased it below the limit
        if (bike.price > priceRange[1]) return false;
      }

      // Brand filter (Case Insensitive)
      if (selectedBrands.length > 0) {
        const brandMatch = selectedBrands.some(
          (sb) => sb.toLowerCase() === bike.brand.toLowerCase()
        );
        if (!brandMatch) return false;
      }

      // Year filter
      if (selectedYear !== null && bike.year < selectedYear) {
        return false;
      }

      // Search filter (Case Insensitive)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const searchText = `${bike.brand} ${bike.model} ${bike.variant}`.toLowerCase();
        if (!searchText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [bikes, priceRange, selectedBrands, selectedYear, searchQuery, maxPriceLimit]);

  const handleBikeClick = (bikeId: string) => {
    navigate(`/buy/${encodeURIComponent(bikeId)}`);
  };

  const handleWishlistToggle = (bikeId: string) => {
    setWishlistedBikes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bikeId)) {
        newSet.delete(bikeId);
      } else {
        newSet.add(bikeId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex justify-center min-h-screen pt-24 pb-20 bg-transparent text-white">
      <div className="flex flex-col lg:flex-row w-full max-w-[1600px] lg:gap-12 px-4 sm:px-8 lg:px-12">
        {/* Sidebar — sticky, full height (desktop only) */}
        <div className="hidden lg:block flex-shrink-0">
          <FilterSidebar
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedBrands={selectedBrands}
            onBrandsChange={setSelectedBrands}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            availableBrands={availableBrands}
            maxPriceLimit={maxPriceLimit}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-16 overflow-y-auto">
          {/* Mobile filter trigger */}
          <div className="block lg:hidden">
            <FilterSidebar
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedBrands={selectedBrands}
              onBrandsChange={setSelectedBrands}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              availableBrands={availableBrands}
              maxPriceLimit={maxPriceLimit}
            />
          </div>

          {/* Bike grid with catalog header */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BikeGrid
              bikes={filteredBikes}
              wishlistedBikes={wishlistedBikes}
              onWishlistToggle={handleWishlistToggle}
              onBikeClick={handleBikeClick}
            />
          </section>

          {/* Benefits */}
          <section className="pt-12 border-t border-white/5">
            <BenefitsSection />
          </section>
        </div>
      </div>
    </div>
  );
}
