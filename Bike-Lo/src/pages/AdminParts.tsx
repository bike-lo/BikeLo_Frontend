import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { getSpareParts, deleteSparePart, sparePartImageUrl } from "@/services/sparePartService";
import type { SparePartResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Package, 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  ChevronLeft,
  Filter,
  AlertCircle,
  Settings2
} from "lucide-react";

export default function AdminParts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [parts, setParts] = useState<SparePartResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const loadParts = () => {
    setLoading(true);
    getSpareParts()
      .then(setParts)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "Failed to load parts";
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
    loadParts();
  }, [user, navigate]);

  const handleDelete = async (p: SparePartResponse) => {
    try {
      await deleteSparePart(p.id);
      setParts(parts.filter(x => x.id !== p.id));
      toast.success(`Part "${p.name}" deleted successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete part");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredParts = parts.filter((p) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.compatible_models.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen px-4 py-24 bg-transparent">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/admin")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 
                className="text-4xl font-bold text-white mb-2" 
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Parts Inventory
              </h1>
              <p className="text-gray-400">Review, manage, and audit your spare parts catalog.</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/admin/add-part")}
            className="bg-[#f7931e] hover:bg-[#e0821a] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-orange-500/20"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Part
          </Button>
        </div>

        {/* Filters and Stats */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search by name, brand, or model compatibility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-neutral-900/50 backdrop-blur-md border-white/10 text-white placeholder:text-gray-500 rounded-2xl focus:ring-[#f7931e]/50"
            />
          </div>
          <div className="flex items-center gap-3 bg-neutral-900/50 backdrop-blur-md border border-white/10 px-6 rounded-2xl">
            <Filter className="w-5 h-5 text-[#f7931e]" />
            <span className="text-sm font-medium text-gray-300">
              Showing {filteredParts.length} of {parts.length} parts
            </span>
          </div>
        </div>

        {loading && parts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#f7931e]/30 border-t-[#f7931e] rounded-full animate-spin" />
            <p className="text-gray-400 font-medium">Scanning Inventory Logs...</p>
          </div>
        ) : error && parts.length === 0 ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Systems Connection Error</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <Button onClick={loadParts} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
              Retry Sync
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.length > 0 ? (
              filteredParts.map((p) => (
                <Card 
                  key={p.id} 
                  className="bg-neutral-900/50 backdrop-blur-md border-white/5 hover:border-[#f7931e]/30 transition-all duration-300 group overflow-hidden ring-1 ring-white/5 shadow-2xl relative"
                >
                  <CardHeader className="pb-4 relative">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center overflow-hidden">
                          {p.images && p.images.length > 0 ? (
                            <img 
                              src={sparePartImageUrl(p.images[0].url)} 
                              alt={p.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold text-white group-hover:text-[#f7931e] transition-colors truncate">
                            {p.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-[#f7931e]/10 text-[#f7931e] border-[#f7931e]/20 text-[10px] uppercase font-bold">
                              {p.brand}
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-gray-400 text-[10px] truncate max-w-[100px]">
                              {p.compatible_models}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium font-mono">Unit Price</span>
                        <span className="text-2xl font-bold text-white font-mono">₹{p.price.toLocaleString()}</span>
                      </div>
                      <Badge 
                        className={`capitalize ${
                          p.is_available 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        {p.is_available ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <Settings2 className="w-4 h-4 text-[#f7931e]/60" />
                      <span className="truncate">Condition: <span className="text-gray-200 capitalize">{p.condition}</span></span>
                    </div>
                    
                    <div className="pt-4 flex items-center gap-3 border-t border-white/5">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => navigate(`/parts/${p.id}`)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      >
                        <Edit3 className="w-4 h-4 mr-2 text-[#f7931e]" />
                        Edit / Manage
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsDeleting(p.id)}
                        className="bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 border border-red-500/10 w-12"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>

                  {/* Delete Confirmation Overlay */}
                  {isDeleting === p.id && (
                    <div className="absolute inset-0 z-20 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
                      <div className="bg-red-500/20 p-4 rounded-full border border-red-500/30 mb-4 text-red-400 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                        <Trash2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-white font-bold text-xl mb-2">Sanitize Item?</h4>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Are you sure you want to remove <strong>{p.name}</strong>? This action cannot be reversed.
                      </p>
                      <div className="flex items-center gap-3 w-full max-w-[240px]">
                        <Button 
                          variant="destructive" 
                          className="flex-1 h-11 font-bold shadow-lg shadow-red-500/20"
                          onClick={() => handleDelete(p)}
                        >
                          Confirm
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="flex-1 h-11 text-gray-300 hover:text-white bg-white/5 border border-white/10"
                          onClick={() => setIsDeleting(null)}
                        >
                          Abort
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="col-span-full py-32 text-center">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 text-gray-600 shadow-inner">
                  <Package className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                  Zero Results Found
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Your search criteria returned no inventory records. Try broading your parameters or adding a new listing.
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button 
                    variant="link" 
                    onClick={() => setSearchQuery("")}
                    className="text-[#f7931e] hover:text-[#e0821a] font-bold"
                  >
                    Reset Dashboard
                  </Button>
                  <Button 
                    onClick={() => navigate("/admin/add-part")}
                    variant="outline"
                    className="border-white/10 text-white"
                  >
                    Add New Record
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
