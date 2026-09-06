import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface EditorialQuoteCardProps {
  onReturnToEditorial?: () => void;
}

export const EditorialQuoteCard: React.FC<EditorialQuoteCardProps> = ({ onReturnToEditorial }) => {
  return (
    <div
      id="editorial-quote-section"
      className="col-span-1 md:col-span-2 py-4 sm:py-6 flex flex-col justify-between relative"
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.24em] uppercase text-[#f2c14e] font-semibold">
          HISTORIA DE PORTADA
        </span>
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.2em] text-white/50 uppercase">
          MANTA · EDITORIAL COMMERCE
        </span>
      </div>

      <div className="my-4">
        <blockquote
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
          className="font-['Fraunces',Georgia,serif] text-xl sm:text-2xl md:text-3xl text-[#ece7de] font-light italic leading-snug"
        >
          “La lluvia vuelve espejo la calle y la calle vuelve historia cada look.”
        </blockquote>
        <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] text-white/60 tracking-[0.16em] uppercase mt-2">
          Revista Digital MANTA · Monzón tapatío · Agosto 2026
        </p>
      </div>

      {onReturnToEditorial && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onReturnToEditorial}
            className="inline-flex items-center gap-2 text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] tracking-wider text-[#f2c14e] hover:text-white uppercase transition-colors cursor-pointer group/btn py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover/btn:-translate-x-1 transition-transform" />
            <span>Volver a la Revista Digital</span>
          </button>
        </div>
      )}
    </div>
  );
};
