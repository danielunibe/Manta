import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MenuItemData } from './menuData';
import { tactile, hasNativeHover } from '../../../utils/tactileFeedback';

interface MenuItemProps {
  item: MenuItemData;
  index: number;
  isOpen: boolean;
  isExpanded?: boolean;
  badgeCount?: number;
  onSelect: (item: MenuItemData) => void;
  onToggleExpand?: (itemId: string) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  item,
  index,
  isOpen,
  isExpanded = false,
  badgeCount = 0,
  onSelect,
  onToggleExpand
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Staggered entry delay calculation
  const delay = `${0.06 + index * 0.05}s`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    tactile.selection();
    if (item.hasSubmenu && onToggleExpand) {
      onToggleExpand(item.id);
    } else {
      onSelect(item);
    }
  };

  return (
    <div
      className="relative w-full border-b border-white/[0.08] transition-colors duration-300"
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
        transition: isOpen
          ? `opacity 0.45s ease ${delay}, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${delay}`
          : 'opacity 0.2s ease, transform 0.2s ease'
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => {
          if (hasNativeHover()) setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
        aria-expanded={item.hasSubmenu ? isExpanded : undefined}
        aria-label={`${item.number} ${item.title}`}
        className="w-full py-3.5 sm:py-4.5 min-h-[48px] flex items-center justify-between text-left bg-transparent border-none p-0 cursor-pointer group select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#f2c14e]/60 rounded-sm tactile-control"
      >
        {/* Left: Number + Title */}
        <div
          className="flex items-baseline gap-3.5 sm:gap-6 transition-transform duration-300 ease-out"
          style={{
            transform: isHovered ? 'translateX(6px)' : 'translateX(0px)'
          }}
        >
          {/* Index Number */}
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[11px] sm:text-[12px] tracking-[0.24em] text-[#f2c14e]/85 group-hover:text-[#f2c14e] transition-colors duration-300 font-medium">
            {item.number}
          </span>

          {/* Title */}
          <div className="flex flex-col">
            <span
              className={`font-['Fraunces',Georgia,serif] font-bold text-[clamp(24px,4.5vw,44px)] tracking-tight leading-[1.1] transition-all duration-300 ${
                isHovered || isExpanded
                  ? 'text-[#f2c14e] italic'
                  : 'text-[#ece7de] group-hover:text-[#f2c14e]'
              }`}
            >
              {item.title}
            </span>

            {/* Subtle Subtitle for desktop / high resolution */}
            {item.subtitle && (
              <span className="hidden sm:inline-block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase text-[#93a0ac]/60 mt-0.5 group-hover:text-[#93a0ac]/90 transition-colors">
                {item.subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right side: Badge count or expand chevron */}
        <div className="flex items-center gap-3 pr-1 sm:pr-2">
          {/* Count Badge for Cart / Favorites */}
          {badgeCount > 0 && (
            <span
              className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[11px] sm:text-[12px] tracking-[0.16em] px-2.5 py-0.5 rounded-full bg-[#f2c14e]/15 text-[#f2c14e] border border-[#f2c14e]/30 font-semibold transition-all duration-200"
              style={{
                boxShadow: '0 0 12px rgba(242, 193, 78, 0.15)'
              }}
            >
              {String(badgeCount).padStart(2, '0')}
            </span>
          )}

          {/* Submenu Expand Chevron */}
          {item.hasSubmenu && (
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                isExpanded
                  ? 'bg-[#f2c14e]/20 text-[#f2c14e] rotate-180'
                  : 'bg-white/[0.04] text-white/40 group-hover:text-[#f2c14e] group-hover:bg-white/[0.08]'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          )}
        </div>
      </button>

      {/* Subtle fine active line accent */}
      <div
        className="absolute bottom-0 left-0 h-[1px] bg-[#f2c14e] transition-all duration-300 ease-out"
        style={{
          width: isHovered || isExpanded ? '100%' : '0%',
          opacity: isHovered || isExpanded ? 0.8 : 0
        }}
      />
    </div>
  );
};
