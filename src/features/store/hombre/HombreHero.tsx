import React from 'react';
import { HOMBRE_IMAGES } from './hombreData';

export const HombreHero: React.FC = () => {
  return (
    <header className="space-y-10">
      {/* Masthead */}
      <div className="pt-6 pb-2 text-center">
        <div className="font-['Fraunces',Georgia,serif] font-bold text-3xl sm:text-4xl md:text-5xl text-[#ece7de] tracking-tight">
          Manta
          <span className="text-[#f2c14e] text-2xl sm:text-3xl align-top ml-1">✦</span>
          <span className="text-[#93a0ac] font-normal mx-2.5">/</span>
          <span className="italic text-[#f2c14e]">Hombre</span>
        </div>
        <div className="mt-2.5 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] sm:text-[11px] tracking-[0.28em] text-[#93a0ac] uppercase">
          CATÁLOGO N°05 — 31 PIEZAS · 6 CATEGORÍAS · TEMPORADA DE LLUVIA
        </div>
      </div>

      {/* Portada Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-14 items-center">
        {/* Left Column: Editorial Text */}
        <div className="space-y-5">
          <span className="inline-block bg-[#f2c14e] text-[#141414] font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.22em] font-bold px-3 py-1.5 rounded-sm">
            EDITORIAL LLUVIA · HOMBRE 05
          </span>

          <h1 className="font-['Fraunces',Georgia,serif] font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.98] text-[#ece7de] tracking-tight">
            Él bajo la <em className="block italic text-[#f2c14e] not-italic">lluvia</em>
          </h1>

          <p className="text-[#93a0ac] text-sm sm:text-base leading-relaxed max-w-lg font-['Space_Grotesk',system-ui,sans-serif]">
            El gran catálogo masculino con probador digital fotográfico: seis propuestas de outfit reales,
            mochilas de propuesta y accesorios con carácter. Treinta y una piezas, un solo camino mojado.
          </p>

          <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] sm:text-[11px] tracking-[0.24em] text-[#93a0ac]">
            <b className="text-[#f2c14e] font-normal">31</b> PRENDAS &nbsp;·&nbsp;{' '}
            <b className="text-[#f2c14e] font-normal">6</b> OUTFITS &nbsp;·&nbsp;{' '}
            <b className="text-[#f2c14e] font-normal">5</b> MOCHILAS &nbsp;·&nbsp;{' '}
            <b className="text-[#f2c14e] font-normal">10</b> ACCESORIOS
          </div>

          {/* 4-Color Stripe */}
          <div className="h-1 flex max-w-md rounded-full overflow-hidden">
            <i className="flex-1 bg-[#a63a2b]" />
            <i className="flex-1 bg-[#f2c14e]" />
            <i className="flex-1 bg-[#2f8f8a]" />
            <i className="flex-1 bg-[#ece7de]" />
          </div>
        </div>

        {/* Right Column: Hero Image Frame */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[400px] sm:min-h-[460px] bg-[#10151c] shadow-2xl">
          <img
            src={HOMBRE_IMAGES.hombre}
            alt="Hombre con sobretodo camel y paraguas borgoña"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />

          {/* Vignette & Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080a0e]/40 via-transparent to-[#080a0e]/90 pointer-events-none" />

          {/* Editorial Stamp */}
          <div className="absolute top-4 right-4 rotate-6 border border-[#f2c14e] text-[#f2c14e] font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.2em] leading-tight px-3 py-2 text-center rounded-sm bg-[#0a0d12]/50 backdrop-blur-md">
            HOMBRE<br />
            EDICIÓN · 05
          </div>

          {/* Foot Info */}
          <div className="absolute left-0 right-0 bottom-0 p-5 sm:p-6 flex justify-between items-end gap-3 z-10">
            <div>
              <div className="font-['Fraunces',Georgia,serif] font-bold text-2xl sm:text-3xl text-[#ece7de] leading-none">
                Sobretodo <em className="italic text-[#f2c14e]">camel</em>
              </div>
            </div>
            <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.24em] text-[#ece7de]/80 text-right leading-relaxed">
              MANTA · NORTE · TERRA<br />
              BRUMA · LLUVIA LAB
            </div>
          </div>

          {/* Bottom Edge Stripe */}
          <div className="absolute left-0 right-0 bottom-0 h-1 flex">
            <i className="flex-1 bg-[#a63a2b]" />
            <i className="flex-1 bg-[#f2c14e]" />
            <i className="flex-1 bg-[#2f8f8a]" />
            <i className="flex-1 bg-[#ece7de]" />
          </div>
        </div>
      </section>
    </header>
  );
};
