export type AppMode = 'editorial' | 'store';

export type EditionStatus = 'live' | 'upcoming';
export type HotspotRelation = 'wearing' | 'carried' | 'material' | 'complete-look';

export interface AssetRef {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface TextLine {
  t: string;
  em?: boolean;
}

export interface Look {
  chip: string;
  acento: string;
  lineas: TextLine[];
  sub: string;
  image: string;
  alt: string;
  storyId?: string;
  imageAsset?: AssetRef;
  hotspots?: Hotspot[];
}

export type BackgroundEngine = 'rain' | 'fireworks' | 'street';

export interface MagazineEdition {
  id: string;
  number: string;
  month: string;
  year: string;
  themeTitle: string;
  backgroundEngine: BackgroundEngine;
  gradientBg: string;
  looks: Look[];
  status?: EditionStatus;
  storeEnabled?: boolean;
  teaserMessage?: string;
}

export interface Hotspot {
  id: string;
  storyId: string;
  productId: string;
  label: string;
  x: number;
  y: number;
  relation: HotspotRelation;
}

export interface TiltState {
  rotX: number;
  rotY: number;
  px: number;
  py: number;
  gx: string;
  gy: string;
  isPulsing: boolean;
}

export type ProductCategory = 'Ropa' | 'Calzado' | 'Accesorios' | 'Mochilas' | 'Peluches' | 'Abrigos' | 'Camisas' | 'Pantalones';
export type ProductFamily = 'mujer' | 'hombre' | 'ninos' | 'bebe' | 'unisex';
export type ProductAvailability = 'in-stock' | 'limited' | 'preorder' | 'sold-out';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  family: ProductFamily;
  price: number;
  priceFormatted: string;
  image: string;
  img?: string;
  colors?: string;
  sizes?: string[];
  tag?: string;
  badge?: string;
  subtitle?: string;
  isNew?: boolean;
  guaf?: boolean;
  probador?: boolean;
  availability?: ProductAvailability;
  editorialProvenance?: string;
  releaseEditionId?: string;
  storeVisible?: boolean;
  sourceStoryId?: string;
  asset?: AssetRef;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}
