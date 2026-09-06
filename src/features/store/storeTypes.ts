import { Product } from '../../types';

export type StoreCategory = 'Todos' | 'Ropa' | 'Calzado' | 'Accesorios' | 'Mochilas' | 'Peluches' | 'Abrigos' | 'Camisas' | 'Pantalones';
export type StoreFamilyCategory = 'todos' | 'mujer' | 'hombre' | 'ninos' | 'bebe';
export type StoreSortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export type StoreProduct = Product;

export interface StoreCategoryItem {
  id: 'mujer' | 'hombre' | 'ninos' | 'bebe';
  title: string;
  chip: string;
  countLabel: string;
  image: string;
  accent: string;
  tagline: string;
}

export interface StoreBrand {
  id: string;
  name: string;
  status: 'available' | 'soon';
  visualVariant: string;
  tagline: string;
}

export interface StoreFiltersState {
  category: StoreCategory;
  brand: string;
  family: StoreFamilyCategory;
  maxPrice: number;
  sort: StoreSortOption;
  searchQuery: string;
  favoritesOnly?: boolean;
}

export interface StoreNavigationIntent {
  family?: StoreFamilyCategory;
  productId?: string;
  favoritesOnly?: boolean;
}
