import React from 'react';
import { HOMBRE_PRODUCTS } from './hombreData';
import { Product } from '../../../types';
import { tactile } from '../../../utils/tactileFeedback';
import { Plus, Check } from 'lucide-react';

interface HombreMochilasRowProps {
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  addedProductId?: string | null;
}

export const HombreMochilasRow: React.FC<HombreMochilasRowProps> = ({
  onAddToCart,
  onSelectProduct,
  addedProductId
}) => {
  const mochilas = HOMBRE_PRODUCTS.filter((p) => p.category === 'Mochilas');

  return (
    <div id="mochilas-hombre" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.26em] uppercase text-[#f2c14e] font-semibold">
            NUEVAS · UNA POR PROPUESTA
          </span>
          <h2 className="font-['Fraunces',Georgia,serif] font-bold text-3xl sm:text-4xl text-[#ece7de] tracking-tight mt-1">
            La fila de <em className="italic text-[#f2c14e] not-italic">mochilas</em>
          </h2>
        </div>
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.22em] text-[#93a0ac] uppercase">
          CADA LOOK TIENE LA SUYA
        </span>
      </div>

      {/* Backpack Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
        {mochilas.map((p) => {
          const isRecentlyAdded = addedProductId === p.id;

          return (
            <div
              key={p.id}
              className="group relative rounded-2xl border border-white/10 bg-[#10151c] overflow-hidden hover:border-[#f2c14e]/40 transition-all flex flex-col justify-between"
            >
              {/* Image Container */}
              <div
                className="relative aspect-square overflow-hidden bg-white/[0.03] cursor-pointer"
                onClick={() => onSelectProduct && onSelectProduct(p)}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Quick Add Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    tactile.medium();
                    onAddToCart(p);
                  }}
                  aria-label={`Añadir ${p.name}`}
                  className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    isRecentlyAdded
                      ? 'bg-[#2f8f8a] border-[#2f8f8a] text-white'
                      : 'border-[#f2c14e] text-[#f2c14e] bg-[#0a0d12]/70 hover:bg-[#f2c14e] hover:text-[#141414]'
                  }`}
                >
                  {isRecentlyAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-3.5 border-t border-white/10 flex-1 flex flex-col justify-between">
                <div>
                  <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.22em] text-[#93a0ac] uppercase">
                    {p.brand} · MOCHILAS
                  </span>
                  <h3
                    onClick={() => onSelectProduct && onSelectProduct(p)}
                    className="font-['Space_Grotesk',system-ui,sans-serif] text-xs sm:text-[13.5px] font-medium text-[#ece7de] mt-1 mb-1 line-clamp-1 group-hover:text-[#f2c14e] transition-colors cursor-pointer"
                  >
                    {p.name}
                  </h3>
                </div>
                <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[11px] text-[#f2c14e] font-medium mt-1">
                  ${p.price} USD
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
