import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface LookComposerProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onAddToBag: (product: Product) => void;
}

export const LookComposer: React.FC<LookComposerProps> = ({ products, onRemove, onAddToBag }) => {
  if (products.length === 0) return null;

  return (
    <aside
      id="editorial-look-composer"
      className="fixed bottom-5 left-1/2 z-[52] flex w-[min(92vw,720px)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/15 bg-[#091015]/80 p-3 text-white shadow-2xl backdrop-blur-xl"
      aria-label="Composición del look"
    >
      <div className="hidden shrink-0 sm:block">
        <Sparkles className="h-4 w-4 text-[#f2c14e]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] uppercase tracking-[0.22em] text-[#f2c14e]">Tu look · {products.length} piezas</div>
        <div className="mt-1 flex max-w-full gap-1.5 overflow-x-auto no-scrollbar">
          {products.map((product) => (
            <span key={product.id} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/80">
              {product.name}
              <button type="button" onClick={() => onRemove(product.id)} className="rounded-full p-0.5 text-white/45 hover:text-white" aria-label={`Quitar ${product.name} del look`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
        <button
          type="button"
          onClick={() => products.forEach(onAddToBag)}
          className="min-h-[44px] shrink-0 rounded-xl bg-[#f2c14e]/18 px-3 text-[10px] font-bold uppercase tracking-wider text-[#f2c14e] transition-transform hover:bg-[#f2c14e]/28 hover:scale-[1.02]"
        >
        Bolsa
      </button>
    </aside>
  );
};
