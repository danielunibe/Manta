import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { CartItem } from '../../types';

interface CartDrawerProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (item: CartItem, quantity: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ items, isOpen, onClose, onUpdateQuantity }) => {
  const [visible, setVisible] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
    setVisible(false);
    closeTimer.current = window.setTimeout(() => { closeTimer.current = null; }, 320);
    return () => { if (closeTimer.current) window.clearTimeout(closeTimer.current); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen && !visible) return null;

  return (
    <div
      id="cart-drawer-backdrop"
      className={`fixed inset-0 z-[100] flex items-end justify-center bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <aside
        id="cart-drawer-surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={`flex max-h-[82svh] w-full flex-col rounded-t-[28px] bg-[#111719] text-[#ece7de] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] sm:max-w-xl sm:rounded-3xl ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          <div>
            <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] uppercase tracking-[.22em] text-[#f2c14e]">Selección Agosto</span>
            <h2 id="cart-drawer-title" className="mt-1 font-['Fraunces',Georgia,serif] text-2xl">Tu bolsa</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar bolsa" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[.06] text-white/70 transition hover:bg-white/[.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          {items.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center text-center text-white/55">
              <ShoppingBag className="mb-3 h-7 w-7 text-[#f2c14e]/70" />
              <p className="font-['Fraunces',Georgia,serif] text-xl text-white/80">Todavía no hay piezas</p>
              <p className="mt-1 max-w-xs text-sm">Elige una pieza desde la escena o el catálogo para verla aquí.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize ?? ''}-${item.selectedColor ?? ''}`} className="flex items-center gap-3 rounded-2xl bg-white/[.045] p-3">
                  <img src={item.product.image} alt="" className="h-16 w-16 shrink-0 rounded-xl bg-black/20 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-['Fraunces',Georgia,serif] text-lg">{item.product.name}</p>
                    <p className="mt-0.5 text-xs text-white/50">{item.selectedSize ?? 'Talla única'}{item.selectedColor ? ` · ${item.selectedColor}` : ''}</p>
                    <p className="mt-1 font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs text-[#f2c14e]">{item.product.priceFormatted}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-black/20 p-1">
                    <button type="button" onClick={() => onUpdateQuantity(item, item.quantity - 1)} aria-label={`Reducir ${item.product.name}`} className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/[.1] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]"><Minus className="h-3 w-3" /></button>
                    <span className="w-5 text-center text-xs">{item.quantity}</span>
                    <button type="button" onClick={() => onUpdateQuantity(item, item.quantity + 1)} aria-label={`Aumentar ${item.product.name}`} className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/[.1] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 bg-black/20 px-5 py-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}>
          <div><span className="block text-[10px] uppercase tracking-[.18em] text-white/45">Total simulado</span><strong className="font-['Fraunces',Georgia,serif] text-2xl">${total.toLocaleString('es-MX')} MXN</strong></div>
          <button type="button" disabled={items.length === 0} className="min-h-12 flex-1 rounded-2xl bg-[#f2c14e] px-4 py-3 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[11px] font-bold uppercase tracking-[.14em] text-[#111719] disabled:cursor-not-allowed disabled:opacity-35">Continuar</button>
        </div>
      </aside>
    </div>
  );
};
