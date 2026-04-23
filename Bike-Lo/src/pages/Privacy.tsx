import { useEffect } from "react";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Bike-Lo (bike-lo.com)
          </p>
          <p className="text-sm text-gray-500 mt-2">Last Updated: April 2026</p>
          <div className="w-20 h-1 bg-[#f7931e] mx-auto mt-6"></div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-12">
          {/* Introduction */}
          <section className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              This Privacy Policy describes how Bikezlo Motorrad India LLP, operating Bike-Lo, collects, uses, and protects user information when accessing the website or mobile application. By using the Bike-Lo platform, you consent to the collection and use of information as described in this policy.
            </p>
          </section>

          {/* Privacy Policy Sections */}
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">1</span>
                Information We Collect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-11">
                <div className="space-y-3">
                  <h3 className="font-bold text-[#f7931e]">Personal Information</h3>
                  <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                    <li>• Name</li>
                    <li>• Phone number</li>
                    <li>• Email address</li>
                    <li>• Address</li>
                    <li>• Identity verification</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-[#f7931e]">Transaction Info</h3>
                  <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                    <li>• Vehicle purchase details</li>
                    <li>• Service history</li>
                    <li>• Payment information</li>
                    <li>• Buyback requests</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-[#f7931e]">Technical Info</h3>
                  <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                    <li>• Device type</li>
                    <li>• IP address</li>
                    <li>• Browser information</li>
                    <li>• App usage analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">2</span>
                How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>Your information may be used for processing vehicle purchases, providing service updates, customer support, fraud prevention, and improving platform performance.</p>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border-l-4 border-[#f7931e]">
                  <p className="text-sm font-medium">Bike-Lo may also send offers, promotions, and service reminders through WhatsApp, SMS, email, or phone calls.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">3</span>
                Information Sharing
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                Bike-Lo may share information with payment gateways, logistics partners, inspection agencies, and government authorities when legally required. <span className="font-bold text-black dark:text-white">Bike-Lo does not sell personal user data to third parties.</span>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">4</span>
                Data Protection
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                We implement secure servers, access control systems, and data encryption. However, no internet transmission is 100% secure, and Bike-Lo cannot guarantee absolute security.
              </p>
            </section>
          </div>

          {/* Policy Separator */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-12">
            <h2 className="text-3xl font-bold mb-8 text-black dark:text-white text-center" style={{ fontFamily: "'Noto Serif', serif" }}>
              Refund & Cancellation Policy
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold mb-4 text-[#f7931e]">Vehicle Purchases</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Due to the nature of pre-owned vehicles, all sales are generally final once delivery is completed. Cancellation requests may be considered only before vehicle delivery and may be subject to administrative charges.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold mb-4 text-[#f7931e]">Spare Parts & Accessories</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Returns accepted within 48 hours only if product is defective or incorrect. Products must be unused and in original packaging.
                </p>
              </div>
            </div>
          </div>

          {/* Seller Terms Section */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-12">
            <h2 className="text-3xl font-bold mb-8 text-black dark:text-white text-center" style={{ fontFamily: "'Noto Serif', serif" }}>
              Seller Terms & Conditions
            </h2>
            <div className="bg-[#f7931e]/5 rounded-2xl p-6 md:p-8 space-y-6">
              <p className="text-gray-700 dark:text-gray-300">Individuals selling vehicles to Bike-Lo agree that they are the legal owner and the vehicle is not stolen or disputed.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f7931e]"></span>
                  Legal Ownership
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f7931e]"></span>
                  Genuine Documents
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f7931e]"></span>
                  Disclose Accident History
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f7931e]"></span>
                  Insurance Details
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">Failure to disclose accurate information may result in legal liability. Bike-Lo reserves the right to reject vehicles.</p>
            </div>
          </div>
          {/* Disclaimer Section */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-12">
            <h2 className="text-3xl font-bold mb-8 text-black dark:text-white text-center" style={{ fontFamily: "'Noto Serif', serif" }}>
              Disclaimer
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
                Bike-Lo acts as a facilitator for used vehicle transactions. All information provided on the website is for informational purposes only. We strive for accuracy but do not guarantee that vehicle specifications, availability, or prices are always up-to-date.
              </p>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-12 text-center">
            <h2 className="text-2xl font-bold mb-6 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
              Contact Details
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p className="font-bold text-black dark:text-white">Bikezlo Motorrad India LLP</p>
              <p>H No P-230, Kistamma Enclave</p>
              <p>Old Alwal, Hyderabad, Telangana – India</p>
              <p className="pt-4 text-[#f7931e] font-medium">Customer Support available through official website and mobile application.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
