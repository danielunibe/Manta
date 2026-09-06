import React from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '../../types';
import { WEEKLY_DROP_PRODUCTS } from './storeData';
import { tactile } from '../../utils/tactileFeedback';

interface WeeklyDropProps {
  onAddToCart: (product: Product) => void;
  addedProductId?: string | null;
}

export const WeeklyDrop: React.FC<WeeklyDropProps> = ({ onAddToCart, addedProductId }) => {
  const handleAdd = (prod: Product) => {
    tactile.success();
    onAddToCart(prod);
  };

  return (
    <div id="weekly-drop-section" className="col-span-1 md:col-span-2 space-y-3 pt-1">
      {/* Clean Header directly on background */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] uppercase text-[#f2c14e] font-semibold">
            EL DROP DE LA SEMANA
          </span>
          <h3
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.65)' }}
            className="font-['Fraunces',Georgia,serif] text-xl sm:text-2xl font-bold text-[#ece7de] mt-0.5"
          >
            Llegaron las Lluvias
          </h3>
        </div>
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.2em] uppercase text-[#f2c14e] px-2.5 py-0.5 rounded-full bg-black/40 border border-[#f2c14e]/30">
          DISPONIBLE AHORA
        </span>
      </div>

      {/* Horizontal Rail of products with snap on mobile, grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1 touch-pan-x [overscroll-behavior-inline:contain]">
        {WEEKLY_DROP_PRODUCTS.map((prod) => {
          const isRecentlyAdded = addedProductId === prod.id;
          return (
            <div
              key={prod.id}
              className="min-w-[210px] w-[62vw] max-w-[240px] sm:w-auto sm:min-w-0 sm:max-w-none snap-start shrink-0 flex flex-col justify-between group/prod"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 bg-black/30 border border-white/10 group-hover/prod:border-white/30 transition-colors">
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover/prod:scale-105 transition-transform duration-500"
                />
                {prod.badge && (
                  <span className="absolute top-2 left-2 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-wider uppercase px-2 py-0.5 rounded bg-black/75 text-[#f2c14e] backdrop-blur-sm border border-white/10">
                    {prod.badge}
                  </span>
                )}
              </div>

              <div>
                <h4
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                  className="font-['Fraunces',Georgia,serif] text-sm sm:text-base font-semibold text-[#ece7de] leading-snug line-clamp-1 group-hover/prod:text-[#f2c14e] transition-colors"
                >
                  {prod.name}
                </h4>
                {prod.editorialProvenance && (
                  <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] text-white/50 tracking-wider uppercase mt-0.5">
                    {prod.editorialProvenance}
                  </p>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs font-semibold text-[#ece7de]">
                  {prod.priceFormatted}
                </span>

                <button
                  type="button"
                  onClick={() => handleAdd(prod)}
                  aria-label={`Añadir ${prod.name} al carrito`}
                  className={`w-7 h-7 rounded-full flex items-center justify-center tactile-control touch-target-44 cursor-pointer ${
                    isRecentlyAdded
                      ? 'bg-emerald-500 text-black scale-110'
                      : 'bg-white/15 hover:bg-[#f2c14e] text-white hover:text-black'
                  }`}
                >
                  {isRecentlyAdded ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
