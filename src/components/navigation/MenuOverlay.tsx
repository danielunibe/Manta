import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, ChevronRight, ArrowLeft } from 'lucide-react';
import { MENU_ITEMS_DATA, MenuItemData, SEASONS_DATA, SeasonItemData, FAMILY_CATEGORIES_DATA, FamilyCategoryData } from './menu/menuData';
import { getLiveProducts } from '../../domain/catalog';
import { Product } from '../../types';

const LIVE_CATALOG_PRODUCTS = getLiveProducts();
import { tactile } from '../../utils/tactileFeedback';

export interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (action: {
    type: 'inicio' | 'temporadas' | 'catalogo' | 'familia' | 'favoritos' | 'carrito' | 'cuenta';
    payload?: any;
  }) => void;
  cartCount?: number;
  favoriteCount?: number;
  currentEditionIndex?: number;
  isSearchActive?: boolean;
  onToggleSearch?: () => void;
  onAddToCart?: (product: Product) => void;
}

type SubView = 'main' | 'temporadas' | 'familia';

export const MenuOverlay: React.FC<MenuOverlayProps> = ({
  isOpen,
  onClose,
  onNavigate,
  cartCount = 0,
  favoriteCount = 0,
  currentEditionIndex = 0,
  isSearchActive = false,
  onToggleSearch,
  onAddToCart
}) => {
  const [activeSubView, setActiveSubView] = useState<SubView>('main');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync search state with external header button [ 🔍 ]
  useEffect(() => {
    if (isSearchActive) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [isSearchActive]);

  // Focus input when search becomes active once visually committed and stable
  useEffect(() => {
    if (isOpen && isSearching) {
      let animId: number;
      const rafId = requestAnimationFrame(() => {
        animId = requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      });
      return () => {
        cancelAnimationFrame(rafId);
        if (animId) cancelAnimationFrame(animId);
      };
    }
  }, [isOpen, isSearching]);

  // Reset states when closed
  useEffect(() => {
    if (!isOpen) {
      setActiveSubView('main');
      setIsSearching(false);
      setSearchQuery('');
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isSearching) {
          setIsSearching(false);
          setSearchQuery('');
          if (onToggleSearch) onToggleSearch();
        } else if (activeSubView !== 'main') {
          setActiveSubView('main');
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSearching, activeSubView, onClose, onToggleSearch]);

  const handleSelectMenuItem = useCallback(
    (item: MenuItemData) => {
      tactile.selection();
      if (item.actionType === 'temporadas') {
        setActiveSubView('temporadas');
        return;
      }
      if (item.actionType === 'familia') {
        setActiveSubView('familia');
        return;
      }

      onNavigate({ type: item.actionType });
      onClose();
    },
    [onClose, onNavigate]
  );

  const handleSelectSeason = useCallback(
    (season: SeasonItemData) => {
      tactile.selection();
      onNavigate({
        type: 'temporadas',
        payload: {
          editionIndex: season.editionIndex ?? 0,
          seasonId: season.id
        }
      });
      onClose();
    },
    [onClose, onNavigate]
  );

  const handleSelectFamilyCategory = useCallback(
    (cat: FamilyCategoryData) => {
      tactile.selection();
      onNavigate({
        type: 'familia',
        payload: {
          family: cat.family || cat.id,
          categoryId: cat.id
        }
      });
      onClose();
    },
    [onClose, onNavigate]
  );

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      tactile.softImpact();
      onClose();
    }
  };

  // Filtered search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return LIVE_CATALOG_PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.family.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.tag?.toLowerCase().includes(q)
      );
    }).slice(0, 8);
  }, [searchQuery]);

  const handleSelectProduct = (prod: Product) => {
    tactile.selection();
    onNavigate({
      type: 'catalogo',
      payload: {
        productId: prod.id
      }
    });
    onClose();
  };

  // Seasons available for editorial
  const editorialSeasons = useMemo(() => {
    return SEASONS_DATA.filter((s) => s.editionIndex !== undefined);
  }, []);

  return (
    <div
      id="menuOverlay"
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label="Índice Editorial MANTA"
      onClick={handleBackdropClick}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      style={{
        background: 'rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s',
        zIndex: 55
      }}
      className={`fixed inset-0 h-[100svh] max-h-[100svh] w-full select-none overflow-hidden flex flex-col justify-start ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* 
        Safe-zone container for Top Header:
        Content starts precisely after fixed header [MANTA] ... [ 🔍 ]
      */}
      <div
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 64px)',
          transform: isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(-104%, 0, 0)',
          transition: 'transform 0.46s cubic-bezier(0.16, 1, 0.3, 1)',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.85), 0 1px 3px rgba(0, 0, 0, 0.95)'
        }}
        className="w-full max-w-xl md:max-w-4xl mx-auto px-5 sm:px-8 h-full flex flex-col justify-start overflow-hidden pb-4"
      >
        {isSearching ? (
          /* ======================================================== */
          /* 1. BÚSQUEDA FLUIDA INTEGRADA BAJO HEADER                 */
          /* ======================================================== */
          <div className="flex flex-col h-full overflow-hidden animate-fadeIn space-y-4">
            {/* Header & Back to Index button */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="font-['Abril_Fatface',serif] text-lg sm:text-xl text-[#ece7de] tracking-wide">
                  BUSCADOR
                </span>
                <span className="text-white/25 text-xs">·</span>
                <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.2em] text-white/50 uppercase">
                  MANTA STORE
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  tactile.selection();
                  setIsSearching(false);
                  setSearchQuery('');
                  if (onToggleSearch) onToggleSearch();
                }}
                className="inline-flex items-center gap-1 text-[11px] font-['Spline_Sans_Mono',ui-monospace,monospace] text-[#93a0ac] hover:text-white uppercase tracking-wider transition-colors cursor-pointer py-1.5 px-2.5 rounded-full hover:bg-white/5 tactile-control touch-target-44"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ÍNDICE</span>
              </button>
            </div>

            {/* Direct Search Input Field */}
            <div className="relative shrink-0">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos o categorías..."
                className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white/[0.06] border-0 focus:ring-2 focus:ring-[#f2c14e]/55 text-xs sm:text-sm text-[#ece7de] placeholder:text-white/30 outline-none font-['Spline_Sans_Mono',ui-monospace,monospace] transition-colors"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    tactile.softImpact();
                    setSearchQuery('');
                  }}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white cursor-pointer tactile-control touch-target-44"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results / Fast Suggestions */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
              {searchQuery.trim().length === 0 ? (
                <div className="space-y-3 pt-2">
                  <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.22em] text-white/40 uppercase block">
                    SUGERENCIAS RÁPIDAS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Mujer', 'Hombre', 'Niños', 'Bebé', 'Ropa', 'Calzado', 'Accesorios', 'Mochilas', 'Abrigos'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          tactile.selection();
                          setSearchQuery(chip);
                        }}
                        className="px-3.5 py-1.5 rounded-full border-0 bg-white/[0.06] text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] text-white/70 hover:text-white hover:bg-white/[0.14] focus-visible:ring-2 focus-visible:ring-[#f2c14e] transition-colors cursor-pointer tactile-control"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-[#93a0ac] font-['Space_Grotesk'] text-xs space-y-2">
                  <p>Sin resultados para &ldquo;{searchQuery}&rdquo;</p>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate({ type: 'catalogo' });
                      onClose();
                    }}
                    className="text-xs text-[#f2c14e] hover:underline cursor-pointer"
                  >
                    Ver catálogo completo →
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className="flex items-center justify-between py-2.5 px-1 hover:bg-white/5 transition-colors cursor-pointer group tactile-control min-h-[52px]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-12 object-cover rounded bg-black/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[9px] font-['Spline_Sans_Mono',ui-monospace,monospace] text-white/40 uppercase block truncate">
                            {prod.category}
                          </span>
                          <h4 className="text-xs font-medium text-[#ece7de] group-hover:text-[#f2c14e] transition-colors truncate font-['Space_Grotesk']">
                            {prod.name}
                          </h4>
                          <span className="text-[11px] font-bold text-[#ece7de] font-['Spline_Sans_Mono',ui-monospace,monospace]">
                            {prod.priceFormatted}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeSubView === 'temporadas' ? (
          /* ======================================================== */
          /* 2. SUBVISTA TEMPORADAS (QUIOSCO DE REVISTAS EDITORIALES) */
          /* ======================================================== */
          <div className="flex flex-col h-full overflow-hidden animate-fadeIn space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => {
                  tactile.selection();
                  setActiveSubView('main');
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-['Spline_Sans_Mono',ui-monospace,monospace] text-[#f2c14e] hover:text-white uppercase tracking-wider transition-colors cursor-pointer py-1.5 px-2.5 rounded-full hover:bg-white/5 tactile-control touch-target-44"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>VOLVER AL ÍNDICE</span>
              </button>
              <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.2em] text-white/40 uppercase">
                EDICIONES DEL STAND
              </span>
            </div>

            <div className="space-y-0.5 shrink-0">
              <h3 className="font-['Abril_Fatface',serif] text-xl sm:text-2xl text-[#ece7de] tracking-wide [text-shadow:0_2px_8px_rgba(0,0,0,0.85)]">
                QUIOSCO DE REVISTAS
              </h3>
              <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.18em] text-[#93a0ac] uppercase">
                TOCA UNA EDICIÓN PARA SACARLA AL STAND CENTRAL
              </p>
            </div>

            {/* Visual rack of available editions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 overflow-y-auto no-scrollbar py-1">
              {editorialSeasons.map((season) => {
                const isCurrent = season.editionIndex === currentEditionIndex;
                return (
                  <button
                    key={season.id}
                    type="button"
                    onClick={() => handleSelectSeason(season)}
                    className={`group relative flex sm:flex-col items-center sm:items-start gap-3 p-2.5 sm:p-3 rounded-xl text-left cursor-pointer transition-all duration-300 tactile-control touch-target-44 border ${
                      isCurrent
                        ? 'bg-[#f2c14e]/10 border-[#f2c14e]/60 shadow-[0_0_20px_rgba(242,193,78,0.2)]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.06]'
                    }`}
                  >
                    {/* Realistic 3D magazine cover thumbnail */}
                    <div className="relative w-14 sm:w-full aspect-[5/7] max-h-36 sm:max-h-40 rounded-md overflow-hidden shrink-0 shadow-lg border border-white/15">
                      <img
                        src={season.image}
                        alt={season.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Spine gradient effect */}
                      <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
                      {/* Brand micro stamp */}
                      <div className="absolute top-1 left-1 px-1 py-0.2 bg-black/65 backdrop-blur-sm rounded text-[7px] font-['Abril_Fatface',serif] text-white">
                        MANTA
                      </div>
                      <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/75 backdrop-blur-sm rounded text-[7.5px] font-mono text-[#f2c14e]">
                        {season.number}
                      </div>
                    </div>

                    {/* Meta & Selection */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-['Fraunces',Georgia,serif] text-sm sm:text-base font-bold text-[#ece7de] group-hover:text-[#f2c14e] transition-colors truncate">
                          {season.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[7.5px] font-['Spline_Sans_Mono',ui-monospace,monospace] px-1.5 py-0.5 rounded-full bg-[#f2c14e] text-black font-bold uppercase tracking-wider shrink-0">
                            EN STAND ✦
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] font-['Spline_Sans_Mono',ui-monospace,monospace] text-[#f2c14e]/90 uppercase tracking-wider truncate mb-1">
                        VOL. {season.number} · {season.year}
                      </p>
                      <p className="text-[10px] text-white/60 line-clamp-1 font-['Space_Grotesk']">
                        {season.theme}
                      </p>

                      <div className="mt-2 hidden sm:flex items-center gap-1 text-[9px] font-mono text-[#f2c14e] uppercase group-hover:translate-x-0.5 transition-transform">
                        <span>SACAR REVISTA</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="sm:hidden shrink-0">
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#f2c14e] group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : activeSubView === 'familia' ? (
          /* ======================================================== */
          /* 3. SUBVISTA FAMILIA (REEMPLAZA ÍNDICE SIN SCROLL)        */
          /* ======================================================== */
          <div className="flex flex-col h-full overflow-hidden animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <button
                type="button"
                onClick={() => {
                  tactile.selection();
                  setActiveSubView('main');
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-['Spline_Sans_Mono',ui-monospace,monospace] text-[#f2c14e] hover:text-white uppercase tracking-wider transition-colors cursor-pointer py-1.5 px-2.5 rounded-full hover:bg-white/5 tactile-control touch-target-44"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>VOLVER AL ÍNDICE</span>
              </button>
              <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.2em] text-white/40 uppercase">
                COLECCIÓN FAMILIAR
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-['Abril_Fatface',serif] text-xl sm:text-2xl text-[#ece7de] tracking-wide [text-shadow:0_2px_8px_rgba(0,0,0,0.85)]">
                FAMILIA
              </h3>
              <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.2em] text-[#93a0ac] uppercase">
                LÍNEAS Y PRENDAS POR INTEGRANTE
              </p>
            </div>

            <div className="divide-y divide-white/5 py-1">
              {FAMILY_CATEGORIES_DATA.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectFamilyCategory(cat)}
                  className="w-full flex items-center justify-between py-3 px-1 text-left hover:bg-white/5 transition-colors cursor-pointer group tactile-control min-h-[52px]"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs font-mono text-[#f2c14e]/70">
                      0{idx + 1}
                    </span>
                    <div>
                      <span className="font-['Fraunces',Georgia,serif] text-base sm:text-lg font-bold text-[#ece7de] group-hover:text-[#f2c14e] transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-['Space_Grotesk'] text-white/50 block line-clamp-1">
                        {cat.description}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* 4. ÍNDICE PRINCIPAL MOBILE-FIRST (COMPACTO SIN SCROLL)   */
          /* ======================================================== */
          <div className="flex flex-col justify-between h-full overflow-hidden">
            {/* Header Identity */}
            <div className="flex items-baseline justify-between border-b border-white/10 pb-2.5 shrink-0">
              <div>
                <span className="font-['Abril_Fatface',serif] text-2xl text-[#ece7de] tracking-wide [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
                  ÍNDICE
                </span>
              </div>
            </div>

            {/* Main Navigation List: Fits in 375x667 viewport without vertical scrolling */}
            <nav
              aria-label="Navegación principal"
              className="flex flex-col divide-y divide-white/5 py-1 mt-1.5 sm:mt-2 mb-auto"
            >
              {MENU_ITEMS_DATA.map((item, idx) => {
                let badgeCount = 0;
                if (item.id === 'carrito') badgeCount = cartCount;
                if (item.id === 'favoritos') badgeCount = favoriteCount;
                const hasSub = item.actionType === 'temporadas' || item.actionType === 'familia';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectMenuItem(item)}
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                      transitionDelay: `${idx * 28}ms`
                    }}
                    className="w-full flex items-center justify-between py-2 sm:py-2.5 px-2 text-left hover:bg-white/[0.04] transition-colors cursor-pointer group tactile-control min-h-[44px]"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[11px] font-medium text-[#f2c14e]/80 tracking-wider [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                        {item.number}
                      </span>
                      <span className="font-['Abril_Fatface',serif] text-lg sm:text-xl tracking-wide text-[#ece7de] group-hover:text-white group-hover:translate-x-0.5 transition-all [text-shadow:0_2px_8px_rgba(0,0,0,0.85)]">
                        {item.title}
                      </span>
                      {item.id === 'temporadas' && (
                        <span className="hidden xs:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#f2c14e]/15 border border-[#f2c14e]/30 text-[8px] font-mono text-[#f2c14e] uppercase tracking-wider">
                          3 REVISTAS
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {badgeCount > 0 && (
                        <span className="px-1.5 py-0.2 min-w-[18px] h-[16px] rounded-full text-[9px] font-mono font-bold bg-[#f2c14e] text-black flex items-center justify-center">
                          {badgeCount}
                        </span>
                      )}
                      {hasSub ? (
                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Micro-colophon at bottom (single discreet line, safe for small viewports) */}
            <div className="pt-2 border-t border-white/10 shrink-0 flex items-center justify-between text-[9px] font-['Spline_Sans_Mono',ui-monospace,monospace] text-white/40 tracking-wider uppercase">
              <span>GUADALAJARA · MÉXICO</span>
              <span>MANTA © 2026</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
