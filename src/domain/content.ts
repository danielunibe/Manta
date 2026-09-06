import { AssetRef, Hotspot, MagazineEdition, Product } from '../types';
import { EDITORIAL_ASSETS } from '../data/assetManifest';
import { AUGUST_STORY_CAMPAIGNS, AUGUST_STORY_NOTES } from './editorialMedia';
import { StoryCampaign, StoryNote } from './editorialMediaTypes';

export interface Story {
  id: string;
  editionId: string;
  title: string;
  subtitle: string;
  image: AssetRef;
  accent: string;
  hotspots: Hotspot[];
  notes?: StoryNote[];
  campaign?: StoryCampaign;
}

export interface Edition extends Omit<MagazineEdition, 'looks'> {
  stories: Story[];
  status: 'live' | 'upcoming';
  storeEnabled: boolean;
  teaserMessage?: string;
}

export const ASSET = (src: string, alt: string): AssetRef => ({ src, alt });

const AUGUST_STORY_IDS = ['august-rain', 'august-oficio', 'august-noche'];

export const AUGUST_STORIES: Story[] = [
  {
    id: AUGUST_STORY_IDS[0],
    editionId: 'august',
    title: 'La ciudad después del agua',
    subtitle: 'Una familia cruza Guadalajara cuando la lluvia vuelve espejo la calle.',
    image: ASSET(EDITORIAL_ASSETS.august.cover, 'Familia latinoamericana caminando por una calle mojada de Guadalajara bajo la lluvia'),
    accent: '#e8b23a',
    notes: AUGUST_STORY_NOTES.filter((note) => note.storyId === AUGUST_STORY_IDS[0]),
    campaign: AUGUST_STORY_CAMPAIGNS[AUGUST_STORY_IDS[0]],
    hotspots: [
      { id: 'august-raincoat', storyId: AUGUST_STORY_IDS[0], productId: 'manta-01', label: 'paraguas de madera', x: 64, y: 48, relation: 'carried' },
      { id: 'august-terracotta', storyId: AUGUST_STORY_IDS[0], productId: 'valle-01', label: 'impermeable terracota', x: 38, y: 58, relation: 'wearing' },
      { id: 'august-boots', storyId: AUGUST_STORY_IDS[0], productId: 'terra-01', label: 'botas para lluvia', x: 72, y: 82, relation: 'wearing' },
      { id: 'august-complete', storyId: AUGUST_STORY_IDS[0], productId: 'august-bolso-cafe', label: 'bolso de la escena', x: 52, y: 40, relation: 'carried' }
    ]
  },
  {
    id: AUGUST_STORY_IDS[1],
    editionId: 'august',
    title: 'Oficio que se lleva',
    subtitle: 'Texturas, color y movimiento convierten la ciudad en un taller abierto.',
    image: ASSET(EDITORIAL_ASSETS.august.stories[1], 'Retrato editorial de una creadora mexicana con textiles y materiales de oficio'),
    accent: '#c56b3a',
    notes: AUGUST_STORY_NOTES.filter((note) => note.storyId === AUGUST_STORY_IDS[1]),
    campaign: AUGUST_STORY_CAMPAIGNS[AUGUST_STORY_IDS[1]],
    hotspots: [
      { id: 'august-craft', storyId: AUGUST_STORY_IDS[1], productId: 'august-bordado', label: 'textura de oficio', x: 48, y: 38, relation: 'material' },
      { id: 'august-bag', storyId: AUGUST_STORY_IDS[1], productId: 'august-bolsa', label: 'bolsa de diario', x: 65, y: 64, relation: 'carried' },
      { id: 'august-layer', storyId: AUGUST_STORY_IDS[1], productId: 'august-capa', label: 'capa ligera', x: 34, y: 54, relation: 'wearing' },
      { id: 'august-detail', storyId: AUGUST_STORY_IDS[1], productId: 'terra-02', label: 'detalle de piel', x: 73, y: 74, relation: 'material' }
    ]
  },
  {
    id: AUGUST_STORY_IDS[2],
    editionId: 'august',
    title: 'Noche de barrio',
    subtitle: 'La tarde cae sobre una mesa compartida: vestir también es encontrarse.',
    image: ASSET(EDITORIAL_ASSETS.august.stories[2], 'Grupo de amigos latinoamericanos reunidos en una terraza urbana al anochecer'),
    accent: '#2f8f83',
    notes: AUGUST_STORY_NOTES.filter((note) => note.storyId === AUGUST_STORY_IDS[2]),
    campaign: AUGUST_STORY_CAMPAIGNS[AUGUST_STORY_IDS[2]],
    hotspots: [
      { id: 'august-jacket', storyId: AUGUST_STORY_IDS[2], productId: 'august-chaqueta', label: 'chaqueta de noche', x: 42, y: 38, relation: 'wearing' },
      { id: 'august-knit', storyId: AUGUST_STORY_IDS[2], productId: 'august-punto', label: 'punto de temporada', x: 67, y: 46, relation: 'wearing' },
      { id: 'august-sneakers', storyId: AUGUST_STORY_IDS[2], productId: 'august-sneakers', label: 'paso urbano', x: 54, y: 84, relation: 'wearing' },
      { id: 'august-accessory', storyId: AUGUST_STORY_IDS[2], productId: 'august-acento', label: 'acento del look', x: 28, y: 57, relation: 'carried' }
    ]
  }
];

const FUTURE_STORY = (editionId: string, id: string, title: string, subtitle: string, image: string, alt: string, accent: string): Story => ({
  id,
  editionId,
  title,
  subtitle,
  image: ASSET(image, alt),
  accent,
  hotspots: []
});

export const EDITORIAL_CONTENT: Edition[] = [
  {
    id: 'august', number: '08', month: 'Agosto', year: '2026',
    themeTitle: 'Monzón tapatío', backgroundEngine: 'rain', gradientBg: 'transparent',
    status: 'live', storeEnabled: true, stories: AUGUST_STORIES
  },
  {
    id: 'september', number: '09', month: 'Septiembre', year: '2026',
    themeTitle: 'Patria cotidiana', backgroundEngine: 'fireworks',
    gradientBg: 'radial-gradient(60vmax 42vmax at 50% 44%, rgba(20,48,38,.55), transparent 68%), #040d0a',
    status: 'upcoming', storeEnabled: false, teaserMessage: 'La próxima edición llega pronto.',
    stories: [
      FUTURE_STORY('september', 'september-taller', 'La materia guarda memoria', 'Un adelanto de oficio, ciudad y herencia cotidiana.', EDITORIAL_ASSETS.september.teasers[0], 'Adelanto editorial de Septiembre con textiles y oficio mexicano', '#d9a441'),
      FUTURE_STORY('september', 'september-calle', 'La calle también hereda', 'Color y movimiento para una patria vivida a diario.', EDITORIAL_ASSETS.september.teasers[1], 'Adelanto editorial de Septiembre en una calle urbana mexicana', '#ff4655'),
      FUTURE_STORY('september', 'september-noche', 'Vestir la celebración', 'Una noche de encuentro, todavía por descubrir.', EDITORIAL_ASSETS.september.teasers[2], 'Adelanto editorial de Septiembre durante una celebración nocturna', '#2fbf71')
    ]
  },
  {
    id: 'october', number: '10', month: 'Octubre', year: '2026',
    themeTitle: 'Noche tapatía', backgroundEngine: 'street', gradientBg: 'transparent',
    status: 'upcoming', storeEnabled: false, teaserMessage: 'Esta historia se está revelando.',
    stories: [
      FUTURE_STORY('october', 'october-luces', 'Luces de barrio', 'Un adelanto nocturno entre neón, lluvia y amistad.', EDITORIAL_ASSETS.october.teasers[0], 'Adelanto editorial de Octubre con luces urbanas y lluvia nocturna', '#e2588a'),
      FUTURE_STORY('october', 'october-esquina', 'La esquina se enciende', 'Siluetas y color para una ciudad que no se detiene.', EDITORIAL_ASSETS.october.teasers[1], 'Adelanto editorial de Octubre en una esquina urbana iluminada', '#f2b33d'),
      FUTURE_STORY('october', 'october-fiesta', 'Después de la lluvia', 'La última imagen antes de abrir la próxima edición.', EDITORIAL_ASSETS.october.teasers[2], 'Adelanto editorial de Octubre después de la lluvia', '#3fa777')
    ]
  }
];

export const ALL_STORIES = EDITORIAL_CONTENT.flatMap((edition) => edition.stories);

export const getEdition = (editionId: string) => EDITORIAL_CONTENT.find((edition) => edition.id === editionId) ?? EDITORIAL_CONTENT[0];
export const getStory = (storyId: string) => ALL_STORIES.find((story) => story.id === storyId);
export const getLiveEditions = () => EDITORIAL_CONTENT.filter((edition) => edition.status === 'live' && edition.storeEnabled);
export const getUpcomingEditions = () => EDITORIAL_CONTENT.filter((edition) => edition.status === 'upcoming');

export const normalizeProduct = (product: Product): Product => ({
  ...product,
  releaseEditionId: product.releaseEditionId ?? (product.editorialProvenance?.toLowerCase().includes('agosto') ? 'august' : 'september'),
  storeVisible: product.storeVisible ?? product.editorialProvenance?.toLowerCase().includes('agosto') ?? false,
  asset: product.asset ?? ASSET(product.image, product.name)
});
