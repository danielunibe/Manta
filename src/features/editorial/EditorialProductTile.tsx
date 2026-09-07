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
  left: 'left-3 top-[22%] md:left-8 md:top-[24%]',
  right: 'right-3 top-[22%] md:right-8 md:top-[24%]',
  'left-lower': 'left-3 top-[30%] md:left-8 md:top-[32%]',
  'right-lower': 'right-3 top-[30%] md:right-8 md:top-[32%]',
  center: 'left-1/2 top-[29%] -translate-x-1/2'
};

/**
 * Small floating catalog images placed directly over the editorial image.
 * They intentionally replace generic hotspot dots and opaque cards: the
 * editorial page remains visible while each product keeps its native ratio.
 */
export const EditorialProductTile: React.FC<EditorialProductTileProps> = ({ product, placement, featured = false, onOpen }) => (
  <button
    type="button"
    data-editorial-product-tile="true"
    className={`absolute ${placementClasses[placement]} pointer-events-auto z-10 flex ${featured ? 'max-w-[96px] md:max-w-[124px]' : 'max-w-[82px] md:max-w-[108px]'} shrink-0 flex-col items-center text-left transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[.97] ${placement === 'center' ? '-translate-x-1/2' : ''}`}
    aria-label={`Ver ${product.name}`}
    onPointerDown={(event) => event.stopPropagation()}
    onClick={(event) => {
      event.stopPropagation();
      onOpen(product.id);
    }}
  >
    <img
      src={product.image}
      alt=""
      className={`block h-auto w-auto object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,.48)] ${featured ? 'max-h-[82px] max-w-[92px] md:max-h-[104px] md:max-w-[118px]' : 'max-h-[70px] max-w-[78px] md:max-h-[88px] md:max-w-[102px]'}`}
      loading="lazy"
    />
    <span className="mt-1 max-w-full truncate font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] uppercase leading-[1.05] tracking-[0.03em] text-white drop-shadow-[0_2px_7px_rgba(0,0,0,.95)]">
      {product.name}
    </span>
    <span className="text-[10px] leading-none text-[#f2c14e] drop-shadow-[0_2px_7px_rgba(0,0,0,.95)]">
      {product.priceFormatted}
    </span>
  </button>
);
