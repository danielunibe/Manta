import React from 'react';
import { StoreCategory, StoreFamilyCategory, StoreFiltersState } from './storeTypes';
import { RotateCcw, X, SlidersHorizontal, Heart } from 'lucide-react';
import { tactile } from '../../utils/tactileFeedback';

interface StoreFiltersProps {
  filters: StoreFiltersState;
  onChangeFilter: <K extends keyof StoreFiltersState>(key: K, value: StoreFiltersState[K]) => void;
  onResetFilters: () => void;
  totalProductsCount: number;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

const CATEGORIES: StoreCategory[] = ['Todos', 'Ropa', 'Calzado', 'Accesorios', 'Mochilas', 'Peluches', 'Abrigos', 'Camisas', 'Pantalones'];
const FAMILIES: { id: StoreFamilyCategory; label: string }[] = [
  { id: 'todos', label: 'Toda la Familia' },
  { id: 'mujer', label: 'Mujer' },
  { id: 'hombre', label: 'Hombre' },
  { id: 'ninos', label: 'Niños' },
  { id: 'bebe', label: 'Bebé' }
];

export const StoreFilters: React.FC<StoreFiltersProps> = ({
  filters,
  onChangeFilter,
  onResetFilters,
  totalProductsCount,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  return (
    <aside
      id={isMobileDrawer ? 'store-filters-sheet' : 'store-filters-sidebar'}
      aria-label="Filtros del catálogo"
      style={
        isMobileDrawer
          ? { paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }
          : undefined
      }
      className={
        isMobileDrawer
          ? 'w-full space-y-5 p-5 overflow-y-auto no-scrollbar max-h-[82vh]'
          : 'w-full lg:w-72 xl:w-80 rounded-2xl store-glass-control p-5 space-y-5 shrink-0 h-fit hidden lg:block'
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-[#f2c14e]">
          <SlidersHorizontal className="w-4 h-4" />
          <h3 className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs font-semibold tracking-[0.22em] uppercase">
            FILTROS
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              tactile.softImpact();
              onResetFilters();
            }}
            className="text-[10px] font-['Spline_Sans_Mono',ui-monospace,monospace] uppercase tracking-wider text-white/60 hover:text-[#f2c14e] flex items-center gap-1 transition-colors cursor-pointer py-1.5 px-2.5 rounded-full hover:bg-white/5 tactile-control touch-target-44"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
          {isMobileDrawer && onCloseMobileDrawer && (
            <button
              type="button"
              onClick={() => {
                tactile.softImpact();
                onCloseMobileDrawer();
              }}
              aria-label="Cerrar filtros"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer tactile-control touch-target-44"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Favorites Toggle */}
      <button
        type="button"
        onClick={() => {
          tactile.softImpact();
          onChangeFilter('favoritesOnly', !filters.favoritesOnly);
        }}
        className={`w-full py-2.5 px-3.5 min-h-[44px] rounded-xl text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] tracking-wider uppercase transition-all cursor-pointer text-left flex items-center justify-between tactile-control ${
            filters.favoritesOnly
            ? 'bg-[#f2c14e]/18 text-[#f2c14e] font-bold shadow-md shadow-[#f2c14e]/20'
            : 'bg-white/5 hover:bg-white/10 text-[#ece7de]'
        }`}
      >
        <div className="flex items-center gap-2">
          <Heart className={`w-3.5 h-3.5 ${filters.favoritesOnly ? 'fill-black text-black' : 'text-[#f2c14e]'}`} />
          <span>Solo Favoritos</span>
        </div>
        {filters.favoritesOnly && <span className="text-[9px] uppercase font-mono font-bold">Activo</span>}
      </button>

      {/* 1. Category Filter */}
      <div className="space-y-2">
        <label className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-wider text-white/60 block">
          Categoría
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  tactile.selection();
                  onChangeFilter('category', cat);
                }}
                className={`py-2.5 px-3 min-h-[44px] rounded-xl text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] tracking-wider uppercase transition-all cursor-pointer text-left flex items-center justify-between tactile-control ${
                  isSelected
                    ? 'bg-[#f2c14e]/18 text-[#f2c14e] font-bold shadow-md shadow-[#f2c14e]/20'
                    : 'bg-white/5 hover:bg-white/10 text-[#ece7de]'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Family Target Filter */}
      <div className="space-y-2">
        <label className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-wider text-white/60 block">
          Colección Familiar
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FAMILIES.map((fam) => {
            const isSelected = filters.family === fam.id;
            return (
              <button
                key={fam.id}
                type="button"
                onClick={() => {
                  tactile.selection();
                  onChangeFilter('family', fam.id);
                }}
                className={`py-2 px-3.5 min-h-[40px] rounded-full text-xs font-['Space_Grotesk'] transition-all cursor-pointer tactile-control ${
                  isSelected
                    ? 'bg-white/20 text-[#f2c14e] font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
              >
                {fam.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Range Slider */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-wider text-white/60">
            Precio Máximo
          </label>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs font-bold text-[#f2c14e]">
            ${filters.maxPrice.toLocaleString()} MXN
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={3000}
          step={50}
          value={filters.maxPrice}
          onChange={(e) => onChangeFilter('maxPrice', Number(e.target.value))}
          className="w-full accent-[#f2c14e] cursor-pointer"
        />
        <div className="flex items-center justify-between text-[8.5px] font-['Spline_Sans_Mono',ui-monospace,monospace] text-white/50">
          <span>$500 MXN</span>
          <span>$3,000 MXN</span>
        </div>
      </div>

      {/* Mobile Drawer Apply Button */}
      {isMobileDrawer && onCloseMobileDrawer && (
        <div className="pt-3">
          <button
            type="button"
            onClick={() => {
              tactile.softImpact();
              onCloseMobileDrawer();
            }}
            className="w-full py-3.5 min-h-[48px] rounded-full bg-[#f2c14e]/18 text-[#f2c14e] font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs font-bold uppercase tracking-wider hover:bg-[#f2c14e]/28 cursor-pointer shadow-lg shadow-[#f2c14e]/20 tactile-control touch-target-44"
          >
            Ver {totalProductsCount} {totalProductsCount === 1 ? 'Prenda' : 'Prendas'}
          </button>
        </div>
      )}
    </aside>
  );
};
