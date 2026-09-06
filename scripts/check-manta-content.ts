import { EDITORIAL_CONTENT } from '../src/domain/content';
import { ALL_PRODUCTS, getLiveProducts } from '../src/domain/catalog';
import { EDITORIAL_MEDIA } from '../src/domain/editorialMedia';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(`MANTA content contract failed: ${message}`);
};

const editions = EDITORIAL_CONTENT;
const liveEditions = editions.filter((edition) => edition.status === 'live' && edition.storeEnabled);
const liveProducts = getLiveProducts();
const allStories = editions.flatMap((edition) => edition.stories);
const allHotspots = allStories.flatMap((story) => story.hotspots);
const allNotes = allStories.flatMap((story) => story.notes ?? []);
const ids = [
  ...editions.map((edition) => edition.id),
  ...allStories.map((story) => story.id),
  ...ALL_PRODUCTS.map((product) => product.id),
  ...allNotes.map((note) => note.id),
  ...EDITORIAL_MEDIA.map((media) => media.id)
];
const localAsset = (src?: string) => Boolean(src && src.startsWith('/assets/') && existsSync(resolve(process.cwd(), 'public', src.slice(1))));

assert(liveEditions.length === 1, 'there must be exactly one live Store edition');
assert(liveEditions[0].id === 'august', 'August must be the live Store edition');
assert(liveProducts.length >= 18, 'the live editorial catalog must contain the expanded August product set');
assert(liveProducts.every((product) => product.releaseEditionId === 'august' && product.storeVisible), 'future products must never enter Store');
assert(new Set(liveProducts.map((product) => product.image)).size === liveProducts.length, 'live products must not reuse image assets');
assert(liveProducts.some((product) => product.family === 'ninos') && liveProducts.some((product) => product.family === 'bebe'), 'the live catalog must include children and baby families');
assert(['Ropa', 'Calzado', 'Accesorios', 'Mochilas', 'Peluches'].every((category) => liveProducts.some((product) => product.category === category)), 'the live catalog must cover the requested product categories');
assert(new Set(ids).size === ids.length, 'edition, story and product IDs must be unique');
assert(allHotspots.every((hotspot) => allStories.some((story) => story.id === hotspot.storyId) && ALL_PRODUCTS.some((product) => product.id === hotspot.productId)), 'hotspots must reference existing stories and products');
assert(editions.filter((edition) => edition.status === 'upcoming').every((edition) => !edition.storeEnabled), 'upcoming editions must be commercially locked');
assert(allStories.every((story) => story.image.src.startsWith('/assets/') && existsSync(resolve(process.cwd(), 'public', story.image.src.slice(1)))), 'editorial assets must be local and present');
assert(liveProducts.every((product) => product.image.startsWith('/assets/') && existsSync(resolve(process.cwd(), 'public', product.image.slice(1)))), 'live product assets must be local and present');
const campaignPosterIds = new Set(
  allStories.map((story) => story.campaign?.posterMediaId).filter((mediaId): mediaId is string => Boolean(mediaId))
);
const campaignPosters = EDITORIAL_MEDIA.filter((media) => media.kind === 'poster' && campaignPosterIds.has(media.id));
assert(campaignPosters.length === 3, 'there must be exactly 3 campaign posters');
assert(campaignPosters.filter((media) => media.orientation === 'portrait').length === 2, 'there must be exactly 2 portrait campaign posters');
assert(campaignPosters.filter((media) => media.orientation === 'landscape').length === 1, 'there must be exactly 1 landscape campaign poster');
assert(allStories.filter((story) => story.editionId === 'august').every((story) => story.notes?.length === 5), 'each August story must contain exactly 5 magazine notes');
assert(allNotes.every((note) => allStories.some((story) => story.id === note.storyId)), 'notes must reference existing stories');
assert(allNotes.every((note) => note.mediaIds.every((mediaId) => EDITORIAL_MEDIA.some((media) => media.id === mediaId))), 'notes must reference existing media');
assert(allNotes.every((note) => note.productIds.every((productId) => liveProducts.some((product) => product.id === productId))), 'August notes must reference only live products');
assert(allNotes.filter((note) => note.storyId !== 'august-rain' && note.storyId !== 'august-oficio' && note.storyId !== 'august-noche').every((note) => !note.commerceEnabled && note.teaserOnly), 'future notes must remain teaser-only');
assert(allNotes.filter((note) => note.teaserOnly).every((note) => note.productIds.length === 0), 'future notes must not carry purchasable products');
assert(EDITORIAL_MEDIA.filter((media) => media.kind === 'poster').every((media) => localAsset(media.src)), 'editorial posters must be local and present');
assert(EDITORIAL_MEDIA.filter((media) => media.kind === 'video' && media.status === 'ready').every((media) => localAsset(media.src) && localAsset(media.posterSrc)), 'ready videos must have local video and poster files');
assert(EDITORIAL_MEDIA.filter((media) => media.kind === 'audio' && media.status === 'ready').every((media) => localAsset(media.src)), 'ready audio must have a local exported source');
assert(allStories.filter((story) => story.editionId === 'august').every((story) => story.campaign && localAsset(EDITORIAL_MEDIA.find((media) => media.id === story.campaign?.posterMediaId)?.src)), 'August campaigns must have local posters');

console.log(`MANTA content PASS · ${editions.length} editions · ${allStories.length} stories · ${allNotes.length} notes · ${liveProducts.length} live products · ${allHotspots.length} hotspots · ${campaignPosters.length} campaign posters`);
