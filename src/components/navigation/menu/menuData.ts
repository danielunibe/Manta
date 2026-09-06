export interface MenuItemData {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  hasSubmenu?: boolean;
  actionType:
    | 'inicio'
    | 'temporadas'
    | 'catalogo'
    | 'familia'
    | 'favoritos'
    | 'carrito'
    | 'cuenta';
}

export interface SeasonItemData {
  id: string;
  number: string;
  name: string;
  theme: string;
  year: string;
  editionIndex?: number; // 0 for August, 1 for Sept, 2 for Oct
  accentColor: string;
  badge?: string;
  image: string;
  isCurrent?: boolean;
}

export interface FamilyCategoryData {
  id: string;
  name: string;
  family: 'mujer' | 'hombre' | 'ninos' | 'bebe';
  lookIndex?: number;
  description: string;
}

export const MENU_ITEMS_DATA: MenuItemData[] = [
  {
    id: 'inicio',
    number: '01',
    title: 'INICIO',
    subtitle: 'Stand de revistas y portadas interactivas',
    actionType: 'inicio'
  },
  {
    id: 'temporadas',
    number: '02',
    title: 'TEMPORADAS',
    subtitle: 'Archivo de publicaciones y colecciones del año',
    hasSubmenu: true,
    actionType: 'temporadas'
  },
  {
    id: 'catalogo',
    number: '03',
    title: 'STORE',
    subtitle: 'Boutique familiar, compras y drops semanales',
    actionType: 'catalogo'
  },
  {
    id: 'familia',
    number: '04',
    title: 'FAMILIA',
    subtitle: 'Mujer, Hombre, Niños y Bebé',
    hasSubmenu: true,
    actionType: 'familia'
  },
  {
    id: 'favoritos',
    number: '05',
    title: 'FAVORITOS',
    subtitle: 'Prendas y looks guardados en tu atelier',
    actionType: 'favoritos'
  },
  {
    id: 'carrito',
    number: '06',
    title: 'CARRITO',
    subtitle: 'Bolsa de compras y prendas en orden',
    actionType: 'carrito'
  },
  {
    id: 'cuenta',
    number: '07',
    title: 'MI CUENTA',
    subtitle: 'Atelier personal, pedidos y atención boutique',
    actionType: 'cuenta'
  }
];

export const SEASONS_DATA: SeasonItemData[] = [
  {
    id: 'primavera',
    number: '01',
    name: 'PRIMAVERA',
    theme: 'Brisa & Lino Ligero',
    year: '2026',
    accentColor: '#48bb78',
    badge: 'Próximo Drop',
    image: '/assets/editorial/september-teaser-01.png'
  },
  {
    id: 'verano-agosto',
    number: '08',
    name: 'VERANO',
    theme: 'Monzón tapatío',
    year: '2026',
    editionIndex: 0,
    accentColor: '#e8b23a',
    badge: 'En vivo · Edición 08',
    image: '/assets/editorial/august-cover.png'
  },
  {
    id: 'otono-septiembre',
    number: '09',
    name: 'OTOÑO',
    theme: 'Patria cotidiana',
    year: '2026',
    editionIndex: 1,
    accentColor: '#d9a441',
    badge: 'Próximamente · Edición 09',
    image: '/assets/editorial/september-teaser-01.png'
  },
  {
    id: 'invierno-octubre',
    number: '10',
    name: 'INVIERNO',
    theme: 'Noche tapatía',
    year: '2026',
    editionIndex: 2,
    accentColor: '#e2588a',
    badge: 'Próximamente · Edición 10',
    image: '/assets/editorial/october-teaser-01.png'
  },
  {
    id: 'navidad',
    number: '12',
    name: 'NAVIDAD',
    theme: 'Gala de Luces & Fiestas',
    year: '2026',
    accentColor: '#ff4655',
    badge: 'Especial',
    image: '/assets/editorial/october-teaser-01.png'
  }
];

export const FAMILY_CATEGORIES_DATA: FamilyCategoryData[] = [
  {
    id: 'mujer',
    name: 'MUJER',
    family: 'mujer',
    description: 'Sastrería, gabardinas impermeables y piezas de seda'
  },
  {
    id: 'hombre',
    name: 'HOMBRE',
    family: 'hombre',
    description: 'Abrigos de lana, punto mostaza y parkas urbanas'
  },
  {
    id: 'ninos',
    name: 'NIÑOS',
    family: 'ninos',
    description: 'Botas de lluvia, chubasqueros y prendas de juego'
  },
  {
    id: 'bebe',
    name: 'BEBÉ',
    family: 'bebe',
    description: 'Mamelucos de algodón orgánico y mantas térmicas'
  }
];
