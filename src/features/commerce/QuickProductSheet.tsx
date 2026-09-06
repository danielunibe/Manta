import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '../../types';
import { Heart, X, Check, AlertCircle } from 'lucide-react';
import { tactile } from '../../utils/tactileFeedback';

export interface QuickProductSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product, selections?: { size?: string; color?: string }) => void;
  onAddToLook?: (productId: string) => void;
  isInLook?: boolean;
  source?: string;
  variant?: 'store-glass' | 'default';
}

export const QuickProductSheet: React.FC<QuickProductSheetProps> = ({
  product,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onAddToLook,
  isInLook = false,
  variant = 'store-glass'
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeValidationError, setSizeValidationError] = useState<boolean>(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isTrackingRef = useRef<boolean>(false);
  const wasHeaderDragRef = useRef<boolean>(false);
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Parse available colors from product.colors string (e.g. "Mostaza / Madera natural")
  const parsedColors = React.useMemo(() => {
    if (!product?.colors) return [];
    return product.colors
      .split('/')
      .map((c) => c.trim())
      .filter(Boolean);
  }, [product?.colors]);

  // Reset selections when a new product is selected
  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      // Pre-select first color if available, or keep null
      if (parsedColors.length === 1) {
        setSelectedColor(parsedColors[0]);
      } else {
        setSelectedColor(null);
      }
      setSizeValidationError(false);
      setIsAddedSuccess(false);
      setDragOffset(0);
    }
  }, [product?.id, parsedColors]);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [product?.id]);

  // Handle open / close animations & focus trapping
  useEffect(() => {
    if (isOpen && product) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setIsMounted(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
        if (sheetRef.current) {
          sheetRef.current.focus();
        }
      }, 20);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus();
        }
      }, 340);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  // The product surface owns the viewport while it is present. This prevents
  // the magazine/store behind it from moving on touch devices.
  useEffect(() => {
    if (!isOpen && !isMounted) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [isOpen, isMounted]);

  // Escape key handler on desktop
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Add to Cart action
  const handleAddToCart = () => {
    if (!product) return;
    if (product.availability === 'sold-out') return;

    // Check size requirement
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeValidationError(true);
      tactile.selection();
      return;
    }

    tactile.success();
    onAddToCart(product, {
      size: selectedSize || undefined,
      color: selectedColor || undefined
    });

    setIsAddedSuccess(true);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => {
      setIsAddedSuccess(false);
    }, 1000);
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    tactile.softImpact();
    onToggleFavorite(product.id);
  };

  // Touch / Pointer gesture handlers for smooth swipe-down-to-close
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement | null;
    // Don't intercept button clicks, tags or inputs
    if (target?.closest('button, a, input, select, textarea, [role="button"]')) {
      return;
    }

    const isHeaderOrHandle = Boolean(target?.closest('#quick-sheet-handle, #quick-sheet-header'));
    wasHeaderDragRef.current = isHeaderOrHandle;

    // Only allow drag on content if scroll is at top
    if (!isHeaderOrHandle && scrollContainerRef.current && scrollContainerRef.current.scrollTop > 2) {
      return;
    }

    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    isTrackingRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isTrackingRef.current || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // Direction lock: if horizontal drag dominates, cancel gesture
    if (!isDragging) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        isTrackingRef.current = false;
        return;
      }

      // Check if user is scrolling up while inside content
      if (!wasHeaderDragRef.current && scrollContainerRef.current && scrollContainerRef.current.scrollTop > 0) {
        isTrackingRef.current = false;
        return;
      }

      if (deltaY > 8) {
        setIsDragging(true);
      }
    }

    if (isDragging) {
      if (deltaY > 0) {
        // Direct follow finger downwards
        setDragOffset(deltaY);
      } else {
        // Slight resistance upwards
        setDragOffset(Math.max(-12, deltaY * 0.15));
      }
    }
  };

  const handlePointerEnd = (e: React.PointerEvent) => {
    if (!isTrackingRef.current || !dragStartRef.current) {
      isTrackingRef.current = false;
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const deltaY = e.clientY - dragStartRef.current.y;
    const elapsed = Date.now() - dragStartRef.current.time;
    const velocityY = elapsed > 0 ? deltaY / elapsed : 0;

    isTrackingRef.current = false;
    setIsDragging(false);

    // Commit close if dragged > 75px or flicked downwards
    if (deltaY > 75 || (velocityY > 0.45 && deltaY > 20)) {
      onClose();
    } else {
      // Snap back
      setDragOffset(0);
    }
  };

  if (!isMounted || !product) {
    return null;
  }

  const isSoldOut = product.availability === 'sold-out';

  return createPortal((
    <div
      id="quick-product-sheet-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0, 0, 0, 0)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transition: 'background-color 340ms cubic-bezier(0.16, 1, 0.3, 1), opacity 340ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="fixed inset-0 z-[90] flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 backdrop-blur-[2px] select-none"
    >
      {/* 
        Unified Single Commercial Sheet Surface
        Mobile: enters from bottom with height ~58-72svh
        Desktop: elegant centered modal dialog
      */}
      <div
        id="quick-product-sheet-surface"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-sheet-title"
        aria-describedby="quick-sheet-desc"
        tabIndex={-1}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{
          transform: isVisible
            ? `translate3d(0, ${Math.max(0, dragOffset)}px, 0)`
            : 'translate3d(0, 100%, 0)',
          transition: isDragging
            ? 'none'
            : 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1)',
          height: 'min(78svh, 680px)',
          maxHeight: 'min(78svh, 680px)'
        }}
        className={`relative z-[91] w-full sm:max-w-lg ${
          variant === 'store-glass' ? 'store-glass-sheet' : 'bg-[#111418]'
        } rounded-t-[28px] sm:rounded-3xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden text-[#ece7de] outline-none`}
      >
        {/* ======================================================== */}
        {/* 1. TOP HANDLE & HEADER */}
        {/* ======================================================== */}
        <div id="quick-sheet-header" className="px-5 pt-3 pb-2 shrink-0 relative flex flex-col">
          {/* Subtle Tactile Drag Handle */}
          <div
            id="quick-sheet-handle"
            className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-2 cursor-grab active:cursor-grabbing shrink-0"
          />

          <div className="flex items-center justify-end gap-3">
            {/* Close Button X */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar detalles del producto"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer tactile-control touch-target-44"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. SCROLLABLE PRODUCT DETAILS */}
        {/* ======================================================== */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto no-scrollbar px-5 py-2 space-y-4"
          style={{ overscrollBehaviorY: 'contain' }}
        >
          {/* Product Image Preview */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/40 shrink-0">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center pointer-events-none"
            />

          </div>

          {/* Title & Price Header */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between gap-3">
              <h2
                id="quick-sheet-title"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
                className="font-['Fraunces',Georgia,serif] text-xl sm:text-2xl font-bold text-[#ece7de] leading-snug"
              >
                {product.name}
              </h2>
              <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-base sm:text-lg font-bold text-[#f2c14e] shrink-0">
                {product.priceFormatted}
              </span>
            </div>

            {product.subtitle && (
              <p
                id="quick-sheet-desc"
                className="font-['Space_Grotesk'] text-xs sm:text-sm text-white/70 leading-relaxed pt-0.5"
              >
                {product.subtitle}
              </p>
            )}
          </div>

          {/* Colors Selector (Textual Pills) */}
          {parsedColors.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.2em] uppercase text-white/50 font-semibold">
                  COLOR {selectedColor ? `· ${selectedColor}` : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {parsedColors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        tactile.selection();
                        setSelectedColor(color);
                      }}
                      className={`px-3.5 py-1.5 min-h-[38px] rounded-xl text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] uppercase tracking-wider transition-all cursor-pointer tactile-control ${
                        isSelected
                          ? 'bg-[#f2c14e]/18 text-[#f2c14e] font-bold shadow-md shadow-[#f2c14e]/20 scale-[1.02]'
                          : 'bg-white/10 text-[#ece7de] hover:bg-white/15'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes Selector (Tactile Buttons) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.2em] uppercase text-white/50 font-semibold">
                  TALLA {selectedSize ? `· ${selectedSize}` : ''}
                </span>

                {sizeValidationError && (
                  <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10.5px] tracking-wider uppercase text-[#e55353] font-bold flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" />
                    Selecciona una talla
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        tactile.selection();
                        setSelectedSize(size);
                        setSizeValidationError(false);
                      }}
                      className={`min-w-[44px] min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] font-bold uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer tactile-control touch-target-44 ${
                        isSelected
                          ? 'bg-[#f2c14e]/18 text-[#f2c14e] shadow-lg shadow-[#f2c14e]/25 scale-105'
                          : sizeValidationError
                          ? 'bg-red-500/15 text-white ring-2 ring-red-500/60 hover:bg-red-500/25'
                          : 'bg-white/10 text-[#ece7de] hover:bg-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Availability Notice for Sold Out items */}
          {isSoldOut && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-['Space_Grotesk']">
              Pieza no disponible temporalmente en el atelier.
            </div>
          )}

          {onAddToLook && (
            <button
              type="button"
              onClick={() => onAddToLook(product.id)}
              className={`w-full min-h-[46px] rounded-xl border px-4 py-3 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[11px] font-bold uppercase tracking-[0.16em] transition-colors tactile-control touch-target-44 ${
                isInLook
                  ? 'bg-[#f2c14e]/15 text-[#f2c14e]'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-[#f2c14e]'
              }`}
            >
              {isInLook ? '✓ EN EL LOOK' : 'AÑADIR AL LOOK'}
            </button>
          )}
        </div>

        {/* ======================================================== */}
        {/* 3. BOTTOM STICKY ACTION BAR */}
        {/* ======================================================== */}
        <div
          id="quick-sheet-bottom-actions"
          className={`shrink-0 p-4 ${
            variant === 'store-glass' ? 'bg-black/40 backdrop-blur-md' : 'bg-[#111418]/95 backdrop-blur-md'
          } flex items-center gap-3`}
          style={{
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)'
          }}
        >
          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
            className={`w-12 h-12 shrink-0 rounded-2xl border flex items-center justify-center transition-all cursor-pointer tactile-control touch-target-44 ${
              isFavorite
                ? 'bg-red-500/15 text-[#e55353]'
                : 'store-glass-control text-white/80 hover:text-white'
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-transform active:scale-125 ${
                isFavorite ? 'fill-[#e55353] text-[#e55353]' : ''
              }`}
            />
          </button>

          {/* Primary CTA Button: AGREGAR A BOLSA */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isSoldOut}
            aria-label={isSoldOut ? 'Producto no disponible' : `Añadir ${product.name} a la bolsa`}
            className={`flex-1 min-h-[50px] py-3 px-5 rounded-2xl font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer tactile-control touch-target-44 ${
              isSoldOut
                ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
                : isAddedSuccess
                ? 'bg-emerald-500/18 text-emerald-300 shadow-lg shadow-emerald-500/30 scale-[0.99]'
                : sizeValidationError
                ? 'bg-[#f2c14e]/18 text-[#f2c14e] shadow-lg shadow-[#f2c14e]/20 ring-2 ring-red-500'
                : 'bg-[#f2c14e]/18 text-[#f2c14e] hover:bg-[#f2c14e]/28 shadow-lg shadow-[#f2c14e]/25 active:scale-[0.98]'
            }`}
          >
            {isSoldOut ? (
              <span>NO DISPONIBLE</span>
            ) : isAddedSuccess ? (
              <>
                <Check className="w-4 h-4 text-black" />
                <span>AGREGADO ✓</span>
              </>
            ) : (
              <span>AGREGAR A BOLSA</span>
            )}
          </button>
        </div>
      </div>
    </div>
  ), document.body);
};
