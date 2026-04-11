import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitSellBike } from "@/services/sellBikeService";
import { bookBikeLeadApi } from "@/services/bikeService";
import { useAuth } from "@/hooks/use-auth";

interface SellFormProps {
  onSuccess?: () => void;
}

export default function SellForm({ onSuccess }: SellFormProps) {
  const { user } = useAuth();
  const [vehicleType, setVehicleType] = useState<"new" | "existing">("existing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    brand: "",
    year: "",
    model: "",
    exShowroom: "",
    registrationNumber: "",
  });
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  const bikeBrands = [
    "Honda",
    "Yamaha",
    "Suzuki",
    "TVS",
    "Bajaj",
    "Royal Enfield",
    "Hero",
    "KTM",
    "Kawasaki",
    "Harley-Davidson",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRcFileChange = (file: File | null) => {
    setRcFile(file);
  };

  const handleInvoiceFileChange = (file: File | null) => {
    setInvoiceFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const yearNum = parseInt(formData.year, 10);
      if (Number.isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
        setError("Enter a valid year (1900–2100).");
        return;
      }
      const fd = new FormData();
      fd.append("vehicle_type", vehicleType);
      fd.append("registration_no", vehicleType === "existing" ? formData.registrationNumber : "");
      fd.append("brand", formData.brand);
      fd.append("model", formData.model);
      fd.append("year", String(yearNum));
      if (vehicleType === "new") {
        const exShowroom = parseFloat(formData.exShowroom);
        if (Number.isNaN(exShowroom) || exShowroom < 0) {
          setError("Ex-showroom price is required for new vehicles.");
          return;
        }
        fd.append("ex_showroom", formData.exShowroom);
        if (invoiceFile) fd.append("invoice", invoiceFile);
      } else {
        if (vehicleType === "existing" && !formData.registrationNumber.trim()) {
          setError("Registration number is required for used vehicles.");
          return;
        }
        if (rcFile) fd.append("rc_card", rcFile);
      }

      const response = await submitSellBike(fd);

      // ── Email Notification Logic ─────────────────────────────────────────
      if (user) {
        const bikeTitle = `${formData.brand} ${formData.model} (${yearNum})`;
        
        const resolveUrl = (url?: string | null) => {
          if (!url) return null;
          return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL || 'http://localhost:8001'}${url}`;
        };
        const invoiceUrl = resolveUrl(response.invoice_url);
        const rcCardUrl = resolveUrl(response.rc_card_url);
        const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

        const uploadedDocsRows = [
          invoiceUrl ? `
            <tr>
              <td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Invoice</td>
              <td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">
                <a href="${invoiceUrl}" target="_blank" style="color: #10b981; text-decoration: none; display: inline-block; margin-bottom: 10px;">View Invoice ↗</a>
                ${isImage(invoiceUrl) ? `<br/><img src="${invoiceUrl}" alt="Invoice" style="max-width: 100%; max-height: 300px; border-radius: 4px; border: 1px solid #e2e8f0; display: block;" />` : ''}
              </td>
            </tr>` : '',
          rcCardUrl ? `
            <tr>
              <td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">RC Card</td>
              <td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">
                <a href="${rcCardUrl}" target="_blank" style="color: #10b981; text-decoration: none; display: inline-block; margin-bottom: 10px;">View RC Card ↗</a>
                ${isImage(rcCardUrl) ? `<br/><img src="${rcCardUrl}" alt="RC Card" style="max-width: 100%; max-height: 300px; border-radius: 4px; border: 1px solid #e2e8f0; display: block;" />` : ''}
              </td>
            </tr>` : ''
        ].filter(Boolean).join('');

        const docsSectionHtml = uploadedDocsRows ? `
            <p style="color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 12px; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Uploaded Documents</p>
            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
              ${uploadedDocsRows}
            </table>
        ` : '';

        const userHtml = `
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f8fafc" style="font-family: sans-serif; width: 100%;">
  <tr>
    <td align="center" style="padding: 40px 0;">
      <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin: 0 auto; max-width: 600px; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
        <tr>
          <td bgcolor="#1e293b" style="padding: 20px 30px; text-align: center; border-bottom: 3px solid #f7931e; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <span style="font-size: 24px; font-weight: bold; color: #f7931e;">Bike-Lo</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #1e293b; margin-top: 0;">Request Received</h2>
            <p style="color: #475569; line-height: 1.6;">Hi <strong>${user.name}</strong>,<br>We've received your request for vehicle insurance/evaluation. Our team will review the details and get back to you shortly.</p>
            <table width="100%" cellpadding="10" cellspacing="0" style="margin: 20px 0; border-collapse: collapse;">
              <tr>
                <td style="border: 1px solid #e2e8f0; color: #64748b; font-weight: bold; width: 35%;">Vehicle Details</td>
                <td style="border: 1px solid #e2e8f0; color: #1e293b; font-weight: bold;">${bikeTitle}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">Application ID</td>
                <td style="border: 1px solid #e2e8f0; color: #10b981; font-weight: bold;">INS-${Date.now().toString().slice(-6)}</td>
              </tr>
            </table>
            ${docsSectionHtml}
            <br>
            <center>
              <a href="https://bike-lo.com/profile" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">View Status</a>
            </center>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();

        const adminHtml = `
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f8fafc" style="font-family: sans-serif; width: 100%;">
  <tr>
    <td align="center" style="padding: 40px 0;">
      <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin: 0 auto; max-width: 600px; border-radius: 8px; border: 1px solid #e2e8f0; border-collapse: collapse;">
        <tr>
          <td bgcolor="#1e293b" style="padding: 20px 30px; border-bottom: 3px solid #f7931e; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            <span style="font-size: 24px; font-weight: bold; color: #f7931e;">Bike-Lo</span>
            <span style="color: #ffffff; float: right; font-size: 14px; font-weight: bold; margin-top: 6px;">INSURANCE LEAD 🚨</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #1e293b; margin-top: 0;">New Evaluation Request</h2>
            
            <p style="color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 12px; margin-top: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Customer Information</p>
            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Name</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${user.name}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Email</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${user.email}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Phone</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${user.phone || "Not provided"}</td></tr>
            </table>

            <p style="color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 12px; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Vehicle Details</p>
            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Type</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${vehicleType}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Brand</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${formData.brand}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Model</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${formData.model}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Year</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${yearNum}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Reg No</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${formData.registrationNumber || "N/A"}</td></tr>
            </table>
            
            ${docsSectionHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();

        await bookBikeLeadApi({
          email: user.email,
          subject: "Insurance/Evaluation Request - BikeLo",
          UserHTML: userHtml,
          AdminHTML: adminHtml,
        });
      }

      setFormData({ brand: "", year: "", model: "", exShowroom: "", registrationNumber: "" });
      setRcFile(null);
      setInvoiceFile(null);
      setVehicleType("existing");
      setError(null);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full bg-neutral-900/60 dark:bg-gray-900/40 backdrop-blur-md border-[#f7931e]/20 shadow-2xl overflow-hidden ring-1 ring-white/5">

      <CardHeader className="pb-8 border-b border-white/5">
        <CardTitle className="text-2xl flex items-center gap-3 text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
          <div className="bg-[#f7931e] rounded-full p-1.5 shadow-lg shadow-orange-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          Bike Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Vehicle Type Selection */}
          <div>
            <Label className="block text-sm font-medium text-gray-400 mb-4 tracking-wide uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
              Bike Type
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setVehicleType("new")}
                className={`transition-all duration-300 rounded-xl p-4 text-center border-2 font-semibold ${vehicleType === "new"
                    ? "bg-[#059669] border-[#059669] text-white shadow-lg shadow-emerald-500/20"
                    : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-white/5"
                  }`}
              >
                New Vehicle
              </button>
              <button
                type="button"
                onClick={() => setVehicleType("existing")}
                className={`transition-all duration-300 rounded-xl p-4 text-center border-2 font-semibold ${vehicleType === "existing"
                    ? "bg-[#059669] border-[#059669] text-white shadow-lg shadow-emerald-500/20"
                    : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-white/5"
                  }`}
              >
                Used / Existing
              </button>
            </div>
          </div>

          <div className="space-y-5">

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 md:col-span-1">
                <Label htmlFor="brand" className="text-sm font-medium text-gray-400 mb-1.5 block">Brand</Label>
                <div className="relative">
                  <Select
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    className="w-full bg-[#111827] border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all outline-none h-11 px-3"
                    required
                  >
                    <option value="" className="bg-[#111827]">Select Brand</option>
                    {bikeBrands.map((brand) => (
                      <option key={brand} value={brand.toLowerCase()} className="bg-[#111827]">
                        {brand}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <Label htmlFor="year" className="text-sm font-medium text-gray-400 mb-1.5 block">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="1990"
                  max="2025"
                  placeholder="YYYY"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  className="bg-[#111827] border-gray-700 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all h-11"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="model" className="text-sm font-medium text-gray-400 mb-1.5 block">Model</Label>
              <Input
                id="model"
                type="text"
                placeholder="e.g. Activa, MT-15, Classic 350"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="bg-[#111827] border-gray-700 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all h-11"
                required
              />
            </div>

            {/* New vehicle: ex-showroom + invoice */}
            {vehicleType === "new" && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="exShowroom" className="text-sm font-medium text-gray-400 mb-1.5 block">Ex-showroom price (₹)</Label>
                  <Input
                    id="exShowroom"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 95000"
                    value={formData.exShowroom}
                    onChange={(e) => handleInputChange("exShowroom", e.target.value)}
                    className="bg-[#111827] border-gray-700 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all h-11"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400 mb-2 block tracking-wide">Upload Invoice</Label>
                  <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-[#059669] border-dashed rounded-lg cursor-pointer bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold text-emerald-500 group-hover:text-emerald-400 transition-colors">Click to upload</span> PDF, JPG or PNG (MAX. 10MB)
                      </p>
                      {invoiceFile && <p className="text-xs text-emerald-500 font-medium px-2 py-1 bg-emerald-500/10 rounded">{invoiceFile.name}</p>}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleInvoiceFileChange(e.target.files?.[0] || null)}
                      required
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Existing Bike: registration + RC */}
            {vehicleType === "existing" && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="registrationNumber" className="text-sm font-medium text-gray-400 mb-1.5 block">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="E.G. KA-01-HQ-9999"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value.toUpperCase())}
                    className="bg-[#111827] border-gray-700 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all h-11 uppercase tracking-wider"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400 mb-2 block tracking-wide">Upload RC Card (Smart Card)</Label>
                  <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-[#059669] border-dashed rounded-lg cursor-pointer bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold text-emerald-500 group-hover:text-emerald-400 transition-colors">Click to upload</span> PDF, JPG or PNG (MAX. 10MB)
                      </p>
                      {rcFile && <p className="text-xs text-emerald-500 font-medium px-2 py-1 bg-emerald-500/10 rounded">{rcFile.name}</p>}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleRcFileChange(e.target.files?.[0] || null)}
                      required
                    />
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full py-7 text-lg font-bold rounded-xl transition-all duration-300 bg-[#059669] hover:bg-[#10b981] text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 active:scale-[0.98] mt-4"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Submit Application
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
