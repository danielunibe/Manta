import React from 'react';

const MARQUEE_ITEMS = [
  'Temporada de lluvia',
  'Ropa para toda la familia',
  'Selección editorial',
  'Envíos a todo el país',
  'Confección responsable',
  'Edición limitada',
  'Curaduría artesanal',
  'Guadalajara & México'
];

export const StoreMarquee: React.FC = () => {
  return (
    <div
      id="store-editorial-marquee"
      className="w-full py-4 sm:py-5 border-y border-white/10 bg-white/[0.02] overflow-hidden select-none"
    >
      <div className="flex w-max animate-marquee space-x-8 items-center whitespace-nowrap">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={`${item}-${idx}`} className="inline-flex items-center gap-8">
            <span className="font-['Fraunces',Georgia,serif] text-base sm:text-lg md:text-xl font-light tracking-wide text-[#ece7de]/85">
              {item}
            </span>
            <span className="text-[#f2c14e] text-xs font-serif">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
