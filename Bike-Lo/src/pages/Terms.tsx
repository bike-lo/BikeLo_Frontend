import { useEffect } from "react";

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-lg">
            Bike-Lo (bike-lo.com)
          </p>
          <div className="w-20 h-1 bg-[#f7931e] mx-auto mt-6"></div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-12 shadow-sm space-y-10">
          <section className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Welcome to Bike-Lo. By accessing or using our website, purchasing a vehicle, spare parts, accessories, or using our services, you agree to comply with the following terms and conditions.
            </p>
          </section>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">1</span>
                General
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>Bike-Lo is an omni-channel platform offering pre-owned motorcycles, scooters, spare parts, accessories, and vehicle services. All transactions conducted through Bike-Lo are subject to these terms and applicable laws of India.</p>
                <p>Bike-Lo reserves the right to modify or update these terms at any time without prior notice.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">2</span>
                Vehicle Sales
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>All vehicles sold by Bike-Lo are pre-owned vehicles and are inspected before sale. Customers are advised to verify the vehicle condition and documents before purchase.</p>
                <p>Bike-Lo ensures transparency in the vehicle evaluation process; however, normal wear and tear associated with used vehicles is expected.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">3</span>
                RC Transfer
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>Vehicle ownership transfer (RC Transfer) will be initiated after completion of the sale.</p>
                <p>The RC transfer process may take 45 to 120 days, depending on RTO procedures and documentation provided by the buyer and seller.</p>
                <p>Customers must cooperate in providing necessary documents required for the transfer process.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">4</span>
                Warranty Policy
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>Certain vehicles sold by Bike-Lo may come with a limited engine warranty of up to 6 months, covering only specific internal engine components.</p>
                <p className="font-semibold text-black dark:text-white">The warranty does not cover:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Accident damage</li>
                  <li>Electrical components</li>
                  <li>Consumable parts</li>
                  <li>Damage due to negligence or improper maintenance</li>
                </ul>
                <p>Warranty claims are subject to inspection by the Bike-Lo service team.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">5</span>
                Assured Buyback Program
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>Bike-Lo may offer an Assured Buyback Assurance on selected vehicles.</p>
                <p>Under this program, customers may be eligible to sell the vehicle back to Bike-Lo for 65% to 70% of the purchase value, subject to:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Vehicle condition</li>
                  <li>Usage</li>
                  <li>Proper documentation</li>
                  <li>No major accident or structural damage</li>
                </ul>
                <p>Final valuation will be determined by Bike-Lo after inspection.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">6</span>
                Spare Parts & Accessories
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>Bike-Lo sells spare parts and accessories sourced from trusted suppliers. While we aim to provide quality products, availability and compatibility may vary depending on the vehicle model.</p>
                <p>Customers should ensure the correct fitment for their vehicle before purchase.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">7</span>
                Service & Maintenance
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>Service work performed at Bike-Lo service centers will be carried out by trained technicians. However, Bike-Lo will not be responsible for any issues arising due to pre-existing mechanical conditions or misuse of the vehicle.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">8</span>
                Payments
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>All payments must be made through approved payment methods such as bank transfer, UPI, or other authorized payment channels.</p>
                <p>Bike-Lo reserves the right to cancel any transaction in case of payment discrepancies or fraudulent activity.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">9</span>
                Limitation of Liability
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>Bike-Lo shall not be held liable for any indirect, incidental, or consequential damages arising from the use of vehicles, spare parts, accessories, or services purchased through the platform.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f7931e]/10 text-[#f7931e] text-sm">10</span>
                Governing Law
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed pl-11">
                <p>All disputes arising from transactions with Bike-Lo shall be subject to the jurisdiction of courts in Hyderabad, Telangana, India.</p>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Last updated: April 2024</p>
          <p className="mt-2">If you have any questions regarding these terms, please contact us at support@bike-lo.com</p>
        </div>
      </div>
    </div>
  );
}
