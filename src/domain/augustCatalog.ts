import { Product } from '../types';

/**
 * Production catalog for the live August edition.
 *
 * Kept separate from the historical store fixtures so the published SPA does
 * not bundle future-season or remote-image data into the first experience.
 */
export const AUGUST_CATALOG_PRODUCTS: Product[] = [
  {
    id: 'manta-01', name: 'Paraguas Mostaza Clásico', brand: 'Manta', category: 'Accesorios', family: 'unisex',
    price: 680, priceFormatted: '$680 MXN', colors: 'Mostaza / Madera natural', image: '/assets/editorial/products/umbrella-mustard.png',
    isNew: true, tag: 'Drop semanal', subtitle: 'Varillaje reforzado y mango de madera pulida para cruzar la lluvia.',
    editorialProvenance: 'Agosto · La ciudad después del agua', releaseEditionId: 'august', storeVisible: true,
    sourceStoryId: 'august-rain', availability: 'in-stock'
  },
  {
    id: 'valle-01', name: 'Impermeable Terracota Fino', brand: 'Valle', category: 'Ropa', family: 'mujer',
    price: 1450, priceFormatted: '$1,450 MXN', colors: 'Terracota / Ocre', sizes: ['CH', 'M', 'G', 'XG'],
    image: '/assets/editorial/products/impermeable-mujer-terracota-editorial.png', isNew: true, tag: 'Novedad',
    subtitle: 'Una capa ligera para moverse entre agua, sombra y luz.', editorialProvenance: 'Agosto · La ciudad después del agua',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-rain', availability: 'in-stock'
  },
  {
    id: 'terra-01', name: 'Botas de Lluvia Humo', brand: 'Terra', category: 'Calzado', family: 'hombre',
    price: 980, priceFormatted: '$980 MXN', colors: 'Gris humo / Suela ámbar', sizes: ['25 MX', '26 MX', '27 MX', '28 MX', '29 MX'],
    image: '/assets/editorial/products/boots-smoke.png', tag: 'Edición limitada',
    subtitle: 'Suela firme y silueta limpia para caminar después del agua.', editorialProvenance: 'Agosto · La ciudad después del agua',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-rain', availability: 'limited'
  },
  {
    id: 'lluvia-lab-01', name: 'Poncho Storm Breaker Pro', brand: 'Lluvia Lab', category: 'Ropa', family: 'unisex',
    price: 1150, priceFormatted: '$1,150 MXN', colors: 'Grafito / Amarillo', sizes: ['S/M', 'L/XL'],
    image: '/assets/editorial/products/poncho-storm-grafito.png', isNew: true, tag: 'Técnico',
    subtitle: 'Ripstop repelente para la jornada que no se detiene.', editorialProvenance: 'Agosto · Oficio que se lleva',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-oficio', availability: 'in-stock'
  },
  {
    id: 'terra-02', name: 'Botines Chelsea Caucho Crema', brand: 'Terra', category: 'Calzado', family: 'mujer',
    price: 1280, priceFormatted: '$1,280 MXN', colors: 'Crema arena / Negro', sizes: ['23 MX', '24 MX', '25 MX', '26 MX'],
    image: '/assets/editorial/products/botines-chelsea-crema.png', isNew: true, tag: 'Selección',
    subtitle: 'Un acabado mate para entrar y salir de la calle con calma.', editorialProvenance: 'Agosto · Oficio que se lleva',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-oficio', availability: 'in-stock'
  },
  {
    id: 'august-bolsa', name: 'Bolsa de Diario Cantera', brand: 'Valle', category: 'Accesorios', family: 'unisex',
    price: 890, priceFormatted: '$890 MXN', colors: 'Terracota / Café', image: '/assets/editorial/products/bag-canterra.png', tag: 'Oficio',
    subtitle: 'Textura suave para llevar lo necesario durante una jornada larga.', editorialProvenance: 'Agosto · Oficio que se lleva',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-oficio', availability: 'in-stock'
  },
  {
    id: 'august-capa', name: 'Capa Ligera de Lluvia', brand: 'Lluvia Lab', category: 'Abrigos', family: 'unisex',
    price: 1350, priceFormatted: '$1,350 MXN', colors: 'Teal / Forro óxido', sizes: ['CH', 'M', 'G'],
    image: '/assets/editorial/products/jacket-teal.png', tag: 'Capa', subtitle: 'Una capa flexible para caminar entre lluvia, sombra y sol.',
    editorialProvenance: 'Agosto · Oficio que se lleva', releaseEditionId: 'august', storeVisible: true,
    sourceStoryId: 'august-oficio', availability: 'in-stock'
  },
  {
    id: 'august-bordado', name: 'Camisa Bordado de Barrio', brand: 'Manta', category: 'Camisas', family: 'mujer',
    price: 1180, priceFormatted: '$1,180 MXN', colors: 'Crema / Hilo terracota', sizes: ['CH', 'M', 'G'],
    image: '/assets/editorial/products/shirt-bordado-barrio.png', isNew: true, tag: 'Editorial',
    subtitle: 'Algodón y un gesto de color pensado para repetirse.', editorialProvenance: 'Agosto · Oficio que se lleva',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-oficio', availability: 'in-stock'
  },
  {
    id: 'august-bolso-azul', name: 'Bolso Azul de Noche', brand: 'Manta', category: 'Accesorios', family: 'mujer',
    price: 1120, priceFormatted: '$1,120 MXN', colors: 'Azul profundo / Metal cálido', image: '/assets/editorial/products/bolso-azul-noche.png', tag: 'Noche',
    subtitle: 'Una silueta compacta para llevar la noche entre una mesa y otra.', editorialProvenance: 'Agosto · Noche de barrio',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-noche', availability: 'limited'
  },
  {
    id: 'august-bolso-cafe', name: 'Bolso Café de Terraza', brand: 'Manta', category: 'Accesorios', family: 'unisex',
    price: 1240, priceFormatted: '$1,240 MXN', colors: 'Café cacao / Metal cálido', image: '/assets/editorial/products/bolso-cafe-terraza-editorial.png', tag: 'Objeto de escena',
    subtitle: 'Una forma estructurada para pasar de la calle a la reunión.', editorialProvenance: 'Agosto · Noche de barrio',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-noche', availability: 'in-stock'
  },
  {
    id: 'august-chaqueta', name: 'Chaqueta Teal de Noche', brand: 'Norte', category: 'Abrigos', family: 'hombre',
    price: 1690, priceFormatted: '$1,690 MXN', colors: 'Teal profundo / Óxido', sizes: ['CH', 'M', 'G', 'XG'],
    image: '/assets/editorial/products/camisa-hombre-teal-editorial.png', tag: 'Noche',
    subtitle: 'Una capa ligera para la última hora de la tarde.', editorialProvenance: 'Agosto · Noche de barrio',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-noche', availability: 'limited'
  },
  {
    id: 'august-punto', name: 'Punto Bruma de Temporada', brand: 'Bruma', category: 'Ropa', family: 'unisex',
    price: 980, priceFormatted: '$980 MXN', colors: 'Teal / Arena', sizes: ['CH', 'M', 'G'], image: '/assets/editorial/products/punto-bruma.png', tag: 'Punto',
    subtitle: 'Textura suave para una noche fresca y una ciudad que sigue caminando.', editorialProvenance: 'Agosto · Noche de barrio',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-noche', availability: 'in-stock'
  },
  {
    id: 'august-sneakers', name: 'Tenis Paso Mojado', brand: 'Terra', category: 'Calzado', family: 'unisex',
    price: 1240, priceFormatted: '$1,240 MXN', colors: 'Humo / Ámbar', sizes: ['24 MX', '25 MX', '26 MX', '27 MX', '28 MX'], image: '/assets/editorial/products/tenis-paso-mojado.png', tag: 'Urbano',
    subtitle: 'Suela firme para cruzar la ciudad después de la lluvia.', editorialProvenance: 'Agosto · Noche de barrio',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-noche', availability: 'in-stock'
  },
  {
    id: 'august-acento', name: 'Pañoleta Ruta de Agua', brand: 'Manta', category: 'Accesorios', family: 'unisex',
    price: 420, priceFormatted: '$420 MXN', colors: 'Óxido / Mostaza', image: '/assets/editorial/products/panolleta-ruta-agua.png', tag: 'Acento',
    subtitle: 'Un pequeño golpe de color para llevar la historia contigo.', editorialProvenance: 'Agosto · Noche de barrio',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-noche', availability: 'in-stock'
  },
  {
    id: 'august-kids-raincoat', name: 'Impermeable Nube Amarilla', brand: 'Manta', category: 'Ropa', family: 'ninos',
    price: 790, priceFormatted: '$790 MXN', colors: 'Mostaza / Teal', sizes: ['4A', '6A', '8A', '10A'], image: '/assets/editorial/products/ninos-impermeable-amarillo.png', isNew: true, tag: 'Niños',
    subtitle: 'Una capa ligera para convertir el trayecto en aventura.', editorialProvenance: 'Agosto · La ciudad después del agua · Niños',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-rain', availability: 'in-stock'
  },
  {
    id: 'august-kids-boots', name: 'Botas Charco Teal', brand: 'Terra', category: 'Calzado', family: 'ninos',
    price: 620, priceFormatted: '$620 MXN', colors: 'Teal / Terracota', sizes: ['18 MX', '19 MX', '20 MX', '21 MX'], image: '/assets/editorial/products/botas-ninos-teal-editorial.png', tag: 'Niños',
    subtitle: 'Bota flexible para caminar, saltar y volver a casa.', editorialProvenance: 'Agosto · La ciudad después del agua · Niños',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-rain', availability: 'in-stock'
  },
  {
    id: 'august-kids-backpack', name: 'Mochila Nube de Camino', brand: 'Manta', category: 'Mochilas', family: 'ninos',
    price: 690, priceFormatted: '$690 MXN', colors: 'Óxido / Teal', sizes: ['Única'], image: '/assets/editorial/products/ninos-mochila-nube.png', tag: 'Niños',
    subtitle: 'Una mochila compacta para llevar lo necesario durante la jornada.', editorialProvenance: 'Agosto · La ciudad después del agua · Niños',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-rain', availability: 'in-stock'
  },
  {
    id: 'august-kids-plush', name: 'Compañero Ajolote de Lluvia', brand: 'Manta', category: 'Peluches', family: 'ninos',
    price: 440, priceFormatted: '$440 MXN', colors: 'Terracota / Teal', sizes: ['Única'], image: '/assets/editorial/products/ninos-peluche-ajolote.png', tag: 'Niños',
    subtitle: 'Un pequeño acompañante para la pausa entre una escena y otra.', editorialProvenance: 'Agosto · La ciudad después del agua · Niños',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-rain', availability: 'in-stock'
  },
  {
    id: 'august-baby-body', name: 'Body Cielo de Algodón', brand: 'Manta', category: 'Ropa', family: 'bebe',
    price: 520, priceFormatted: '$520 MXN', colors: 'Crema / Cielo', sizes: ['3-6M', '6-12M', '12-18M'], image: '/assets/editorial/products/body-bebe-cielo-editorial.png', tag: 'Bebé',
    subtitle: 'Una pieza suave para los primeros días de lluvia y de luz.', editorialProvenance: 'Agosto · La ciudad después del agua · Bebé',
    releaseEditionId: 'august', storeVisible: true, sourceStoryId: 'august-rain', availability: 'in-stock'
  }
];
