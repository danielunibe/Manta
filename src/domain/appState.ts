import { CartItem, Product } from '../types';

export interface MantaState {
  mode: 'editorial' | 'store';
  activeEditionId: string;
  activeStoryId: string | null;
  selectedProductId: string | null;
  selectedLookProductIds: string[];
  favoriteProductIds: Set<string>;
  cartItems: CartItem[];
  navigationNotice: string | null;
}

export type MantaAction =
  | { type: 'SELECT_EDITION'; editionId: string }
  | { type: 'OPEN_STORY'; storyId: string }
  | { type: 'CLOSE_STORY' }
  | { type: 'OPEN_PRODUCT'; productId: string }
  | { type: 'CLOSE_PRODUCT' }
  | { type: 'ADD_TO_LOOK'; productId: string }
  | { type: 'REMOVE_FROM_LOOK'; productId: string }
  | { type: 'TOGGLE_FAVORITE'; productId: string }
  | { type: 'ADD_TO_CART'; product: Product; selections?: { size?: string; color?: string } }
  | { type: 'REMOVE_FROM_CART'; productId: string; selectedSize?: string; selectedColor?: string }
  | { type: 'UPDATE_CART_QUANTITY'; productId: string; quantity: number; selectedSize?: string; selectedColor?: string }
  | { type: 'OPEN_STORE' }
  | { type: 'OPEN_EDITORIAL' }
  | { type: 'SHOW_NOTICE'; message: string }
  | { type: 'CLEAR_NOTICE' };

export const initialMantaState: MantaState = {
  mode: 'editorial',
  activeEditionId: 'august',
  activeStoryId: null,
  selectedProductId: null,
  selectedLookProductIds: [],
  favoriteProductIds: new Set(['manta-01', 'terra-01']),
  cartItems: [],
  navigationNotice: null
};

export function mantaReducer(state: MantaState, action: MantaAction): MantaState {
  switch (action.type) {
    case 'SELECT_EDITION':
      return { ...state, activeEditionId: action.editionId, activeStoryId: null, selectedProductId: null };
    case 'OPEN_STORY':
      return { ...state, activeStoryId: action.storyId, selectedProductId: null };
    case 'CLOSE_STORY':
      return { ...state, activeStoryId: null, selectedProductId: null, selectedLookProductIds: [] };
    case 'OPEN_PRODUCT':
      return { ...state, selectedProductId: action.productId };
    case 'CLOSE_PRODUCT':
      return { ...state, selectedProductId: null };
    case 'ADD_TO_LOOK':
      return state.selectedLookProductIds.includes(action.productId)
        ? state
        : { ...state, selectedLookProductIds: [...state.selectedLookProductIds, action.productId] };
    case 'REMOVE_FROM_LOOK':
      return { ...state, selectedLookProductIds: state.selectedLookProductIds.filter((id) => id !== action.productId) };
    case 'TOGGLE_FAVORITE': {
      const next = new Set(state.favoriteProductIds);
      if (next.has(action.productId)) next.delete(action.productId); else next.add(action.productId);
      return { ...state, favoriteProductIds: next };
    }
    case 'ADD_TO_CART': {
      const existing = state.cartItems.find((item) => item.product.id === action.product.id && item.selectedSize === action.selections?.size && item.selectedColor === action.selections?.color);
      if (existing) {
        return { ...state, cartItems: state.cartItems.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item) };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { product: action.product, quantity: 1, selectedSize: action.selections?.size, selectedColor: action.selections?.color }]
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => !(
          item.product.id === action.productId &&
          item.selectedSize === action.selectedSize &&
          item.selectedColor === action.selectedColor
        ))
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems
          .map((item) => item.product.id === action.productId && item.selectedSize === action.selectedSize && item.selectedColor === action.selectedColor
            ? { ...item, quantity: action.quantity }
            : item)
          .filter((item) => item.quantity > 0)
      };
    case 'OPEN_STORE':
      return { ...state, mode: 'store', activeStoryId: null, selectedProductId: null };
    case 'OPEN_EDITORIAL':
      return { ...state, mode: 'editorial' };
    case 'SHOW_NOTICE':
      return { ...state, navigationNotice: action.message };
    case 'CLEAR_NOTICE':
      return { ...state, navigationNotice: null };
    default:
      return state;
  }
}
