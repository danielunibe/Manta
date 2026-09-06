import React, { useState } from 'react';
import { Tag, Copy, Check } from 'lucide-react';

export const PromoCard: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('LLUVIA20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="promo-card"
      className="col-span-1 rounded-2xl bg-black/40 border border-[#f2c14e]/30 p-4 sm:p-5 flex flex-col justify-between group transition-all duration-300 relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[#f2c14e]">
          <Tag className="w-3.5 h-3.5" />
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.2em] uppercase font-semibold">
            CÓDIGO DE TEMPORADA
          </span>
        </div>
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.16em] uppercase text-[#f2c14e] px-2 py-0.5 rounded-full bg-[#f2c14e]/15">
          −20%
        </span>
      </div>

      <div className="my-2.5 flex items-baseline justify-between">
        <div className="font-['Fraunces',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#f2c14e] tracking-wider">
          LLUVIA20
        </div>
        <button
          type="button"
          onClick={handleCopyCode}
          className="text-[10px] font-['Spline_Sans_Mono',ui-monospace,monospace] text-white/80 hover:text-[#f2c14e] uppercase tracking-wider flex items-center gap-1 bg-white/10 hover:bg-white/18 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>COPIADO</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>COPIAR</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[10.5px] text-[#93a0ac] leading-tight">
        Válido en tu primera compra de la colección familiar.
      </p>
    </div>
  );
};
