import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { StoreHero } from './StoreHero';
import { StoreSearch } from './StoreSearch';
import { QuickCategoryRail } from './QuickCategoryRail';
import { StoreCatalog } from './StoreCatalog';
import { StoreToast } from './StoreToast';
import { QuickProductSheet } from '../commerce/QuickProductSheet';
import { EditorialCampaignRail } from './EditorialCampaignRail';
import { StoreFiltersState, StoreNavigationIntent } from './storeTypes';
import { getEdition } from '../../domain/content';
import { getEditorialMedia } from '../../domain/editorialMedia';
import { getLiveEdition } from '../../domain/editionRegistry';
import { MagazineEdition, Product } from '../../types';

interface StoreExperienceProps {
  onReturnToEditorial: () => void;
  onOpenEditorialStory?: (storyId: string) => void;
  onAddToCart: (product: Product, selections?: { size?: string; color?: string }) => void;
  cartCount?: number;
  addedToastMessage?: string | null;
  addedProductId?: string | null;
  favoriteProductIds?: Set<string>;
  onToggleFavorite?: (productId: string) => void;
  activeEdition?: MagazineEdition;
  navigationIntent?: StoreNavigationIntent | null;
  onClearNavigationIntent?: () => void;
  isStoreSearchOpen?: boolean;
  onCloseStoreSearch?: () => void;
  storeSearchQuery?: string;
  onStoreSearchChange?: (query: string) => void;
}

const DEFAULT_FILTERS: StoreFiltersState = {
  category: 'Todos',
  brand: 'Todas',
  family: 'todos',
  maxPrice: 3000,
  sort: 'featured',
  searchQuery: '',
  favoritesOnly: false
};

export const StoreExperience: React.FC<StoreExperienceProps> = ({
  onReturnToEditorial,
  onOpenEditorialStory,
  onAddToCart,
  cartCount = 0,
  addedToastMessage = null,
  addedProductId = null,
  favoriteProductIds,
  onToggleFavorite: onToggleFavoriteProp,
  navigationIntent,
  onClearNavigationIntent,
  isStoreSearchOpen = false,
  onCloseStoreSearch,
  storeSearchQuery: storeSearchQueryProp,
  onStoreSearchChange: onStoreSearchChangeProp
}) => {
  const [filters, setFilters] = useState<StoreFiltersState>(DEFAULT_FILTERS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [internalFavoriteIds, setInternalFavoriteIds] = useState<Set<string>>(
    new Set(['manta-01', 'terra-01'])
  );
  const favoriteIds = favoriteProductIds !== undefined ? favoriteProductIds : internalFavoriteIds;
  const [localToast, setLocalToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const storeContainerRef = useRef<HTMLDivElement>(null);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const highlightTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external search query if provided
  useEffect(() => {
    if (storeSearchQueryProp !== undefined && storeSearchQueryProp !== filters.searchQuery) {
      setFilters((prev) => ({
        ...prev,
        searchQuery: storeSearchQueryProp
      }));
    }
  }, [storeSearchQueryProp]);

  // Handle navigationIntent when it arrives
  useEffect(() => {
    if (!navigationIntent) return;

    if (navigationIntent.family) {
      setFilters((prev) => ({
        ...prev,
        family: navigationIntent.family!,
        category: 'Todos',
        favoritesOnly: false,
        searchQuery: ''
      }));
      setTimeout(() => {
        if (catalogRef.current) {
          catalogRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else if (navigationIntent.favoritesOnly) {
      setFilters((prev) => ({
        ...prev,
        favoritesOnly: true,
        category: 'Todos',
        family: 'todos',
        brand: 'Todas',
        searchQuery: ''
      }));
      setTimeout(() => {
        if (catalogRef.current) {
          catalogRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else if (navigationIntent.productId) {
      const prodId = navigationIntent.productId;
      setFilters((prev) => ({
        ...prev,
        category: 'Todos',
        family: 'todos',
        brand: 'Todas',
        favoritesOnly: false,
        searchQuery: ''
      }));
      setHighlightedProductId(prodId);

      setTimeout(() => {
        const el = document.getElementById(`product-card-${prodId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (catalogRef.current) {
          catalogRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);

      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = setTimeout(() => {
        setHighlightedProductId(null);
      }, 2800);
    }

    if (onClearNavigationIntent) {
      onClearNavigationIntent();
    }
  }, [navigationIntent, onClearNavigationIntent]);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setLocalToast(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setLocalToast(null);
    }, 1700);
  }, []);

  const handleChangeFilter = useCallback(
    <K extends keyof StoreFiltersState>(key: K, value: StoreFiltersState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value
      }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    showToast('FILTROS LIMPIOS');
  }, [showToast]);

  const scrollToCatalog = useCallback(() => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSelectQuickCategory = useCallback(
    (type: 'family' | 'category' | 'all', value: string) => {
      if (type === 'all') {
        setFilters((prev) => ({
          ...prev,
          family: 'todos',
          category: 'Todos',
          favoritesOnly: false
        }));
      } else if (type === 'family') {
        setFilters((prev) => ({
          ...prev,
          family: value as any,
          category: 'Todos',
          favoritesOnly: false
        }));
      } else if (type === 'category') {
        setFilters((prev) => ({
          ...prev,
          category: value as any,
          family: 'todos',
          favoritesOnly: false
        }));
      }
      scrollToCatalog();
    },
    [scrollToCatalog]
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      const isCurrentlyFav = favoriteIds.has(productId);
      if (onToggleFavoriteProp) {
        onToggleFavoriteProp(productId);
      } else {
        setInternalFavoriteIds((prev) => {
          const next = new Set(prev);
          if (next.has(productId)) {
            next.delete(productId);
          } else {
            next.add(productId);
          }
          return next;
        });
      }
      showToast(isCurrentlyFav ? 'ELIMINADO DE FAVORITOS' : 'GUARDADO EN ATELIER');
    },
    [favoriteIds, onToggleFavoriteProp, showToast]
  );

  const handleSelectProduct = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
    },
    []
  );

  const activeToast = localToast || addedToastMessage;

  const storeEdition = getLiveEdition();
  const footerEditionLine = `HECHO CON CALMA · ${storeEdition.month.toUpperCase()} · ${storeEdition.themeTitle.toUpperCase()}`;

  const isResultsMode = useMemo(() => {
    return (
      filters.searchQuery.trim().length > 0 ||
      filters.category !== 'Todos' ||
      filters.family !== 'todos' ||
      filters.brand !== 'Todas' ||
      filters.favoritesOnly ||
      filters.maxPrice < 3000
    );
  }, [filters]);

  const isSearchActive = filters.searchQuery.trim().length > 0;
  const editorialStories = getEdition(storeEdition.id).stories;
  const matchingEditorialStories = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();
    if (!query) return [];
    return editorialStories.filter((story) => {
      const noteText = (story.notes ?? []).flatMap((note) => [note.title, ...note.body]).join(' ');
      return `${story.title} ${story.subtitle} ${noteText}`.toLowerCase().includes(query);
    });
  }, [editorialStories, filters.searchQuery]);

  return (
    <div
      id="store-experience-view"
      ref={storeContainerRef}
      className="relative w-full h-full min-h-[100svh] store-glass-surface text-[#ece7de] overflow-y-auto no-scrollbar overflow-x-hidden selection:bg-white selection:text-black pb-24"
      style={{
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Main Container - Padded for fixed App Shell Header */}
      <main
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 74px)'
        }}
        className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 space-y-5 sm:space-y-7 relative z-10"
      >
        {/* ======================================================== */}
        {/* 1. STORE SEARCH (Rendered when toggled from header search button) */}
        {/* ======================================================== */}
        {isStoreSearchOpen && (
          <StoreSearch
            searchQuery={filters.searchQuery}
            autoFocus={true}
            onClose={onCloseStoreSearch}
            onSearchChange={(q) => {
              handleChangeFilter('searchQuery', q);
              if (onStoreSearchChangeProp) {
                onStoreSearchChangeProp(q);
              }
              if (q.trim().length > 0 && catalogRef.current) {
                catalogRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onClearSearch={() => {
              handleChangeFilter('searchQuery', '');
              if (onStoreSearchChangeProp) {
                onStoreSearchChangeProp('');
              }
            }}
          />
        )}

        {/* Search is the only place where discovery controls appear. */}
        {isStoreSearchOpen && (
          <QuickCategoryRail
            filters={filters}
            onSelectCategory={handleSelectQuickCategory}
            onScrollToCatalog={scrollToCatalog}
          />
        )}

        {isStoreSearchOpen && isSearchActive && matchingEditorialStories.length > 0 && (
          <section id="store-search-stories" aria-labelledby="store-search-stories-title" className="space-y-3">
            <div className="px-1">
              <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] uppercase tracking-[0.24em] text-[#f2c14e]">Lectura relacionada</span>
              <h2 id="store-search-stories-title" className="mt-1 font-['Fraunces',Georgia,serif] text-2xl text-white sm:text-3xl">Historias que responden</h2>
            </div>
            <div className="flex snap-x gap-3 overflow-x-auto pb-1 no-scrollbar">
              {matchingEditorialStories.map((story) => {
                const poster = story.campaign ? getEditorialMedia(story.campaign.posterMediaId) : undefined;
                return (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => onOpenEditorialStory?.(story.id)}
                    className="group relative h-40 min-w-[min(78vw,300px)] snap-start overflow-hidden rounded-2xl bg-white/[0.05] text-left shadow-lg transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]"
                    aria-label={`Leer historia ${story.title}`}
                  >
                    {poster?.src && <img src={poster.src} alt={poster.alt ?? story.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
                    <span className="absolute inset-x-4 bottom-4">
                      <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] uppercase tracking-[0.2em] text-[#f2c14e]">{story.title}</span>
                      <span className="mt-1 block font-['Fraunces',Georgia,serif] text-xl leading-tight text-white">{story.subtitle}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* When active search / filters are running, switch immediately to PRODUCT RESULTS */}
        {!isResultsMode ? (
          <>
            {/* The editorial layer introduces the chapter before products. */}
            <StoreHero
              activeEdition={storeEdition}
              onExploreCampaign={onReturnToEditorial}
            />

            <EditorialCampaignRail
              stories={editorialStories}
              onReadStory={onOpenEditorialStory ?? (() => onReturnToEditorial())}
            />

            {/* Brands remain filter data only; they do not occupy editorial space. */}
          </>
        ) : null}

        {/* ======================================================== */}
        {/* DEDICATED SECTIONS OR FULL CATALOG / RESULTS */}
        {/* ======================================================== */}
        <div ref={catalogRef}>
          <StoreCatalog
            filters={filters}
            onChangeFilter={handleChangeFilter}
            onResetFilters={handleResetFilters}
            favoriteIds={favoriteIds}
            recentlyAddedId={addedProductId}
            highlightedProductId={highlightedProductId}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={onAddToCart}
            onSelectProduct={handleSelectProduct}
            isResultsMode={isResultsMode}
          />
        </div>

        {/* ======================================================== */}
        {/* 7. STORE FOOTER & COLOPHON */}
        {/* ======================================================== */}
        <footer className="pt-12 pb-10 border-t border-white/10 grid gap-8 md:grid-cols-[1fr_auto] items-end text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] text-[#93a0ac] tracking-widest uppercase">
          <div className="space-y-3">
            <p className="text-[#f2c14e] font-bold tracking-[0.24em]">MANTA · HECHO CON CALMA</p>
            <p className="max-w-xl leading-relaxed tracking-[0.12em] normal-case text-[#aeb7bf]">
              Revista editorial y comercio contextual para leer, mirar y elegir con intención.
            </p>
            <p className="tracking-[0.12em]">© 2026 Daniel Alexis Aguilar Unibe / MANTA · Todos los derechos reservados.</p>
            <p className="max-w-2xl tracking-[0.12em] normal-case text-[#77838d]">El concepto, diseño de interfaz, nombres de producto, marca, textos, ilustraciones y material fotográfico son propiedad intelectual de su autor. Protegidos por la Ley Federal del Derecho de Autor y de Propiedad Industrial. Prohibida su reproducción, distribución o explotación comercial sin autorización previa por escrito. Hecho en Guadalajara, Jalisco, México.</p>
            <p className="tracking-[0.12em] normal-case text-[#aeb7bf]">Contacto de derechos y licencias: <a href="mailto:danialexisis@me.com" className="text-[#f2c14e] hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#f2c14e]">danialexisis@me.com</a></p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <span>Contacto y redes</span>
            <nav aria-label="Contacto y redes de MANTA" className="flex flex-wrap gap-2 justify-end">
              <a href="mailto:danialexisis@me.com" className="rounded-full bg-white/[0.06] px-4 py-2 hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-[#f2c14e]">Correo</a>
              <a href="https://www.linkedin.com/in/danielunibe" target="_blank" rel="noreferrer" className="rounded-full bg-white/[0.06] px-4 py-2 hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-[#f2c14e]">LinkedIn</a>
              <a href="https://github.com/danielunibe" target="_blank" rel="noreferrer" className="rounded-full bg-white/[0.06] px-4 py-2 hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-[#f2c14e]">GitHub</a>
              <a href="https://dribbble.com/danielalexisis" target="_blank" rel="noreferrer" className="rounded-full bg-white/[0.06] px-4 py-2 hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-[#f2c14e]">Dribbble</a>
            </nav>
            <button
              type="button"
              onClick={onReturnToEditorial}
              className="text-[#f2c14e] hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#f2c14e]"
            >
              Volver a revista ↗
            </button>
          </div>
        </footer>
      </main>

      {/* ======================================================== */}
      {/* CANONICAL REUSABLE QUICK PRODUCT SHEET (Decision Layer) */}
      {/* ======================================================== */}
      <QuickProductSheet
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favoriteIds.has(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={onAddToCart}
        source="store"
      />

      {/* Floating Toast Notification */}
      <StoreToast message={activeToast} />
    </div>
  );
};
