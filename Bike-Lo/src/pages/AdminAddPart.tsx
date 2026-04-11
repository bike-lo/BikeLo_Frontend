import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { createSparePart } from '@/services/sparePartService';
import { 
  ChevronLeft, 
  Upload, 
  X, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Camera,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminAddPart() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [compatibleModels, setCompatibleModels] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [condition, setCondition] = useState('New');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [files, setFiles] = useState<
    { id: string; file: File; preview: string | null }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_FILES = 5;
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const createPreview = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(typeof reader.result === 'string' ? reader.result : '');
      };
      reader.readAsDataURL(file);
    });

  const addFiles = async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const allowed = MAX_FILES - files.length;
    const slice = arr.slice(0, allowed);
    const newItems: { id: string; file: File; preview: string | null }[] = [];
    for (const f of slice) {
      if (!f.type.startsWith('image/')) continue;
      if (f.size > 5 * 1024 * 1024) continue;
      const preview = await createPreview(f);
      newItems.push({ id: Date.now().toString() + Math.random(), file: f, preview });
    }
    if (newItems.length) setFiles((prev) => [...prev, ...newItems]);
  };

  const validate = () => {
    if (!name.trim()) return 'Name is required';
    if (!brand.trim()) return 'Brand is required';
    if (price === '' || Number(price) < 0) return 'Enter a valid price';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      toast.error(v);
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('name', name.trim());
      fd.append('brand', brand.trim());
      fd.append('compatible_models', compatibleModels.trim());
      fd.append('price', String(Number(price)));
      fd.append('condition', condition);
      fd.append('description', description.trim());
      fd.append('is_available', isAvailable ? 'true' : 'false');
      
      files.forEach((f, index) => {
        fd.append(`image_${index + 1}`, f.file);
      });

      setIsUploading(true);
      await createSparePart(fd);
      setUploadComplete(true);
      toast.success('Spare part added successfully!');
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to save spare part.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen px-4 py-24 bg-transparent">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 
              className="text-4xl font-bold text-white mb-2" 
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Add Spare Part
            </h1>
            <p className="text-gray-400">List a new genuine spare part in the inventory.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="bg-neutral-900/50 backdrop-blur-md border-[#f7931e]/20 shadow-2xl ring-1 ring-white/5 overflow-hidden">
            <CardHeader className="border-b border-white/5 pb-8">
              <CardTitle className="text-2xl flex items-center gap-3 text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <Info className="w-6 h-6 text-[#f7931e]" />
                Primary Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Part Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Front Brake Pads"
                    className="bg-neutral-800/50 border-white/10 text-white focus:border-[#f7931e]/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-gray-300">Brand</Label>
                  <Input 
                    id="brand" 
                    value={brand} 
                    onChange={(e) => setBrand(e.target.value)} 
                    placeholder="e.g. Brembo"
                    className="bg-neutral-800/50 border-white/10 text-white focus:border-[#f7931e]/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compatibleModels" className="text-gray-300">Compatible Models</Label>
                  <Input 
                    id="compatibleModels" 
                    value={compatibleModels} 
                    onChange={(e) => setCompatibleModels(e.target.value)} 
                    placeholder="e.g. Ninja 300, RC 390"
                    className="bg-neutral-800/50 border-white/10 text-white focus:border-[#f7931e]/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">Price (INR)</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={price} 
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                    placeholder="e.g. 1500"
                    className="bg-neutral-800/50 border-white/10 text-white focus:border-[#f7931e]/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-gray-300">Condition</Label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-neutral-800/50 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-[#f7931e]/50 outline-none transition-all"
                  >
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Used">Used</option>
                  </select>
                </div>

                <div className="flex items-end pb-2">
                  <div className="flex items-center gap-3 bg-neutral-800/30 p-2.5 rounded-lg border border-white/5 w-full">
                    <Checkbox 
                      id="isAvailable" 
                      checked={isAvailable} 
                      onChange={(e) => setIsAvailable(e.target.checked)} 
                      className="border-white/20 data-[state=checked]:bg-[#f7931e] data-[state=checked]:border-[#f7931e]"
                    />
                    <Label htmlFor="isAvailable" className="mb-0 text-gray-300 cursor-pointer">In Stock & Available</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the part, warranty info, etc..."
                  className="flex w-full rounded-md border border-white/10 bg-neutral-800/50 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-[#f7931e]/50 outline-none transition-all min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900/50 backdrop-blur-md border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
            <CardHeader className="border-b border-white/5 pb-8">
              <CardTitle className="text-2xl flex items-center gap-3 text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <Camera className="w-6 h-6 text-[#f7931e]" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
                }}
                className={`rounded-2xl border-2 p-12 text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-[#f7931e] bg-[#f7931e]/10' 
                    : 'border-dashed border-white/10 hover:border-[#f7931e]/40 hover:bg-white/5'
                }`}
              >
                <input
                  ref={fileInputRef}
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.currentTarget.value = '';
                  }}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-[#f7931e]/10 p-4 rounded-full border border-[#f7931e]/20">
                    <Upload className="w-8 h-8 text-[#f7931e]" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">Click to upload or drag & drop</p>
                    <p className="text-gray-400 text-sm mt-1">
                      JPG/PNG (Up to 5MB each)
                    </p>
                    <p className="text-xs text-[#f7931e]/70 mt-2 font-medium">
                      Maximum Capacity: {MAX_FILES} images
                    </p>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <Button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      Browse Gallery
                    </Button>
                    {files.length > 0 && (
                      <Button 
                        variant="ghost" 
                        type="button" 
                        onClick={() => setFiles([])}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        Reset Media
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Selected Images ({files.length}/{MAX_FILES})</h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {files.map((f) => (
                      <div key={f.id} className="relative group aspect-square rounded-xl overflow-hidden bg-neutral-800 ring-1 ring-white/10">
                        <img src={f.preview || ''} alt="preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            type="button"
                            onClick={() => setSelectedPreview(f.preview)}
                            className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-white" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setFiles((prev) => prev.filter((p) => p.id !== f.id))}
                            className="bg-red-500/20 backdrop-blur-md p-2 rounded-lg border border-red-500/30 hover:bg-red-500/40 transition-colors"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center gap-4 pt-4 pb-12">
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading}
              className="h-14 px-10 bg-[#f7931e] hover:bg-[#e0821a] text-white text-lg font-bold shadow-xl shadow-orange-500/20 flex-1 md:flex-none"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </div>
              ) : isSubmitting ? 'Saving...' : 'List Spare Part'}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin')}
              className="h-14 px-8 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
        
        {/* Success Modal */}
        {uploadComplete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl ring-1 ring-white/5">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-500/20 p-4 rounded-full border border-green-500/30 mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>
                  Spare Part Added
                </h3>
                <p className="text-gray-400 mb-8">The spare part has been successfully added to the inventory.</p>
                
                <div className="flex flex-col gap-3 w-full">
                  <Button 
                    className="w-full bg-[#f7931e] hover:bg-[#e0821a] text-white font-bold h-12"
                    onClick={() => {
                      setName(''); setBrand(''); setCompatibleModels(''); setPrice(''); setCondition('New'); setDescription(''); setIsAvailable(true);
                      setFiles([]); setUploadComplete(false);
                    }}
                  >
                    Add Another Part
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white/10 text-white h-12"
                    onClick={() => navigate('/admin')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Preview Overlay */}
        {selectedPreview && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedPreview(null)}>
            <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center">
              <button 
                className="absolute top-4 right-4 bg-white/10 p-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                onClick={() => setSelectedPreview(null)}
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <img src={selectedPreview} alt="preview" className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
