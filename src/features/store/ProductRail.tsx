import React, { useRef, useCallback } from 'react';
import { StoreProduct } from './storeTypes';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { ChevronRight } from 'lucide-react';
import { tactile } from '../../utils/tactileFeedback';

interface ProductRailProps {
  id?: string;
  title: string;
  subtitle?: string;
  tag?: string;
  icon?: React.ReactNode;
  products: StoreProduct[];
  favoriteIds: Set<string>;
  recentlyAddedId?: string | null;
  highlightedProductId?: string | null;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  onViewAll?: () => void;
}

export const ProductRail: React.FC<ProductRailProps> = ({
  id,
  title,
  subtitle,
  tag,
  icon,
  products,
  favoriteIds,
  recentlyAddedId = null,
  highlightedProductId = null,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  onViewAll
}) => {
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    if (dx > 8 || dy > 8) {
      isDraggingRef.current = true;
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    pointerStartRef.current = null;
  }, []);

  const handleSelectSafe = useCallback(
    (product: Product) => {
      if (isDraggingRef.current) {
        return; // Suppress click on drag
      }
      if (onSelectProduct) {
        onSelectProduct(product);
      }
    },
    [onSelectProduct]
  );

  if (!products || products.length === 0) return null;

  return (
    <section
      id={id || `product-rail-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className="space-y-3 pt-2"
    >
      {/* Rail Header */}
      <div className="flex items-end justify-between gap-3 px-0.5">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            {icon && <span className="text-[#f2c14e] shrink-0">{icon}</span>}
            {tag && (
              <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.22em] uppercase font-bold text-[#f2c14e] px-2 py-0.5 rounded-full bg-[#f2c14e]/15 border border-[#f2c14e]/30">
                {tag}
              </span>
            )}
          </div>
          <h2
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
            className="font-['Fraunces',Georgia,serif] text-xl sm:text-2xl md:text-3xl font-bold text-[#ece7de] tracking-tight truncate"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="font-['Space_Grotesk'] text-xs text-[#93a0ac] truncate">
              {subtitle}
            </p>
          )}
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={() => {
              tactile.selection();
              onViewAll();
            }}
            className="text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] text-[#f2c14e] hover:text-white uppercase tracking-wider flex items-center gap-1 shrink-0 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-white/5 tactile-control transition-colors"
          >
            <span>Ver todo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Horizontal Scroll Track - Mobile: ~2 cards visible with peek */}
      <div className="relative">
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-1 -mx-1 select-none"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain'
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[45vw] min-w-[155px] max-w-[200px] sm:w-[190px] md:w-[210px] shrink-0 flex flex-col"
            >
              <ProductCard
                product={product}
                isFavorite={favoriteIds.has(product.id)}
                isRecentlyAdded={recentlyAddedId === product.id}
                isHighlighted={highlightedProductId === product.id}
                onToggleFavorite={onToggleFavorite}
                onAddToCart={onAddToCart}
                onSelectProduct={handleSelectSafe}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
