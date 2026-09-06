import React from 'react';

export const KidsQuoteStrip: React.FC = () => {
  return (
    <div
      id="kids-quote-strip"
      className="my-12 border-y border-white/10 py-10 px-4 text-center select-none"
    >
      <p className="font-['Fraunces',Georgia,serif] italic text-xl sm:text-2xl md:text-3xl text-[#e6dfd2]">
        “La lluvia no se espera: <b className="text-[#f2c14e] font-normal not-italic font-bold">se ladra</b>.”
      </p>
      <span className="block mt-3 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] text-[#93a0ac] uppercase">
        MANTA KIDS · COLECCIÓN BEAGLE 06 · REFERENCIA PELUCHE 3D
      </span>
    </div>
  );
};
