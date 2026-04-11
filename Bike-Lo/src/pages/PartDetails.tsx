import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Hammer, ShoppingCart, Trash2, ShieldCheck, Clock, Edit2, X, Plus } from "lucide-react";
import { getSpareParts, sparePartImageUrl, deleteSparePart, updateSparePart } from "@/services/sparePartService";
import { useAuth } from "@/hooks/use-auth";
import type { SparePartResponse, UpdateSparePartRequest } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef } from "react";

export default function PartDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [part, setPart] = useState<SparePartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Edit form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState<UpdateSparePartRequest>({});
  const [editFiles, setEditFiles] = useState<{ id: string; file: File; preview: string | null }[]>([]);
  const [isPreparingEdit, setIsPreparingEdit] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_FILES_LIMIT = 5;

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    setLoading(true);
    getSpareParts()
      .then((data: SparePartResponse[]) => {
        if (!mounted) return;
        const found = data.find((p: SparePartResponse) => String(p.id) === id);
        if (found) {
          setPart(found);
          if (found.images && found.images.length > 0) {
            setActiveImageIndex(0);
          }
        } else {
          setError("Hardware component not found in inventory.");
        }
      })
      .catch((err: any) => {
        console.error(err);
        if (mounted) setError("Failed to synchronize with inventory server.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

  const handleDelete = async () => {
    if (!part || !window.confirm("Are you sure you want to delete this hardware component?")) return;
    try {
      await deleteSparePart(part.id);
      toast.success("Component deleted successfully");
      navigate("/parts");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete component");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!part) return;
    setIsUpdating(true);
    try {
      const fd = new FormData();
      if (editForm.name) fd.append("name", editForm.name);
      if (editForm.brand) fd.append("brand", editForm.brand);
      if (editForm.compatible_models) fd.append("compatible_models", editForm.compatible_models);
      if (editForm.price !== undefined) fd.append("price", String(editForm.price));
      if (editForm.condition) fd.append("condition", editForm.condition);
      if (editForm.description) fd.append("description", editForm.description);
      fd.append("is_available", editForm.is_available ? "true" : "false");

      // ONLY send files. Since we converted existing photos to Files,
      // they will be included here if not deleted.
      editFiles.forEach((f, index) => {
        if (index < 5) {
          fd.append(`image_${index + 1}`, f.file);
        }
      });

      console.debug("[UpdatePart] Submitting FormData with binary files:", Array.from(fd.keys()));
      const updated = await updateSparePart(part.id, fd);
      setPart(updated);
      setIsEditModalOpen(false);
      setEditFiles([]);
      toast.success("Component updated successfully");
      if (updated.images && updated.images.length > 0) {
        setActiveImageIndex(0);
      }
    } catch (err: any) {
      console.error("[UpdatePart] Failed:", err);
      toast.error(err.message || "Failed to update component");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = async () => {
    if (!part) return;
    setEditForm({
      name: part.name,
      brand: part.brand,
      compatible_models: part.compatible_models,
      price: part.price,
      condition: part.condition,
      description: part.description,
      is_available: part.is_available,
    });
    
    setIsPreparingEdit(true);
    setIsEditModalOpen(true);
    setEditFiles([]);

    try {
      // Convert existing images to File objects to satisfy backend strictness
      const initialFiles: { id: string; file: File; preview: string | null }[] = [];
      
      for (const img of part.images) {
        try {
          const fullUrl = sparePartImageUrl(img.url);
          const response = await fetch(fullUrl);
          const blob = await response.blob();
          const filename = img.url.split('/').pop() || `image_${img.id}.jpg`;
          const file = new File([blob], filename, { type: blob.type });
          
          initialFiles.push({
            id: `existing-${img.id}`,
            file,
            preview: fullUrl
          });
        } catch (e) {
          console.warn(`Failed to convert existing image ${img.id}:`, e);
        }
      }
      setEditFiles(initialFiles);
    } catch (err) {
      console.error("Error preparing edit images:", err);
    } finally {
      setIsPreparingEdit(false);
    }
  };

  const addEditFiles = async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const allowed = MAX_FILES_LIMIT - editFiles.length;
    const slice = arr.slice(0, allowed);
    const newItems: { id: string; file: File; preview: string | null }[] = [];

    for (const f of slice) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 5 * 1024 * 1024) continue;

      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
        reader.readAsDataURL(f);
      });

      newItems.push({ id: Date.now().toString() + Math.random(), file: f, preview });
    }

    if (newItems.length) setEditFiles((prev) => [...prev, ...newItems]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f7931e]/30 border-t-[#f7931e] rounded-full animate-spin" />
          <p className="text-neutral-400 text-[10px] uppercase tracking-[0.4em] font-black">Syncing Data...</p>
        </div>
      </div>
    );
  }

  if (error || !part) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
            <Package className="w-10 h-10 text-red-500 opacity-40" />
          </div>
          <p className="text-2xl font-black italic text-white uppercase" style={{ fontFamily: "'Noto Serif', serif" }}>
            {error || "Component Not Found"}
          </p>
          <button
            onClick={() => navigate("/parts")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#f7931e] hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Archive
          </button>
        </div>
      </div>
    );
  }

  const imageUrls = (part.images ?? []).map((img) => sparePartImageUrl(img.url));

  const specs = [
    { 
      label: "Condition Status", 
      value: part.condition, 
      icon: <ShieldCheck className="w-4 h-4 text-[#f7931e]" /> 
    },
    { 
      label: "Compatibility Range", 
      value: part.compatible_models || "Universal", 
      icon: <Hammer className="w-4 h-4 text-[#f7931e]" /> 
    },
    { 
      label: "Stock Log", 
      value: part.is_available ? "In Stock" : "Sold Out", 
      icon: <Clock className="w-4 h-4 text-[#f7931e]" />,
      alert: !part.is_available
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 pb-20 selection:bg-[#f7931e]/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/parts")}
          className="group flex items-center gap-3 text-neutral-500 hover:text-white transition-all mb-12"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#f7931e] group-hover:border-[#f7931e] transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Inventory</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Gallery Section */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[16/10] rounded-[3rem] overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl group ring-1 ring-white/10"
            >
              {imageUrls.length > 0 ? (
                <img
                  src={imageUrls[activeImageIndex] || imageUrls[0]}
                  alt={part.name}
                  className="w-full h-full object-cover grayscale-[10%] brightness-95 group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-[1.02] transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-800 bg-neutral-900/50">
                  <Package className="w-16 h-16 opacity-10 mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">No Visual Data</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                <Badge className="bg-[#f7931e] text-white text-[10px] px-5 py-2 font-black uppercase tracking-[0.15em] italic border-0 shadow-2xl shadow-orange-500/40">
                  {part.condition}
                </Badge>
              </div>
            </motion.div>

            {/* Thumbnail Navigation */}
            {imageUrls.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="grid grid-cols-5 gap-4"
              >
                {imageUrls.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 group relative ${
                      activeImageIndex === idx
                        ? "border-[#f7931e] scale-105 shadow-[0_15px_35px_rgba(247,147,30,0.3)] z-10"
                        : "border-white/5 opacity-60 hover:opacity-100 hover:border-white/20"
                    }`}
                  >
                    <img src={src} alt={`thumb-${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    {activeImageIndex === idx && (
                      <div className="absolute inset-0 bg-[#f7931e]/10 pointer-events-none" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-12"
          >
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-[#f7931e] uppercase tracking-[0.4em]">{part.brand} Certified</span>
                <div className="h-0.5 w-12 bg-neutral-800 rounded-full" />
              </div>
              <h1
                className="text-4xl sm:text-6xl font-black italic tracking-tighter text-white uppercase leading-none"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                {part.name}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/5 pb-8 pt-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Acquisition Reserve</span>
                  <p className="text-5xl font-black tracking-tighter text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                    ₹ {part.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="pb-2">
                   <div className="flex items-center gap-2 bg-neutral-900/50 border border-white/10 rounded-full px-4 py-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${part.is_available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                        {part.is_available ? 'Hardware Online' : 'Out of Circulation'}
                      </span>
                   </div>
                </div>
              </div>
            </div>

            {/* Spec Grid */}
            <div className="grid gap-4">
              {specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="group bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 flex items-center justify-between hover:border-[#f7931e]/30 transition-all duration-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#f7931e]/10 transition-colors">
                      {spec.icon}
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-black mb-0.5 group-hover:text-[#f7931e] transition-colors line-clamp-1">
                        {spec.label}
                      </p>
                      <p className={`text-lg font-black italic tracking-tight uppercase ${spec.alert ? 'text-red-400' : 'text-white'}`}>
                        {spec.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">Technical Dossier</h3>
              <p className="text-neutral-400 text-base leading-relaxed font-medium">
                {part.description || "No technical description available for this identified component."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
               <button 
                 disabled={!part.is_available}
                 className="w-full py-6 bg-[#f7931e] text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:shadow-[0_20px_40px_rgba(247,147,30,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                 style={{ fontFamily: "'Noto Serif', serif" }}
               >
                 <span className="flex items-center justify-center gap-3">
                   <ShoppingCart className="w-4 h-4" />
                   {part.is_available ? 'Acquire Hardware' : 'Reservation Not Possible'}
                 </span>
               </button>

               {isAdmin && (
                 <div className="grid grid-cols-2 gap-4 pt-8">
                    <button 
                      onClick={openEditModal}
                      className="py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-3 h-3" /> Modify Listing
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="py-4 bg-red-600/10 border border-red-600/20 text-red-500 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" /> Terminate Archive
                    </button>
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen}
        title="Edit Hardware Component"
      >
        <form onSubmit={handleUpdate} className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-neutral-500">Part Name</Label>
              <Input
                id="name"
                value={editForm.name || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand" className="text-xs uppercase tracking-widest font-bold text-neutral-500">Brand</Label>
              <Input
                id="brand"
                value={editForm.brand || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, brand: e.target.value }))}
                className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="compatible_models" className="text-xs uppercase tracking-widest font-bold text-neutral-500">Compatible Models</Label>
              <Input
                id="compatible_models"
                value={editForm.compatible_models || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, compatible_models: e.target.value }))}
                className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-xs uppercase tracking-widest font-bold text-neutral-500">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={editForm.price ?? ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="condition" className="text-xs uppercase tracking-widest font-bold text-neutral-500">Condition</Label>
              <select
                id="condition"
                value={editForm.condition || "New"}
                onChange={(e) => setEditForm(prev => ({ ...prev, condition: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm focus:ring-2 focus:ring-[#f7931e]/50 outline-none"
              >
                <option value="New">New</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="is_available"
                checked={editForm.is_available ?? true}
                onChange={(e) => setEditForm(prev => ({ ...prev, is_available: e.target.checked }))}
              />
              <Label htmlFor="is_available" className="text-sm font-bold cursor-pointer">In Stock</Label>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-xs uppercase tracking-widest font-bold text-neutral-500">Description</Label>
            <textarea
              id="description"
              value={editForm.description || ""}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              className="flex w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm min-h-[80px]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 italic">Inventory Media ({editFiles.length}/5)</Label>
              {editFiles.length > 0 && (
                <button 
                  type="button" 
                  onClick={() => setEditFiles([])}
                  className="text-[9px] text-red-500/70 hover:text-red-500 font-black uppercase tracking-widest transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {/* Upload Button */}
              {editFiles.length < MAX_FILES_LIMIT && (
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  disabled={isPreparingEdit}
                  className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 hover:border-[#f7931e]/50 hover:bg-neutral-800 transition-all group disabled:opacity-50 bg-neutral-900/40"
                >
                  <Plus className="w-4 h-4 text-neutral-600 group-hover:text-[#f7931e] transition-colors" />
                  <span className="text-[8px] font-black uppercase tracking-tighter text-neutral-700 mt-1">Add</span>
                </button>
              )}

              {/* Unified Image List (Old + New) */}
              {editFiles.map((f) => (
                <div key={f.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={f.preview || ""} alt="preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setEditFiles(prev => prev.filter(p => p.id !== f.id))}
                      className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-110 transition-all shadow-xl"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  {f.id.startsWith('existing-') && (
                    <div className="absolute top-1 left-1 bg-black/60 rounded px-1 py-0.5 border border-white/10 backdrop-blur-sm">
                      <span className="text-[6px] text-white/70 font-black uppercase tracking-tighter">Current</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Skeleton Loading for conversion */}
              {isPreparingEdit && Array.from({ length: Math.max(0, 3 - editFiles.length) }).map((_, i) => (
                <div key={`skeleton-${i}`} className="aspect-square rounded-xl bg-white/5 animate-pulse border border-white/5" />
              ))}
            </div>

            <input
              ref={editFileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addEditFiles(e.target.files);
                e.currentTarget.value = "";
              }}
            />
            <p className="text-[9px] text-neutral-500 italic mt-2 leading-relaxed">
              Images satisfy strictly backend requirements. The top-left badge indicates photos already in inventory.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-[#f7931e] hover:bg-[#e6851a] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] h-12 px-8"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
