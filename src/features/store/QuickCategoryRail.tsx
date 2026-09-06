import React from 'react';
import { StoreCategory, StoreFamilyCategory, StoreFiltersState } from './storeTypes';
import { tactile } from '../../utils/tactileFeedback';
import { Sparkles, User, Users, Baby, Footprints, Shield, Shirt, Backpack, HeartHandshake } from 'lucide-react';

interface QuickCategoryRailProps {
  filters: StoreFiltersState;
  onSelectCategory: (type: 'family' | 'category' | 'all', value: string) => void;
  onScrollToCatalog?: () => void;
}

interface QuickCatItem {
  id: string;
  type: 'all' | 'family' | 'category';
  value: string;
  label: string;
  icon: React.ReactNode;
}

const QUICK_CATEGORIES: QuickCatItem[] = [
  {
    id: 'all',
    type: 'all',
    value: 'todos',
    label: 'Todos',
    icon: <Sparkles className="w-3.5 h-3.5" />
  },
  {
    id: 'mujer',
    type: 'family',
    value: 'mujer',
    label: 'Mujer',
    icon: <User className="w-3.5 h-3.5" />
  },
  {
    id: 'hombre',
    type: 'family',
    value: 'hombre',
    label: 'Hombre',
    icon: <User className="w-3.5 h-3.5" />
  },
  {
    id: 'ninos',
    type: 'family',
    value: 'ninos',
    label: 'Niños',
    icon: <Users className="w-3.5 h-3.5" />
  },
  {
    id: 'bebe',
    type: 'family',
    value: 'bebe',
    label: 'Bebé',
    icon: <Baby className="w-3.5 h-3.5" />
  },
  {
    id: 'calzado',
    type: 'category',
    value: 'Calzado',
    label: 'Calzado',
    icon: <Footprints className="w-3.5 h-3.5" />
  },
  {
    id: 'ropa',
    type: 'category',
    value: 'Ropa',
    label: 'Ropa',
    icon: <Shirt className="w-3.5 h-3.5" />
  },
  {
    id: 'accesorios',
    type: 'category',
    value: 'Accesorios',
    label: 'Accesorios',
    icon: <Shield className="w-3.5 h-3.5" />
  },
  {
    id: 'mochilas',
    type: 'category',
    value: 'Mochilas',
    label: 'Mochilas',
    icon: <Backpack className="w-3.5 h-3.5" />
  },
  {
    id: 'peluches',
    type: 'category',
    value: 'Peluches',
    label: 'Peluches',
    icon: <HeartHandshake className="w-3.5 h-3.5" />
  },
  {
    id: 'abrigos',
    type: 'category',
    value: 'Abrigos',
    label: 'Abrigos',
    icon: <Shield className="w-3.5 h-3.5" />
  },
  {
    id: 'camisas',
    type: 'category',
    value: 'Camisas',
    label: 'Camisas',
    icon: <Shirt className="w-3.5 h-3.5" />
  },
  {
    id: 'pantalones',
    type: 'category',
    value: 'Pantalones',
    label: 'Pantalones',
    icon: <Shirt className="w-3.5 h-3.5" />
  }
];

export const QuickCategoryRail: React.FC<QuickCategoryRailProps> = ({
  filters,
  onSelectCategory,
  onScrollToCatalog
}) => {
  const isSelected = (item: QuickCatItem) => {
    if (item.type === 'all') {
      return filters.family === 'todos' && filters.category === 'Todos' && !filters.favoritesOnly;
    }
    if (item.type === 'family') {
      return filters.family === item.value;
    }
    if (item.type === 'category') {
      return filters.category === item.value;
    }
    return false;
  };

  const handleTap = (item: QuickCatItem) => {
    tactile.selection();
    if (item.type === 'all') {
      onSelectCategory('all', 'todos');
    } else if (item.type === 'family') {
      if (filters.family === item.value) {
        onSelectCategory('family', 'todos');
      } else {
        onSelectCategory('family', item.value);
      }
    } else if (item.type === 'category') {
      if (filters.category === item.value) {
        onSelectCategory('category', 'Todos');
      } else {
        onSelectCategory('category', item.value);
      }
    }
  };

  return (
    <nav
      id="quick-category-rail"
      aria-label="Categorías Rápidas"
      className="relative -my-1 py-1"
    >
      <div
        className="flex gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar px-0.5 py-1 -mx-0.5 select-none"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain'
        }}
      >
        {QUICK_CATEGORIES.map((item) => {
          const active = isSelected(item);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTap(item)}
              aria-pressed={active}
              className={`shrink-0 min-h-[42px] px-3.5 sm:px-4 py-2 rounded-full text-xs font-['Spline_Sans_Mono',ui-monospace,monospace] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer tactile-control ${
                active
                  ? 'bg-[#f2c14e]/18 text-[#f2c14e] font-bold shadow-md shadow-[#f2c14e]/20 scale-[1.02]'
                  : 'store-glass-control text-[#ece7de] hover:text-white'
              }`}
            >
              <span className={active ? 'text-black' : 'text-[#f2c14e]'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
