import React from 'react';
import { CategoryCard } from './CategoryCard';
import { BrandMarquee } from './BrandMarquee';
import { WeeklyDrop } from './WeeklyDrop';
import { PromoCard } from './PromoCard';
import { ServiceCard } from './ServiceCard';
import { EditorialQuoteCard } from './EditorialQuoteCard';
import { STORE_CATEGORIES } from './storeData';
import { Product } from '../../types';
import { Sparkles } from 'lucide-react';

interface StoreBentoProps {
  onAddToCart: (product: Product) => void;
  addedProductId?: string | null;
  onReturnToEditorial?: () => void;
  onSelectCategory: (catId: 'mujer' | 'hombre' | 'ninos' | 'bebe') => void;
}

export const StoreBento: React.FC<StoreBentoProps> = ({
  onAddToCart,
  addedProductId,
  onReturnToEditorial,
  onSelectCategory
}) => {
  return (
    <section id="store-bento-section" className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.26em] uppercase text-[#f2c14e] font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            CATEGORÍAS FAMILIARES
          </span>
          <h2
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
            className="font-['Fraunces',Georgia,serif] text-2xl sm:text-3xl md:text-4xl font-bold text-[#ece7de] mt-0.5"
          >
            Todo para cada uno
          </h2>
        </div>
        <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10.5px] text-white/50 tracking-wider uppercase">
          Desliza para explorar líneas
        </p>
      </div>

      {/* 1. CATEGORÍAS: CARRUSEL HORIZONTAL FLUIDO EN MÓVIL (GRID 4 EN DESKTOP) */}
      <div
        id="store-categories-carousel"
        className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1 touch-pan-x [overscroll-behavior-inline:contain]"
      >
        <CategoryCard
          category={STORE_CATEGORIES[0]}
          onClick={() => onSelectCategory('mujer')}
        />
        <CategoryCard
          category={STORE_CATEGORIES[1]}
          onClick={() => onSelectCategory('hombre')}
        />
        <CategoryCard
          category={STORE_CATEGORIES[2]}
          onClick={() => onSelectCategory('ninos')}
        />
        <CategoryCard
          category={STORE_CATEGORIES[3]}
          onClick={() => onSelectCategory('bebe')}
        />
      </div>

      {/* 2. DROP DE LA SEMANA & MARQUEE TICKER */}
      <div className="space-y-6 pt-2">
        <WeeklyDrop
          onAddToCart={onAddToCart}
          addedProductId={addedProductId}
        />

        <BrandMarquee />
      </div>

      {/* 3. EDITORIAL STORY & PROMO/SERVICE (SLIM DUAL TILES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch pt-2">
        {/* Quote: 2 cols on desktop */}
        <div className="md:col-span-2">
          <EditorialQuoteCard onReturnToEditorial={onReturnToEditorial} />
        </div>

        {/* Promo code: 1 col */}
        <PromoCard />

        {/* Service: 1 col */}
        <ServiceCard />
      </div>
    </section>
  );
};
