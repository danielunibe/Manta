import React from 'react';
import { HOMBRE_IMAGES } from './hombreData';
import { tactile } from '../../../utils/tactileFeedback';
import { ArrowRight } from 'lucide-react';

interface HombreHighlightsProps {
  onSelectCategory: (category: string) => void;
}

export const HombreHighlights: React.FC<HombreHighlightsProps> = ({ onSelectCategory }) => {
  const highlights = [
    {
      category: 'Abrigos',
      title: 'Abrigos',
      subtitle: 'SOBRETODOS · CHAQUETAS',
      img: HOMBRE_IMAGES.carbon
    },
    {
      category: 'Mochilas',
      title: 'Mochilas',
      subtitle: '5 PROPUESTAS IMPERMEABLES',
      img: HOMBRE_IMAGES.mochCarbon
    },
    {
      category: 'Accesorios',
      title: 'Accesorios',
      subtitle: '10 PIEZAS CON CARÁCTER',
      img: HOMBRE_IMAGES.parBorgona
    },
    {
      category: 'Calzado',
      title: 'Calzado',
      subtitle: 'BOTAS · SNEAKERS',
      img: HOMBRE_IMAGES.botasCuero
    }
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.26em] uppercase text-[#f2c14e] font-semibold">
            ATAJOS MASCULINOS
          </span>
          <h2 className="font-['Fraunces',Georgia,serif] font-bold text-3xl sm:text-4xl text-[#ece7de] tracking-tight mt-1">
            Lo esencial de <em className="italic text-[#f2c14e] not-italic">temporada</em>
          </h2>
        </div>
        <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9.5px] tracking-[0.22em] text-[#93a0ac] uppercase">
          TOCA PARA FILTRAR EL CATÁLOGO
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {highlights.map((item) => (
          <div
            key={item.category}
            onClick={() => {
              tactile.soft();
              onSelectCategory(item.category);
            }}
            className="group relative rounded-2xl border border-white/10 overflow-hidden h-44 sm:h-48 cursor-pointer bg-[#10151c] hover:border-[#f2c14e]/40 transition-all shadow-lg"
          >
            {/* Background Image */}
            <img
              src={item.img}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080a0e]/95 via-[#080a0e]/40 to-transparent" />

            {/* Card Content Foot */}
            <div className="absolute left-0 right-0 bottom-0 p-4 sm:p-5 flex justify-between items-end gap-2">
              <div>
                <h3 className="font-['Fraunces',Georgia,serif] font-bold text-xl sm:text-2xl text-[#ece7de] group-hover:text-[#f2c14e] transition-colors">
                  {item.title}
                </h3>
                <span className="block mt-1 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8.5px] tracking-[0.2em] text-[#93a0ac]">
                  {item.subtitle}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-sm text-[#ece7de] group-hover:bg-[#f2c14e] group-hover:text-[#141414] group-hover:border-[#f2c14e] transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
