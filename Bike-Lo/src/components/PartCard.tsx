import { ShoppingCart, Hammer, Package } from 'lucide-react';
import type { SparePartResponse } from '@/types/api';
import { sparePartImageUrl } from '@/services/sparePartService';

interface PartCardProps {
  part: SparePartResponse;
  onClick?: () => void;
}

export default function PartCard({ part, onClick }: PartCardProps) {
  const mainImage = part.images && part.images.length > 0 
    ? sparePartImageUrl(part.images[0].url)
    : null;

  return (
    <div 
      onClick={onClick}
      className="group relative bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-[#f7931e]/30 cursor-pointer flex flex-col h-full ring-1 ring-white/5"
    >
      {/* Visual Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800/50">
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={part.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-neutral-700" />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">{part.condition}</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f7931e]">{part.brand}</p>
            <h3 className="text-xl font-black italic tracking-tighter uppercase text-white leading-tight" style={{ fontFamily: "'Noto Serif', serif" }}>
              {part.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-0.5">Valuation</p>
            <p className="text-xl font-black text-white">₹{part.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-1 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">
              <Hammer className="w-3.5 h-3.5 text-[#f7931e]" />
              Compatible With
            </div>
            <p className="text-sm font-medium text-neutral-300 line-clamp-1">{part.compatible_models || 'Universal'}</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">
              <Package className="w-3.5 h-3.5 text-[#f7931e]" />
              Stock Presence
            </div>
            <p className={`text-sm font-black uppercase tracking-widest ${part.is_available ? 'text-green-400' : 'text-red-400'}`}>
              {part.is_available ? 'Available' : 'Sold Out'}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#f7931e] hover:text-white flex items-center justify-center gap-3 active:scale-[0.98]">
            <ShoppingCart className="w-4 h-4" />
            Acquire Hardware
          </button>
        </div>
      </div>
    </div>
  );
}
