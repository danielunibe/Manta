import React from 'react';
import { EDITIONS } from '../../../data/magazines';
import { Sparkles, Compass } from 'lucide-react';

interface ActiveEditionMiniPreviewProps {
  currentEditionIndex: number;
  onOpenEdition?: (index: number) => void;
}

export const ActiveEditionMiniPreview: React.FC<ActiveEditionMiniPreviewProps> = ({
  currentEditionIndex,
  onOpenEdition
}) => {
  const edition = EDITIONS[currentEditionIndex] || EDITIONS[0];
  const primaryLook = edition.looks[0];

  return (
    <div className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] p-3.5 sm:p-4 backdrop-blur-md flex flex-col gap-3">
      {/* Header Tag */}
      <div className="flex items-center justify-between">
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] sm:text-[10px] tracking-[0.24em] uppercase text-[#f2c14e] flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#f2c14e]" />
          PORTADA EN STAND
        </span>
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.16em] text-white/50">
          VOL. {edition.number}
        </span>
      </div>

      {/* Magazine Cover Thumbnail & Info */}
      <div className="flex items-center gap-3.5">
        <div className="relative w-14 h-19 sm:w-16 sm:h-22 rounded-md overflow-hidden flex-shrink-0 bg-black/60 border border-white/15 shadow-lg">
          {primaryLook?.image && (
            <img
              src={primaryLook.image}
              alt={edition.themeTitle}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
            <span className="font-['Abril_Fatface',serif] text-[9px] text-white tracking-widest leading-none">
              MANTA
            </span>
          </div>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-['Fraunces',Georgia,serif] font-bold text-[18px] sm:text-[20px] text-[#ece7de] leading-tight truncate">
            {edition.month} {edition.year}
          </span>
          <span className="text-[12px] text-[#93a0ac] font-['Space_Grotesk'] truncate mt-0.5">
            {edition.themeTitle}
          </span>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-mono text-[9.5px] tracking-wider px-2 py-0.5 rounded bg-white/[0.08] text-white/80 border border-white/10">
              {edition.looks.length} LOOKS
            </span>
            <span className="font-mono text-[9.5px] tracking-wider text-[#f2c14e]/80">
              ✦ MOTOR {edition.backgroundEngine.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Button to quickly view stand */}
      {onOpenEdition && (
        <button
          type="button"
          onClick={() => onOpenEdition(currentEditionIndex)}
          className="w-full mt-1 py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-[#f2c14e]/20 border border-white/10 hover:border-[#f2c14e]/40 text-[#ece7de] hover:text-[#f2c14e] text-[11px] font-mono tracking-[0.16em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Ver Historia Completa</span>
        </button>
      )}
    </div>
  );
};
