import React, { useEffect, useRef } from 'react';
import { Look, MagazineEdition } from '../../../types';
import { PageFlipRenderer } from './PageFlipRenderer';
import { PageFlipDirection } from './pageFlipTypes';

interface StoryPageFlipProps {
  edition: MagazineEdition;
  currentLook: Look;
  nextLook: Look;
  currentStoryIndex: number;
  targetStoryIndex: number;
  progress: number;
  direction: PageFlipDirection;
  isFlipping: boolean;
  visible?: boolean;
  onGpuVisualReadyChange?: (ready: boolean) => void;
  onTexturesReadyChange?: (ready: boolean) => void;
}

export const StoryPageFlip: React.FC<StoryPageFlipProps> = ({
  edition,
  currentLook,
  nextLook,
  currentStoryIndex,
  targetStoryIndex,
  progress,
  direction,
  isFlipping,
  visible,
  onGpuVisualReadyChange,
  onTexturesReadyChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<PageFlipRenderer | null>(null);
  const [, setTexturesReady] = React.useState(false);
  const [gpuVisualReady, setGpuVisualReady] = React.useState(false);

  // Initialize WebGL Renderer
  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new PageFlipRenderer(containerRef.current);
    rendererRef.current = renderer;
    renderer.preloadAllStories(edition);

    const handleResize = () => {
      if (rendererRef.current && containerRef.current) {
        rendererRef.current.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [edition]);

  // Update textures & preheat WebGL whenever stories or edition change
  useEffect(() => {
    if (!rendererRef.current || !currentLook || !nextLook) return;

    let isMounted = true;

    // Invalidate the previous frame before requesting a new pair of textures.
    // The parent keeps the settled DOM page visible during this gap.
    setGpuVisualReady(false);
    setTexturesReady(false);
    onGpuVisualReadyChange?.(false);
    onTexturesReadyChange?.(false);

    rendererRef.current.setStories(
      currentLook,
      nextLook,
      edition,
      currentStoryIndex,
      targetStoryIndex,
      edition.looks.length
    ).then(() => {
      if (isMounted && rendererRef.current) {
        const isTexReady = rendererRef.current.isTexturesReady();
        const isGpuReady = rendererRef.current.isGpuVisualReady();
        setTexturesReady(isTexReady);
        setGpuVisualReady(isGpuReady);
        onTexturesReadyChange?.(isTexReady);
        onGpuVisualReadyChange?.(isGpuReady);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [edition, currentLook, nextLook, currentStoryIndex, targetStoryIndex, onTexturesReadyChange, onGpuVisualReadyChange]);

  // Update folding frame driven by progress & direction
  useEffect(() => {
    if (!rendererRef.current) return;
    rendererRef.current.updateFold(progress, direction || 'next');
  }, [progress, direction]);

  const isVisible = visible !== undefined ? visible : (isFlipping && gpuVisualReady);

  return (
    <div
      ref={containerRef}
      id="story-page-flip-canvas"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden'
      }}
      className="w-full h-full select-none"
    />
  );
};
