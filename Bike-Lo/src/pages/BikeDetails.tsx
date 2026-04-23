import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBikes, bikeImageUrl, bookBikeLeadApi, updateBike, updateBikeFormData, deleteBike } from "@/services/bikeService";
import { meApi } from "@/services/authService";
import { useAuth } from "@/hooks/use-auth";
import { useLoading } from "@/hooks/use-loading";
import type { BikeResponse, UpdateBikeRequest } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const isAdmin = user?.role === "admin";

  const [bike, setBike] = useState<BikeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState<UpdateBikeRequest>({});
  const [editFiles, setEditFiles] = useState<{ id: string; file: File; preview: string | null }[]>([]);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_FILES_LIMIT = 6;

  useEffect(() => {
    let mounted = true;
    startLoading();
    setLoading(true);
    const decodedId = id ? decodeURIComponent(id) : id;
    getBikes()
      .then((data) => {
        if (!mounted) return;
        const found = data.find((b) => String(b.id) === decodedId);
        if (found) {
          setBike(found);
          const first = found.images?.[0]?.url;
          setMainImage(first ? bikeImageUrl(first) : null);
        } else {
          setError("Bike not found");
        }
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setError("Failed to load bike details");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
          stopLoading();
        }
      });
    return () => { mounted = false; };
  }, [id]);

  const handleBookNow = useCallback(async () => {
    if (!bike) return;
    setBookingLoading(true);
    setBookingMsg(null);

    let userEmail = "unknown@bikelo.com";
    let userName = "Customer";
    let userPhone = "Not provided";

    // Fetch logged-in user details (requires valid JWT in localStorage)
    try {
      const me = await meApi();
      console.debug("[BookNow] Current user:", me);
      userEmail = me.email ?? userEmail;
      userName = me.name ?? userName;
      userPhone = me.phone ?? userPhone;
    } catch (err) {
      console.warn("[BookNow] Could not fetch user info — user may not be logged in:", err);
      setBookingLoading(false);
      setBookingMsg({ type: "error", text: "Please log in to book a bike." });
      return;
    }

    const bikeTitle = `${bike.year} ${bike.make} ${bike.model_name}`;
    const priceFormatted = `₹ ${Number(bike.price).toLocaleString("en-IN")}`;

    // ── User confirmation email HTML ─────────────────────────────────────────
    const userHtml = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;">
  <h2 style="color:#f7931e;">Booking Request Confirmed 🏍️</h2>
  <p>Hi <strong>${userName}</strong>,</p>
  <p>We've received your booking request for the <strong>${bikeTitle}</strong> at <strong>${priceFormatted}</strong>.</p>
  <p>Our team will contact you at <strong>${userEmail}</strong> within 24 hours to confirm the details.</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
  <p style="color:#888;font-size:12px;">BikeLo — Buy &amp; Sell Bikes</p>
</div>`.trim();

    // ── Admin lead notification HTML ─────────────────────────────────────────
    const adminHtml = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff;">
  <h2 style="color:#f7931e;">New Lead — Bike Booking 🚨</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Customer</td><td style="padding:8px;border:1px solid #eee;">${userName}</td></tr>
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #eee;">${userEmail}</td></tr>
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #eee;">${userPhone}</td></tr>
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Bike</td><td style="padding:8px;border:1px solid #eee;">${bikeTitle}</td></tr>
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Price</td><td style="padding:8px;border:1px solid #eee;">${priceFormatted}</td></tr>
    <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;">Bike ID</td><td style="padding:8px;border:1px solid #eee;">${bike.id}</td></tr>
  </table>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
  <p style="color:#888;font-size:12px;">BikeLo Admin Notification</p>
</div>`.trim();

    const payload = {
      email: userEmail,
      subject: `Booking Request: ${bikeTitle}`,
      UserHTML: userHtml,
      AdminHTML: adminHtml,
      "UserHTML ": userHtml,
      "AdminHTML ": adminHtml,
    };

    console.debug("[BookNow] Sending lead payload to /leads/capture:", payload);

    try {
      const result = await bookBikeLeadApi(payload);
      console.debug("[BookNow] Success:", result);
      setBookingMsg({ type: "success", text: "🎉 Booking request sent! We'll contact you soon." });
    } catch (err: any) {
      console.error("[BookNow] Failed to capture lead:", err);
      const msg = err?.message ?? "Failed to send booking request. Please try again.";
      setBookingMsg({ type: "error", text: msg });
    } finally {
      setBookingLoading(false);
    }
  }, [bike]);

  const handleDelete = async () => {
    if (!bike || !window.confirm("Are you sure you want to delete this bike? This action cannot be undone.")) return;
    try {
      await deleteBike(bike.id);
      toast.success("Bike deleted successfully");
      navigate("/buy");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete bike");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bike) return;
    setIsUpdating(true);
    try {
      let updatedBike;
      if (editFiles.length > 0) {
        const fd = new FormData();
        if (editForm.make) fd.append('make', editForm.make);
        if (editForm.model_name) fd.append('model_name', editForm.model_name);
        if (editForm.year) fd.append('year', String(editForm.year));
        if (editForm.km_driven !== undefined) fd.append('km_driven', String(editForm.km_driven));
        if (editForm.ownership !== undefined) fd.append('ownership', String(editForm.ownership));
        if (editForm.price !== undefined) fd.append('price', String(editForm.price));
        fd.append('insurance', editForm.insurance ? 'true' : 'false');
        
        editFiles.forEach((f, index) => {
          fd.append(`image_${index + 1}`, f.file);
        });
        
        updatedBike = await updateBikeFormData(bike.id, fd);
      } else {
        updatedBike = await updateBike(bike.id, editForm);
      }
      setBike(updatedBike);
      setIsEditModalOpen(false);
      setEditFiles([]);
      toast.success("Bike updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update bike");
    } finally {
      setIsUpdating(false);
    }
  };

  const openEditModal = () => {
    if (!bike) return;
    setEditForm({
      make: bike.make,
      model_name: bike.model_name,
      year: bike.year,
      km_driven: bike.km_driven,
      ownership: bike.ownership,
      price: bike.price,
      insurance: bike.insurance,
    });
    setIsEditModalOpen(true);
  };

  const addEditFiles = async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const allowed = MAX_FILES_LIMIT - editFiles.length;
    const slice = arr.slice(0, allowed);
    const newItems: { id: string; file: File; preview: string | null }[] = [];
    
    for (const f of slice) {
      if (!f.type.startsWith('image/')) continue;
      if (f.size > 5 * 1024 * 1024) continue;
      
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.readAsDataURL(f);
      });
      
      newItems.push({ id: Date.now().toString() + Math.random(), file: f, preview });
    }
    
    if (newItems.length) setEditFiles((prev) => [...prev, ...newItems]);
  };

  // ── Loading (Global loading screen handles this) ─────────────────────────
  if (loading && !bike) {
    return <div className="min-h-screen bg-black" />;
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !bike) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-black dark:text-white">{error ?? "Bike not found"}</p>
          <button
            onClick={() => navigate("/buy")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f7931e] text-white font-bold rounded-full
             hover:bg-[#e6851a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const imageUrls = (bike.images ?? []).map((img) => bikeImageUrl(img.url));
  const formatPrice = (p: number) => `₹ ${(p).toLocaleString("en-IN")}`;
  const ownership = bike.ownership === 1 ? "1st Owner" : bike.ownership === 2 ? "2nd Owner" : `${bike.ownership}th Owner`;

  // Specs to display in the grid
  const specs = [
    { label: "Year", value: String(bike.year) },
    { label: "KM Driven", value: bike.km_driven.toLocaleString("en-IN") + " km" },
    { label: "Ownership", value: ownership },
    { label: "Insurance", value: bike.insurance ? "Available" : "Not Available" },
  ];

  const isAd = bike.is_ad === true || String(bike.is_ad) === 'true' || bike.make === 'N/A';
  const isNew = bike.is_new === true || String(bike.is_new) === 'true';

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 pb-20 selection:bg-[#f7931e]/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Navigation Breadcrumb */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/buy")}
          className="group flex items-center gap-3 text-neutral-500 hover:text-white transition-all mb-12"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#f7931e] group-hover:border-[#f7931e] transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Showroom</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* ── LEFT: Immersive Gallery (7 cols) ─────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl group"
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={`${bike.make} ${bike.model_name}`}
                  className="w-full h-full object-cover grayscale-[10%] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 bg-neutral-900/50">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">No Visual Data</span>
                </div>
              )}

              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* Badges Overlay */}
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                {!isAd && !isNew && (
                  <Badge className="bg-[#f7931e] text-white text-[10px] px-4 py-1.5 font-black uppercase tracking-[0.15em] italic border-0 shadow-xl shadow-orange-500/20">
                    {ownership}
                  </Badge>
                )}
                {isNew && (
                  <Badge className="bg-[#f7931e] hover:bg-[#f7931e] text-white text-[10px] px-4 py-1.5 font-black uppercase tracking-[0.15em] italic border-0 shadow-xl shadow-orange-500/20">
                    Brand New
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {imageUrls.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="grid grid-cols-6 gap-3"
              >
                {imageUrls.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(src)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 group relative ${mainImage === src
                      ? "border-[#f7931e] scale-105 shadow-[0_10px_30px_rgba(247,147,30,0.2)]"
                      : "border-white/5 opacity-40 hover:opacity-100 hover:border-white/20"
                      }`}
                  >
                    <img src={src} alt={`thumbnail-${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    {mainImage === src && (
                      <div className="absolute inset-0 bg-[#f7931e]/10 pointer-events-none" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Shared content for Ads or Mobile view overflow */}
            {isAd && (
               <div className="pt-8 space-y-6 text-center lg:text-left">
                  <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: "'Noto Serif', serif" }}>
                    {bike.model_name}
                  </h1>
                  <p className="text-neutral-400 text-lg leading-relaxed max-w-3xl">
                    {bike.description || "Archived data listing for research."}
                  </p>
               </div>
            )}
          </div>

          {/* ── RIGHT: Details & Configuration (5 cols) ──────────────────────── */}
          {!isAd && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-10 lg:sticky lg:top-32"
            >
              {/* Essential Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-[#f7931e] uppercase tracking-[0.4em]">{bike.year} Limited Edition</span>
                  <div className="h-0.5 w-8 bg-neutral-800" />
                </div>
                <h1
                  className="text-4xl sm:text-6xl font-black italic tracking-tighter text-white uppercase leading-[0.9]"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  {bike.make} <br />
                  <span className="text-[#f7931e]">{bike.model_name}</span>
                </h1>
                
                <div className="pt-4 flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/5 pb-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Acquisition Reserve</span>
                    <p className="text-5xl font-black tracking-tighter" style={{ fontFamily: "'Noto Serif', serif" }}>
                      {formatPrice(bike.price)}
                    </p>
                  </div>
                  <div className="pb-2">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest border border-white/10 rounded-full px-4 py-1">Verified Certified</span>
                  </div>
                </div>
              </div>

              {/* Configuration Grid */}
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="group bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-[#f7931e]/30 transition-all duration-500 shadow-xl"
                  >
                    <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-black mb-2 group-hover:text-[#f7931e] transition-colors">
                      {spec.label}
                    </p>
                    <p className="text-lg font-black italic tracking-tight text-white uppercase">
                      {spec.label === "Ownership" && isNew ? "New Machine" : spec.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Status Message */}
              {bookingMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-[0.1em] border ${bookingMsg.type === "success"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                >
                  {bookingMsg.text}
                </motion.div>
              )}

              {/* Interaction Stack */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleBookNow}
                  disabled={bookingLoading}
                  className="relative group overflow-hidden py-6 bg-[#f7931e] text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:shadow-[0_20px_40px_rgba(247,147,30,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                   <span className="relative z-10">{bookingLoading ? "Processing Booking..." : "Initiate Reservation"}</span>
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
                
                <a
                  href="tel:7396961812"
                  className="py-6 bg-neutral-900/50 border border-white/10 text-white font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-neutral-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  Contact Us: 7396961812
                </a>
              </div>

              {/* Administrative Intel (Admin Only) */}
              {isAdmin && (
                <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-600">Administrative Operations</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={openEditModal}
                      className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Profile
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 py-4 bg-red-600/10 border border-red-600/20 text-red-500 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" /> Terminate Archive
                    </button>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="pt-4 text-center lg:text-right">
                <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest leading-none">
                  Archived Listing Valid as of {new Date(bike.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Dialog 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen}
        title="Edit Bike Details"
      >
        <form onSubmit={handleUpdate} className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="make" className="text-xs uppercase tracking-widest font-bold text-neutral-500">Make</Label>
              <Input
                id="make"
                value={editForm.make || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, make: e.target.value }))}
                className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model_name" className="text-xs uppercase tracking-widest font-bold text-neutral-500">Model Name</Label>
              <Input
                id="model_name"
                value={editForm.model_name || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, model_name: e.target.value }))}
                className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="year" className="text-xs uppercase tracking-widest font-bold text-neutral-500">Year</Label>
              <Input
                id="year"
                type="number"
                value={editForm.year || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, year: Number(e.target.value) }))}
                className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="km_driven" className="text-xs uppercase tracking-widest font-bold text-neutral-500">KM Driven</Label>
              <Input
                id="km_driven"
                type="number"
                value={editForm.km_driven ?? ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, km_driven: Number(e.target.value) }))}
                className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="ownership" className="text-xs uppercase tracking-widest font-bold text-neutral-500">Ownership</Label>
              <Input
                id="ownership"
                type="number"
                value={editForm.ownership ?? ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, ownership: Number(e.target.value) }))}
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

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="insurance"
              checked={editForm.insurance || false}
              onChange={(e) => setEditForm(prev => ({ ...prev, insurance: e.target.checked }))}
            />
            <Label htmlFor="insurance" className="text-sm font-bold cursor-pointer">Insurance Available</Label>
          </div>

          <div className="grid gap-2 pt-2">
            <Label className="text-xs uppercase tracking-widest font-bold text-neutral-500">Update Images (Optional)</Label>
            <div
              className="rounded-md border border-dashed border-neutral-200 dark:border-neutral-800 p-4 text-center hover:border-[#f7931e]/50 transition-colors cursor-pointer"
              onClick={() => editFileInputRef.current?.click()}
            >
              <input
                ref={editFileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addEditFiles(e.target.files);
                  e.currentTarget.value = '';
                }}
              />
              <p className="text-xs text-neutral-400">Click to add up to {MAX_FILES_LIMIT} images</p>
            </div>

            {editFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {editFiles.map((f) => (
                  <div key={f.id} className="relative group aspect-square rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <img src={f.preview || ''} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditFiles(prev => prev.filter(p => p.id !== f.id));
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {bike?.images && bike.images.length > 0 && (
              <p className="text-[10px] text-neutral-500 mt-1 italic">
                Note: Uploading new images will replace existing ones.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800 mt-4">
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
