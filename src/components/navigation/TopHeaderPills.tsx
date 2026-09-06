import React from 'react';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { AppMode } from '../../types';
import { tactile } from '../../utils/tactileFeedback';

interface TopHeaderPillsProps {
  progress?: number;
  currentEditionMonth?: string;
  appMode?: AppMode;
  onSelectMode?: (mode: AppMode) => void;
  onToggleMode?: () => void;
  cartCount?: number;
  menuOpen?: boolean;
  onToggleMenu?: () => void;
  onCloseMenu?: () => void;
  onSearchClick?: () => void;
  onCartClick?: () => void;
  isStoreSearchOpen?: boolean;
  onToggleStoreSearch?: () => void;
  storeSearchQuery?: string;
}

const pillStyle: React.CSSProperties = {
  background: 'rgba(15, 18, 22, 0.42)',
  backdropFilter: 'blur(14px) saturate(120%)',
  WebkitBackdropFilter: 'blur(14px) saturate(120%)',
  border: '1px solid transparent',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.18)',
  color: '#ffffff',
  borderRadius: '9999px'
};

export const TopHeaderPills: React.FC<TopHeaderPillsProps> = ({
  appMode = 'editorial',
  onSelectMode,
  onToggleMode,
  cartCount = 0,
  menuOpen = false,
  onToggleMenu,
  onCloseMenu,
  onSearchClick,
  onCartClick,
  isStoreSearchOpen = false,
  onToggleStoreSearch,
  storeSearchQuery = ''
}) => {
  const isStore = appMode === 'store';

  const handleMenuClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    tactile.softImpact();
    if (onToggleMenu) {
      onToggleMenu();
    }
  };

  const handleModeClick = (targetMode: AppMode, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    tactile.selection();
    if (menuOpen && onCloseMenu) {
      onCloseMenu();
    }
    if (onSelectMode) {
      onSelectMode(targetMode);
    } else if (onToggleMode && targetMode !== appMode) {
      onToggleMode();
    }
  };

  const handleSearchClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    tactile.selection();
    if (onSearchClick) {
      onSearchClick();
    }
  };

  const handleStoreSearchToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    tactile.selection();
    if (onToggleStoreSearch) {
      onToggleStoreSearch();
    } else if (onSearchClick) {
      onSearchClick();
    }
  };

  const handleCartClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    tactile.selection();
    onCartClick?.();
  };

  const isSearchActive = isStoreSearchOpen || storeSearchQuery.trim().length > 0;

  return (
    <header
      id="top-header-pills-bar"
      style={{
        top: 'calc(env(safe-area-inset-top, 0px) + 12px)'
      }}
      className="fixed left-0 right-0 z-[60] px-4 sm:px-6 flex items-center justify-between pointer-events-none select-none transition-all duration-200"
    >
      {/* ======================================================== */}
      {/* LEFT PILL: ALWAYS SAYS "MANTA" WITH MENU HAMBURGER ICON */}
      {/* ======================================================== */}
      <div className="pointer-events-auto">
        <button
          id="btn-pill-manta-left"
          type="button"
          onClick={handleMenuClick}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          aria-expanded={menuOpen}
          aria-controls="menuOverlay"
          aria-label={menuOpen ? 'Cerrar menú MANTA' : 'Abrir menú MANTA'}
          style={{
            ...pillStyle,
            background: menuOpen
              ? 'rgba(15, 18, 22, 0.58)'
              : 'rgba(15, 18, 22, 0.44)',
            borderColor: 'transparent',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.18)',
            transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="group relative h-9 px-3.5 sm:px-4 flex items-center justify-center gap-2 text-white active:scale-[0.93] tactile-control touch-target-44 cursor-pointer select-none"
        >
          {/* Animated icon with 90° rotation and spring morph */}
          <span
            style={{
              transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="flex items-center justify-center shrink-0"
          >
            {menuOpen ? (
              <X className="w-3.5 h-3.5 text-white/90 transition-colors duration-200" />
            ) : (
              <Menu className="w-3.5 h-3.5 text-white/90 group-hover:text-white transition-colors duration-200" />
            )}
          </span>

          <span
            className={`font-['Abril_Fatface',serif] text-[13px] tracking-[0.06em] leading-none pt-[1px] [text-shadow:0_1px_3px_rgba(0,0,0,0.85)] transition-colors duration-300 ${
              'text-white'
            }`}
          >
            MANTA
          </span>

        </button>
      </div>

      {/* ======================================================== */}
      {/* RIGHT PILLS: */}
      {/* - MENU OPEN: [ 🔍 ] */}
      {/* - EDITORIAL MODE: [ STORE 🛒 ] */}
      {/* - STORE MODE: [ REVISTA ] [ 🔍 ] */}
      {/* ======================================================== */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        {menuOpen ? (
          <button
            id="btn-header-search"
            type="button"
            onClick={handleSearchClick}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Buscar en menú y catálogo"
            style={pillStyle}
            className="h-9 w-9 flex items-center justify-center text-white tactile-control touch-target-44 transition-colors cursor-pointer select-none"
          >
            <Search className="w-4 h-4 text-white" />
          </button>
        ) : isStore ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="btn-header-revista"
              type="button"
              onClick={(e) => handleModeClick('editorial', e)}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              aria-label="Volver a la revista editorial"
              style={pillStyle}
              className="h-9 px-4 flex items-center justify-center font-['Spline_Sans_Mono',ui-monospace,monospace] text-[11px] tracking-[0.16em] uppercase text-white tactile-control touch-target-44 transition-colors cursor-pointer select-none"
            >
              REVISTA
            </button>
            <button
              id="btn-header-cart"
              type="button"
              onClick={handleCartClick}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              aria-label={`Abrir bolsa${cartCount > 0 ? ` · ${cartCount} piezas` : ''}`}
              style={pillStyle}
              className="relative flex h-9 w-9 items-center justify-center text-white tactile-control touch-target-44 transition-colors cursor-pointer select-none"
            >
              <ShoppingCart className="h-4 w-4 text-white" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-white px-1 font-mono text-[9px] font-bold leading-none text-black">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              id="btn-header-store-search"
              type="button"
              onClick={handleStoreSearchToggle}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              aria-label={isStoreSearchOpen ? 'Cerrar barra de búsqueda' : 'Buscar en la tienda'}
              style={pillStyle}
              className={`h-9 w-9 flex items-center justify-center text-white tactile-control touch-target-44 transition-all cursor-pointer select-none ${
                isSearchActive
                  ? '!bg-white/[0.16] !text-white'
                  : ''
              }`}
            >
              {isStoreSearchOpen ? (
                <X className="w-4 h-4 text-black" />
              ) : (
                <Search
                  className="w-4 h-4 text-white"
                />
              )}
            </button>
          </div>
        ) : (
          <button
            id="btn-header-store"
            type="button"
            onClick={(e) => handleModeClick('store', e)}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="Abrir tienda Store"
            style={pillStyle}
            className="h-9 px-3.5 flex items-center gap-1.5 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[11px] tracking-[0.16em] uppercase text-white tactile-control touch-target-44 transition-colors cursor-pointer select-none"
          >
            <span>STORE</span>
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
            {cartCount > 0 && (
              <span
                id="header-cart-badge"
                className="ml-0.5 px-1 min-w-[16px] h-[16px] rounded-full text-[9px] font-bold flex items-center justify-center font-mono bg-white text-black leading-none"
              >
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
