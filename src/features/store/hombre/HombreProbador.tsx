import React, { useState, useMemo, useRef, useCallback } from 'react';
import { HOMBRE_OUTFITS, HOMBRE_PRODUCTS_BY_NAME, HombreOutfit } from './hombreData';
import { Product } from '../../../types';
import { tactile } from '../../../utils/tactileFeedback';
import { ArrowLeft, ArrowRight, Check, ShoppingBag, Eye } from 'lucide-react';

interface HombreProbadorProps {
  onAddToCart: (product: Product) => void;
  onScrollToCatalog: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const HombreProbador: React.FC<HombreProbadorProps> = ({
  onAddToCart,
  onScrollToCatalog,
  onSelectProduct
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [addedAllSuccess, setAddedAllSuccess] = useState(false);

  const outfit = HOMBRE_OUTFITS[currentIdx];

  const outfitTotal = useMemo(() => {
    return outfit.items.reduce((acc, itemName) => {
      const prod = HOMBRE_PRODUCTS_BY_NAME[itemName];
      return acc + (prod ? prod.price : 0);
    }, 0);
  }, [outfit]);

  const paletteColors = useMemo(() => {
    const c = outfit.colors;
    const raw = [c.coat, c.scarf, c.hat, c.pants, c.shoes, c.pack, c.umbrella];
    const unique = raw.filter((v, i, a): v is string => Boolean(v) && a.indexOf(v) === i);
    return unique.slice(0, 6);
  }, [outfit]);

  const getDotColor = useCallback((o: HombreOutfit, p: Product) => {
    if (o.dots && o.dots[p.name]) {
      return o.dots[p.name];
    }
    switch (p.category) {
      case 'Abrigos':
        return o.colors.coat;
      case 'Pantalones':
        return o.colors.pants;
      case 'Calzado':
        return o.colors.shoes;
      case 'Mochilas':
        return o.colors.pack || '#888';
      case 'Camisas':
        return o.colors.coat;
      default:
        if (/Paraguas/.test(p.name)) return o.colors.umbrella || '#888';
        if (/Bufanda/.test(p.name)) return o.colors.scarf || '#888';
        if (/Bucket|Gorro/.test(p.name)) return o.colors.hat || '#888';
        return '#f2c14e';
    }
  }, []);

  const handlePrev = useCallback(() => {
    tactile.soft();
    setCurrentIdx((prev) => (prev - 1 + HOMBRE_OUTFITS.length) % HOMBRE_OUTFITS.length);
  }, []);

  const handleNext = useCallback(() => {
    tactile.soft();
    setCurrentIdx((prev) => (prev + 1) % HOMBRE_OUTFITS.length);
  }, []);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchStartX(clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (touchStartX === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = clientX - touchStartX;
    setTouchStartX(null);

    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const handleAddEntireOutfit = () => {
    tactile.success();
    outfit.items.forEach((name) => {
      const p = HOMBRE_PRODUCTS_BY_NAME[name];
      if (p) {
        onAddToCart(p);
      }
    });
    setAddedAllSuccess(true);
    setTimeout(() => setAddedAllSuccess(false), 2400);
  };

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div id="probador-hombre" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.26em] uppercase text-[#f2c14e] font-semibold">
            PROBADOR DIGITAL · MASCULINO
          </span>
          <h2 className="font-['Fraunces',Georgia,serif] font-bold text-3xl sm:text-4xl text-[#ece7de] tracking-tight mt-1">
            Propuestas de <em className="italic text-[#f2c14e] not-italic">outfit</em>
          </h2>
        </div>
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.22em] text-[#93a0ac] uppercase">
          FOTO REAL POR LOOK · DESLIZA O USA LAS FLECHAS
        </span>
      </div>

      {/* Probador Card */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-b from-white/[0.045] to-white/[0.015] bg-[#10151c] shadow-2xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        {/* Left Side: Editorial Look Image */}
        <div className="relative min-h-[440px] sm:min-h-[540px] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden bg-[#0c1016]">
          {HOMBRE_OUTFITS.map((look, i) => (
            <img
              key={look.name}
              src={look.img}
              alt={`Look ${i + 1} - ${look.name}`}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
                i === currentIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            />
          ))}

          {/* Bottom Shadow Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#080a0e]/85 pointer-events-none" />

          {/* Look Tag Badge */}
          <div className="absolute top-4 left-4 z-10 bg-[#f2c14e] text-[#141414] font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.22em] font-bold px-2.5 py-1.5 rounded-sm shadow-md">
            LOOK {pad(currentIdx + 1)}
          </div>

          {/* Photo Meta Tag */}
          <div className="absolute top-4 right-4 z-10 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.2em] text-[#ece7de]/80 border border-white/20 bg-[#0a0d12]/50 backdrop-blur-md px-2.5 py-1.5 rounded-sm">
            FOTO EDITORIAL · LLUVIA REAL
          </div>

          {/* Dynamic Color Palette */}
          <div className="absolute left-4 bottom-4 z-10 flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {paletteColors.map((col, idx) => (
                <span
                  key={`${col}-${idx}`}
                  className="w-4 h-4 rounded-full border border-white/40 shadow-md transition-colors duration-500"
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
            <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.22em] text-[#ece7de]/80 ml-1">
              PALETA DEL LOOK
            </span>
          </div>
        </div>

        {/* Right Side: Outfit Info & Piece Breakdown */}
        <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.26em] text-[#f2c14e] uppercase font-semibold">
              PROPUESTA {pad(currentIdx + 1)} · PROBADOR DIGITAL
            </span>

            <h3 className="font-['Fraunces',Georgia,serif] font-bold text-2xl sm:text-3xl lg:text-4xl text-[#ece7de] leading-tight">
              {outfit.name}
            </h3>

            <p className="text-sm text-[#93a0ac] leading-relaxed max-w-md font-['Space_Grotesk',system-ui,sans-serif]">
              {outfit.desc}
            </p>

            {/* Piece Items Breakdown */}
            <div className="border-t border-white/10 pt-2 divide-y divide-white/5">
              {outfit.items.map((itemName) => {
                const prod = HOMBRE_PRODUCTS_BY_NAME[itemName];
                if (!prod) return null;
                const dotColor = getDotColor(outfit, prod);

                return (
                  <div
                    key={itemName}
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct(prod);
                      }
                    }}
                    className="flex items-center gap-3 py-2 text-xs sm:text-sm hover:bg-white/5 px-2 -mx-2 rounded transition-colors cursor-pointer group"
                    title="Toca para ver detalles"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-black/40"
                      style={{ backgroundColor: dotColor }}
                    />
                    <span className="flex-1 text-[#ece7de] font-medium group-hover:text-[#f2c14e] transition-colors">
                      {prod.name}
                    </span>
                    <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[11px] text-[#93a0ac]">
                      ${prod.price}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Total Row */}
            <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
              <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] text-[#93a0ac] uppercase">
                TOTAL OUTFIT
              </span>
              <span className="font-['Fraunces',Georgia,serif] font-bold text-2xl sm:text-3xl text-[#f2c14e]">
                ${outfitTotal} USD
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddEntireOutfit}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-[#f2c14e] text-[#141414] rounded-full py-3.5 px-6 font-['Space_Grotesk',system-ui,sans-serif] font-medium text-xs tracking-[0.2em] uppercase hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-12px_rgba(242,193,78,0.5)] transition-all cursor-pointer"
              >
                {addedAllSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    ¡OUTFIT AÑADIDO!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    AÑADIR OUTFIT COMPLETO ({outfit.items.length})
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onScrollToCatalog}
                className="flex items-center justify-center gap-2 bg-transparent border border-white/15 text-[#ece7de] rounded-full py-3.5 px-6 font-['Space_Grotesk',system-ui,sans-serif] text-xs tracking-[0.2em] uppercase hover:border-[#f2c14e]/50 hover:text-[#f2c14e] transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                VER PIEZAS ↓
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Outfit anterior"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#ece7de] hover:bg-[#f2c14e] hover:text-[#141414] hover:border-[#f2c14e] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-2">
              {HOMBRE_OUTFITS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    tactile.soft();
                    setCurrentIdx(i);
                  }}
                  aria-label={`Ver outfit ${i + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === currentIdx ? 'w-6 bg-[#f2c14e]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.2em] text-[#93a0ac]">
                {pad(currentIdx + 1)} / {pad(HOMBRE_OUTFITS.length)}
              </span>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Outfit siguiente"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#ece7de] hover:bg-[#f2c14e] hover:text-[#141414] hover:border-[#f2c14e] transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
