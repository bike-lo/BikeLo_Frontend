import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { createSellListing } from "@/services/sellListingService";
import { bookBikeLeadApi } from "@/services/bikeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

export default function Sell() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [noOfOwners, setNoOfOwners] = useState<number | "">(1);
  const [insuranceAvailable, setInsuranceAvailable] = useState<"yes" | "no">("no");
  const [financeHypothecation, setFinanceHypothecation] = useState<"yes" | "no">("no");
  const [originalRcAvailable, setOriginalRcAvailable] = useState<"yes" | "no">("no");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!model.trim()) {
      setError("Model is required.");
      return;
    }
    const y = year === "" ? 0 : Number(year);
    if (!y || y < 1900 || y > currentYear) {
      setError("Please enter a valid year.");
      return;
    }
    const owners = noOfOwners === "" ? 0 : Number(noOfOwners);
    if (owners < 1) {
      setError("Number of owners must be at least 1.");
      return;
    }

    setLoading(true);
    try {
      await createSellListing({
        model: model.trim(),
        year: y,
        no_of_owners: owners,
        insurance_available: insuranceAvailable === "yes",
        finance_hypothecation: financeHypothecation === "yes",
        original_rc_available: originalRcAvailable === "yes",
      });

      if (user) {
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
            <h2 style="color: #1e293b; margin-top: 0;">Listing Request Received</h2>
            <p style="color: #475569; line-height: 1.6;">Hi <strong>${user.name}</strong>,<br>Thank you for choosing Bike-Lo. We've received your request to list your bike.</p>
            <table width="100%" cellpadding="10" cellspacing="0" style="margin: 20px 0; border-collapse: collapse;">
              <tr>
                <td style="border: 1px solid #e2e8f0; color: #64748b; font-weight: bold; width: 35%;">Vehicle Model</td>
                <td style="border: 1px solid #e2e8f0; color: #1e293b; font-weight: bold;">${model.trim()} (${y})</td>
              </tr>
              <tr>
                <td style="border: 1px solid #e2e8f0; color: #64748b; font-weight: bold;">Status</td>
                <td style="border: 1px solid #e2e8f0; color: #10b981; font-weight: bold;">Pending Verification</td>
              </tr>
            </table>
            <p style="color: #475569;">We will review your submission and contact you shortly.</p>
            <br>
            <center>
              <a href="https://bike-lo.com/profile" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">Track My Listing</a>
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
            <span style="color: #ffffff; float: right; font-size: 14px; font-weight: bold; margin-top: 6px;">SELL REQUEST 🚨</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #1e293b; margin-top: 0;">New Seller Lead Alert</h2>
            
            <p style="color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 12px; margin-top: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Seller Information</p>
            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Name</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${user.name}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Email</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${user.email}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Phone</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${user.phone || "Not provided"}</td></tr>
            </table>

            <p style="color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 12px; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Vehicle Details</p>
            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Model</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${model.trim()}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Year</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${y}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Owners</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${owners}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Insurance</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${insuranceAvailable}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Finance</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${financeHypothecation}</td></tr>
              <tr><td style="color: #64748b; width: 140px; border-bottom: 1px solid #f1f5f9;">Original RC</td><td style="color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${originalRcAvailable}</td></tr>
            </table>

            <br><center style="margin-top:20px;">
              <a href="https://bike-lo.com/admin/dashboard" style="background-color: #1e293b; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; font-size: 14px;">Open Admin Dashboard</a>
            </center>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();

        await bookBikeLeadApi({
          email: user.email,
          subject: "Bike Sell Request - BikeLo",
          "UserHTML": userHtml,
          "AdminHTML": adminHtml
        });
      }

      setSuccess(true);
      setModel("");
      setYear("");
      setNoOfOwners(1);
      setInsuranceAvailable("no");
      setFinanceHypothecation("no");
      setOriginalRcAvailable("no");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit listing.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle style={{ fontFamily: "'Noto Serif', serif" }}>Sell Your Bike</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Please log in to submit your bike for sale.</p>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen pt-20 pb-20 bg-transparent px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl space-y-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Sell Your Bike
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Fill in the details below to list your bike for sale. Our experts will review your submission promptly.
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200">
              Your listing has been submitted successfully.
            </div>
          )}

          <Card className="bg-neutral-900/50 dark:bg-gray-900/40 backdrop-blur-md border-[#f7931e]/20 shadow-2xl overflow-hidden ring-1 ring-white/5">
            <CardHeader className="pb-8 border-b border-white/5">
              <CardTitle className="text-3xl flex items-center gap-3 text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <div className="bg-[#f7931e] rounded-full p-1.5 shadow-lg shadow-orange-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Bike Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="model" className="text-sm font-medium text-gray-400">Model</Label>
                    <Input
                      id="model"
                      type="text"
                      placeholder="e.g. Activa 6G, Classic 350"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="bg-[#111827] border-gray-700 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all h-11"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="year" className="text-sm font-medium text-gray-400 min-h-[1.5rem] flex items-end pb-1">Year</Label>
                      <Select
                        id="year"
                        value={year === "" ? "" : String(year)}
                        onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full bg-[#111827] border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all outline-none h-11 px-3"
                        required
                      >
                        <option value="" className="bg-[#111827]">Select year</option>
                        {yearOptions.map((y) => (
                          <option key={y} value={y} className="bg-[#111827]">
                            {y}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="noOfOwners" className="text-sm font-medium text-gray-400 min-h-[1.5rem] flex items-end pb-1">No. of owners</Label>
                      <Input
                        id="noOfOwners"
                        type="number"
                        min={1}
                        value={noOfOwners === "" ? "" : noOfOwners}
                        onChange={(e) =>
                          setNoOfOwners(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))
                        }
                        className="bg-[#111827] border-gray-700 text-white focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col space-y-2">
                      <Label className="text-sm font-medium text-gray-400 min-h-[2.5rem] flex items-end pb-1">Insurance Available</Label>
                      <Select
                        value={insuranceAvailable}
                        onChange={(e) => setInsuranceAvailable(e.target.value as "yes" | "no")}
                        className="w-full bg-[#111827] border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all h-11 px-3"
                      >
                        <option value="no" className="bg-[#111827]">No</option>
                        <option value="yes" className="bg-[#111827]">Yes</option>
                      </Select>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label className="text-sm font-medium text-gray-400 min-h-[2.5rem] flex items-end pb-1">Finance</Label>
                      <Select
                        value={financeHypothecation}
                        onChange={(e) => setFinanceHypothecation(e.target.value as "yes" | "no")}
                        className="w-full bg-[#111827] border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all h-11 px-3"
                      >
                        <option value="no" className="bg-[#111827]">No</option>
                        <option value="yes" className="bg-[#111827]">Yes</option>
                      </Select>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label className="text-sm font-medium text-gray-400 min-h-[2.5rem] flex items-end pb-1">Original RC Available</Label>
                      <Select
                        value={originalRcAvailable}
                        onChange={(e) => setOriginalRcAvailable(e.target.value as "yes" | "no")}
                        className="w-full bg-[#111827] border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-all h-11 px-3"
                      >
                        <option value="no" className="bg-[#111827]">No</option>
                        <option value="yes" className="bg-[#111827]">Yes</option>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-7 text-lg font-bold rounded-xl transition-all duration-300 bg-[#059669] hover:bg-[#10b981] text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 active:scale-[0.98]"
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Submitting...
                      </div>
                    ) : "List My Bike"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setError(null);
                      setSuccess(false);
                      setModel("");
                      setYear("");
                      setNoOfOwners(1);
                    }}
                    className="py-7 px-8 border-gray-700 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-semibold"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Contact Support for Selling */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>Need help selling?</h3>
              <p className="text-gray-400 text-sm">Our team is available to assist you with valuation and paperwork.</p>
            </div>
            <a
              href="tel:7396961812"
              className="px-8 py-4 bg-neutral-900 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-neutral-800 transition-all flex items-center gap-3"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Contact Support: 7396961812
            </a>
          </div>


          {/* Trust Messaging Adapted for Selling */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-white/5 pt-12">
            <div className="p-4 group">
              <div className="text-[#059669] mb-3 flex justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-bold mb-2 text-white text-lg">Quick Valuation</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">Get the best market price for your bike within minutes.</p>
            </div>
            <div className="p-4 group">
              <div className="text-[#059669] mb-3 flex justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold mb-2 text-white text-lg">Instant Payment</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">Fast and secure payment directly to your bank account.</p>
            </div>
            <div className="p-4 group">
              <div className="text-[#059669] mb-3 flex justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="font-bold mb-2 text-white text-lg">Full Support</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">We handle all the paperwork and RC transfer for you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
