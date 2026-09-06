export interface StoryNote {
  id: string;
  storyId: string;
  eyebrow: string;
  title: string;
  body: string[];
  mediaIds: string[];
  audioTrackId?: string;
  productIds: string[];
  commerceEnabled: boolean;
  teaserOnly?: boolean;
  /** Optional editorial cutout layered over the note image. */
  productOverlaySrc?: string;
  productOverlayAlt?: string;
  productOverlayPosition?: 'left' | 'center' | 'right';
}

export interface StoryCampaign {
  posterMediaId: string;
  videoMediaId?: string;
  placement: 'editorial' | 'store' | 'catalog';
  ctaLabel: string;
}
