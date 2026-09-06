import { Product } from '../types';
import { normalizeProduct } from './content';
import { AUGUST_CATALOG_PRODUCTS } from './augustCatalog';

const AUGUST_PRODUCT_ASSETS: Record<string, { image: string; storyId: string }> = {
  'manta-01': { image: '/assets/editorial/products/umbrella-mustard.png', storyId: 'august-rain' },
  'valle-01': { image: '/assets/editorial/products/impermeable-mujer-terracota-editorial.png', storyId: 'august-rain' },
  'terra-01': { image: '/assets/editorial/products/boots-smoke.png', storyId: 'august-rain' },
  'lluvia-lab-01': { image: '/assets/editorial/products/poncho-storm-grafito.png', storyId: 'august-oficio' },
  'terra-02': { image: '/assets/editorial/products/botines-chelsea-crema.png', storyId: 'august-oficio' },
  'august-look': { image: '/assets/editorial/august-cover.png', storyId: 'august-rain' },
  'august-bolsa': { image: '/assets/editorial/products/bag-canterra.png', storyId: 'august-oficio' },
  'august-bolso-azul': { image: '/assets/editorial/products/bolso-azul-noche.png', storyId: 'august-noche' },
  'august-bolso-cafe': { image: '/assets/editorial/products/bolso-cafe-terraza-editorial.png', storyId: 'august-noche' },
  'august-capa': { image: '/assets/editorial/products/jacket-teal.png', storyId: 'august-oficio' },
  'august-bordado': { image: '/assets/editorial/products/shirt-bordado-barrio.png', storyId: 'august-oficio' },
  'august-chaqueta': { image: '/assets/editorial/products/camisa-hombre-teal-editorial.png', storyId: 'august-noche' },
  'august-punto': { image: '/assets/editorial/products/punto-bruma.png', storyId: 'august-noche' },
  'august-sneakers': { image: '/assets/editorial/products/tenis-paso-mojado.png', storyId: 'august-noche' },
  'august-acento': { image: '/assets/editorial/products/panolleta-ruta-agua.png', storyId: 'august-noche' },
  'august-kids-raincoat': { image: '/assets/editorial/products/ninos-impermeable-amarillo.png', storyId: 'august-rain' },
  'august-kids-boots': { image: '/assets/editorial/products/botas-ninos-teal-editorial.png', storyId: 'august-rain' },
  'august-kids-backpack': { image: '/assets/editorial/products/ninos-mochila-nube.png', storyId: 'august-rain' },
  'august-kids-plush': { image: '/assets/editorial/products/ninos-peluche-ajolote.png', storyId: 'august-rain' },
  'august-baby-body': { image: '/assets/editorial/products/body-bebe-cielo-editorial.png', storyId: 'august-rain' }
};

export const ALL_PRODUCTS: Product[] = AUGUST_CATALOG_PRODUCTS.map((product) => {
  const editorialAsset = AUGUST_PRODUCT_ASSETS[product.id];
  return normalizeProduct({
    ...product,
    ...(editorialAsset ? { image: editorialAsset.image, sourceStoryId: editorialAsset.storyId } : {})
  });
});

const AUGUST_EDITORIAL_PRODUCT_IDS = new Set(
  ALL_PRODUCTS
    .filter((product) => product.releaseEditionId === 'august' && product.storeVisible === true)
    .map((product) => product.id)
);

/** The pilot catalog is derived from the products actually placed in August scenes. */
export const getLiveProducts = (): Product[] => ALL_PRODUCTS.filter(
  (product) => product.releaseEditionId === 'august' && product.storeVisible === true && AUGUST_EDITORIAL_PRODUCT_IDS.has(product.id)
);

export const getProductsForStory = (storyId: string): Product[] => ALL_PRODUCTS.filter(
  (product) => product.sourceStoryId === storyId
);

export const getProduct = (productId: string): Product | undefined => ALL_PRODUCTS.find((product) => product.id === productId);

export const getProductsByIds = (productIds: string[]): Product[] => productIds
  .map((id) => getProduct(id))
  .filter((product): product is Product => Boolean(product));
