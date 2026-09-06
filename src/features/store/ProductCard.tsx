import React from 'react';
import { Check, Heart, Plus } from 'lucide-react';
import { StoreProduct } from './storeTypes';
import { Product } from '../../types';
import { tactile } from '../../utils/tactileFeedback';

interface ProductCardProps {
  product: StoreProduct;
  isFavorite: boolean;
  isRecentlyAdded: boolean;
  isHighlighted?: boolean;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  isRecentlyAdded,
  isHighlighted = false,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct
}) => {
  const handleCardClick = () => {
    if (onSelectProduct) {
      tactile.selection();
      onSelectProduct(product);
    }
  };

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    // Products with variants open the contextual sheet instead of guessing.
    if (product.sizes && product.sizes.length > 0) {
      onSelectProduct?.(product);
      return;
    }
    tactile.success();
    onAddToCart(product);
  };

  const handleToggleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    tactile.softImpact();
    onToggleFavorite(product.id);
  };

  return (
    <article
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className={`group relative flex cursor-pointer select-none flex-col justify-between rounded-2xl p-1 transition-all duration-300 ${
        isHighlighted
          ? 'scale-[1.02] bg-white/[0.04] ring-2 ring-[#f2c14e] shadow-lg shadow-[#f2c14e]/25'
          : 'hover:bg-white/[0.02]'
      }`}
    >
      <div className="relative mb-2 aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/30 transition-colors group-hover:border-white/30">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="pointer-events-none h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
          className="store-glass-floating tactile-control touch-target-44 absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white"
        >
          <Heart className={`h-3.5 w-3.5 transition-colors ${isFavorite ? 'fill-[#e55353] text-[#e55353]' : 'text-white/80 hover:text-[#e55353]'}`} />
        </button>

        {isRecentlyAdded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#08100d]/35">
            <span className="animate-cart-pop flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400 text-black shadow-lg shadow-emerald-400/30" aria-hidden="true">
              <Check className="h-5 w-5" />
            </span>
            <span className="sr-only" aria-live="polite">{product.name} agregado a la bolsa</span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 px-0.5">
        <h3 className="line-clamp-2 font-['Fraunces',Georgia,serif] text-[15px] font-semibold leading-[1.08] text-[#ece7de] transition-colors group-hover:text-[#f2c14e] sm:text-base">
          {product.name}
        </h3>
      </div>

      <div className="mt-2 flex min-w-0 items-center justify-between gap-2 border-t border-white/10 px-0.5 pt-2">
        <span className="truncate whitespace-nowrap font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs font-semibold text-[#ece7de] sm:text-sm">
          {product.priceFormatted}
        </span>
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Añadir ${product.name} a la bolsa`}
          className={`tactile-control touch-target-44 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all ${
            isRecentlyAdded
              ? 'animate-cart-pop bg-emerald-400/20 text-emerald-300 shadow-md shadow-emerald-400/30'
              : 'store-glass-control text-white hover:!bg-[#f2c14e]/18 hover:!text-[#f2c14e]'
          }`}
        >
          {isRecentlyAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>
    </article>
  );
};
