import React from 'react';
import { Check } from 'lucide-react';

interface StoreToastProps {
  message: string | null;
}

export const StoreToast: React.FC<StoreToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      id="store-toast-notification"
      role="status"
      aria-live="polite"
      style={{
        background: 'rgba(16, 21, 28, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(242, 193, 78, 0.4)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
      }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 rounded-full flex items-center gap-2.5 text-[#ece7de] pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
    >
      <div className="w-5 h-5 rounded-full bg-[#f2c14e] text-black flex items-center justify-center shrink-0">
        <Check className="w-3.5 h-3.5" />
      </div>
      <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-xs font-semibold tracking-wider uppercase text-[#f2c14e]">
        {message}
      </span>
    </div>
  );
};
