import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { tactile } from '../../utils/tactileFeedback';

interface StoreSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  placeholder?: string;
  onFocus?: () => void;
  autoFocus?: boolean;
  onClose?: () => void;
}

export const StoreSearch: React.FC<StoreSearchProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  placeholder = 'Buscar un producto o categoría...',
  onFocus,
  autoFocus = false,
  onClose
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    tactile.softImpact();
    onClearSearch();
    inputRef.current?.focus();
  };

  return (
    <div
      id="store-marketplace-search"
      className="w-full relative z-20 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="relative flex items-center w-full h-[46px] rounded-2xl store-glass-control focus-within:bg-white/[0.14] focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all shadow-md">
        {/* Search Icon */}
        <div className="pl-3.5 pr-2.5 flex items-center pointer-events-none text-white/60">
          <Search className="w-4 h-4 text-[#f2c14e]" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          autoFocus={autoFocus}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          aria-label="Buscar en la tienda"
          className="w-full h-full bg-transparent text-sm text-[#ece7de] placeholder-white/45 font-['Space_Grotesk'] outline-none pr-16"
        />

        {/* Action Buttons Right */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery.trim().length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Limpiar búsqueda"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer tactile-control touch-target-44"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                tactile.selection();
                onClose();
              }}
              aria-label="Ocultar búsqueda"
              className="px-2 py-1 text-[10px] font-['Spline_Sans_Mono',ui-monospace,monospace] uppercase tracking-wider text-white/60 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
