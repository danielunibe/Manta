import React, { useMemo, useState } from 'react';
import { StoreFiltersState, StoreSortOption } from './storeTypes';
import { getLiveProducts } from '../../domain/catalog';
import { StoreFilters } from './StoreFilters';
import { ProductGrid } from './ProductGrid';
import { Product } from '../../types';
import { ArrowUpDown, SlidersHorizontal, Heart, X } from 'lucide-react';
import { tactile } from '../../utils/tactileFeedback';

const LIVE_CATALOG_PRODUCTS = getLiveProducts();

interface StoreCatalogProps {
  filters: StoreFiltersState;
  onChangeFilter: <K extends keyof StoreFiltersState>(key: K, value: StoreFiltersState[K]) => void;
  onResetFilters: () => void;
  favoriteIds: Set<string>;
  recentlyAddedId: string | null;
  highlightedProductId?: string | null;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  isResultsMode?: boolean;
}

export const StoreCatalog: React.FC<StoreCatalogProps> = ({
  filters,
  onChangeFilter,
  onResetFilters,
  favoriteIds,
  recentlyAddedId,
  highlightedProductId = null,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  isResultsMode = false
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return LIVE_CATALOG_PRODUCTS.filter((p) => {
      // Favorites filter
      if (filters.favoritesOnly) {
        if (!favoriteIds.has(p.id)) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'Todos' && p.category !== filters.category) {
        return false;
      }

      // Family target filter
      if (filters.family !== 'todos') {
        // Unisex pieces stay discoverable in the general edit, but must not
        // contaminate a deliberately selected Mujer/Hombre/Niños/Bebé rail.
        if (p.family !== filters.family) {
          return false;
        }
      }

      // Brand filter
      if (filters.brand !== 'Todas') {
        if (p.brand.toLowerCase() !== filters.brand.toLowerCase()) {
          return false;
        }
      }

      // Max price filter
      if (p.price > filters.maxPrice) {
        return false;
      }

      // Search query filter (if any)
      if (filters.searchQuery.trim().length > 0) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesSub = p.subtitle?.toLowerCase().includes(q);
        const matchesTag = p.tag?.toLowerCase().includes(q);
        const matchesProv = p.editorialProvenance?.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSub && !matchesTag && !matchesProv) {
          return false;
        }
      }

      return true;
    });
  }, [filters, favoriteIds]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (filters.sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        // Keep the magazine logic visible in the catalogue: family first,
        // then category, then editorial order. This prevents a random mixed rail.
        return list.sort((a, b) => {
          const familyOrder: Record<string, number> = { mujer: 0, hombre: 1, ninos: 2, bebe: 3, unisex: 4 };
          const categoryOrder: Record<string, number> = { Ropa: 0, Camisas: 1, Abrigos: 2, Pantalones: 3, Calzado: 4, Accesorios: 5, Mochilas: 6, Peluches: 7 };
          return (familyOrder[a.family] ?? 9) - (familyOrder[b.family] ?? 9) || (categoryOrder[a.category] ?? 9) - (categoryOrder[b.category] ?? 9) || a.name.localeCompare(b.name);
        });
    }
  }, [filteredProducts, filters.sort]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'Todos') count++;
    if (filters.family !== 'todos') count++;
    if (filters.brand !== 'Todas') count++;
    if (filters.maxPrice < 3000) count++;
    if (filters.favoritesOnly) count++;
    if (filters.searchQuery.trim().length > 0) count++;
    return count;
  }, [filters]);

  // Derive Results Title
  const resultsTitle = useMemo(() => {
    if (filters.searchQuery.trim().length > 0) {
      return `Resultados para “${filters.searchQuery.trim()}”`;
    }
    if (filters.favoritesOnly) {
      return 'Tus Favoritos del Atelier';
    }
    if (filters.family !== 'todos') {
      const familyNames: Record<string, string> = {
        mujer: 'Colección Mujer',
        hombre: 'Colección Hombre',
        ninos: 'Colección Infantil & Niños',
        bebe: 'Colección Bebé'
      };
      return familyNames[filters.family] || `Colección ${filters.family}`;
    }
    if (filters.category !== 'Todos') {
      return `Prendas de ${filters.category}`;
    }
    if (filters.brand !== 'Todas') {
      return 'Selección filtrada';
    }
    if (filters.maxPrice < 3000) {
      return `Prendas hasta $${filters.maxPrice.toLocaleString()} MXN`;
    }
    return 'Todos los productos';
  }, [filters]);

  return (
    <section id="store-catalog-section" className="space-y-5 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-3">
            {isResultsMode && <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.28em] uppercase text-[#f2c14e] font-semibold">Resultados</span>}

            {isResultsMode && (
              <button
                type="button"
                onClick={() => {
                  tactile.softImpact();
                  onResetFilters();
                }}
                className="text-[10px] font-['Spline_Sans_Mono',ui-monospace,monospace] uppercase tracking-wider text-[#f2c14e] hover:text-white underline cursor-pointer"
              >
                ← Volver a descubrir
              </button>
            )}
          </div>

          <h2
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
            className="font-['Fraunces',Georgia,serif] text-2xl sm:text-3xl md:text-4xl font-bold text-[#ece7de] mt-1"
          >
            {isResultsMode ? resultsTitle : 'Agosto'}
          </h2>

          <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs text-white/50 uppercase tracking-wider mt-0.5">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
        </div>

        {/* Desktop Sort Selector */}
        {isResultsMode && <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full store-glass-control">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#f2c14e]" />
            <select
              value={filters.sort}
              onChange={(e) => {
                tactile.selection();
                onChangeFilter('sort', e.target.value as StoreSortOption);
              }}
              aria-label="Ordenar productos"
              className="bg-transparent text-xs text-[#ece7de] font-['Spline_Sans_Mono',ui-monospace,monospace] uppercase tracking-wider outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#10151c] text-[#ece7de]">
                Destacados
              </option>
              <option value="price-asc" className="bg-[#10151c] text-[#ece7de]">
                Precio: Menor a Mayor
              </option>
              <option value="price-desc" className="bg-[#10151c] text-[#ece7de]">
                Precio: Mayor a Menor
              </option>
              <option value="name-asc" className="bg-[#10151c] text-[#ece7de]">
                Nombre: A—Z
              </option>
            </select>
          </div>
        </div>}
      </div>

      {/* Mobile Compact Toolbar: [ FILTROS (N) ] [ ORDENAR ] */}
      {isResultsMode && <div className="flex lg:hidden items-center justify-between gap-2.5 w-full">
        <button
          type="button"
          onClick={() => {
            tactile.softImpact();
            setIsMobileFilterOpen(true);
          }}
          className="flex-1 py-2.5 px-4 min-h-[44px] rounded-full store-glass-control text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] uppercase tracking-wider text-[#ece7de] flex items-center justify-center gap-2 cursor-pointer tactile-control touch-target-44 transition-all"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#f2c14e]" />
          <span>FILTROS {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
        </button>

        <div className="flex-1 flex items-center justify-between py-2 px-3.5 min-h-[44px] rounded-full store-glass-control text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] text-[#ece7de]">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#f2c14e] shrink-0 mr-1.5" />
          <select
            value={filters.sort}
            onChange={(e) => {
              tactile.selection();
              onChangeFilter('sort', e.target.value as StoreSortOption);
            }}
            aria-label="Ordenar productos"
            className="bg-transparent uppercase tracking-wider outline-none cursor-pointer w-full text-[11px]"
          >
            <option value="featured" className="bg-[#10151c] text-[#ece7de]">Destacados</option>
            <option value="price-asc" className="bg-[#10151c] text-[#ece7de]">Precio: Menor</option>
            <option value="price-desc" className="bg-[#10151c] text-[#ece7de]">Precio: Mayor</option>
            <option value="name-asc" className="bg-[#10151c] text-[#ece7de]">Nombre A—Z</option>
          </select>
        </div>
      </div>}

      {/* Active Filters Rail (if any active filters) */}
      {(filters.category !== 'Todos' ||
        filters.family !== 'todos' ||
        filters.brand !== 'Todas' ||
        filters.maxPrice < 3000 ||
        filters.favoritesOnly ||
        filters.searchQuery.trim().length > 0) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          {filters.searchQuery.trim().length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full store-glass-control text-white text-xs font-['Spline_Sans_Mono',ui-monospace,monospace]">
              <span>"{filters.searchQuery}"</span>
              <button
                type="button"
                onClick={() => onChangeFilter('searchQuery', '')}
                className="hover:text-[#f2c14e] cursor-pointer p-0.5"
                aria-label="Quitar filtro de búsqueda"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.family !== 'todos' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2c14e]/15 text-[#f2c14e] border border-[#f2c14e]/30 backdrop-blur-md text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] uppercase font-semibold">
              <span>{filters.family}</span>
              <button
                type="button"
                onClick={() => onChangeFilter('family', 'todos')}
                className="hover:text-white cursor-pointer p-0.5"
                aria-label="Quitar filtro de familia"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.category !== 'Todos' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full store-glass-control text-white text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] uppercase">
              <span>{filters.category}</span>
              <button
                type="button"
                onClick={() => onChangeFilter('category', 'Todos')}
                className="hover:text-[#f2c14e] cursor-pointer p-0.5"
                aria-label="Quitar filtro de categoría"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.maxPrice < 3000 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full store-glass-control text-white text-xs font-['Spline_Sans_Mono',ui-monospace,monospace]">
              <span>≤${filters.maxPrice.toLocaleString()} MXN</span>
              <button
                type="button"
                onClick={() => onChangeFilter('maxPrice', 3000)}
                className="hover:text-[#f2c14e] cursor-pointer p-0.5"
                aria-label="Quitar filtro de precio"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.favoritesOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2c14e]/15 text-[#f2c14e] border border-[#f2c14e]/30 text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] uppercase">
              <span>Favoritos</span>
              <button
                type="button"
                onClick={() => onChangeFilter('favoritesOnly', false)}
                className="hover:text-white cursor-pointer p-0.5"
                aria-label="Quitar filtro de favoritos"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeFilterCount > 1 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] text-[#f2c14e] hover:underline uppercase tracking-wider px-2 py-1 cursor-pointer"
            >
              Limpiar todo
            </button>
          )}
        </div>
      )}

      {/* Main Layout: Desktop Sidebar + Product Grid (Products are immediately visible on mobile!) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        {isResultsMode && <StoreFilters
          filters={filters}
          onChangeFilter={onChangeFilter}
          onResetFilters={onResetFilters}
          totalProductsCount={sortedProducts.length}
        />}

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {filters.favoritesOnly && (
            <div className="mb-4 flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#f2c14e]/10 border border-[#f2c14e]/30 text-[#f2c14e] font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs">
              <div className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 fill-[#f2c14e]" />
                <span className="font-semibold uppercase tracking-wider">
                  Favoritos del Atelier ({sortedProducts.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => onChangeFilter('favoritesOnly', false)}
                className="text-[11px] underline uppercase tracking-wider text-white hover:text-[#f2c14e] cursor-pointer transition-colors"
              >
                Ver todos
              </button>
            </div>
          )}
          <ProductGrid
            products={sortedProducts}
            favoriteIds={favoriteIds}
            recentlyAddedId={recentlyAddedId}
            highlightedProductId={highlightedProductId}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            onResetFilters={onResetFilters}
            onSelectProduct={onSelectProduct}
          />
        </div>
      </div>

      {/* Mobile Filters Bottom-Sheet Drawer */}
      {isMobileFilterOpen && (
        <div
          id="mobile-filters-drawer-backdrop"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="w-full bg-[#0c1015] rounded-t-3xl border-t border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <StoreFilters
              filters={filters}
              onChangeFilter={onChangeFilter}
              onResetFilters={onResetFilters}
              totalProductsCount={sortedProducts.length}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};
