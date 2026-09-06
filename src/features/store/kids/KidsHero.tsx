import React from 'react';
import { KIDS_IMAGES } from '../storeData';

interface KidsHeroProps {
  onExploreCatalog?: () => void;
}

export const KidsHero: React.FC<KidsHeroProps> = ({ onExploreCatalog }) => {
  return (
    <section id="kids-hero" className="relative space-y-8 pt-2 select-none">
      {/* Masthead Kids Header */}
      <header className="text-center pt-2 pb-1">
        <div className="font-['Fraunces',Georgia,serif] font-bold text-3xl sm:text-4xl text-[#ece7de] flex items-center justify-center">
          <span>Manta</span>
          <span className="text-[#f2c14e] text-2xl align-top ml-1">✦</span>
          <span className="text-[#93a0ac] font-normal mx-2.5">/</span>
          <span className="italic text-[#f2c14e]">Kids</span>
        </div>
        <div className="mt-2 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.3em] uppercase text-[#93a0ac]">
          COLECCIÓN BEAGLE · KIDS — PELUCHE 3D BAJO LA LLUVIA
        </div>
      </header>

      {/* Portada Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-12 items-center">
        {/* Left Column: Text & Editorial Narrative */}
        <div className="space-y-4">
          <span className="inline-block bg-[#f2c14e] text-[#141414] font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.22em] px-2.5 py-1.5 font-bold uppercase rounded-sm shadow-sm">
            COLECCIÓN KIDS · LOOK BEAGLE
          </span>

          <h1 className="font-['Fraunces',Georgia,serif] font-bold text-4xl sm:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.01em] text-[#ece7de]">
            Charcos y <em className="italic text-[#f2c14e] font-normal not-italic block sm:inline">ladridos</em>
          </h1>

          <p className="font-['Space_Grotesk',system-ui,sans-serif] text-sm sm:text-base text-[#93a0ac] max-w-xl leading-relaxed">
            Implementada fiel a la referencia: estilo peluche 3D cinematográfico, raincoat amarillo brillante con botones rojos, gorro con ribete rojo, botas amarillas de suela roja y el pequeño amigo amarillo sosteniendo el paraguas rojo sobre el asfalto mojado.
          </p>

          <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] text-[#93a0ac] uppercase">
            <b className="text-[#f2c14e] font-normal">12</b> PIEZAS &nbsp;·&nbsp;{' '}
            <b className="text-[#f2c14e] font-normal">5</b> CATEGORÍAS &nbsp;·&nbsp;{' '}
            <b className="text-[#f2c14e] font-normal">1</b> PARAGUAS ROJO
          </p>

          {/* 4-Color Stripe */}
          <div className="h-1 flex max-w-md rounded-full overflow-hidden shadow-sm">
            <i className="flex-1 bg-[#c0392b]" />
            <i className="flex-1 bg-[#f2c14e]" />
            <i className="flex-1 bg-[#9cc3e8]" />
            <i className="flex-1 bg-[#8fbf6a]" />
          </div>

          {onExploreCatalog && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onExploreCatalog}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f2c14e] text-black font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs font-bold tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#f2c14e]/20"
              >
                <span>Explorar Catálogo Beagle</span>
                <span>↓</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Beagle 3D Hero Portrait */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[380px] sm:min-h-[460px] bg-[#0c1016] shadow-2xl group">
          <img
            src={KIDS_IMAGES.beaglePortada}
            alt="Beagle peluche 3D con raincoat amarillo y gorro rojo caminando bajo la lluvia, amigo amarillo con paraguas rojo"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out pointer-events-none"
          />

          {/* Speech Bubble "¡GUAF!" */}
          <div className="absolute top-5 left-5 z-20 bg-[#f7f3ea] text-[#141414] rounded-2xl px-3.5 py-2 font-['Spline_Sans_Mono',ui-monospace,monospace] font-bold text-xs tracking-wider shadow-lg shadow-black/40 flex items-center gap-1.5 animate-pulse">
            <span>¡GUAF!</span>
            <span className="text-sm">🐾</span>
            <div className="absolute -bottom-1.5 left-5 w-3 h-3 bg-[#f7f3ea] rotate-45 rounded-[2px]" />
          </div>

          {/* Stamp Badge */}
          <div className="absolute top-5 right-5 rotate-6 border border-[#c0392b] text-[#ffd9d2] font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.2em] leading-relaxed px-3 py-1.5 text-center rounded bg-[#c0392b]/70 backdrop-blur-sm z-20 shadow-md">
            KIDS
            <br />
            BEAGLE · 06
          </div>

          {/* Bottom Stripe on Image */}
          <div className="absolute left-0 right-0 bottom-0 h-1.5 flex overflow-hidden z-20">
            <i className="flex-1 bg-[#c0392b]" />
            <i className="flex-1 bg-[#f2c14e]" />
            <i className="flex-1 bg-[#9cc3e8]" />
            <i className="flex-1 bg-[#8fbf6a]" />
          </div>
        </div>
      </div>
    </section>
  );
};
