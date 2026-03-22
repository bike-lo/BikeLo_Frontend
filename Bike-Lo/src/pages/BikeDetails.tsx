import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBikes, bikeImageUrl, updateBike, bookBikeLeadApi } from "@/services/bikeService";
import type { BikeResponse, UpdateBikeRequest } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Save, X, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [bike, setBike] = useState<BikeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [editData, setEditData] = useState<Partial<UpdateBikeRequest>>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
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
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

  // Derived image arrays for UI display
  const activeImageUrls = (() => {
    if (!bike) return [];
    const existing = (bike.images ?? [])
      .filter((img) => !deletedImages.includes(img.id))
      .map((img) => ({ url: bikeImageUrl(img.url), id: img.id, isNew: false, fileIndex: -1 }));

    const added = newImagePreviews.map((preview, idx) => ({ url: preview, id: `new-${idx}`, isNew: true, fileIndex: idx }));
    return [...existing, ...added];
  })();

  // Keep mainImage valid if it gets deleted
  useEffect(() => {
    if (activeImageUrls.length > 0) {
      if (!mainImage || !activeImageUrls.find(i => i.url === mainImage)) {
        setMainImage(activeImageUrls[0].url);
      }
    } else {
      setMainImage(null);
    }
  }, [activeImageUrls, mainImage]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel Edit
      setIsEditing(false);
      setEditData({});
      setNewImages([]);
      setNewImagePreviews([]);
      setDeletedImages([]);
    } else {
      // Start Edit
      setIsEditing(true);
      if (bike) {
        setEditData({
          make: bike.make,
          model_name: bike.model_name,
          price: bike.price,
          year: bike.year,
          km_driven: bike.km_driven,
          ownership: bike.ownership,
          insurance: bike.insurance,
        });
      }
    }
  };

  const handleSave = async () => {
    if (!bike) return;
    setSaving(true);
    try {
      // 1. Update text data via existing API
      await updateBike(bike.id, editData);

      // 2. Handle image mock logic (To be integrated later)
      if (deletedImages.length > 0 || newImages.length > 0) {
        toast.info("Image additions and deletions are recorded visually. Target APIs for images are pending integration.", { duration: 5000 });
      } else {
        toast.success("Bike updated successfully");
      }

      // Update local state to reflect text changes immediately
      setBike({
        ...bike,
        make: editData.make ?? bike.make,
        model_name: editData.model_name ?? bike.model_name,
        price: editData.price ?? bike.price,
        year: editData.year ?? bike.year,
        km_driven: editData.km_driven ?? bike.km_driven,
        ownership: editData.ownership ?? bike.ownership,
        insurance: editData.insurance ?? bike.insurance,
        // Since API is missing, we leave existing images intact in local state until a real refresh.
      });

      setIsEditing(false);
      setNewImages([]);
      setNewImagePreviews([]);
      setDeletedImages([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to save bike updates");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const addedFiles = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...addedFiles]);
      const previews = addedFiles.map((f) => URL.createObjectURL(f));
      setNewImagePreviews((prev) => [...prev, ...previews]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteImage = (img: typeof activeImageUrls[0]) => {
    if (img.isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== img.fileIndex));
      setNewImagePreviews((prev) => prev.filter((_, i) => i !== img.fileIndex));
    } else {
      setDeletedImages((prev) => [...prev, img.id as number]);
    }
  };

  const handleBookNow = async () => {
    if (!user) {
      toast.error("Please login to book a bike.");
      navigate("/login");
      return;
    }
    if (!bike) return;

    setIsBooking(true);
    try {
      const subject = `Booking Request: ${displayBike.make} ${displayBike.model_name}`;
      
      const userHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #f7931e;">Booking Confirmation</h2>
          <p>Hi <strong>${user.name || 'Customer'}</strong>,</p>
          <p>Thank you for expressing your interest in the <strong>${displayBike.year} ${displayBike.make} ${displayBike.model_name}</strong>!</p>
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #eee; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Price:</strong> ${formatPrice(displayBike.price)}</p>
            <p style="margin: 5px 0;"><strong>KM Driven:</strong> ${displayBike.km_driven?.toLocaleString("en-IN") || 0} km</p>
          </div>
          <p>We have successfully received your request and our team will contact you shortly to arrange a viewing and test ride.</p>
          <br>
          <p>Best Regards,</p>
          <p><strong>BikeLo Team</strong></p>
        </div>
      `;

      const adminHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; border-radius: 8px;">
          <h2 style="color: #d9534f;">New Bike Booking Lead</h2>
          
          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd; margin-bottom: 15px;">
            <h3 style="margin-top: 0; color: #333;">Customer Details</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px;"><strong>Name:</strong> ${user.name || 'Unknown'}</li>
              <li style="margin-bottom: 8px;"><strong>Email:</strong> ${user.email}</li>
              <li style="margin-bottom: 8px;"><strong>Phone:</strong> ${user.phone || 'Not provided'}</li>
              <li style="margin-bottom: 8px;"><strong>User ID:</strong> ${user.id}</li>
            </ul>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd;">
            <h3 style="margin-top: 0; color: #333;">Bike Details</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px;"><strong>Bike ID:</strong> ${bike.id}</li>
              <li style="margin-bottom: 8px;"><strong>Make:</strong> ${displayBike.make}</li>
              <li style="margin-bottom: 8px;"><strong>Model:</strong> ${displayBike.model_name}</li>
              <li style="margin-bottom: 8px;"><strong>Year:</strong> ${displayBike.year}</li>
              <li style="margin-bottom: 8px;"><strong>Price:</strong> ${formatPrice(displayBike.price)}</li>
            </ul>
          </div>
        </div>
      `;

      await bookBikeLeadApi({
        email: user.email,
        subject,
        "UserHTML ": userHtml,
        "AdminHTML ": adminHtml
      });

      toast.success("Booking request sent successfully! We will contact you soon.");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit your request.");
    } finally {
      setIsBooking(false);
    }
  };

  // ── Loading & Errors ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f7931e]/30 border-t-[#f7931e] rounded-full animate-spin" />
          <p className="text-neutral-400 text-sm uppercase tracking-widest font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !bike) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-black dark:text-white">{error ?? "Bike not found"}</p>
          <button
            onClick={() => navigate("/buy")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f7931e] text-white font-bold rounded-full hover:bg-[#e6851a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  // Derived Display Values
  const displayBike = isEditing ? { ...bike, ...editData } : bike;
  const formatPrice = (p: number | null | undefined) => `₹ ${(p || 0).toLocaleString("en-IN")}`;
  const getOwnershipText = (own: number | null | undefined) => own === 1 ? "1st Owner" : own === 2 ? "2nd Owner" : `${own || 0}th Owner`;
  const ownershipText = getOwnershipText(displayBike.ownership);

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-12 pb-16">
      {/* Top Bar with Back & Admin Controls */}
      <div className="flex justify-between items-center mb-8 mt-4">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/buy")}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-[#f7931e] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase tracking-widest font-bold text-[11px]">Back to Catalog</span>
        </motion.button>

        {isAdmin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleEditToggle}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-neutral-500 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#f7931e] hover:bg-[#e6851a] rounded-lg transition-all"
              >
                <Pencil className="w-4 h-4" /> Edit Bike
              </button>
            )}
          </motion.div>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* ── LEFT: Image Gallery ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-3">
          {/* Main Image */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            {mainImage ? (
              <img src={mainImage} alt="Main view" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                No Image Available
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className="bg-[#f7931e] text-white text-[10px] px-3 py-1 font-black uppercase tracking-wide italic border-0">
                {ownershipText}
              </Badge>
            </div>
          </div>

          {/* Thumbnails */}
          {(activeImageUrls.length > 1 || isEditing) && (
            <div className="grid grid-cols-4 gap-2">
              {activeImageUrls.map((img, idx) => (
                <div key={img.url + idx} className="relative group aspect-[4/3]">
                  <button
                    onClick={() => setMainImage(img.url)}
                    className={`w-full h-full rounded-xl overflow-hidden border-2 transition-all duration-200 ${mainImage === img.url
                        ? "border-[#f7931e] shadow-[0_0_12px_rgba(247,147,30,0.4)]"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-[#f7931e]/50"
                      }`}
                  >
                    <img src={img.url} alt={`view-${idx}`} className="w-full h-full object-cover" />
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => handleDeleteImage(img)}
                      className="absolute top-1 right-1 p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-md shadow backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {isEditing && (
                <div className="aspect-[4/3] border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-[#f7931e]/50 cursor-pointer text-neutral-400 hover:text-[#f7931e] transition-colors" onClick={() => fileInputRef.current?.click()}>
                  <div className="flex flex-col items-center gap-1">
                    <Plus className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Add</span>
                  </div>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* ── RIGHT: Details ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-7">

          {/* Header Area */}
          <div>
            {isEditing ? (
              <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900/40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Make</Label>
                    <Input value={editData.make || ""} onChange={e => setEditData({ ...editData, make: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Model Name</Label>
                    <Input value={editData.model_name || ""} onChange={e => setEditData({ ...editData, model_name: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Price (₹)</Label>
                  <Input type="number" value={editData.price || ""} onChange={e => setEditData({ ...editData, price: Number(e.target.value) })} />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight text-black dark:text-white uppercase leading-tight" style={{ fontFamily: "'Noto Serif', serif" }}>
                  {displayBike.make} {displayBike.model_name}
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 mt-1">
                  {displayBike.year} · {ownershipText}
                </p>
                <p className="text-3xl font-black text-[#f7931e] mt-3" style={{ fontFamily: "'Noto Serif', serif" }}>
                  {formatPrice(displayBike.price)}
                  <span className="text-sm font-medium text-neutral-400 ml-2">(Ex-showroom)</span>
                </p>
              </>
            )}
          </div>

          {/* Specs Grid */}
          <div>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-900/40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Year</Label>
                  <Input type="number" value={editData.year || ""} onChange={e => setEditData({ ...editData, year: Number(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-neutral-500 font-bold">KM Driven</Label>
                  <Input type="number" value={editData.km_driven || ""} onChange={e => setEditData({ ...editData, km_driven: Number(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Ownership</Label>
                  <Input type="number" value={editData.ownership || ""} onChange={e => setEditData({ ...editData, ownership: Number(e.target.value) })} />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="insurance"
                    checked={editData.insurance ?? false}
                    onChange={(e: any) => setEditData({ ...editData, insurance: !!e.target.checked })}
                  />
                  <Label htmlFor="insurance" className="text-sm font-bold">Has Insurance</Label>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Year", value: String(displayBike.year || 0) },
                  { label: "KM Driven", value: `${(displayBike.km_driven || 0).toLocaleString("en-IN")} km` },
                  { label: "Ownership", value: ownershipText },
                  { label: "Insurance", value: displayBike.insurance ? "Available" : "Not Available" },
                ].map((spec) => (
                  <div key={spec.label} className="bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-semibold mb-0.5">{spec.label}</p>
                    <p className="text-sm font-bold text-black dark:text-white">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800" />

          {/* CTA & Features (Hide in edit mode optionally, or keep unchanged) */}
          <div className={`transition-opacity ${isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleBookNow}
                disabled={isBooking}
                className="flex-1 py-4 bg-gradient-to-r from-[#f7931e] to-[#e6851a] text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all" 
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                {isBooking ? "Booking..." : "Book Now"}
              </button>
              <button className="flex-1 py-4 bg-transparent border-2 border-neutral-300 dark:border-neutral-700 text-black dark:text-white font-bold uppercase tracking-widest text-sm rounded-xl" style={{ fontFamily: "'Noto Serif', serif" }}>
                Check On-Road Price
              </button>
            </div>
            <p className="text-xs text-neutral-400 text-center sm:text-left mt-4 mb-7">
              💬 Contact for best deal · EMI options available
            </p>

            <div className="border-t border-neutral-200 dark:border-neutral-800 mb-7" />


          </div>

        </motion.div>
      </div>
    </div>
  );
}
