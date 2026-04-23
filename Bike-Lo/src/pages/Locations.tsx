import { MapPin, ExternalLink, Clock, Phone } from "lucide-react";

const hubLocations = [
  {
    name: "BikeLo Hub (Old Alwal)",
    mapUrl: "https://maps.app.goo.gl/76waTVzyVEZaxLJ17",
    area: "Old Alwal, Hyderabad",
    description:
      "Visit this hub for test rides, bike inspections, and in-person assistance with buying or selling.",
  },
  {
    name: "SSV Multibrand Hub",
    mapUrl: "https://maps.app.goo.gl/eLAUFUBYir1qJhhT7",
    area: "Hyderabad",
    description:
      "A multibrand support location for browsing available bikes and getting help from the Bike-Lo team.",
  },
  {
    name: "GearUp VOC Hub",
    mapUrl: "https://maps.app.goo.gl/oTqjDt6Hjs8kp84w7",
    area: "Hyderabad",
    description:
      "Use this hub for vehicle checks, consultation, and a closer look at Bike-Lo inventory and services.",
  },
];

export default function Locations() {
  return (
    <div className="min-h-screen px-4 pt-28 pb-16">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[32px] border border-black/10 bg-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/60">
          <div className="border-b border-black/5 bg-[linear-gradient(135deg,rgba(247,147,30,0.18),rgba(255,255,255,0.35))] px-6 py-12 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(247,147,30,0.22),rgba(23,23,23,0.4))] md:px-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f7931e]/25 bg-[#f7931e]/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#f7931e]">
              <MapPin className="h-4 w-4" />
              Hub Locations
            </p>
            <h1
              className="max-w-3xl text-4xl font-bold tracking-tight text-black dark:text-white md:text-5xl"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Find a Bike-Lo hub near you
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700 dark:text-neutral-300">
              These are the three Bike-Lo hub locations currently listed in the footer. Use the map links to open directions and visit the nearest location.
            </p>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-3 md:p-10">
            {hubLocations.map((location) => (
              <article
                key={location.name}
                className="group rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-neutral-900/80"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-[#f7931e]/12 p-3 text-[#f7931e]">
                  <MapPin className="h-6 w-6" />
                </div>

                <h2
                  className="text-2xl font-bold text-black dark:text-white"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  {location.name}
                </h2>

                <p className="mt-3 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                  <MapPin className="h-4 w-4" />
                  {location.area}
                </p>

                <p className="mt-4 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                  {location.description}
                </p>

                <div className="mt-6 space-y-3 rounded-2xl bg-black/[0.03] p-4 dark:bg-white/[0.04]">
                  <p className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <Clock className="h-4 w-4 text-[#f7931e]" />
                    Open for visits and support inquiries
                  </p>
                  <p className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <Phone className="h-4 w-4 text-[#f7931e]" />
                    Contact Bike-Lo: 7396961812
                  </p>
                </div>

                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f7931e] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#e6851a]"
                >
                  Open in Maps
                  <ExternalLink className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
