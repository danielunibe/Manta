import React, { Suspense, useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { EDITIONS } from './domain/editionRegistry';
import { BackgroundCanvasManager } from './components/canvas/BackgroundCanvasManager';
import { AugustCover } from './components/covers/AugustCover';
import { SeptemberCover } from './components/covers/SeptemberCover';
import { OctoberCover } from './components/covers/OctoberCover';
import { SwipeUpHint } from './components/navigation/SwipeUpHint';
import { TopHeaderPills } from './components/navigation/TopHeaderPills';
import { MenuOverlay } from './components/navigation/MenuOverlay';
import { tactile } from './utils/tactileFeedback';
import { useCoverStoryTransition } from './features/editorial/transition/useCoverStoryTransition';
import { CoverStorySurface } from './features/editorial/transition/CoverStorySurface';
const StoreExperience = React.lazy(() => import('./features/store/StoreExperience').then((module) => ({ default: module.StoreExperience })));
import { StoreNavigationIntent } from './features/store/storeTypes';
import { AppMode, CartItem, Product } from './types';
import { getProduct, getProductsByIds } from './domain/catalog';
import { QuickProductSheet } from './features/commerce/QuickProductSheet';
import { LookComposer } from './features/commerce/LookComposer';
import { initialMantaState, mantaReducer } from './domain/appState';
import { AmbientAudio, AudioDock } from './features/audio/AudioDock';
import { getEditorialMedia } from './domain/editorialMedia';
import { getStory } from './domain/content';
import { CartDrawer } from './features/commerce/CartDrawer';

const INITIAL_EDITION_ID = 'august';
const INITIAL_EDITION_INDEX = Math.max(0, EDITIONS.findIndex((edition) => edition.id === INITIAL_EDITION_ID));

export default function App() {
  const [mantaState, dispatch] = useReducer(mantaReducer, initialMantaState);
  const [storeNavigationIntent, setStoreNavigationIntent] = useState<StoreNavigationIntent | null>(null);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_EDITION_INDEX);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lookIndices, setLookIndices] = useState<number[]>([0, 0, 0]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState(false);
  const favoriteProductIds = mantaState.favoriteProductIds;

  const handleToggleFavorite = useCallback((productId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', productId });
  }, []);

  const favoriteCount = favoriteProductIds.size;
  const [addedToastMessage, setAddedToastMessage] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1000
  );

  const [menuSearchActive, setMenuSearchActive] = useState(false);
  const [isStoreSearchOpen, setIsStoreSearchOpen] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const activeEdition = EDITIONS[currentIndex] || EDITIONS[0];
  const [editorialProductId, setEditorialProductId] = useState<string | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const wheelLockUntilRef = useRef(0);
  const lookProductIds = mantaState.selectedLookProductIds;
  const activeAudioTrack = activeAudioId ? getEditorialMedia(activeAudioId) ?? null : null;
  const augustAudioTrack = getEditorialMedia('audio-despues-del-agua') ?? null;
  const ambientAudioTrack = getEditorialMedia(
    activeEdition?.id === 'september'
      ? 'audio-materia-que-camina'
      : activeEdition?.id === 'october'
      ? 'audio-la-noche-nos-junta'
      : 'audio-despues-del-agua'
  ) ?? augustAudioTrack;

  const handleHeaderSearchClick = useCallback(() => {
    setMenuSearchActive((prev) => !prev);
  }, []);

  const handleToggleStoreSearch = useCallback(() => {
    setIsStoreSearchOpen((prev) => !prev);
  }, []);

  const handleAddToCart = useCallback((product: Product, selections?: { size?: string; color?: string }) => {
    if (product.storeVisible === false || product.releaseEditionId === 'september' || product.releaseEditionId === 'october') {
      setAddedToastMessage('PRÓXIMAMENTE · ESTA PIEZA AÚN NO ESTÁ DISPONIBLE');
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selections?.size) {
      setAddedToastMessage('SELECCIONA UNA TALLA EN DETALLES');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', product, selections });

    const sizeSuffix = selections?.size ? ` (${selections.size})` : '';
    setAddedToastMessage(`✓ ${product.name.toUpperCase()}${sizeSuffix} AÑADIDO`);
    setAddedProductId(product.id);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setAddedToastMessage(null);
      setAddedProductId(null);
    }, 1700);
  }, []);

  const handleAddToLook = useCallback((productId: string) => {
    dispatch({ type: 'ADD_TO_LOOK', productId });
    setAddedToastMessage('LOOK · PIEZA AÑADIDA A LA COMPOSICIÓN');
  }, []);

  const handleUpdateCartQuantity = useCallback((item: CartItem, quantity: number) => {
    dispatch({
      type: 'UPDATE_CART_QUANTITY',
      productId: item.product.id,
      quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor
    });
  }, []);

  const cartCount = mantaState.cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const currentIndexRef = useRef<number>(0);

  // Keep currentIndexRef synchronized
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload magazine photos
  useEffect(() => {
    EDITIONS.forEach(ed => {
      ed.looks.forEach(l => {
        const img = new Image();
        img.src = l.image;
      });
    });
    const timer = setTimeout(() => setIsReady(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => {
      const next = Math.max(0, prev - 1);
      if (next !== prev) tactile.selection();
      return next;
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      const next = Math.min(EDITIONS.length - 1, prev + 1);
      if (next !== prev) tactile.selection();
      return next;
    });
  }, []);

  const handleSelect = useCallback((index: number) => {
    setCurrentIndex(prev => {
      if (index !== prev) tactile.selection();
      return index;
    });
  }, []);

  const handleTriggerBurst = useCallback(() => {
    setBurstTrigger(prev => prev + 1);
  }, []);

  const handleLookChange = useCallback((editionIdx: number, lookIdx: number) => {
    setLookIndices(prev => {
      const next = [...prev];
      next[editionIdx] = lookIdx;
      return next;
    });
  }, []);

  // Responsive center-to-center spacing
  const safeWindowWidth =
    typeof windowWidth === 'number' && Number.isFinite(windowWidth) && windowWidth > 0
      ? windowWidth
      : 1000;
  const slideSpacing = Math.max(260, Math.min(safeWindowWidth * 0.72, 420));

  const isDraggingRef = useRef(false);

  // Smooth asymptotic rubber-band for carousel edges (Gate T2)
  // At delta = 0, slope = 1 (free initial motion). Smoothly approaches asymptote maxResistance.
  const calculateEdgeResistance = (delta: number, maxResistance: number = 85): number => {
    if (delta === 0) return 0;
    const sign = Math.sign(delta);
    const abs = Math.abs(delta);
    return sign * maxResistance * (1 - Math.exp(-abs / maxResistance));
  };

  // Horizontal carousel drag handler - 1:1 follow-finger with smooth asymptotic edge resistance
  const handleHorizontalDrag = useCallback((deltaX: number) => {
    if (!isDraggingRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);
    }
    const curIdx = currentIndexRef.current;
    let adjustedDelta = deltaX;
    if (curIdx === 0 && deltaX > 0) {
      adjustedDelta = calculateEdgeResistance(deltaX, 85);
    } else if (curIdx === EDITIONS.length - 1 && deltaX < 0) {
      adjustedDelta = calculateEdgeResistance(deltaX, 85);
    }

    setDragOffset(adjustedDelta);
  }, []);

  // Horizontal carousel drag end handler - commit decision via distance + velocity, max 1 magazine
  const handleHorizontalDragEnd = useCallback(
    (deltaX: number, velocityX: number) => {
      const commitThreshold = Math.min(100, Math.max(60, slideSpacing * 0.28));
      const curIdx = currentIndexRef.current;
      let targetIdx = curIdx;

      // Strictly at most 1 magazine advancement per gesture, even with high velocity
      if ((deltaX < -commitThreshold || (velocityX < -0.30 && deltaX < -15)) && curIdx < EDITIONS.length - 1) {
        targetIdx = curIdx + 1;
      } else if ((deltaX > commitThreshold || (velocityX > 0.30 && deltaX > 15)) && curIdx > 0) {
        targetIdx = curIdx - 1;
      }

      if (targetIdx !== curIdx) {
        tactile.selection();
        setCurrentIndex(targetIdx);
      }

      setDragOffset(0);
      isDraggingRef.current = false;
      setIsDragging(false);
    },
    [slideSpacing]
  );

  // Measure active cover geometry once before cover morph detaches
  const handleBeforeDetach = useCallback(() => {
    const el = document.getElementById(`cover-story-surface-${activeEdition.id}`);
    if (el) {
      const article = el.querySelector('article') || el;
      const r = article.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        return {
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height
        };
      }
    }
    return null;
  }, [activeEdition.id]);

  // Cover -> Story Vertical Gesture & Morph Hook
  const {
    phase,
    openProgress: progress,
    isCoverDetached,
    coverStartRect,
    pageProgress,
    pageDirection,
    targetStoryIndex,
    flipToNext,
    flipToPrev,
    openStory,
    closeStory,
    resetToCover,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd
  } = useCoverStoryTransition({
    currentStoryIndex: lookIndices[currentIndex],
    editionLooksCount: EDITIONS[currentIndex]?.looks.length || 1,
    onStoryIndexChange: (idx) => handleLookChange(currentIndex, idx),
    onHorizontalDrag: handleHorizontalDrag,
    onHorizontalDragEnd: handleHorizontalDragEnd,
    canNavigateHorizontal: true,
    onBeforeDetach: handleBeforeDetach
  });

  const handleReturnToEditorial = useCallback(() => {
    setStoreNavigationIntent(null);
    setIsStoreSearchOpen(false);
    setCurrentIndex(0);
    setLookIndices((prev) => prev.map(() => 0));
    resetToCover();
    dispatch({ type: 'OPEN_EDITORIAL' });
  }, [resetToCover]);

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    if (menuOpen || mantaState.mode === 'store') return;

    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a, input, select, textarea, [role="button"]')) return;

    const deltaX = event.deltaX;
    const deltaY = event.deltaY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const now = performance.now();
    if (now < wheelLockUntilRef.current) {
      event.preventDefault();
      return;
    }

    const isVertical = absY > 24 && absY >= absX * 1.2;
    const isHorizontal = absX > 24 && absX >= absY * 1.2;

    if (isVertical && phase === 'cover' && deltaY < 0) {
      event.preventDefault();
      wheelLockUntilRef.current = now + 620;
      openStory();
      return;
    }

    // Trackpad horizontal scroll changes the edition only from the cover.
    // Story reading remains strictly vertical to protect the page narrative.
    if (isHorizontal && phase === 'cover') {
      event.preventDefault();
      wheelLockUntilRef.current = now + 520;
      handleHorizontalDragEnd(deltaX > 0 ? 120 : -120, deltaX > 0 ? 0.4 : -0.4);
    }
  }, [handleHorizontalDragEnd, menuOpen, mantaState.mode, openStory, phase]);

  const handleToggleMode = useCallback(() => {
    setMenuOpen(false);
    setMenuSearchActive(false);
    setIsStoreSearchOpen(false);
    if (mantaState.mode === 'store') {
      setCurrentIndex(0);
      setLookIndices((prev) => prev.map(() => 0));
      resetToCover();
    } else {
      const liveIndex = Math.max(0, EDITIONS.findIndex((edition) => edition.status === 'live' && edition.storeEnabled));
      setCurrentIndex(liveIndex);
      setLookIndices((prev) => prev.map(() => 0));
    }
    dispatch({ type: mantaState.mode === 'editorial' ? 'OPEN_STORE' : 'OPEN_EDITORIAL' });
  }, [mantaState.mode, resetToCover]);

  const handleSelectMode = useCallback((mode: AppMode) => {
    if (mode === 'store') {
      const liveIndex = Math.max(0, EDITIONS.findIndex((edition) => edition.status === 'live' && edition.storeEnabled));
      setCurrentIndex(liveIndex);
      setLookIndices((prev) => prev.map(() => 0));
    }
    if (mode === 'editorial') {
      setStoreNavigationIntent(null);
      setIsStoreSearchOpen(false);
      setCurrentIndex(0);
      setLookIndices((prev) => prev.map(() => 0));
      resetToCover();
    }
    dispatch({ type: mode === 'store' ? 'OPEN_STORE' : 'OPEN_EDITORIAL' });
    setMenuOpen(false);
    setMenuSearchActive(false);
  }, [resetToCover]);

  useEffect(() => {
    if (mantaState.mode !== 'editorial' || phase !== 'story') {
      setActiveAudioId(null);
    }
  }, [mantaState.mode, phase]);

  // Keep the fixed editorial surface on the viewport axis. Hidden overflow
  // can still retain a horizontal offset after a 3D page transition.
  useEffect(() => {
    const appShell = document.getElementById('app-shell');
    if (appShell) {
      appShell.scrollLeft = 0;
    }
  }, [mantaState.mode, currentIndex, phase]);

  const handleOpenEditorialStory = useCallback((storyId: string) => {
    const story = getStory(storyId);
    if (!story) return;
    const editionIndex = EDITIONS.findIndex((edition) => edition.id === story.editionId);
    const storyIndex = EDITIONS[editionIndex]?.looks.findIndex((look) => look.storyId === story.id) ?? -1;
    if (editionIndex < 0 || storyIndex < 0) return;

    setCurrentIndex(editionIndex);
    setLookIndices((prev) => {
      const next = [...prev];
      next[editionIndex] = storyIndex;
      return next;
    });
    setStoreNavigationIntent(null);
    setIsStoreSearchOpen(false);
    dispatch({ type: 'OPEN_EDITORIAL' });

    const waitForCover = phase === 'cover' ? 180 : 620;
    if (phase !== 'cover') closeStory();
    window.setTimeout(() => openStory(), waitForCover);
  }, [closeStory, openStory, phase]);

  const handleToggleMenu = useCallback(() => {
    // Prevent opening Menu during PageFlip (dragging or settling) to ensure stability
    if (phase === 'page-dragging' || phase === 'page-settling') {
      return;
    }
    setMenuOpen((prev) => {
      const next = !prev;
      if (!next) {
        setMenuSearchActive(false);
      }
      return next;
    });
  }, [phase]);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
    setMenuSearchActive(false);
  }, []);

  const backgroundOpacity = menuOpen
    ? 1
    : mantaState.mode === 'store'
    ? 1
    : Math.max(0, 1 - progress);

  const handleNavigateFromMenu = useCallback(
    (action: {
      type: 'inicio' | 'temporadas' | 'catalogo' | 'familia' | 'favoritos' | 'carrito' | 'cuenta';
      payload?: any;
    }) => {
      switch (action.type) {
        case 'inicio':
          dispatch({ type: 'OPEN_EDITORIAL' });
          if (phase !== 'cover') {
            closeStory();
          }
          break;
        case 'temporadas':
          if (action.payload?.editionIndex !== undefined) {
            const targetIdx = Math.max(0, Math.min(EDITIONS.length - 1, action.payload.editionIndex));
            setCurrentIndex(targetIdx);
          }
          dispatch({ type: 'OPEN_EDITORIAL' });
          break;
        case 'catalogo':
          {
            const liveIndex = Math.max(0, EDITIONS.findIndex((edition) => edition.status === 'live' && edition.storeEnabled));
            setCurrentIndex(liveIndex);
          }
          if (action.payload?.productId) {
            setStoreNavigationIntent({ productId: action.payload.productId });
          } else {
            setStoreNavigationIntent(null);
          }
          dispatch({ type: 'OPEN_STORE' });
          break;
        case 'familia': {
          const liveIndex = Math.max(0, EDITIONS.findIndex((edition) => edition.status === 'live' && edition.storeEnabled));
          setCurrentIndex(liveIndex);
          const family = action.payload?.family || action.payload?.categoryId;
          if (family) {
            setStoreNavigationIntent({ family });
          } else {
            setStoreNavigationIntent(null);
          }
          dispatch({ type: 'OPEN_STORE' });
          break;
        }
        case 'favoritos':
          {
          const liveIndex = Math.max(0, EDITIONS.findIndex((edition) => edition.status === 'live' && edition.storeEnabled));
          setCurrentIndex(liveIndex);
          setStoreNavigationIntent({ favoritesOnly: true });
          dispatch({ type: 'OPEN_STORE' });
          setAddedToastMessage(
            `ATELIER · ${favoriteProductIds.size} ${favoriteProductIds.size === 1 ? 'FAVORITO' : 'FAVORITOS'}`
          );
          if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          toastTimerRef.current = setTimeout(() => setAddedToastMessage(null), 1800);
          }
          break;
        case 'carrito':
          setMenuOpen(false);
          setCartOpen(true);
          break;
        case 'cuenta':
          setAddedToastMessage('ATELIER PERSONAL · PRÓXIMAMENTE');
          if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          toastTimerRef.current = setTimeout(() => setAddedToastMessage(null), 1800);
          break;
        default:
          break;
      }
    },
    [activeEdition.storeEnabled, closeStory, phase, favoriteProductIds, cartCount]
  );

  // Keyboard navigation for horizontal carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'cover' || mantaState.mode !== 'editorial' || menuOpen) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, phase, mantaState.mode, menuOpen]);

  // Safe fractional carousel position
  const continuousIndex =
    Number.isFinite(dragOffset) && Number.isFinite(slideSpacing) && slideSpacing > 0
      ? currentIndex - dragOffset / slideSpacing
      : currentIndex;

  const safeContinuousIndex = Number.isFinite(continuousIndex) ? continuousIndex : currentIndex;
  const activeDiff = currentIndex - safeContinuousIndex;
  const activeAbsDiff = Math.abs(activeDiff);
  const activeTranslateX = Number.isFinite(activeDiff * slideSpacing) ? activeDiff * slideSpacing : 0;
  // Depth response: center 1.0, lateral ~0.84 (within .82–.88 specification)
  const activeScale = Math.max(0.84, 1 - Math.min(activeAbsDiff, 1.2) * 0.16);
  const activeBaseOpacity = Math.max(0.40, 1 - Math.min(activeAbsDiff, 1.2) * 0.40);
  const activeOpacity = isReady ? activeBaseOpacity : 0;
  // Rotation: center 0°, lateral max 12° progressive (within 10–14° specification)
  const activeRotateY = Math.max(-12, Math.min(12, activeDiff * 12));

  const coverComponents = React.useMemo(() => [
    <AugustCover
      key="august"
      edition={EDITIONS[0]}
      onTriggerBurst={handleTriggerBurst}
      isActive={currentIndex === 0}
      isDragging={isDragging || progress > 0.05}
      lookIndex={lookIndices[0]}
      onLookChange={(idx) => handleLookChange(0, idx)}
      progress={currentIndex === 0 ? progress : 0}
      isDetached={currentIndex === 0 && isCoverDetached}
    />,
    <SeptemberCover
      key="september"
      edition={EDITIONS[1]}
      onTriggerBurst={handleTriggerBurst}
      isActive={currentIndex === 1}
      isDragging={isDragging || progress > 0.05}
      lookIndex={lookIndices[1]}
      onLookChange={(idx) => handleLookChange(1, idx)}
      progress={currentIndex === 1 ? progress : 0}
      isDetached={currentIndex === 1 && isCoverDetached}
    />,
    <OctoberCover
      key="october"
      edition={EDITIONS[2]}
      onTriggerBurst={handleTriggerBurst}
      isActive={currentIndex === 2}
      isDragging={isDragging || progress > 0.05}
      lookIndex={lookIndices[2]}
      onLookChange={(idx) => handleLookChange(2, idx)}
      progress={currentIndex === 2 ? progress : 0}
      isDetached={currentIndex === 2 && isCoverDetached}
    />
  ], [currentIndex, isDragging, progress, lookIndices, isCoverDetached, handleTriggerBurst, handleLookChange]);

  return (
    <div
      onPointerDown={(e) => {
        setAudioUnlocked(true);
        if (menuOpen || mantaState.mode === 'store') return;
        {
              const target = e.target as HTMLElement | null;
              if (
                target?.closest(
                  'button, a, input, select, textarea, [role="button"], #top-header-pills-bar, #menuOverlay, header'
                )
              ) {
                return;
              }
              handlePointerDown(e);
        }
      }}
      onPointerMove={menuOpen || mantaState.mode === 'store' ? undefined : handlePointerMove}
      onPointerUp={menuOpen || mantaState.mode === 'store' ? undefined : handlePointerEnd}
      onPointerCancel={menuOpen || mantaState.mode === 'store' ? undefined : handlePointerEnd}
      onWheel={handleWheel}
      style={{
        background: activeEdition.gradientBg || '#000000',
        transition: 'background 0.6s ease'
      }}
      id="app-shell"
      className="relative w-screen h-screen min-h-[100svh] overflow-hidden overflow-x-clip select-none font-['Space_Grotesk',sans-serif]"
    >
      {/* ======================================================== */}
      {/* 0. GLOBAL AMBIENT BACKGROUND CANVAS (Shared Editorial & Store) */}
      {/* ======================================================== */}
      <div
        id="global-ambient-canvas-container"
        style={{
          opacity: backgroundOpacity,
          transition: 'opacity 0.4s ease'
        }}
        className="fixed inset-0 pointer-events-none z-0"
      >
        <BackgroundCanvasManager
          currentEngine={activeEdition.backgroundEngine}
          burstTrigger={burstTrigger}
        />
      </div>

      {/* ======================================================== */}
      {/* 1. EDITORIAL MODE LAYER (Persistent, never destroyed) */}
      {/* ======================================================== */}
      <div
        id="editorial-mode-layer"
        style={{
          opacity: mantaState.mode === 'editorial' ? 1 : 0,
          transform:
            mantaState.mode === 'editorial'
              ? 'none'
              : 'translate3d(-80px, 0, 0)',
          pointerEvents: mantaState.mode === 'editorial' && !menuOpen ? 'auto' : 'none',
          visibility: mantaState.mode === 'editorial' ? 'visible' : 'hidden',
          perspective: phase === 'story' ? 'none' : '1200px',
          transition:
            'transform 480ms cubic-bezier(0.16, 1, 0.3, 1), opacity 480ms cubic-bezier(0.16, 1, 0.3, 1), visibility 480ms'
        }}
        className={`absolute inset-0 w-full h-full overflow-hidden z-10 ${phase === 'story' ? 'touch-auto' : 'touch-none'}`}
      >
        {/* ======================================================== */}
        {/* 1A. MAGAZINE STAND (Carousel of Editions) */}
        {/* Reacciona sacando las revistas con física 3D hacia abajo al presionar MANTA */}
        {/* ======================================================== */}
        <div
          id="magazine-stand"
          style={{
            transform: menuOpen
              ? 'translate3d(0, calc(100vh + 140px), -80px) scale(0.88) rotateX(7deg)'
              : 'none',
            opacity: menuOpen ? 0 : 1,
            filter: menuOpen ? 'blur(4px)' : 'blur(0px)',
            zIndex: activeAbsDiff > 0.5 ? 25 : 10,
            transition:
              'transform 620ms cubic-bezier(0.2, 1, 0.28, 1), opacity 500ms cubic-bezier(0.2, 1, 0.28, 1), filter 500ms cubic-bezier(0.2, 1, 0.28, 1)',
            pointerEvents: menuOpen ? 'none' : 'auto'
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Fluid Interactive Carousel Arena */}
          <main
            className={`relative z-10 w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none max-md:-translate-y-[10svh] ${phase === 'story' ? 'touch-auto' : 'touch-none'}`}
          >
            <div className="relative w-full h-full flex items-center justify-center [perspective:1400px]">
              {EDITIONS.map((ed, idx) => {
                const safeContinuousIndex = Number.isFinite(continuousIndex) ? continuousIndex : currentIndex;
                const diff = idx - safeContinuousIndex;
                const absDiff = Math.abs(diff);

                // 3D peeking transforms - continuous depth response
                const translateX = Number.isFinite(diff * slideSpacing) ? diff * slideSpacing : 0;
                const scale = Math.max(0.84, 1 - Math.min(absDiff, 1.2) * 0.16);
                const baseOpacity = Math.max(0.40, 1 - Math.min(absDiff, 1.2) * 0.40);
                const opacity = isReady ? baseOpacity * Math.max(0, 1 - progress * 1.5) : 0;
                const rotateY = Math.max(-12, Math.min(12, diff * 12));
                const zIndex = Math.round(50 - absDiff * 20);

                const isCurrent = idx === currentIndex;

                return (
                  <div
                    key={ed.id}
                    onClick={(e) => {
                      if (!isCurrent && Math.abs(dragOffset) < 6 && progress < 0.05 && !isDraggingRef.current) {
                        e.stopPropagation();
                        tactile.selection();
                        handleSelect(idx);
                      }
                    }}
                    style={{
                      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                      opacity: isCurrent ? (isReady ? 1 : 0) : opacity,
                      zIndex: isCurrent ? 50 : zIndex,
                      transition: isDragging || isCoverDetached || progress > 0
                        ? 'none'
                        : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 380ms cubic-bezier(0.16, 1, 0.3, 1)',
                      willChange: 'transform, opacity'
                    }}
                    className={`absolute inset-0 flex items-center justify-center pointer-events-auto`}
                  >
                    <div
                      className={`relative transition-all duration-300 ${
                        !isCurrent ? 'cursor-pointer hover:opacity-85' : ''
                      }`}
                    >
                      {isCurrent ? (
                        <div
                          style={{
                            width: coverStartRect ? `${coverStartRect.width}px` : undefined,
                            height: coverStartRect ? `${coverStartRect.height}px` : undefined
                          }}
                          className="relative aspect-[5/7] invisible pointer-events-none select-none"
                        />
                      ) : (
                        coverComponents[idx]
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>

        {/* ======================================================== */}
        {/* 1B. ACTIVE EDITORIAL SURFACE (Cover on Stand / Story Fullscreen) */}
        {/* Reacciona sacando la revista activa y su contenido del viewport */}
        {/* ======================================================== */}
        <div
          id="active-story-surface"
          style={{
            transform: menuOpen
              ? 'translate3d(0, calc(100vh + 140px), -80px) scale(0.88) rotateX(7deg)'
              : 'translate3d(0, 0, 0) scale(1) rotateX(0deg)',
            opacity: menuOpen ? 0 : 1,
            filter: menuOpen ? 'blur(4px)' : 'blur(0px)',
            zIndex: activeAbsDiff > 0.5 ? 10 : 25,
            transition:
              'transform 620ms cubic-bezier(0.2, 1, 0.28, 1), opacity 500ms cubic-bezier(0.2, 1, 0.28, 1), filter 500ms cubic-bezier(0.2, 1, 0.28, 1)',
            pointerEvents: menuOpen ? 'none' : 'auto'
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Single Persistent Editorial Surface for Active Edition (Preserves instance through all morphs) */}
          <CoverStorySurface
            edition={activeEdition}
            phase={phase}
            pageProgress={pageProgress}
            pageDirection={pageDirection}
            targetStoryIndex={targetStoryIndex}
            flipToNext={flipToNext}
            flipToPrev={flipToPrev}
            currentLookIdx={lookIndices[currentIndex]}
            onSelectLook={(lookIdx) => handleLookChange(currentIndex, lookIdx)}
            onCloseStory={closeStory}
            onTriggerBurst={handleTriggerBurst}
            progress={progress}
            isCoverActive={true}
            coverElement={coverComponents[currentIndex]}
            isCoverDetached={isCoverDetached}
            startRect={coverStartRect}
            horizontalTransform={
              progress > 0
                ? undefined
                : {
                    translateX: activeTranslateX,
                    scale: activeScale,
                    rotateY: activeRotateY,
                    opacity: activeOpacity,
                    transition: isDragging
                      ? 'none'
                      : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1), opacity 380ms cubic-bezier(0.16, 1, 0.3, 1)'
                  }
            }
            onSelectProduct={(productId) => setEditorialProductId(productId)}
            onPlayAudio={setActiveAudioId}
            videoAudioEnabled={audioUnlocked && !activeAudioId}
          />
        </div>

        {/* Botón: Desliza para entrar - Only in Editorial Mode, when Menu is closed, and at cover */}
        {mantaState.mode === 'editorial' && !menuOpen && progress === 0 && (
          <SwipeUpHint onClick={openStory} progress={progress} />
        )}

        <QuickProductSheet
          product={editorialProductId ? getProduct(editorialProductId) ?? null : null}
          isOpen={editorialProductId !== null}
          onClose={() => setEditorialProductId(null)}
          isFavorite={editorialProductId ? favoriteProductIds.has(editorialProductId) : false}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onAddToLook={handleAddToLook}
          isInLook={editorialProductId ? lookProductIds.includes(editorialProductId) : false}
          source={activeEdition.themeTitle}
        />
        <LookComposer
          products={getProductsByIds(lookProductIds)}
          onRemove={(productId) => dispatch({ type: 'REMOVE_FROM_LOOK', productId })}
          onAddToBag={handleAddToCart}
        />
        <AudioDock track={activeAudioTrack} onClose={() => setActiveAudioId(null)} />
        <AmbientAudio
          track={ambientAudioTrack}
          fallbackTrack={augustAudioTrack}
          enabled={!activeAudioId}
          unlocked={audioUnlocked}
        />
      </div>

        {/* ======================================================== */}
        {/* 2. STORE MODE LAYER (Horizontal Transition & Full Viewport Experience) */}
        {/* ======================================================== */}
        <div
          id="store-mode-layer"
          style={{
          opacity: mantaState.mode === 'store' ? 1 : 0,
          transform: mantaState.mode === 'store' ? 'translate3d(0, 0, 0)' : 'translate3d(28px, 0, 0)',
          pointerEvents: mantaState.mode === 'store' ? 'auto' : 'none',
          visibility: mantaState.mode === 'store' ? 'visible' : 'hidden',
            transition:
              'transform 480ms cubic-bezier(0.16, 1, 0.3, 1), opacity 480ms cubic-bezier(0.16, 1, 0.3, 1), visibility 480ms'
          }}
          className="absolute inset-0 w-full h-full overflow-hidden z-40"
        >
          <Suspense fallback={<div className="flex h-full items-center justify-center font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs uppercase tracking-[0.22em] text-white/60">Abriendo atelier…</div>}>
            <StoreExperience
              onReturnToEditorial={handleReturnToEditorial}
              onOpenEditorialStory={handleOpenEditorialStory}
              onAddToCart={handleAddToCart}
              cartCount={cartCount}
              addedToastMessage={addedToastMessage}
              addedProductId={addedProductId}
              favoriteProductIds={favoriteProductIds}
              onToggleFavorite={handleToggleFavorite}
              activeEdition={activeEdition}
              navigationIntent={storeNavigationIntent}
              onClearNavigationIntent={() => setStoreNavigationIntent(null)}
              isStoreSearchOpen={isStoreSearchOpen}
              onCloseStoreSearch={() => setIsStoreSearchOpen(false)}
              storeSearchQuery={storeSearchQuery}
              onStoreSearchChange={setStoreSearchQuery}
            />
          </Suspense>
        </div>

      {/* ======================================================== */}
      {/* 3. APP SHELL GLOBAL PERSISTENT HEADER (Z-60) */}
      {/* ======================================================== */}
      <TopHeaderPills
        progress={progress}
        currentEditionMonth={activeEdition.month}
        appMode={mantaState.mode}
        onSelectMode={handleSelectMode}
        onToggleMode={handleToggleMode}
        cartCount={cartCount}
        menuOpen={menuOpen}
        onToggleMenu={handleToggleMenu}
        onCloseMenu={handleCloseMenu}
            onSearchClick={handleHeaderSearchClick}
            onCartClick={() => handleNavigateFromMenu({ type: 'carrito' })}
        isStoreSearchOpen={isStoreSearchOpen}
        onToggleStoreSearch={handleToggleStoreSearch}
        storeSearchQuery={storeSearchQuery}
        />
        <CartDrawer
          items={mantaState.cartItems}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
        />

      {/* ======================================================== */}
      {/* 4. FULLSCREEN NAVIGATION MENU OVERLAY (Z-55) */}
      {/* ======================================================== */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={handleCloseMenu}
        onNavigate={handleNavigateFromMenu}
        cartCount={cartCount}
        favoriteCount={favoriteCount}
        currentEditionIndex={currentIndex}
        isSearchActive={menuSearchActive}
        onToggleSearch={handleHeaderSearchClick}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
