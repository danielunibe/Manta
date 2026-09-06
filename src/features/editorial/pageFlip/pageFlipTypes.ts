import { Look, MagazineEdition } from '../../../types';

export type EditorialPhase =
  | 'cover'
  | 'opening'
  | 'story'
  | 'page-flipping'
  | 'closing';

export type PageFlipDirection = 'next' | 'previous' | null;

export interface PageFlipState {
  currentStoryIndex: number;
  targetStoryIndex: number;
  pageFlipProgress: number; // 0 to 1
  pageFlipDirection: PageFlipDirection;
  isFlipping: boolean;
}

export interface StoryPageData {
  look: Look;
  edition: MagazineEdition;
  index: number;
  total: number;
}
