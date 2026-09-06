import React, { useMemo, useState } from 'react';
import { KIDS_BEAGLE_PRODUCTS } from '../storeData';
import { Product } from '../../../types';
import { Heart, Plus, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { tactile } from '../../../utils/tactileFeedback';

interface KidsCatalogProps {
  favoriteIds: Set<string>;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  addedProductId?: string | null;
}

type KidsSortOption = 'destacados' | 'precio-asc' | 'precio-desc' | 'nombre';

const KIDS_CATEGORIES = ['Todos', 'Ropa', 'Calzado', 'Accesorios', 'Mochilas', 'Peluches'] as const;
const KIDS_BRANDS = ['TODAS', 'MANTA', 'NORTE', 'BRUMA', 'TERRA', 'LLUVIA LAB'] as const;

export const KidsCatalog: React.FC<KidsCatalogProps> = ({
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  addedProductId
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('Todos');
  const [selectedBrand, setSelectedBrand] = useState<string>('TODAS');
  const [maxPrice, setMaxPrice] = useState<number>(90);
  const [sortOption, setSortOption] = useState<KidsSortOption>('destacados');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Dynamic counts
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: KIDS_BEAGLE_PRODUCTS.length };
    KIDS_BEAGLE_PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = { TODAS: KIDS_BEAGLE_PRODUCTS.length };
    KIDS_BEAGLE_PRODUCTS.forEach((p) => {
      const b = p.brand.toUpperCase();
      counts[b] = (counts[b] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return KIDS_BEAGLE_PRODUCTS.filter((p) => {
      if (selectedCat !== 'Todos' && p.category !== selectedCat) {
        return false;
      }
      if (selectedBrand !== 'TODAS' && p.brand.toUpperCase() !== selectedBrand) {
        return false;
      }
      if (p.price > maxPrice) {
        return false;
      }
      return true;
    });
  }, [selectedCat, selectedBrand, maxPrice]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case 'precio-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'precio-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'nombre':
        return list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      case 'destacados':
      default:
        return list;
    }
  }, [filteredProducts, sortOption]);

  const handleClearFilters = () => {
    tactile.softImpact();
    setSelectedCat('Todos');
    setSelectedBrand('TODAS');
    setMaxPrice(90);
    setSortOption('destacados');
  };

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    tactile.success();
    onAddToCart(product);
  };

  const handleToggleFav = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    tactile.softImpact();
    onToggleFavorite(productId);
  };

  return (
    <section id="kids-catalog-section" className="space-y-6 pt-4 scroll-mt-20">
      {/* Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.26em] uppercase text-[#f2c14e] font-semibold">
            CATÁLOGO KIDS · COLECCIÓN BEAGLE
          </span>
          <h2 className="font-['Fraunces',Georgia,serif] font-bold text-2xl sm:text-3xl text-[#ece7de] mt-0.5">
            Todos los productos
          </h2>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs uppercase tracking-wider text-[#ece7de] hover:border-[#f2c14e]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#f2c14e]" />
          <span>Filtros Kids ({sortedProducts.length})</span>
        </button>
      </div>

      {/* Main Grid: Filters Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 items-start">
        {/* ======================================================== */}
        {/* FILTERS ASIDE */}
        {/* ======================================================== */}
        <aside
          className={`space-y-6 lg:sticky lg:top-24 rounded-2xl border border-white/10 bg-[#10151c]/90 p-5 ${
            isMobileFiltersOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-['Fraunces',Georgia,serif] font-bold text-lg text-[#ece7de]">
              Filtrar productos
            </h3>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[11px] font-['Spline_Sans_Mono',ui-monospace,monospace] text-[#93a0ac] hover:text-[#f2c14e] underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          </div>

          {/* Group 1: Categoría */}
          <div className="space-y-2">
            <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] text-[#93a0ac] uppercase">
              CATEGORÍA
            </div>
            <div className="space-y-1">
              {KIDS_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center justify-between gap-2 py-1 px-1.5 rounded-lg hover:bg-white/5 cursor-pointer select-none text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="kidsCat"
                      value={cat}
                      checked={selectedCat === cat}
                      onChange={() => setSelectedCat(cat)}
                      className="accent-[#f2c14e] cursor-pointer"
                    />
                    <span className={selectedCat === cat ? 'text-[#f2c14e] font-semibold' : 'text-[#ece7de]'}>
                      {cat}
                    </span>
                  </div>
                  <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] text-[#93a0ac]">
                    {catCounts[cat] || 0}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Group 2: Selección editorial */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] text-[#93a0ac] uppercase">
              SELECCIÓN
            </div>
            <div className="space-y-1">
              {KIDS_BRANDS.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center justify-between gap-2 py-1 px-1.5 rounded-lg hover:bg-white/5 cursor-pointer select-none text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="kidsBrand"
                      value={brand}
                      checked={selectedBrand === brand}
                      onChange={() => setSelectedBrand(brand)}
                      className="accent-[#f2c14e] cursor-pointer"
                    />
                    <span className={selectedBrand === brand ? 'text-[#f2c14e] font-semibold' : 'text-[#ece7de]'}>
                      {brand === 'TODAS' ? 'Todas' : brand}
                    </span>
                  </div>
                  <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] text-[#93a0ac]">
                    {brandCounts[brand] || 0}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Group 3: Rango de Precio */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] text-[#93a0ac] uppercase">
              RANGO DE PRECIO
            </div>
            <div className="flex justify-between font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] text-[#93a0ac]">
              <span>$20</span>
              <span className="text-[#f2c14e] font-bold">${maxPrice} USD</span>
            </div>
            <input
              type="range"
              min={20}
              max={90}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#f2c14e] cursor-pointer h-1.5 bg-white/20 rounded-lg"
            />
          </div>
        </aside>

        {/* ======================================================== */}
        {/* PRODUCT GRID + TOP SORT BAR */}
        {/* ======================================================== */}
        <div className="space-y-4">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#10151c]/60 p-3 px-4 rounded-xl border border-white/10">
            <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.2em] text-[#93a0ac] uppercase">
              {sortedProducts.length} RESULTADOS · KIDS
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="kids-sort" className="sr-only">Ordenar</label>
              <select
                id="kids-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as KidsSortOption)}
                className="appearance-none bg-[#12161d] border border-white/15 text-[#ece7de] rounded-full py-1.5 px-4 pr-8 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-wider uppercase cursor-pointer outline-none hover:border-[#f2c14e] focus:border-[#f2c14e]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23f2c14e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center'
                }}
              >
                <option value="destacados">ORDENAR · DESTACADOS</option>
                <option value="precio-asc">PRECIO · MENOR A MAYOR</option>
                <option value="precio-desc">PRECIO · MAYOR A MENOR</option>
                <option value="nombre">NOMBRE · A—Z</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {sortedProducts.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-white/10 bg-[#10151c]/40 font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs tracking-widest text-[#93a0ac] uppercase">
              SIN RESULTADOS — PRUEBA LIMPIAR LOS FILTROS
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sortedProducts.map((p) => {
                const isFav = favoriteIds.has(p.id);
                return (
                  <article
                    key={p.id}
                    onClick={() => {
                      tactile.selection();
                      onSelectProduct?.(p);
                    }}
                    className="rounded-2xl border border-white/10 bg-[#10151c] overflow-hidden group transition-all duration-300 hover:border-[#f2c14e]/40 hover:-translate-y-1 shadow-lg cursor-pointer flex flex-col justify-between select-none"
                  >
                    {/* Media Container */}
                    <div className="relative aspect-square bg-white/5 overflow-hidden">
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                        {p.isNew && (
                          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.22em] bg-[#f2c14e] text-[#141414] font-bold px-2 py-0.5 rounded-sm shadow-sm uppercase">
                            NUEVO
                          </span>
                        )}
                        {p.guaf && (
                          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.18em] bg-[#f7f3ea]/95 text-[#141414] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase">
                            ¡GUAF! 🐾
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFav(e, p.id)}
                        aria-label={isFav ? `Quitar de favoritos` : `Guardar en favoritos`}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-[#f2c14e] transition-colors z-10 cursor-pointer"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isFav ? 'fill-[#c0392b] text-[#c0392b]' : 'text-white'
                          }`}
                        />
                      </button>

                      {/* Product Image */}
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.22em] text-[#93a0ac] uppercase">
                          {p.brand} · {p.category.toUpperCase()}
                        </span>
                        <h3 className="font-['Space_Grotesk',system-ui,sans-serif] text-sm sm:text-base font-medium text-[#ece7de] mt-1 line-clamp-1 group-hover:text-[#f2c14e] transition-colors">
                          {p.name}
                        </h3>
                        {p.colors && (
                          <span className="block text-xs text-[#93a0ac] mt-0.5">
                            {p.colors}
                          </span>
                        )}

                        {/* Sizes */}
                        {p.sizes && p.sizes.length > 0 && (
                          <div className="flex gap-1 mt-2.5 flex-wrap">
                            {p.sizes.map((s) => (
                              <span
                                key={s}
                                className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.08em] border border-white/10 rounded px-1.5 py-0.5 text-[#93a0ac]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price & Add Button */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
                        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-sm font-semibold text-[#f2c14e]">
                          {p.priceFormatted}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleAdd(e, p)}
                          aria-label={`Añadir ${p.name}`}
                          className="w-7 h-7 rounded-full border border-[#f2c14e] text-[#f2c14e] bg-black/60 hover:bg-[#f2c14e] hover:text-black transition-all flex items-center justify-center shrink-0 cursor-pointer active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
