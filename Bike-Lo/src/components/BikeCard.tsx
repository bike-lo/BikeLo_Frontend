import { Badge } from "@/components/ui/badge";
import type { Bike } from "@/types/bike";

interface BikeCardProps {
  bike: Bike;
  isWishlisted: boolean;
  onWishlistToggle: (bikeId: string) => void;
  onClick?: (bikeId: string) => void;
}

export default function BikeCard({ bike, isWishlisted, onWishlistToggle, onClick }: BikeCardProps) {
  const formatPrice = (price: number) => `₹ ${price.toLocaleString("en-IN")}`;

  return (
    <div
      className="group relative bg-neutral-900/40 backdrop-blur-md border border-white/5 dark:border-neutral-800/60 rounded-[1.5rem] overflow-hidden hover:border-[#f7931e]/50 hover:shadow-[0_20px_60px_rgba(247,147,30,0.15)] transition-all duration-700 cursor-pointer"
      onClick={() => onClick?.(bike.id)}
    >
      {/* Image Container */}
      <div className="aspect-[1.5/1] overflow-hidden relative">
        {bike.imageUrl ? (
          <img
            src={bike.imageUrl}
            alt={`${bike.brand} ${bike.model}`}
            className="w-full h-full object-cover grayscale-[20%] brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
            <span className="text-neutral-700 text-xs uppercase tracking-widest font-black">No Visual</span>
          </div>
        )}

        {/* Glossy Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

        {/* Tags top-left */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          {bike.tags?.map((tag) => (
            <Badge
              key={tag}
              className="bg-[#f7931e] text-white text-[9px] px-2.5 py-0.5 uppercase tracking-widest font-black italic border-0 shadow-lg shadow-orange-500/20"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Wishlist top-right */}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlistToggle(bike.id); }}
          className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-[#f7931e] hover:border-[#f7931e] transition-all duration-500 z-10 group/wishlist"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className={`w-4 h-4 transition-all duration-500 ${isWishlisted ? "fill-white text-white scale-110" : "fill-none text-white group-hover/wishlist:scale-110"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-[0.2em] leading-none mb-1">Reserve For</span>
            <span className="text-2xl font-black text-white tracking-tighter" style={{ fontFamily: "'Noto Serif', serif" }}>
              {formatPrice(bike.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title Group */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-[#f7931e] uppercase tracking-[0.3em]">{bike.year}</span>
            <div className="h-px w-4 bg-neutral-800" />
            <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">{bike.brand}</span>
          </div>
          <h3
            className="text-xl font-black italic tracking-tighter text-white uppercase leading-none group-hover:text-[#f7931e] transition-all duration-500"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            {bike.model}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 truncate">
            {bike.variant}
          </p>
        </div>

        {/* Technical Summary */}
        <div className="flex items-center gap-4 pt-2">
           <div className="flex flex-col">
             <span className="text-[8px] uppercase text-neutral-600 font-black tracking-widest">Mileage</span>
             <span className="text-xs font-bold text-neutral-300">Certified</span>
           </div>
           <div className="w-px h-6 bg-neutral-800" />
           <div className="flex flex-col">
             <span className="text-[8px] uppercase text-neutral-600 font-black tracking-widest">History</span>
             <span className="text-xs font-bold text-neutral-300">Clean</span>
           </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-neutral-700 animate-pulse" />
              </div>
            ))}
            <span className="text-[8px] text-neutral-500 font-bold flex items-center ml-4 uppercase tracking-widest">Verified</span>
          </div>
          <button className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-400 group-hover:text-white transition-all flex items-center gap-2">
             Configure 
             <div className="w-5 h-5 rounded-full bg-neutral-800 group-hover:bg-[#f7931e] flex items-center justify-center transition-all">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
             </div>
          </button>
        </div>
      </div>
    </div>
  );
}
