import React from 'react';
import { STORE_BRANDS } from './storeData';
import { StoreBrand } from './storeTypes';
import { Sparkles, Clock, Check } from 'lucide-react';
import { tactile } from '../../utils/tactileFeedback';

interface BrandGridProps {
  selectedBrand?: string;
  onSelectBrand: (brandName: string) => void;
  onBrandSoon: (brandName: string) => void;
}

export const BrandGrid: React.FC<BrandGridProps> = ({
  selectedBrand = 'Todas',
  onSelectBrand,
  onBrandSoon
}) => {
  const handleClick = (brand: StoreBrand) => {
    tactile.selection();
    if (brand.status === 'available') {
      // Toggle if already selected
      if (selectedBrand.toLowerCase() === brand.name.toLowerCase()) {
        onSelectBrand('Todas');
      } else {
        onSelectBrand(brand.name);
      }
    } else {
      onBrandSoon(brand.name);
    }
  };

  return (
    <section id="store-brands-section" className="space-y-3 pt-2">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-3 px-0.5">
        <div>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] uppercase text-[#2f8f8a] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            SELECCIÓN DE LA EDICIÓN
          </span>
          <h2
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
            className="font-['Fraunces',Georgia,serif] text-xl sm:text-2xl md:text-3xl font-bold text-[#ece7de] tracking-tight"
          >
            Descubre por atmósfera
          </h2>
        </div>
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] text-[#93a0ac] uppercase tracking-wider hidden sm:inline">
          Selección editorial
        </span>
      </div>

      {/* Horizontal Brand Discovery Rail */}
      <div
        className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 px-0.5 -mx-0.5 select-none"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain'
        }}
      >
        {/* "Todas" Chip */}
        <button
          type="button"
          onClick={() => {
            tactile.selection();
            onSelectBrand('Todas');
          }}
          className={`shrink-0 py-2.5 px-4 min-h-[44px] rounded-2xl flex items-center gap-2 text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] uppercase tracking-wider transition-all cursor-pointer tactile-control ${
            selectedBrand === 'Todas'
              ? 'bg-[#f2c14e]/18 text-[#f2c14e] font-bold shadow-md shadow-[#f2c14e]/20'
              : 'store-glass-control text-white/80 hover:text-white'
          }`}
        >
          <span>Todas ({STORE_BRANDS.filter((b) => b.status === 'available').length})</span>
        </button>

        {STORE_BRANDS.map((brand) => {
          const isSelected = selectedBrand.toLowerCase() === brand.name.toLowerCase();
          const isAvailable = brand.status === 'available';

          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => handleClick(brand)}
              aria-label={`Selección ${brand.name} - ${isAvailable ? 'Disponible' : 'Próximamente'}`}
              className={`shrink-0 py-2.5 px-3.5 min-h-[44px] rounded-2xl flex items-center gap-2 border backdrop-blur-md transition-all cursor-pointer tactile-control ${brand.visualVariant} ${
                isSelected
                  ? '!ring-2 !ring-[#f2c14e] !border-[#f2c14e] !bg-[#f2c14e]/25 !text-[#ece7de] font-bold shadow-md shadow-[#f2c14e]/20'
                  : ''
              }`}
            >
              {isSelected ? (
                <div className="w-4 h-4 rounded-full bg-[#f2c14e] text-black flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
              ) : isAvailable ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              ) : (
                <Clock className="w-3 h-3 opacity-60 shrink-0" />
              )}

              <span className="font-['Fraunces',Georgia,serif] text-sm font-bold tracking-tight whitespace-nowrap">
                {brand.name}
              </span>

              {!isAvailable && (
                <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] uppercase tracking-widest text-white/50 whitespace-nowrap">
                  Próx
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
