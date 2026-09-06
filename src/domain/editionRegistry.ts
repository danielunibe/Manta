import { EDITIONS as LEGACY_EDITIONS } from '../data/magazines';
import { EDITORIAL_CONTENT } from './content';
import { MagazineEdition } from '../types';

/**
 * Compatibility boundary while the existing cover/transition renderer moves
 * from Look to Story. New code should read publication state from here.
 */
export const EDITIONS: MagazineEdition[] = LEGACY_EDITIONS.map((edition) => {
  const contentEdition = EDITORIAL_CONTENT.find((item) => item.id === edition.id);
  const stories = contentEdition?.stories ?? [];

  return {
    ...edition,
    themeTitle: contentEdition?.themeTitle ?? edition.themeTitle,
    status: contentEdition?.status ?? 'upcoming',
    storeEnabled: contentEdition?.storeEnabled ?? false,
    teaserMessage: contentEdition?.teaserMessage,
    looks: edition.looks.map((look, index) => {
      const story = stories[index];
      return story
        ? { ...look, storyId: story.id, imageAsset: story.image, hotspots: story.hotspots, image: story.image.src, alt: story.image.alt }
        : look;
    })
  };
});

export const getEditionById = (editionId: string) => EDITIONS.find((edition) => edition.id === editionId) ?? EDITIONS[0];
export const getLiveEdition = () => EDITIONS.find((edition) => edition.status === 'live' && edition.storeEnabled) ?? EDITIONS[0];
export const getUpcomingEditions = () => EDITIONS.filter((edition) => edition.status === 'upcoming');

