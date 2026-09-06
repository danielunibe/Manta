import { EDITORIAL_ASSETS } from '../data/assetManifest';
import { StoryNote, StoryCampaign } from './editorialMediaTypes';

export type MediaOrientation = 'portrait' | 'landscape';
export type MediaStatus = 'planned' | 'ready';

export interface EditorialMedia {
  id: string;
  kind: 'poster' | 'video' | 'audio';
  orientation?: MediaOrientation;
  src?: string;
  posterSrc?: string;
  alt?: string;
  durationSeconds?: number;
  status: MediaStatus;
  flowPrompt?: string;
  sunoPrompt?: string;
  lyrics?: string;
}

export const EDITORIAL_MEDIA: EditorialMedia[] = [
  {
    id: 'poster-august-after-rain',
    kind: 'poster',
    orientation: 'portrait',
    src: EDITORIAL_ASSETS.campaigns.afterRain,
    alt: 'Familia latinoamericana camina bajo la lluvia por una calle urbana de Guadalajara con prendas mostaza, terracota y teal.',
    status: 'ready'
  },
  {
    id: 'poster-august-materia',
    kind: 'poster',
    orientation: 'portrait',
    src: EDITORIAL_ASSETS.campaigns.materia,
    alt: 'Composición editorial vertical con textiles, una bolsa de diario y una prenda terracota sobre una mesa de materiales.',
    status: 'ready'
  },
  {
    id: 'poster-august-noche-barrio',
    kind: 'poster',
    orientation: 'landscape',
    src: EDITORIAL_ASSETS.campaigns.nocheBarrio,
    alt: 'Grupo de amigos latinoamericanos comparte una mesa en una terraza urbana después de la lluvia, con luces cálidas y prendas teal y óxido.',
    status: 'ready'
  },
  {
    id: 'video-august-after-rain',
    kind: 'video',
    orientation: 'portrait',
    src: '/assets/editorial/video/august-after-rain-vertical.mp4',
    posterSrc: EDITORIAL_ASSETS.campaigns.afterRain,
    durationSeconds: 10,
    status: 'ready',
    flowPrompt: 'Create a cinematic editorial fashion video from the reference image. Slow forward camera movement through a rain-soaked Guadalajara-inspired street. Preserve the same people, garments, color palette and composition. Add subtle rain, natural walking motion, reflections on pavement and warm café light. Keep the scene human and observational, not commercial. No product close-ups, no logos, no text generated inside the video. End with a calm editorial pause suitable for adding the title “La ciudad después del agua” in post-production.'
  },
  {
    id: 'video-august-materia',
    kind: 'video',
    orientation: 'portrait',
    src: '/assets/editorial/video/august-materia-vertical.mp4',
    posterSrc: EDITORIAL_ASSETS.campaigns.materia,
    durationSeconds: 10,
    status: 'ready',
    flowPrompt: 'Create a tactile editorial fashion video from the reference image. Use macro movements across fabric, stitching, leather-like texture and a terracotta garment. Transition from the conceptual studio surface to a person wearing the layer and moving toward a city doorway. Keep the camera intimate, elegant and slow. Preserve the original palette and objects. No readable text, no artificial logos, no claims of handcrafted origin, no product catalogue framing. The ending should leave room for an editorial title and a button.'
  },
  {
    id: 'video-august-noche-barrio',
    kind: 'video',
    orientation: 'landscape',
    src: '/assets/editorial/video/august-noche-barrio-horizontal.mp4',
    posterSrc: EDITORIAL_ASSETS.campaigns.nocheBarrio,
    durationSeconds: 10,
    status: 'ready',
    flowPrompt: 'Create a cinematic horizontal editorial campaign video from the reference image. Begin with a quiet urban terrace after rain, then introduce subtle movement among a group of Latin American friends. Use warm lights, wet surfaces, teal and oxide clothing, gentle camera orbit and natural gestures. The mood is contemporary, intimate and communal. Do not make it a conventional ecommerce advertisement. No generated logos or text. End with a wide composition and negative space for the campaign title “Noche de barrio” and a contextual commerce button.'
  },
  {
    id: 'poster-august-page-02',
    kind: 'poster',
    orientation: 'portrait',
    src: EDITORIAL_ASSETS.pages.august02,
    alt: 'Persona con una capa terracota cruza una calle mojada después de la lluvia.',
    status: 'ready'
  },
  {
    id: 'poster-august-page-03',
    kind: 'poster',
    orientation: 'portrait',
    src: EDITORIAL_ASSETS.pages.august03,
    alt: 'Familia latinoamericana se reúne bajo la luz posterior a la lluvia con capas de distintos colores.',
    status: 'ready'
  },
  {
    id: 'poster-august-page-04',
    kind: 'poster',
    orientation: 'portrait',
    src: EDITORIAL_ASSETS.pages.august04,
    alt: 'Niños y una persona adulta recorren un pasaje urbano después de la lluvia.',
    status: 'ready'
  },
  {
    id: 'poster-august-family-outfits',
    kind: 'poster',
    orientation: 'portrait',
    src: EDITORIAL_ASSETS.pages.august05FamilyOutfits,
    alt: 'Dos grupos familiares recorren una calle mojada: madre e hija a la izquierda, padre e hijo a la derecha, con capas mostaza, terracota y teal.',
    status: 'ready'
  },
  {
    id: 'poster-august-oficio-noche',
    kind: 'poster',
    orientation: 'portrait',
    src: EDITORIAL_ASSETS.pages.august06OficioNoche,
    alt: 'Persona acomoda textiles, una bolsa y calzado en un taller abierto a una calle tapatía iluminada después de la lluvia.',
    status: 'ready'
  },
  {
    id: 'poster-august-father-son',
    kind: 'poster',
    orientation: 'portrait',
    src: EDITORIAL_ASSETS.pages.august05FatherSon,
    alt: 'Padre e hijo caminan juntos por una calle tapatía mojada, con capas teal y acentos terracota y mostaza.',
    status: 'ready'
  },
  {
    id: 'poster-august-mother-daughter',
    kind: 'poster',
    orientation: 'portrait',
    src: EDITORIAL_ASSETS.pages.august06MotherDaughter,
    alt: 'Madre e hija caminan juntas por una calle tapatía mojada, con prendas mostaza, terracota y teal.',
    status: 'ready'
  },
  {
    id: 'poster-august-product-interlude',
    kind: 'poster',
    orientation: 'portrait',
    src: EDITORIAL_ASSETS.pages.augustProductInterlude,
    alt: 'Composición editorial de una capa terracota, una bolsa de diario y botas de lluvia sobre una banca después del agua.',
    status: 'ready'
  },
  {
    id: 'audio-despues-del-agua',
    kind: 'audio',
    src: EDITORIAL_ASSETS.audio.luzDespuesLluvia,
    durationSeconds: 58,
    status: 'ready',
    sunoPrompt: 'Contemporary Latin downtempo, subtle electronic cumbia pulse, warm wooden percussion, soft rain field recordings, intimate Spanish vocal, cinematic editorial atmosphere, 82 BPM, restrained arrangement, elegant and reflective, no artist imitation, no dramatic pop chorus.',
    lyrics: `[Verso]\nLa calle guarda luces\ndebajo de los pasos,\nla tarde se acomoda\ndespués del aguacero.\n\nUn hilo de mostaza,\nterracota en el viento,\nla ciudad abre espacio\npara volver a vernos.\n\n[Pre-coro]\nNo hay prisa en la esquina,\nni miedo en el camino,\nla lluvia cambia el nombre\nde todo lo vivido.\n\n[Coro]\nDespués del agua,\nla calle vuelve a respirar.\nDespués del agua,\nhay otra forma de llegar.\nSi el cielo cae,\nnos encuentra caminando.\nDespués del agua,\nseguimos aquí, seguimos andando.`
  },
  {
    id: 'audio-materia-que-camina',
    kind: 'audio',
    src: EDITORIAL_ASSETS.audio.papelPicadoSuave,
    durationSeconds: 55,
    status: 'ready',
    sunoPrompt: 'Modern Mexican-inspired indie folk with nylon guitar, soft hand percussion, subtle textile-like rhythmic clicks, warm bass, intimate Spanish vocal, editorial fashion film mood, 96 BPM, tactile and optimistic, no folkloric parody, no artist imitation.',
    lyrics: `[Verso]\nUna costura guarda\nla forma de una tarde,\nun hilo cruza el aire,\nla sombra se reparte.\n\nLa mano toca el borde,\nla tela cambia el paso,\nlo que parecía quieto\nse vuelve necesario.\n\n[Pre-coro]\nNo es solo lo que cubre,\ntambién lo que acompaña,\nuna textura aprende\nla ruta de la mañana.\n\n[Coro]\nMateria que camina,\ncolor que sabe regresar.\nMateria que camina,\nun gesto para continuar.\nLlévalo contigo,\nsin dejar la historia atrás.\nMateria que camina,\nlo pequeño también puede durar.`
  },
  {
    id: 'audio-la-noche-nos-junta',
    kind: 'audio',
    src: EDITORIAL_ASSETS.audio.esquinasLluvia,
    durationSeconds: 62,
    status: 'ready',
    sunoPrompt: 'Nocturnal Latin groove, brushed percussion, muted synth bass, soft electric piano, subtle urban ambience, intimate Spanish vocal, contemporary Guadalajara night atmosphere, 104 BPM, elegant and communal, suitable for an editorial fashion campaign, no artist imitation.',
    lyrics: `[Verso]\nLa noche enciende lento\nlas luces de la esquina,\nun reflejo en la mesa,\nla lluvia todavía.\n\nLlegamos con la tarde\nguardada en los bolsillos,\nla calle nos devuelve\nun lugar compartido.\n\n[Pre-coro]\nAquí nadie pregunta\nde dónde viene el viento,\nla música acomoda\nlos cuerpos y el silencio.\n\n[Coro]\nLa noche nos junta,\nla noche nos deja estar.\nUna luz en la ruta,\nun sitio para regresar.\nTeal sobre la sombra,\nóxido sobre el cristal.\nLa noche nos junta,\ny la ciudad vuelve a empezar.`
  }
];

export const getEditorialMedia = (mediaId: string): EditorialMedia | undefined =>
  EDITORIAL_MEDIA.find((media) => media.id === mediaId);

export const AUGUST_STORY_NOTES: StoryNote[] = [
  {
    id: 'note-august-rain-map', storyId: 'august-rain', eyebrow: 'Microcrónica · 02 min',
    title: 'Mapa sensorial de una calle mojada',
    body: ['La calle guarda otra arquitectura cuando llueve: la cantera se vuelve reflejo, el café enciende una ventana y cada paraguas dibuja una pequeña habitación móvil. Guadalajara aparece aquí como ritmo, no como postal.', 'Después del agua, moverse es volver a leer el trayecto. El transporte, la banqueta y el encuentro cambian de velocidad; el look acompaña esa pausa sin intentar dominarla.'],
    mediaIds: ['poster-august-after-rain', 'video-august-after-rain'], audioTrackId: 'audio-despues-del-agua', productIds: ['manta-01', 'valle-01', 'terra-01'], commerceEnabled: true,
    productOverlaySrc: EDITORIAL_ASSETS.august.products.umbrella,
    productOverlayAlt: 'Paraguas mostaza de la escena',
    productOverlayPosition: 'left'
  },
  {
    id: 'note-august-rain-dress', storyId: 'august-rain', eyebrow: 'Ensayo breve · Movimiento',
    title: 'Salir también es una forma de vestir',
    body: ['Vestirse para la lluvia no es desaparecer bajo una capa. Es decidir cómo cruzar la ciudad, cómo llegar a una conversación y qué parte del clima queremos dejar entrar.', 'El impermeable terracota y las botas humo resuelven el trayecto, pero la escena sigue siendo lo principal: una forma de estar juntos mientras el cielo cambia.'],
    mediaIds: ['poster-august-father-son'], productIds: ['valle-01', 'terra-01'], commerceEnabled: true,
    productOverlaySrc: EDITORIAL_ASSETS.august.products.outerwear,
    productOverlayAlt: 'Impermeable terracota de la escena',
    productOverlayPosition: 'right'
  },
  {
    id: 'note-august-rain-family', storyId: 'august-rain', eyebrow: 'Nota visual · Composición',
    title: 'La familia como composición',
    body: ['Una familia puede leerse como una paleta en movimiento: mostaza que abre el plano, terracota que lo sostiene y teal que introduce profundidad. Las capas no uniforman; cuentan que cada persona llega con su propio clima.', 'El look completo nace de esa relación entre cuerpos, color y distancia. La ropa aparece como parte de una composición cotidiana, nunca como una interrupción de la historia.'],
    mediaIds: ['poster-august-mother-daughter'], productIds: ['august-bolsa', 'august-bolso-cafe'], commerceEnabled: true,
    productOverlaySrc: EDITORIAL_ASSETS.august.products.bag,
    productOverlayAlt: 'Bolsa de diario Cantera',
    productOverlayPosition: 'left'
  },
  {
    id: 'note-august-rain-small-scale', storyId: 'august-rain', eyebrow: 'Escala cotidiana · Niños',
    title: 'Pequeña escala, mismo clima',
    body: ['La lluvia no cambia de tamaño cuando la miramos desde abajo. Cambia el ritmo: un charco se vuelve mapa, una mochila guarda el día y un color amarillo abre la escena.', 'La misma narrativa puede acompañar distintas edades sin uniformarlas. Cada pieza resuelve una parte del trayecto y deja espacio para que la historia siga siendo de quien la camina.'],
    mediaIds: ['poster-august-page-04'], productIds: ['august-kids-backpack', 'august-kids-raincoat', 'august-kids-boots'], commerceEnabled: true,
    productOverlaySrc: EDITORIAL_ASSETS.august.products.kidsBackpack,
    productOverlayAlt: 'Mochila infantil Nube de Camino',
    productOverlayPosition: 'right'
  },
  {
    id: 'note-august-rain-proof', storyId: 'august-rain', eyebrow: 'Prueba de uso · Aguacero',
    title: 'La prueba del aguacero',
    body: ['Una prenda se entiende mejor cuando se mueve: cruza una banqueta, recibe el agua, se pliega y vuelve a salir. La función aparece en el gesto, no en la promesa.', 'Esta última hoja deja la escena abierta: lo que sigue es probar, combinar y volver a caminar.'],
    mediaIds: [], productIds: ['valle-01', 'terra-01', 'august-kids-raincoat'], commerceEnabled: true
  },
  {
    id: 'note-august-oficio-materia', storyId: 'august-oficio', eyebrow: 'Ensayo táctil · Texturas',
    title: 'Materia que camina',
    body: ['Una tela cambia cuando sale de la mesa y entra en la ciudad. La costura se mueve, el borde encuentra una mano y el color empieza a responder a la luz, al polvo y al agua.', 'La camisa, la bolsa y la capa no son piezas aisladas: son pequeñas superficies de contacto. Acompañan una jornada y acumulan una historia nueva cada vez que se usan.'],
    mediaIds: ['poster-august-materia', 'video-august-materia'], audioTrackId: 'audio-materia-que-camina', productIds: ['august-bordado', 'august-bolsa', 'august-capa'], commerceEnabled: true,
    productOverlaySrc: EDITORIAL_ASSETS.august.products.bag,
    productOverlayAlt: 'Bolsa de diario Cantera de la escena',
    productOverlayPosition: 'left'
  },
  {
    id: 'note-august-oficio-detail', storyId: 'august-oficio', eyebrow: 'Observación · Detalle',
    title: 'El detalle que sostiene el look',
    body: ['El carácter de una pieza suele vivir en lo que casi no se anuncia: el forro, el cierre, una repetición de hilo, la tensión de un borde y ese color que aparece solamente al moverse.', 'Mirar de cerca es otra forma de leer. La textura de oficio se vuelve lenguaje cuando deja de ser decoración y empieza a sostener el cuerpo en su recorrido.'],
    mediaIds: ['poster-august-oficio-noche'], productIds: ['august-bordado', 'terra-02'], commerceEnabled: true
  },
  {
    id: 'note-august-oficio-journey', storyId: 'august-oficio', eyebrow: 'Guía de uso · Jornada larga',
    title: 'Objetos para una jornada larga',
    body: ['Hay objetos que no piden protagonismo: una bolsa que guarda lo necesario, una capa que cambia con el sol, un accesorio que resuelve el color. Su valor aparece en la continuidad.', 'Combinar piezas es construir una herramienta sensible para el día. La ciudad no se detiene para que el look ocurra; el look aprende a acompañarla.'],
    mediaIds: ['poster-august-materia'], productIds: ['august-bolsa', 'august-capa'], commerceEnabled: true
  },
  {
    id: 'note-august-oficio-repetition', storyId: 'august-oficio', eyebrow: 'Lectura de uso · Repetición',
    title: 'Lo que vuelve también cambia',
    body: ['Una prenda se vuelve propia cuando regresa a la escena varias veces. La camisa puede cruzar una mañana de trabajo, una sobremesa y el camino de vuelta sin perder su origen visual.', 'El estilo no depende de estrenar una historia cada día. Depende de encontrar combinaciones que acepten el uso, el clima y la memoria de quien las lleva.'],
    mediaIds: [], productIds: ['august-bordado', 'august-punto'], commerceEnabled: true
  },
  {
    id: 'note-august-oficio-color', storyId: 'august-oficio', eyebrow: 'Paleta · Ciudad',
    title: 'El color contra el cielo gris',
    body: ['Mostaza, terracota y teal no compiten con la lluvia: la vuelven visible. Una paleta puede orientar el cuerpo, marcar una distancia y hacer reconocible un trayecto.', 'El color también es una herramienta de continuidad. Cambia la escena sin obligar a cambiar la historia.'],
    mediaIds: ['poster-august-materia'], productIds: ['august-bordado', 'august-capa', 'august-bolsa'], commerceEnabled: true
  },
  {
    id: 'note-august-night-table', storyId: 'august-noche', eyebrow: 'Microensayo · 03 min',
    title: 'La mesa también es una escena',
    body: ['Una mesa compartida organiza la noche sin pedir un centro único. Las manos, las prendas, los vasos y las luces construyen una composición colectiva donde quedarse también es una manera de participar.', 'La chaqueta teal y el punto Bruma entran en esa conversación como capas de temperatura y de carácter. La ropa pertenece a la escena porque ayuda a sostener el encuentro.'],
    mediaIds: ['poster-august-noche-barrio', 'video-august-noche-barrio'], audioTrackId: 'audio-la-noche-nos-junta', productIds: ['august-chaqueta', 'august-punto'], commerceEnabled: true,
    productOverlaySrc: EDITORIAL_ASSETS.august.products.nightJacket,
    productOverlayAlt: 'Chaqueta teal de noche de la escena',
    productOverlayPosition: 'right'
  },
  {
    id: 'note-august-night-lights', storyId: 'august-noche', eyebrow: 'Microensayo · Trayectos',
    title: 'Luces de esquina',
    body: ['La noche se compone de distancias cortas: una luz que rebota en el piso, una sombra que cruza la esquina, una conversación que continúa después de la lluvia.', 'El paso urbano y la pañoleta llevan el movimiento hacia adelante. Son señales pequeñas para una ciudad que vuelve a encenderse sin hacer demasiado ruido.'],
    mediaIds: ['poster-august-noche-barrio'], productIds: ['august-sneakers', 'august-acento'], commerceEnabled: true
  },
  {
    id: 'note-august-night-look', storyId: 'august-noche', eyebrow: 'Composición · Look completo',
    title: 'Un look para quedarse un rato',
    body: ['La mejor combinación no siempre es la que llega completa desde el inicio. A veces empieza con una capa, suma una textura, encuentra un paso cómodo y termina en un acento que cambia la temperatura.', 'La composición de Noche de barrio acompaña el tránsito de la calle a la reunión sin abandonar la atmósfera. Se arma para quedarse un rato, no para cerrar la historia.'],
    mediaIds: ['poster-august-noche-barrio'], productIds: ['august-chaqueta', 'august-punto', 'august-sneakers', 'august-acento'], commerceEnabled: true
  },
  {
    id: 'note-august-night-return', storyId: 'august-noche', eyebrow: 'Cierre de edición · Regreso',
    title: 'La ciudad guarda un lugar',
    body: ['Después del encuentro queda una luz encendida, una prenda sobre la silla y el sonido de la calle volviendo a su cauce. La noche no termina: cambia de superficie.', 'MANTA cierra esta edición con una idea sencilla: vestir puede ser una forma de volver, de reconocer el camino y de dejar abierta la siguiente escena.'],
    mediaIds: [], productIds: ['august-chaqueta', 'august-acento'], commerceEnabled: true
  },
  {
    id: 'note-august-night-bags', storyId: 'august-noche', eyebrow: 'Objeto · Noche',
    title: 'Lo que llevamos a la mesa',
    body: ['Un bolso guarda más que objetos: conserva el ritmo de la tarde, el paso entre una esquina y otra y esa pequeña reserva que hace posible quedarse.', 'Dos siluetas nuevas entran en la escena como acentos de textura. No completan el look; abren otra forma de llevarlo.'],
    mediaIds: ['poster-august-product-interlude'], productIds: ['august-bolso-azul', 'august-bolso-cafe'], commerceEnabled: true,
    productOverlaySrc: EDITORIAL_ASSETS.bags.blueNight,
    productOverlayAlt: 'Bolso azul de noche',
    productOverlayPosition: 'left'
  }
];

export const AUGUST_STORY_CAMPAIGNS: Record<string, StoryCampaign> = {
  'august-rain': { posterMediaId: 'poster-august-after-rain', videoMediaId: 'video-august-after-rain', placement: 'editorial', ctaLabel: 'Entrar a la escena' },
  'august-oficio': { posterMediaId: 'poster-august-materia', videoMediaId: 'video-august-materia', placement: 'editorial', ctaLabel: 'Tocar la textura' },
  'august-noche': { posterMediaId: 'poster-august-noche-barrio', videoMediaId: 'video-august-noche-barrio', placement: 'store', ctaLabel: 'Armar el look' }
};
