import React from 'react';
import { StoreProduct } from './storeTypes';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { RotateCcw } from 'lucide-react';

interface ProductGridProps {
  products: StoreProduct[];
  favoriteIds: Set<string>;
  recentlyAddedId: string | null;
  highlightedProductId?: string | null;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onResetFilters: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  favoriteIds,
  recentlyAddedId,
  highlightedProductId = null,
  onToggleFavorite,
  onAddToCart,
  onResetFilters,
  onSelectProduct
}) => {
  if (products.length === 0) {
    return (
      <div
        id="store-catalog-empty-state"
        className="py-12 px-6 text-center space-y-4 max-w-lg mx-auto"
      >
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#f2c14e]">
          <RotateCcw className="w-5 h-5 opacity-80" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-['Fraunces',Georgia,serif] text-xl sm:text-2xl font-bold text-[#ece7de]">
            No encontramos resultados
          </h3>
          <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#93a0ac]">
            Prueba quitando un filtro activo, limpiando la búsqueda o ampliando el rango de precio.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#f2c14e]/18 text-[#f2c14e] font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs font-bold uppercase tracking-wider hover:bg-[#f2c14e]/28 shadow-lg shadow-[#f2c14e]/20 transition-all cursor-pointer tactile-control touch-target-44"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ver todos los productos</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="store-catalog-product-grid"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favoriteIds.has(product.id)}
          isRecentlyAdded={recentlyAddedId === product.id}
          isHighlighted={highlightedProductId === product.id}
          onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
};
