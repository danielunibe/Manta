import React from 'react';
import { FAMILY_CATEGORIES_DATA, FamilyCategoryData } from './menuData';
import { ArrowUpRight } from 'lucide-react';

interface FamilySubMenuProps {
  isExpanded: boolean;
  onSelectCategory: (category: FamilyCategoryData) => void;
}

export const FamilySubMenu: React.FC<FamilySubMenuProps> = ({
  isExpanded,
  onSelectCategory
}) => {
  return (
    <div
      style={{
        maxHeight: isExpanded ? '360px' : '0px',
        opacity: isExpanded ? 1 : 0,
        overflow: isExpanded ? 'visible' : 'hidden',
        transition: 'max-height 0.38s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
      }}
      className="w-full pl-6 sm:pl-10 pr-2 py-1"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-l-2 border-[#f2c14e]/30 pl-4 sm:pl-6 my-1">
        {FAMILY_CATEGORIES_DATA.map((cat, idx) => {
          const staggerDelay = `${idx * 0.04}s`;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat)}
              style={{
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'translateY(0)' : 'translateY(8px)',
                transition: isExpanded
                  ? `opacity 0.3s ease ${staggerDelay}, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelay}`
                  : 'opacity 0.15s ease, transform 0.15s ease'
              }}
              className="group/fam p-3 rounded-lg text-left bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-[#f2c14e]/30 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-['Fraunces',Georgia,serif] font-bold text-[16px] sm:text-[18px] text-[#ece7de] group-hover/fam:text-[#f2c14e] transition-colors">
                  {cat.name}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover/fam:text-[#f2c14e] group-hover/fam:translate-x-0.5 group-hover/fam:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-[10px] text-[#93a0ac] line-clamp-2 leading-relaxed font-['Space_Grotesk']">
                {cat.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
