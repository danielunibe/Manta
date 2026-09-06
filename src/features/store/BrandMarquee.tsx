import React from 'react';
import { BRANDS_LIST } from './storeData';

export const BrandMarquee: React.FC = () => {
  return (
    <div
      id="brand-marquee-section"
      className="col-span-1 md:col-span-2 py-4 flex flex-col justify-between border-y border-white/10 my-1"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] uppercase text-[#2f8f8a] font-semibold">
          SELECCIÓN DE LA EDICIÓN
        </span>
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.2em] uppercase text-white/50">
          LECTURA DE TEMPORADA
        </span>
      </div>

      {/* Marquee ticker directly on background */}
      <div className="relative overflow-hidden py-2">
        <div className="flex w-max animate-marquee space-x-6 items-center whitespace-nowrap">
          {/* Double list for smooth seamless loop */}
          {[...BRANDS_LIST, ...BRANDS_LIST].map((brand, idx) => (
            <span
              key={`${brand}-${idx}`}
              className="inline-flex items-center gap-6 font-['Fraunces',Georgia,serif] text-xl sm:text-2xl font-bold text-[#ece7de]/80 hover:text-[#f2c14e] transition-colors"
            >
              <span style={{ textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>{brand}</span>
              <span className="text-[#f2c14e] text-xs font-serif">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between text-[9px] font-['Spline_Sans_Mono',ui-monospace,monospace] tracking-[0.2em] text-white/40 uppercase">
        <span>Diseño independiente colombiano & mexicano</span>
        <span className="text-[#f2c14e]">Tallas S a XL</span>
      </div>
    </div>
  );
};
