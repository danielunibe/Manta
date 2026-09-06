import React from 'react';
import { SEASONS_DATA, SeasonItemData } from './menuData';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SeasonMenuProps {
  isExpanded: boolean;
  currentEditionIndex: number;
  onSelectSeason: (season: SeasonItemData) => void;
}

export const SeasonMenu: React.FC<SeasonMenuProps> = ({
  isExpanded,
  currentEditionIndex,
  onSelectSeason
}) => {
  return (
    <div
      style={{
        maxHeight: isExpanded ? '480px' : '0px',
        opacity: isExpanded ? 1 : 0,
        overflow: isExpanded ? 'visible' : 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease'
      }}
      className="w-full pl-6 sm:pl-10 pr-2 py-1"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 py-3 border-l-2 border-[#f2c14e]/30 pl-4 sm:pl-6 my-1">
        {SEASONS_DATA.map((season, idx) => {
          const isSelected = season.editionIndex === currentEditionIndex;
          const staggerDelay = `${idx * 0.04}s`;

          return (
            <button
              key={season.id}
              type="button"
              onClick={() => onSelectSeason(season)}
              style={{
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'translateY(0)' : 'translateY(8px)',
                transition: isExpanded
                  ? `opacity 0.3s ease ${staggerDelay}, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}, border-color 0.2s ease`
                  : 'opacity 0.15s ease, transform 0.15s ease'
              }}
              className={`group/season flex items-center justify-between p-2.5 sm:p-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-white/[0.09] border border-[#f2c14e]/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/20'
              }`}
            >
              {/* Left info */}
              <div className="flex items-center gap-3">
                {/* Mini color/image thumbnail indicator */}
                <div
                  className="relative w-10 h-13 rounded overflow-hidden flex-shrink-0 bg-black/40 border border-white/10"
                >
                  <img
                    src={season.image}
                    alt={season.name}
                    className="w-full h-full object-cover group-hover/season:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 opacity-40 mix-blend-color"
                    style={{ backgroundColor: season.accentColor }}
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-['Fraunces',Georgia,serif] font-bold text-[17px] sm:text-[19px] text-[#ece7de] group-hover/season:text-[#f2c14e] transition-colors leading-none">
                      {season.name}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-[#f2c14e]/20 text-[#f2c14e] border border-[#f2c14e]/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        ACTIVA
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#93a0ac] font-['Space_Grotesk'] mt-1 truncate max-w-[150px] sm:max-w-[180px]">
                    {season.theme}
                  </span>
                  <span className="text-[9.5px] font-mono tracking-widest text-[#f2c14e]/70 mt-0.5">
                    {season.year} {season.badge ? `· ${season.badge}` : ''}
                  </span>
                </div>
              </div>

              {/* Right Arrow */}
              <div className="text-white/30 group-hover/season:text-[#f2c14e] group-hover/season:translate-x-1 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
