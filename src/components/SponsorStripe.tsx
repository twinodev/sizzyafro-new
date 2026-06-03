/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PartnerLogo } from "../types";

interface SponsorStripeProps {
  partners: PartnerLogo[];
}

export default function SponsorStripe({ partners }: SponsorStripeProps) {
  if (!partners || partners.length === 0) return null;

  // Duplicate items to ensure smooth wrap-around looping
  const scrollList = [...partners, ...partners, ...partners, ...partners];

  return (
    <div className="w-full bg-slate-900/60 border-y border-slate-800/80 py-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-3">
        <h3 className="text-center font-display text-xs tracking-widest text-slate-500 uppercase font-bold">
          Empowered By Our Dedicated Supporters & Partners
        </h3>
      </div>

      <div className="relative w-full overflow-hidden flex items-center h-20">
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="animate-scroll flex items-center gap-16 select-none shrink-0">
          {scrollList.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex items-center gap-3 shrink-0 h-12 hover:scale-105 transition-transform cursor-pointer"
            >
              <img
                src={partner.logo_url}
                alt={partner.name}
                className="h-10 w-10 object-cover rounded-full border border-slate-700/60"
                referrerPolicy="no-referrer"
              />
              <span className="font-display font-semibold text-slate-300 text-sm tracking-wide">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
