import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { MagazineEdition } from '../../../types';
import { mapRange, calculateCoverDimensions } from './transitionMath';
import { EditorialHotspots } from '../EditorialHotspots';
import { StoryNotes } from '../StoryNotes';
import { getStory } from '../../../domain/content';

const StoryPageFlip = React.lazy(() =>
  import('../pageFlip/StoryPageFlip').then((module) => ({ default: module.StoryPageFlip }))
);

interface CoverStorySurfaceProps {
  edition: MagazineEdition;
  currentLookIdx: number;
  onSelectLook: (idx: number) => void;
  onCloseStory: () => void;
  onTriggerBurst?: () => void;
  progress: number;
  phase: string;
  pageProgress: number;
  pageDirection: 'next' | 'previous' | null;
  targetStoryIndex: number;
  flipToNext: () => void;
  flipToPrev: () => void;
  isCoverActive: boolean;
  coverElement: React.ReactNode;
  isCoverDetached?: boolean;
  startRect?: { left: number; top: number; width: number; height: number } | null;
  horizontalTransform?: {
    translateX: number;
    scale: number;
    rotateY: number;
    opacity: number;
    transition?: string;
  };
  onSelectProduct?: (productId: string) => void;
  onPlayAudio?: (trackId: string) => void;
  videoAudioEnabled?: boolean;
}

export const CoverStorySurface: React.FC<CoverStorySurfaceProps> = ({
  edition,
  currentLookIdx,
  onSelectLook,
  onCloseStory,
  onTriggerBurst,
  progress,
  isCoverActive,
  coverElement,
  phase,
  pageProgress,
  pageDirection,
  targetStoryIndex,
  flipToNext,
  flipToPrev,
  isCoverDetached = false,
  startRect = null,
  horizontalTransform,
  onSelectProduct,
  onPlayAudio,
  videoAudioEnabled = false
}) => {
  const surfaceRef = useRef<HTMLDivElement | null>(null);

  // Viewport calculation using visualViewport when available
  const getViewportDimensions = () => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height:
      typeof window !== 'undefined' && window.visualViewport
        ? window.visualViewport.height
        : typeof window !== 'undefined'
        ? window.innerHeight
        : 800
  });

  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(getViewportDimensions);
  const [readyFlipKey, setReadyFlipKey] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowSize(getViewportDimensions());
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const isPageFlipPhase = isCoverDetached && (phase === 'page-dragging' || phase === 'page-settling');

  // A new target invalidates the previous GPU frame. Keep the settled DOM story
  // visible until the new pair of textures has rendered successfully.
  const flipVisualKey = `${edition.id}:${currentLookIdx}:${targetStoryIndex}`;
  useEffect(() => {
    setReadyFlipKey(null);
  }, [flipVisualKey]);

  const handleGpuVisualReadyChange = useCallback((ready: boolean) => {
    setReadyFlipKey(ready ? flipVisualKey : null);
  }, [flipVisualKey]);

  const canvasVisible = isPageFlipPhase && readyFlipKey === flipVisualKey;

  // Fullscreen state: when story is open or page-dragging/settling between stories
  const isFullscreen =
    phase === 'story' || phase === 'page-dragging' || phase === 'page-settling' || progress >= 0.999;

  // Only activate 3D PageFlip when in story mode or page-dragging/settling
  const isStoryActive =
    phase === 'story' || phase === 'page-dragging' || phase === 'page-settling' || progress >= 0.99;

  const currentLook = edition.looks[currentLookIdx] || edition.looks[0];
  const nextLook = edition.looks[targetStoryIndex] || edition.looks[0];
  const activeStory = currentLook.storyId ? getStory(currentLook.storyId) : undefined;

  // Geometric calculations
  const viewportW = windowSize.width;
  const viewportH = windowSize.height;

  // Fallback dimensions based on 5:7 aspect ratio
  const { width: coverW, height: coverH } = calculateCoverDimensions(viewportW, viewportH);
  const fallbackLeft = (viewportW - coverW) / 2;
  // On tall mobile viewports a centered cover leaves too much dead air before
  // the first reading gesture. Lift it into the first editorial reading zone;
  // the opened story still expands to the full viewport independently.
  const mobileCoverOffset = viewportW < 768
    ? -Math.min(Math.max(viewportH * 0.22, 96), 260)
    : 0;
  const fallbackTop = (viewportH - coverH) / 2 + mobileCoverOffset;

  // Prioritize real measured startRect; freeze during the morph
  const baseLeft = startRect ? startRect.left : fallbackLeft;
  const baseTop = startRect ? startRect.top : fallbackTop;
  const baseW = startRect ? startRect.width : coverW;
  const baseH = startRect ? startRect.height : coverH;

  // Smooth continuous geometric expansion towards fullscreen (0, 0, viewportW, viewportH)
  // During any story/page-flip state, lock strictly to 100vw x 100svh to prevent scale jump or zoom
  const currentW = isFullscreen ? viewportW : baseW + (viewportW - baseW) * progress;
  const currentH = isFullscreen ? viewportH : baseH + (viewportH - baseH) * progress;
  const currentLeft = isFullscreen ? 0 : baseLeft + (0 - baseLeft) * progress;
  const currentTop = isFullscreen ? 0 : baseTop + (0 - baseTop) * progress;
  const borderRadius = isFullscreen ? '0px' : `${Math.max(0, (1 - progress) * 4)}px`;
  const shadowOpacity = isFullscreen ? 0 : Math.max(0, 1 - progress);

  const isMorphing = progress > 0;
  const transformStyle = isMorphing
    ? 'none'
    : horizontalTransform
    ? `perspective(1400px) translateX(${horizontalTransform.translateX}px) scale(${horizontalTransform.scale}) rotateY(${horizontalTransform.rotateY}deg)`
    : 'none';
  const opacityStyle = isMorphing
    ? 1
    : horizontalTransform
    ? horizontalTransform.opacity
    : (isCoverActive ? 1 : 0);
  const transitionStyle = isMorphing
    ? 'none'
    : horizontalTransform?.transition || 'none';

  return (
    <div
      ref={surfaceRef}
      id={`cover-story-surface-${edition.id}`}
      style={{
        position: 'fixed',
        left: `${currentLeft}px`,
        top: `${currentTop}px`,
        width: `${currentW}px`,
        height: `${currentH}px`,
        transform: transformStyle,
        opacity: opacityStyle,
        transition: transitionStyle,
        zIndex: isFullscreen ? 40 : 35,
        borderRadius,
        boxShadow:
          shadowOpacity > 0.02
            ? `inset 0 2px 0 rgba(255,255,255,${0.06 * shadowOpacity}), 0 ${60 * shadowOpacity}px ${120 * shadowOpacity}px rgba(0,0,0,${0.75 * shadowOpacity}), 0 ${18 * shadowOpacity}px ${44 * shadowOpacity}px rgba(0,0,0,${0.6 * shadowOpacity})`
            : 'none',
        overflow: 'hidden',
        pointerEvents: isCoverActive ? 'auto' : 'none',
        willChange: 'width, height, top, left, border-radius, transform'
      }}
      className="[transform-style:preserve-3d] select-none bg-neutral-950 touch-none"
    >
      {/* Three.js GPU Page Flip Surface - Only active when story is settled */}
      {isStoryActive && (
        <Suspense fallback={
          <div className="absolute inset-0 z-[1] bg-[#080d11]" aria-hidden="true">
            <img src={currentLook.image} alt="" className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
          </div>
        }>
          <StoryPageFlip
            edition={edition}
            currentLook={currentLook}
            nextLook={nextLook}
            currentStoryIndex={currentLookIdx}
            targetStoryIndex={targetStoryIndex}
            progress={pageProgress}
            direction={pageDirection}
            isFlipping={isPageFlipPhase}
            visible={canvasVisible}
            onGpuVisualReadyChange={handleGpuVisualReadyChange}
          />
        </Suspense>
      )}

      {/* Shared Base Photography & Cover Surface (No destructive deep CSS hacks) */}
      <div 
        className="absolute inset-0 z-0 bg-[#080d11] overflow-hidden pointer-events-none select-none flex items-center justify-center"
      >
        <div style={{ pointerEvents: progress < 0.2 ? 'auto' : 'none' }} className="w-full h-full">
          {coverElement}
        </div>

        {isStoryActive && (
          <EditorialHotspots
            hotspots={currentLook.hotspots}
            disabled={edition.status === 'upcoming'}
            onSelectProduct={(productId) => onSelectProduct?.(productId)}
          />
        )}

        {/* Dynamic Dark Vignette for contrast */}
        <div
          style={{
            opacity: mapRange(progress, 0.15, 1.0, 0.0, 0.3)
          }}
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20"
        />

      </div>

      {isStoryActive && edition.status === 'upcoming' && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-center px-6 pointer-events-none">
          <div className="max-w-sm rounded-2xl border border-white/20 bg-black/55 px-6 py-5 text-center text-white shadow-2xl backdrop-blur-xl">
            <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-[0.28em] text-[#f2c14e]">Próximamente</span>
            <p className="mt-2 font-['Fraunces',Georgia,serif] text-xl font-semibold">{edition.themeTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">Esta edición ya se está revelando. La historia y sus piezas estarán disponibles pronto.</p>
          </div>
        </div>
      )}

      {isStoryActive && phase === 'story' && activeStory?.notes && activeStory.notes.length > 0 && (
        <StoryNotes
          story={activeStory}
          onSelectProduct={onSelectProduct}
          onPlayAudio={onPlayAudio}
          videoAudioEnabled={videoAudioEnabled}
          onPreviousStory={currentLookIdx > 0 ? flipToPrev : onCloseStory}
          onNextStory={flipToNext}
          canGoNext={currentLookIdx < edition.looks.length - 1}
        />
      )}

      {/* Extremely subtle vertical hint for PageFlip reading gesture */}
      {progress > 0.60 && (
        <div
          style={{
            opacity: mapRange(progress, 0.65, 1.0, 0, 0.3)
          }}
          className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex-col items-center gap-2 text-[9px] tracking-[0.3em] uppercase font-['Space_Grotesk'] [writing-mode:vertical-rl] select-none transition-opacity duration-200"
        >
          <span>desliza</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce rotate-180">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}

      {/* Bottom Story Look Indicator Layout (Complementing each edition's typography, hides during GPU flip) */}
      {progress > 0.60 && (
        <div
          style={{
            opacity: mapRange(progress, 0.65, 1.0, 0, 1),
            transform: `translateY(${mapRange(progress, 0.65, 1.0, 16, 0)}px)`,
            pointerEvents: progress < 0.9 ? 'none' : 'auto'
          }}
          className="absolute bottom-8 left-0 right-0 px-6 md:px-12 z-20 pointer-events-none flex justify-between items-end w-full gap-6"
        >
          {edition.id === 'august' ? (
            /* August: Headline is bottom-right -> Indicator is bottom-left */
            <div className="flex flex-col items-start gap-2.5 pointer-events-auto pb-2">
              <div className="font-['Space_Grotesk'] text-xs tracking-widest opacity-60">
                {String(currentLookIdx + 1).padStart(2, '0')} / {String(edition.looks.length).padStart(2, '0')}
              </div>
              <div className="flex gap-2">
                {edition.looks.map((_, idx) => (
                  <div
                    key={idx}
                    aria-label={`Look ${idx + 1}`}
                    className={`h-[2px] transition-all duration-300 ${
                      idx === currentLookIdx
                        ? 'w-8 bg-white opacity-100'
                        : 'w-4 bg-white opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div />
          )}

          {edition.id !== 'august' && (
            /* September & October: Headline is left -> Indicator is bottom-right */
            <div className="flex flex-col items-end gap-2.5 pointer-events-auto pb-2">
              <div className="font-['Space_Grotesk'] text-xs tracking-widest opacity-60">
                {String(currentLookIdx + 1).padStart(2, '0')} / {String(edition.looks.length).padStart(2, '0')}
              </div>
              <div className="flex gap-2">
                {edition.looks.map((_, idx) => (
                  <div
                    key={idx}
                    aria-label={`Look ${idx + 1}`}
                    className={`h-[2px] transition-all duration-300 ${
                      idx === currentLookIdx
                        ? 'w-8 bg-white opacity-100'
                        : 'w-4 bg-white opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
