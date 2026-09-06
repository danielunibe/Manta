import React from 'react';

export const HombreQuoteStrip: React.FC = () => {
  return (
    <div className="mt-16 border-y border-white/10 py-10 px-4 text-center space-y-3">
      <p className="font-['Fraunces',Georgia,serif] italic text-xl sm:text-2xl md:text-3xl text-[#e6dfd2] max-w-3xl mx-auto leading-relaxed">
        “Un buen abrigo dura <b className="text-[#f2c14e] font-normal not-italic">diez inviernos</b>. Una buena
        mochila, toda la tormenta.”
      </p>
      <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.24em] text-[#93a0ac] uppercase">
        MANTA HOMBRE · EDITORIAL 05
      </span>
    </div>
  );
};
