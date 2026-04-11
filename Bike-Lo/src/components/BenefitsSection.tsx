export default function BenefitsSection() {
  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Verified Machines",
      description: "Every unit undergoes a 75-point precision diagnostic and certification process.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Seamless Finance",
      description: "Exclusive acquisition rates with ultra-low down payment and instant approval.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Certified Protection",
      description: "Comprehensive 6-month engine and components warranty for complete peace of mind.",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Buyback",
      description: "Guaranteed buyback pricing within the first 12 months of ownership.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 hover:border-[#f7931e]/40 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(247,147,30,0.1)]"
        >
          {/* Subtle icon container */}
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center text-[#f7931e] mb-6 group-hover:bg-[#f7931e] group-hover:text-white transition-all duration-500 shadow-xl">
            {benefit.icon}
          </div>
          
          <h3
            className="text-xl font-black italic tracking-tight text-white uppercase mb-3 leading-none"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            {benefit.title}
          </h3>
          <p className="text-sm text-neutral-500 font-medium leading-relaxed">
            {benefit.description}
          </p>

          {/* Hover indicator */}
          <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
             <div className="w-6 h-0.5 bg-[#f7931e]" />
          </div>
        </div>
      ))}
    </div>
  );
}

