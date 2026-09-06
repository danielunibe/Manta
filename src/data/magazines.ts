import { MagazineEdition } from '../types';

export const EDITIONS: MagazineEdition[] = [
  {
    id: 'august',
    number: '08',
    month: 'Agosto',
    year: '2026',
    themeTitle: 'Monzón tapatío',
    backgroundEngine: 'rain',
    gradientBg: 'transparent',
    looks: [
      {
        chip: 'Monzón tapatío · Escena 01',
        acento: '#e8b23a',
        lineas: [{ t: 'La ciudad' }, { t: 'después del agua', em: true }],
        sub: 'Una familia cruza la ciudad cuando la lluvia vuelve espejo la calle.',
        image: '/assets/editorial/directed/august-cover-hero-vertical.png',
        alt: 'Familia latina caminando centrada hacia la cámara con paraguas rojo, transparente, mostaza y teal, salpicando agua'
      },
      {
        chip: 'Oficio que se lleva · Escena 02',
        acento: '#d64545',
        lineas: [{ t: 'Oficio que' }, { t: 'se lleva', em: true }],
        sub: 'Texturas, color y movimiento convierten la ciudad en un taller abierto.',
        image: '/assets/editorial/directed/august-materia-vertical.png',
        alt: 'Familia latina riendo bajo paraguas inclinados en pleno aguacero'
      },
      {
        chip: 'Noche de barrio · Escena 03',
        acento: '#2f8f83',
        lineas: [{ t: 'Noche de' }, { t: 'barrio', em: true }],
        sub: 'La tarde cae sobre una mesa compartida: vestir también es encontrarse.',
        image: '/assets/editorial/directed/august-noche-barrio-horizontal.png',
        alt: 'Familia latina de espaldas caminando con paraguas encendidos como faroles'
      }
    ]
  },
  {
    id: 'september',
    number: '09',
    month: 'Septiembre',
    year: '2026',
    themeTitle: 'Patria cotidiana',
    backgroundEngine: 'fireworks',
    gradientBg: 'radial-gradient(60vmax 42vmax at 50% 44%, rgba(20,48,38,.55), transparent 68%), #040d0a',
    looks: [
      {
        chip: 'Próximamente · Patria cotidiana',
        acento: '#d9a441',
        lineas: [{ t: 'La materia' }, { t: 'guarda memoria', em: true }],
        sub: 'Un adelanto de oficio, ciudad y herencia cotidiana.',
        image: '/assets/editorial/september-teaser-01.png',
        alt: 'Look 01: sastre marfil bordado con rebozo carmín'
      },
      {
        chip: 'Próximamente · Patria cotidiana',
        acento: '#ff4655',
        lineas: [{ t: 'La calle' }, { t: 'también hereda', em: true }],
        sub: 'Color y movimiento para una patria vivida a diario.',
        image: '/assets/editorial/september-teaser-02.png',
        alt: 'Look 02: sastre negro con bordado carmín de gala'
      },
      {
        chip: 'Próximamente · Patria cotidiana',
        acento: '#2fbf71',
        lineas: [{ t: 'Vestir la' }, { t: 'celebración', em: true }],
        sub: 'Una noche de encuentro, todavía por descubrir.',
        image: '/assets/editorial/september-teaser-03.png',
        alt: 'Look 03: vestido-rebozo de seda esmeralda en movimiento'
      }
    ]
  },
  {
    id: 'october',
    number: '10',
    month: 'Octubre',
    year: '2026',
    themeTitle: 'Noche tapatía',
    backgroundEngine: 'street',
    gradientBg: 'transparent',
    looks: [
      {
        chip: 'Próximamente · Noche tapatía',
        acento: '#e2588a',
        lineas: [{ t: 'Luces de' }, { t: 'barrio', em: true }],
        sub: 'Un adelanto nocturno entre neón, lluvia y amistad.',
        image: '/assets/editorial/october-teaser-01.png',
        alt: 'Cuadrilla de amigas recargadas riendo contra una fachada verde menta en la Roma Norte'
      },
      {
        chip: 'Próximamente · Noche tapatía',
        acento: '#f2b33d',
        lineas: [{ t: 'La esquina' }, { t: 'se enciende', em: true }],
        sub: 'Siluetas y color para una ciudad que no se detiene.',
        image: '/assets/editorial/october-teaser-02.png',
        alt: 'Cuadrilla riendo frente a un café con toldo verde en la Roma Norte'
      },
      {
        chip: 'Próximamente · Noche tapatía',
        acento: '#3fa777',
        lineas: [{ t: 'Después de' }, { t: 'la lluvia', em: true }],
        sub: 'La última imagen antes de abrir la próxima edición.',
        image: '/assets/editorial/october-teaser-03.png',
        alt: 'Cuadrilla cruzando el paso peatonal en la Roma Norte al atardecer'
      }
    ]
  }
];
