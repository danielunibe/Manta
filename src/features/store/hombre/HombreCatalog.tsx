import React, { useState, useMemo, useCallback } from 'react';
import { HOMBRE_PRODUCTS, HOMBRE_PROBADOR_SET } from './hombreData';
import { Product } from '../../../types';
import { tactile } from '../../../utils/tactileFeedback';
import { Heart, Plus, Check, RotateCcw } from 'lucide-react';

interface HombreCatalogProps {
  favoriteIds: Set<string>;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  addedProductId?: string | null;
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
}

export const HombreCatalog: React.FC<HombreCatalogProps> = ({
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  addedProductId,
  activeCategory: externalCategory,
  onCategoryChange
}) => {
  const [internalCategory, setInternalCategory] = useState<string>('Todos');
  const selectedCategory = externalCategory !== undefined ? externalCategory : internalCategory;

  const [selectedBrand, setSelectedBrand] = useState<string>('TODAS');
  const [probadorOnly, setProbadorOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [sortBy, setSortBy] = useState<'destacados' | 'precio-asc' | 'precio-desc' | 'nombre'>('destacados');

  const setCategory = (cat: string) => {
    tactile.soft();
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  // Counts calculations
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: HOMBRE_PRODUCTS.length };
    HOMBRE_PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = { TODAS: HOMBRE_PRODUCTS.length };
    HOMBRE_PRODUCTS.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, []);

  const probadorCount = useMemo(() => {
    return Object.keys(HOMBRE_PROBADOR_SET).length;
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return HOMBRE_PRODUCTS.filter((p) => {
      if (selectedCategory !== 'Todos' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedBrand !== 'TODAS' && p.brand !== selectedBrand) {
        return false;
      }
      if (p.price > maxPrice) {
        return false;
      }
      if (probadorOnly && !HOMBRE_PROBADOR_SET[p.name]) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedBrand, maxPrice, probadorOnly]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
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
  }, [filteredProducts, sortBy]);

  const handleResetFilters = useCallback(() => {
    tactile.soft();
    setCategory('Todos');
    setSelectedBrand('TODAS');
    setProbadorOnly(false);
    setMaxPrice(200);
    setSortBy('destacados');
  }, []);

  const getSizesFor = (cat: string) => {
    if (cat === 'Abrigos' || cat === 'Camisas' || cat === 'Pantalones') {
      return ['S', 'M', 'L', 'XL'];
    }
    if (cat === 'Calzado') {
      return ['40', '41', '42', '43'];
    }
    if (cat === 'Mochilas') {
      return ['20L', '25L'];
    }
    return ['ÚNICO'];
  };

  const categoriesList = ['Todos', 'Abrigos', 'Camisas', 'Pantalones', 'Mochilas', 'Calzado', 'Accesorios'];
  const brandsList = ['TODAS', 'MANTA', 'NORTE', 'BRUMA', 'TERRA', 'LLUVIA LAB'];

  return (
    <section id="catalogo-hombre" className="space-y-6 pt-4 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.26em] uppercase text-[#f2c14e] font-semibold">
            GRAN CATÁLOGO · HOMBRE
          </span>
          <h2 className="font-['Fraunces',Georgia,serif] font-bold text-3xl sm:text-4xl text-[#ece7de] tracking-tight mt-1">
            Todos los productos
          </h2>
        </div>
      </div>

      {/* Main Grid: Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 lg:gap-10 items-start">
        {/* Filters Aside */}
        <aside className="lg:sticky lg:top-24 rounded-2xl border border-white/10 p-5 bg-[#10151c]/90 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b-2 border-white/80">
            <h3 className="font-['Fraunces',Georgia,serif] font-bold text-lg text-[#ece7de]">
              Filtrar productos
            </h3>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#93a0ac] hover:text-[#f2c14e] flex items-center gap-1 transition-colors cursor-pointer"
              title="Restablecer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] uppercase text-[#93a0ac]">
              CATEGORÍA
            </div>
            <div className="space-y-1">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat;
                const label = cat === 'Camisas' ? 'Camisas & Tejidos' : cat;

                return (
                  <label
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="flex items-center gap-2.5 py-1 px-1.5 -mx-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-xs select-none"
                  >
                    <input
                      type="radio"
                      name="cat-radio"
                      checked={isSelected}
                      onChange={() => setCategory(cat)}
                      className="accent-[#f2c14e] cursor-pointer"
                    />
                    <span className={`flex-1 ${isSelected ? 'text-[#f2c14e] font-medium' : 'text-[#ece7de]'}`}>
                      {label}
                    </span>
                    <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] text-[#93a0ac]">
                      {categoryCounts[cat] || 0}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Probador Digital Checkbox Box */}
          <div className="border border-[#f2c14e]/35 bg-[#f2c14e]/[0.06] rounded-xl p-3.5 space-y-2">
            <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.2em] uppercase text-[#f2c14e] font-semibold">
              PROBADOR DIGITAL
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={probadorOnly}
                onChange={(e) => {
                  tactile.soft();
                  setProbadorOnly(e.target.checked);
                }}
                className="w-4 h-4 rounded accent-[#f2c14e] cursor-pointer"
              />
              <span className="flex-1 text-[#ece7de]">Disponible para probador</span>
              <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] text-[#f2c14e]">
                {probadorCount}
              </span>
            </label>
          </div>

          {/* Brands Filter */}
          <div className="space-y-2.5">
            <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] uppercase text-[#93a0ac]">
              SELECCIÓN
            </div>
            <div className="space-y-1">
              {brandsList.map((brand) => {
                const isSelected = selectedBrand === brand;

                return (
                  <label
                    key={brand}
                    onClick={() => {
                      tactile.soft();
                      setSelectedBrand(brand);
                    }}
                    className="flex items-center gap-2.5 py-1 px-1.5 -mx-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-xs select-none"
                  >
                    <input
                      type="radio"
                      name="brand-radio"
                      checked={isSelected}
                      onChange={() => setSelectedBrand(brand)}
                      className="accent-[#f2c14e] cursor-pointer"
                    />
                    <span className={`flex-1 ${isSelected ? 'text-[#f2c14e] font-medium' : 'text-[#ece7de]'}`}>
                      {brand === 'TODAS' ? 'Todas' : brand}
                    </span>
                    <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] text-[#93a0ac]">
                      {brandCounts[brand] || 0}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2.5">
            <div className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] uppercase text-[#93a0ac]">
              RANGO DE PRECIO
            </div>
            <div className="flex justify-between items-center font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] text-[#93a0ac]">
              <span>$20</span>
              <span className="text-[#f2c14e] font-medium">${maxPrice} USD</span>
            </div>
            <input
              type="range"
              min={20}
              max={200}
              step={5}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#f2c14e] cursor-pointer"
            />
          </div>

          {/* Clear Filters Link */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#ece7de] hover:text-[#f2c14e] underline underline-offset-4 cursor-pointer transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </aside>

        {/* Catalog Main Content */}
        <div className="space-y-5">
          {/* Top Bar: Results Count + Sort Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/10">
            <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.2em] uppercase text-[#93a0ac]">
              {sortedProducts.length} RESULTADOS · HOMBRE
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  tactile.soft();
                  setSortBy(e.target.value as any);
                }}
                className="appearance-none bg-[#12161d]/80 border border-white/10 text-[#ece7de] rounded-full py-2.5 pl-4 pr-9 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.14em] cursor-pointer outline-none hover:border-white/20 transition-colors"
              >
                <option value="destacados">ORDENAR · DESTACADOS</option>
                <option value="precio-asc">PRECIO · MENOR A MAYOR</option>
                <option value="precio-desc">PRECIO · MAYOR A MENOR</option>
                <option value="nombre">NOMBRE · A—Z</option>
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#f2c14e] pointer-events-none text-xs">
                ▾
              </span>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs tracking-[0.24em] text-[#93a0ac] uppercase">
                SIN RESULTADOS — PRUEBA LIMPIAR LOS FILTROS
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 inline-block bg-[#f2c14e] text-[#141414] font-medium text-xs px-5 py-2.5 rounded-full uppercase tracking-wider"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {sortedProducts.map((p) => {
                const isLiked = favoriteIds.has(p.id);
                const isRecentlyAdded = addedProductId === p.id;
                const inProbador = !!HOMBRE_PROBADOR_SET[p.name];
                const sizes = getSizesFor(p.category);

                return (
                  <article
                    key={p.id}
                    className="group rounded-2xl border border-white/10 bg-[#10151c] overflow-hidden hover:border-[#f2c14e]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-md"
                  >
                    {/* Media Container */}
                    <div
                      className="relative aspect-square overflow-hidden bg-white/[0.04] cursor-pointer"
                      onClick={() => onSelectProduct && onSelectProduct(p)}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Tag Nuevo */}
                      {p.isNew && (
                        <span className="absolute top-3 left-3 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.22em] bg-[#f2c14e] text-[#141414] font-bold px-2 py-1 rounded-sm shadow-sm">
                          NUEVO
                        </span>
                      )}

                      {/* Tag Probador */}
                      {inProbador && (
                        <span className="absolute bottom-3 left-3 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.18em] bg-[#0a0d12]/70 backdrop-blur-md text-[#2f8f8a] border border-[#2f8f8a]/50 px-2 py-1 rounded-full">
                          PROBADOR ✓
                        </span>
                      )}

                      {/* Favorite Heart */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          tactile.soft();
                          onToggleFavorite(p.id);
                        }}
                        aria-label={isLiked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full border border-white/10 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                          isLiked
                            ? 'bg-[#a63a2b] text-white border-transparent'
                            : 'bg-[#0a0d12]/60 text-[#ece7de] hover:text-[#f2c14e]'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.22em] text-[#93a0ac] uppercase block">
                          {p.brand} · {p.category.toUpperCase()}
                        </span>

                        <h3
                          onClick={() => onSelectProduct && onSelectProduct(p)}
                          className="font-['Space_Grotesk',system-ui,sans-serif] text-sm sm:text-[15px] font-medium text-[#ece7de] mt-1.5 mb-1 group-hover:text-[#f2c14e] transition-colors cursor-pointer line-clamp-1"
                        >
                          {p.name}
                        </h3>

                        {p.colors && (
                          <span className="text-[11.5px] text-[#93a0ac] block">{p.colors}</span>
                        )}

                        {/* Sizes Pills */}
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {sizes.map((sz) => (
                            <span
                              key={sz}
                              className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] tracking-[0.08em] border border-white/10 rounded px-1.5 py-0.5 text-[#93a0ac]"
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price & Add Button Row */}
                      <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-sm text-[#ece7de] font-semibold">
                          ${p.price} USD
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            tactile.medium();
                            onAddToCart(p);
                          }}
                          aria-label={`Añadir ${p.name}`}
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-md ${
                            isRecentlyAdded
                              ? 'bg-[#2f8f8a] border-[#2f8f8a] text-white'
                              : 'border-[#f2c14e] text-[#f2c14e] bg-[#0a0d12]/60 hover:bg-[#f2c14e] hover:text-[#141414] hover:rotate-90'
                          }`}
                        >
                          {isRecentlyAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
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
