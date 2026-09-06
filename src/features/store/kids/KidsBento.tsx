import React from 'react';
import { KIDS_IMAGES, KIDS_BEAGLE_PRODUCTS } from '../storeData';
import { Product } from '../../../types';
import { tactile } from '../../../utils/tactileFeedback';
import { ArrowDown, Plus } from 'lucide-react';

interface KidsBentoProps {
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onScrollToCatalog?: () => void;
  addedProductId?: string | null;
}

export const KidsBento: React.FC<KidsBentoProps> = ({
  onAddToCart,
  onSelectProduct,
  onScrollToCatalog,
  addedProductId
}) => {
  const pRaincoat = KIDS_BEAGLE_PRODUCTS[0]; // Raincoat Amarillo Beagle ($65)
  const pBoots = KIDS_BEAGLE_PRODUCTS[5];    // Botas Amarillas Suela Roja ($48)
  const pMochila = KIDS_BEAGLE_PRODUCTS[10]; // Mochila Casita Roja ($55)
  const pPeluche = KIDS_BEAGLE_PRODUCTS[11]; // Peluche Beagle Lluvioso ($40)

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    tactile.success();
    onAddToCart(product);
  };

  const handleCardClick = (product: Product) => {
    tactile.selection();
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <section id="kids-bento-section" className="space-y-5 select-none pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.26em] uppercase text-[#e0705c] font-semibold">
            BENTO KIDS · MUNDO BEAGLE
          </span>
          <h2 className="font-['Fraunces',Georgia,serif] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#ece7de] mt-1 leading-tight">
            El paraguas <em className="italic text-[#f2c14e] font-normal not-italic">rojo</em> de la referencia
          </h2>
        </div>
        <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.22em] text-[#93a0ac] sm:text-right max-w-sm uppercase">
          ESTILO PELUCHE 3D · CIELO TORMENTA · ASFALTO MOJADO · TOCA + PARA AÑADIR
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 auto-rows-[96px] sm:auto-rows-[104px]">
        {/* ======================================================== */}
        {/* 1. CARD COMIC: Escena Grande Amigo + Beagle (2 cols x 4 rows) */}
        {/* ======================================================== */}
        <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10151c] sm:col-span-2 sm:row-span-4 min-h-[340px] sm:min-h-[400px] group transition-all duration-300 hover:border-[#f2c14e]/40 shadow-xl">
          <img
            src={KIDS_IMAGES.comicBento}
            alt="Amigo amarillo sosteniendo paraguas rojo sobre el beagle peluche en un charco"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080a0e]/10 via-transparent to-[#080a0e]/90 pointer-events-none" />

          {/* Speech Bubble "¡CHARCOS!" */}
          <div className="absolute top-5 right-5 z-10 bg-[#f7f3ea] text-[#141414] rounded-2xl px-3.5 py-1.5 font-['Spline_Sans_Mono',ui-monospace,monospace] font-bold text-xs tracking-wider shadow-lg shadow-black/50">
            ¡CHARCOS!
            <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-[#f7f3ea] rotate-45 rounded-[2px]" />
          </div>

          {/* Foot caption */}
          <div className="absolute left-0 right-0 bottom-0 p-5 sm:p-6 z-10 space-y-1.5">
            <h3 className="font-['Fraunces',Georgia,serif] font-bold text-2xl sm:text-3xl text-[#ece7de] leading-tight">
              Amarillo y <em className="italic text-[#f2c14e] font-normal not-italic">rojo</em> bajo la lluvia
            </h3>
            <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.24em] text-[#ece7de]/80 uppercase">
              PANEL DE REFERENCIA 3D · PARAGUAS COMPARTIDO · REFLEJO EN EL CHARCO
            </span>
          </div>
        </article>

        {/* ======================================================== */}
        {/* 2. CARD PRODUCT: Raincoat Amarillo Beagle (1 col x 3 rows) */}
        {/* ======================================================== */}
        <article
          onClick={() => handleCardClick(pRaincoat)}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10151c] sm:col-span-1 sm:row-span-3 min-h-[260px] group transition-all duration-300 hover:border-[#f2c14e]/50 cursor-pointer shadow-lg flex flex-col justify-between"
        >
          <img
            src={pRaincoat.image}
            alt={pRaincoat.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a0e]/95 via-transparent to-transparent pointer-events-none" />

          {/* Chip */}
          <span className="relative z-10 m-3 w-fit font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.24em] bg-black/60 backdrop-blur-md border border-[#f2c14e]/60 text-[#f2c14e] rounded-full px-2.5 py-0.5 uppercase">
            ROPA
          </span>

          {/* Info & Add */}
          <div className="relative z-10 p-3.5 flex items-end justify-between gap-2">
            <div>
              <h3 className="font-['Fraunces',Georgia,serif] font-bold text-base text-[#ece7de] leading-tight group-hover:text-[#f2c14e] transition-colors">
                {pRaincoat.name}
              </h3>
              <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.2em] text-[#93a0ac] uppercase mt-0.5">
                BOTONES ROJOS + CAPUCHA
              </span>
              <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs text-[#f2c14e] font-semibold mt-1">
                {pRaincoat.priceFormatted}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => handleAdd(e, pRaincoat)}
              aria-label={`Añadir ${pRaincoat.name}`}
              className="w-8 h-8 rounded-full border border-[#f2c14e] text-[#f2c14e] bg-black/60 hover:bg-[#f2c14e] hover:text-black transition-all flex items-center justify-center shrink-0 cursor-pointer text-base active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </article>

        {/* ======================================================== */}
        {/* 3. CARD PRODUCT: Botas Amarillas Suela Roja (1 col x 3 rows) */}
        {/* ======================================================== */}
        <article
          onClick={() => handleCardClick(pBoots)}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10151c] sm:col-span-1 sm:row-span-3 min-h-[260px] group transition-all duration-300 hover:border-[#f2c14e]/50 cursor-pointer shadow-lg flex flex-col justify-between"
        >
          <img
            src={pBoots.image}
            alt={pBoots.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a0e]/95 via-transparent to-transparent pointer-events-none" />

          {/* Chip */}
          <span className="relative z-10 m-3 w-fit font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.24em] bg-black/60 backdrop-blur-md border border-[#c0392b]/60 text-[#e0705c] rounded-full px-2.5 py-0.5 uppercase">
            CALZADO
          </span>

          {/* Info & Add */}
          <div className="relative z-10 p-3.5 flex items-end justify-between gap-2">
            <div>
              <h3 className="font-['Fraunces',Georgia,serif] font-bold text-base text-[#ece7de] leading-tight group-hover:text-[#f2c14e] transition-colors">
                {pBoots.name}
              </h3>
              <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.2em] text-[#93a0ac] uppercase mt-0.5">
                SUELA ROJA · BRILLO CHARCO
              </span>
              <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs text-[#f2c14e] font-semibold mt-1">
                {pBoots.priceFormatted}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => handleAdd(e, pBoots)}
              aria-label={`Añadir ${pBoots.name}`}
              className="w-8 h-8 rounded-full border border-[#f2c14e] text-[#f2c14e] bg-black/60 hover:bg-[#f2c14e] hover:text-black transition-all flex items-center justify-center shrink-0 cursor-pointer text-base active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </article>

        {/* ======================================================== */}
        {/* 4. CARD TEASER: Catálogo Completo (2 cols x 1 row) */}
        {/* ======================================================== */}
        <div
          onClick={onScrollToCatalog}
          className="relative overflow-hidden rounded-2xl border border-white/10 sm:col-span-2 sm:row-span-1 p-4 px-6 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 hover:border-[#f2c14e]/40 active:scale-[0.99] group shadow-md"
          style={{
            background: 'linear-gradient(90deg, rgba(192,57,43,0.18), rgba(242,193,78,0.08)), #10151c'
          }}
        >
          <span className="font-['Fraunces',Georgia,serif] italic text-base sm:text-lg text-[#ece7de]">
            <b className="text-[#f2c14e] font-normal font-semibold not-italic">12 piezas kids</b> — explora el catálogo completo de la colección
          </span>
          <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#f2c14e] group-hover:text-black flex items-center justify-center text-white transition-colors duration-200 shrink-0">
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. CARD PRODUCT: Mochila Casita Roja (1 col x 3 rows) */}
        {/* ======================================================== */}
        <article
          onClick={() => handleCardClick(pMochila)}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10151c] sm:col-span-1 sm:row-span-3 min-h-[260px] group transition-all duration-300 hover:border-[#f2c14e]/50 cursor-pointer shadow-lg flex flex-col justify-between"
        >
          <img
            src={pMochila.image}
            alt={pMochila.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a0e]/95 via-transparent to-transparent pointer-events-none" />

          {/* Chip */}
          <span className="relative z-10 m-3 w-fit font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.24em] bg-black/60 backdrop-blur-md border border-[#c0392b]/60 text-[#e0705c] rounded-full px-2.5 py-0.5 uppercase">
            MOCHILAS
          </span>

          {/* Info & Add */}
          <div className="relative z-10 p-3.5 flex items-end justify-between gap-2">
            <div>
              <h3 className="font-['Fraunces',Georgia,serif] font-bold text-base text-[#ece7de] leading-tight group-hover:text-[#f2c14e] transition-colors">
                {pMochila.name}
              </h3>
              <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.2em] text-[#93a0ac] uppercase mt-0.5">
                TECHO ROJO · PARCHE BEAGLE
              </span>
              <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs text-[#f2c14e] font-semibold mt-1">
                {pMochila.priceFormatted}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => handleAdd(e, pMochila)}
              aria-label={`Añadir ${pMochila.name}`}
              className="w-8 h-8 rounded-full border border-[#f2c14e] text-[#f2c14e] bg-black/60 hover:bg-[#f2c14e] hover:text-black transition-all flex items-center justify-center shrink-0 cursor-pointer text-base active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </article>

        {/* ======================================================== */}
        {/* 6. CARD PRODUCT: Peluche Beagle Lluvioso (1 col x 3 rows) */}
        {/* ======================================================== */}
        <article
          onClick={() => handleCardClick(pPeluche)}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10151c] sm:col-span-1 sm:row-span-3 min-h-[260px] group transition-all duration-300 hover:border-[#f2c14e]/50 cursor-pointer shadow-lg flex flex-col justify-between"
        >
          <img
            src={pPeluche.image}
            alt={pPeluche.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a0e]/95 via-transparent to-transparent pointer-events-none" />

          {/* Chip */}
          <span className="relative z-10 m-3 w-fit font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.24em] bg-black/60 backdrop-blur-md border border-[#f2c14e]/60 text-[#f2c14e] rounded-full px-2.5 py-0.5 uppercase">
            PELUCHES
          </span>

          {/* Info & Add */}
          <div className="relative z-10 p-3.5 flex items-end justify-between gap-2">
            <div>
              <h3 className="font-['Fraunces',Georgia,serif] font-bold text-base text-[#ece7de] leading-tight group-hover:text-[#f2c14e] transition-colors">
                {pPeluche.name}
              </h3>
              <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.2em] text-[#93a0ac] uppercase mt-0.5">
                RAINCOAT + GORRO AMARILLO
              </span>
              <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs text-[#f2c14e] font-semibold mt-1">
                {pPeluche.priceFormatted}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => handleAdd(e, pPeluche)}
              aria-label={`Añadir ${pPeluche.name}`}
              className="w-8 h-8 rounded-full border border-[#f2c14e] text-[#f2c14e] bg-black/60 hover:bg-[#f2c14e] hover:text-black transition-all flex items-center justify-center shrink-0 cursor-pointer text-base active:scale-90"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </article>

        {/* ======================================================== */}
        {/* 7. CARD PROMO: Código GUAF15 (1 col x 2 rows) */}
        {/* ======================================================== */}
        <article className="relative overflow-hidden rounded-2xl bg-[#f2c14e] border border-[#f2c14e] p-5 flex flex-col justify-center gap-2 sm:col-span-1 sm:row-span-2 shadow-lg text-[#161616]">
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.24em] uppercase text-[#5c4708] font-bold">
            CÓDIGO KIDS
          </span>
          <div className="font-['Fraunces',Georgia,serif] font-bold text-xl sm:text-2xl tracking-wider border-2 border-dashed border-[#161616]/50 rounded-xl py-1.5 px-3 text-center bg-black/5">
            GUAF15
          </div>
          <p className="text-xs text-[#3d3005] leading-snug font-medium">
            −15% en toda la colección Beagle. También en peluches.
          </p>
        </article>

        {/* ======================================================== */}
        {/* 8. CARD ENVÍO: Spinning Circular Badge (1 col x 2 rows) */}
        {/* ======================================================== */}
        <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10151c] sm:col-span-1 sm:row-span-2 flex items-center justify-center p-4 shadow-lg group">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            <svg
              className="w-full h-full animate-[spin_18s_linear_infinite]"
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="circPathKids"
                  d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                />
              </defs>
              <text className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[2.4px] fill-[#93a0ac] uppercase">
                <textPath href="#circPathKids">
                  ENVÍO KIDS GRATIS +$80 · CAMBIOS 30 DÍAS ·
                </textPath>
              </text>
            </svg>
            <span className="absolute text-2xl group-hover:scale-125 transition-transform">
              🐾
            </span>
          </div>
        </article>

        {/* ======================================================== */}
        {/* 9. CARD TIRA CONTINUA: 3 Momentos (2 cols x 2 rows) */}
        {/* ======================================================== */}
        <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10151c] sm:col-span-2 sm:row-span-2 min-h-[160px] group shadow-lg">
          <img
            src={KIDS_IMAGES.tiraEscena}
            alt="Escena continua: salto al charco con botas amarillas, amigo amarillo con paraguas rojo y paseo juntos"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <span className="absolute top-3.5 left-3.5 z-10 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.22em] bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full uppercase text-[#ece7de]">
            ESCENA CONTINUA · 3 MOMENTOS
          </span>
        </article>

        {/* ======================================================== */}
        {/* 10. CARD QUOTE: Proverbio Beagle (2 cols x 1 row) */}
        {/* ======================================================== */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10151c] sm:col-span-2 sm:row-span-1 px-6 py-4 flex items-center justify-between gap-4 shadow-lg">
          <p className="font-['Fraunces',Georgia,serif] italic text-base sm:text-lg text-[#e6dfd2]">
            “Un charco es un espejo <b className="text-[#f2c14e] font-normal not-italic font-semibold">que ladra</b>.”
          </p>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.22em] text-[#93a0ac] uppercase shrink-0">
            KIDS · BEAGLE 06
          </span>
        </div>
      </div>
    </section>
  );
};
