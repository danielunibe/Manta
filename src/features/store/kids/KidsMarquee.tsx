import React from 'react';

export const KidsMarquee: React.FC = () => {
  return (
    <div
      id="kids-marquee-strip"
      className="my-6 border-y border-white/10 py-3 overflow-hidden select-none"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)'
      }}
    >
      <div className="inline-flex whitespace-nowrap animate-marquee">
        <span className="font-['Fraunces',Georgia,serif] italic text-base sm:text-lg text-[#d8d2c6] flex items-center">
          <span>¡Guaf!</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Raincoat amarillo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Paraguas rojo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Botas amarillas suela roja</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Gorro con cinta roja</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Amigo amarillo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>¡Guaf!</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Raincoat amarillo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Paraguas rojo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Botas amarillas suela roja</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Gorro con cinta roja</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Amigo amarillo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
        </span>

        <span
          aria-hidden="true"
          className="font-['Fraunces',Georgia,serif] italic text-base sm:text-lg text-[#d8d2c6] flex items-center"
        >
          <span>¡Guaf!</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Raincoat amarillo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Paraguas rojo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Botas amarillas suela roja</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Gorro con cinta roja</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Amigo amarillo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>¡Guaf!</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Raincoat amarillo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Paraguas rojo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Botas amarillas suela roja</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Gorro con cinta roja</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
          <span>Amigo amarillo</span>
          <b className="text-[#f2c14e] font-normal px-3.5">✦</b>
        </span>
      </div>
    </div>
  );
};
