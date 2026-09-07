import React from 'react';
import { Product } from '../../types';

export type EditorialProductTilePlacement = 'left' | 'right' | 'left-lower' | 'right-lower' | 'center';

interface EditorialProductTileProps {
  product: Product;
  placement: EditorialProductTilePlacement;
  featured?: boolean;
  onOpen: (productId: string) => void;
}

const placementClasses: Record<EditorialProductTilePlacement, string> = {
  left: 'left-4 top-[25%]',
  right: 'right-4 top-[25%]',
  'left-lower': 'left-4 top-[45%]',
  'right-lower': 'right-4 top-[45%]',
  center: 'left-1/2 top-[29%] -translate-x-1/2'
};

/**
 * Small catalog boxes placed on the editorial image itself. They intentionally
 * replace generic hotspot dots: the image remains the page and the product is
 * legible as a compact, actionable catalog reference.
 */
export const EditorialProductTile: React.FC<EditorialProductTileProps> = ({ product, placement, featured = false, onOpen }) => (
  <button
    type="button"
    data-editorial-product-tile="true"
    className={`absolute ${placementClasses[placement]} pointer-events-auto z-10 flex ${featured ? 'h-[94px] w-[82px] md:h-[116px] md:w-[106px]' : 'h-[84px] w-[74px] md:h-[102px] md:w-[94px]'} shrink-0 flex-col items-center justify-end gap-1 overflow-hidden rounded-[0.85rem] bg-[#071014]/82 p-1.5 text-left shadow-[0_16px_34px_rgba(0,0,0,.32)] backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:bg-[#071014]/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e] active:scale-[.97] ${placement === 'center' ? '-translate-x-1/2' : ''}`}
    aria-label={`Ver ${product.name}`}
    onPointerDown={(event) => event.stopPropagation()}
    onClick={(event) => {
      event.stopPropagation();
      onOpen(product.id);
    }}
  >
    <span className={`flex w-full flex-1 items-center justify-center overflow-hidden rounded-[0.65rem] bg-white/[0.06] ${featured ? 'min-h-[58px] md:min-h-[76px]' : 'min-h-[50px] md:min-h-[64px]'}`}>
      <img
        src={product.image}
        alt=""
        className={`h-full w-full object-contain ${featured ? 'max-h-[60px] md:max-h-[78px]' : 'max-h-[52px] md:max-h-[66px]'}`}
        loading="lazy"
      />
    </span>
    <span className="w-full truncate px-0.5 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] uppercase leading-[1.05] tracking-[0.03em] text-white/90">
      {product.name}
    </span>
    <span className="w-full px-0.5 pb-0.5 text-[10px] leading-none text-[#f2c14e]">
      {product.priceFormatted}
    </span>
  </button>
);
