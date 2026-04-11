import SellForm from "@/components/SellForm";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Insurance() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2 -ml-2 text-muted-foreground hover:text-[#f7931e]">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold tracking-widest text-[10px] uppercase">Verified Service</span>
          </div>
        </div>

        {/* Hero Section for Insurance */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-4"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Get Your Vehicle Insured
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Protect your ride with comprehensive coverage and the best rates. 
            Fill in your details below and our team will get back to you with the perfect plan.
          </p>
        </div>

        {/* Form Container (Removed white card to blend with dark bg) */}
        <div className="rounded-2xl shadow-2xl">
          <SellForm />
        </div>

        {/* Trust Messaging */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-white/5 pt-12">
          <div className="p-4 group">
            <div className="text-emerald-500 mb-3 flex justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-bold mb-2 text-white text-lg">Quick Approval</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">Insurance policy approved within hours, not days.</p>
          </div>
          <div className="p-4 group">
             <div className="text-emerald-500 mb-3 flex justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold mb-2 text-white text-lg">Best Premiums</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">Competitive rates through top-tier partnerships.</p>
          </div>
          <div className="p-4 group">
             <div className="text-emerald-500 mb-3 flex justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className="font-bold mb-2 text-white text-lg">Full Support</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">Dedicated assistance for all your claims and queries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
