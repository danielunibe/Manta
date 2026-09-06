import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { StoreCategoryItem } from './storeTypes';
import { tactile } from '../../utils/tactileFeedback';

interface CategoryCardProps {
  category: StoreCategoryItem;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const handleClick = () => {
    tactile.selection();
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Ver categoría ${category.title}`}
      className="relative rounded-2xl overflow-hidden min-h-[200px] sm:min-h-[220px] p-5 sm:p-6 text-left group transition-all duration-300 tactile-control cursor-pointer flex flex-col justify-between shrink-0 w-[72vw] max-w-[280px] sm:w-auto sm:max-w-none snap-start border border-white/10 hover:border-white/25 shadow-lg select-none"
    >
      {/* Background Image with subtle overlay */}
      <img
        src={category.image}
        alt={category.title}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-45 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Top row: Chip & Action arrow */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span
          style={{ color: category.accent }}
          className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] tracking-[0.2em] uppercase font-medium px-2.5 py-0.5 rounded-full bg-black/60 border border-white/10"
        >
          {category.chip}
        </span>
        <div className="w-7 h-7 rounded-full bg-white/15 group-hover:bg-[#f2c14e] group-hover:text-black flex items-center justify-center text-white transition-colors duration-200">
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 mt-auto pt-3">
        <h3
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
          className="font-['Fraunces',Georgia,serif] text-2xl sm:text-3xl font-bold text-[#ece7de] group-hover:text-[#f2c14e] transition-colors duration-200 leading-none"
        >
          {category.title}
        </h3>
        <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.18em] text-white/70 uppercase mt-1">
          {category.countLabel}
        </p>
      </div>
    </button>
  );
};
