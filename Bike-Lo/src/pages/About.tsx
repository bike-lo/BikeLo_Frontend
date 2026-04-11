export default function About() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <h1
          className="text-4xl font-bold text-black dark:text-white mb-2"
          style={{ fontFamily: "'Noto Serif', serif" }}
        >
          About Bike-Lo
        </h1>
        <p className="text-muted-foreground mb-10">
          India’s trusted omni-channel platform for two-wheelers
        </p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Bike-Lo is a trusted omni-channel platform built to transform the way India buys, sells,
            and maintains two-wheelers.
          </p>

          <p>
            Founded with a vision to create an honest, transparent, and stress-free mobility
            ecosystem, Bike-Lo was born from real market experience and a deep understanding of
            customer challenges. We eliminate hidden costs, unclear documentation, and unreliable
            vehicles by offering verified products, fair pricing, and complete end-to-end support.
          </p>

          <p>
            Starting with a small team and strong determination, we grew by putting customers first,
            personally inspecting every vehicle, and delivering consistent quality. Today, Bike-Lo
            offers verified vehicles, digital solutions, finance, insurance, servicing, and
            accessories — all under one roof.
          </p>

          <p>
            Driven by trust, powered by technology, and guided by strong values, we are building
            India’s most reliable two-wheeler ecosystem for working families and everyday riders.
          </p>

          <p>
            At Bike-Lo, we don’t just deliver bikes — we deliver confidence, peace of mind, and
            joy.
          </p>

          <p
            className="text-xl font-semibold text-black dark:text-white pt-4"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Bike-Lo — Happiness, Home Delivered.
          </p>
        </div>

        {/* New Locations Section */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h2
            className="text-3xl font-bold text-black dark:text-white mb-8"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Visit Our Hubs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg">
              <h3 className="text-xl font-bold mb-2">BikeLo.com</h3>
              <p className="text-muted-foreground text-sm mb-4">P 230 kistamma enclave, Old Alwal, Hyderabad, Telangana 500010</p>
              <a 
                href="https://maps.app.goo.gl/76waTVzyVEZaxLJ17" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#f7931e] font-semibold flex items-center gap-2 hover:underline"
              >
                View on Maps 
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg">
              <h3 className="text-xl font-bold mb-2">SSV MULTIBRAND SERVICE</h3>
              <p className="text-muted-foreground text-sm mb-4">HT Rd, Citizen Colony, Old Alwal, Secunderabad, Telangana 500010</p>
              <a 
                href="https://maps.app.goo.gl/eLAUFUBYir1qJhhT7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#f7931e] font-semibold flex items-center gap-2 hover:underline"
              >
                View on Maps
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg">
              <h3 className="text-xl font-bold mb-2">GEARUP VOC</h3>
              <p className="text-muted-foreground text-sm mb-4">opposite Cotton bazar, Old Bowenpally, Hyderabad, Secunderabad, Telangana 500009</p>
              <a 
                href="https://maps.app.goo.gl/oTqjDt6Hjs8kp84w7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#f7931e] font-semibold flex items-center gap-2 hover:underline"
              >
                View on Maps
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
