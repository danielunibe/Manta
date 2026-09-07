import React, { useState, useCallback, useRef, useEffect } from 'react';
import { clamp, easeOutCubic } from './transitionMath';

export type EditorialPhase =
  | 'cover'
  | 'opening'
  | 'story'
  | 'page-dragging'
  | 'page-settling'
  | 'closing';

export type GestureOwner = 'edition-carousel' | 'cover-morph' | 'page-flip' | null;

export type PageFlipDirection = 'next' | 'previous' | null;

interface GestureOrigin {
  phase: EditorialPhase;
  storyIndex: number;
  openProgress: number;
  pageProgress: number;
}

interface UseCoverStoryTransitionProps {
  onHorizontalDrag: (deltaX: number) => void;
  onHorizontalDragEnd: (deltaX: number, velocityX: number) => void;
  canNavigateHorizontal: boolean;
  currentStoryIndex: number;
  editionLooksCount: number;
  onStoryIndexChange: (idx: number) => void;
  onBeforeDetach?: () => { left: number; top: number; width: number; height: number } | null;
}

export function useCoverStoryTransition({
  onHorizontalDrag,
  onHorizontalDragEnd,
  canNavigateHorizontal,
  currentStoryIndex,
  editionLooksCount,
  onStoryIndexChange,
  onBeforeDetach
}: UseCoverStoryTransitionProps) {
  // Editorial state machine
  const [phase, setPhase] = useState<EditorialPhase>('cover');
  const [openProgress, setOpenProgress] = useState(0);
  const [isCoverDetached, setIsCoverDetached] = useState<boolean>(false);
  const isCoverDetachedRef = useRef<boolean>(false);
  const coverStartRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const [coverStartRect, setCoverStartRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [pageProgress, setPageProgress] = useState(0);
  const [targetStoryIndex, setTargetStoryIndex] = useState(currentStoryIndex);
  const [pageDirection, setPageDirection] = useState<PageFlipDirection>(null);
  const [isPointerActive, setIsPointerActive] = useState(false);

  // Refs for animation and gesture arbitration
  const phaseRef = useRef<EditorialPhase>('cover');
  const openProgressRef = useRef(0);
  const pageProgressRef = useRef(0);
  const currentStoryIndexRef = useRef(currentStoryIndex);
  const targetStoryIndexRef = useRef(currentStoryIndex);
  const pageDirectionRef = useRef<PageFlipDirection>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Gesture origins and state
  const activePointerIdRef = useRef<number | null>(null);
  const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });
  const pointerLastRef = useRef({ x: 0, y: 0, time: 0 });
  const morphStartYRef = useRef<number>(0);
  const velocityRef = useRef({ vx: 0, vy: 0 });
  const gestureOwnerRef = useRef<GestureOwner>(null);
  const gestureAxisRef = useRef<'horizontal' | 'vertical' | null>(null);
  const gestureOriginRef = useRef<GestureOrigin>({
    phase: 'cover',
    storyIndex: 0,
    openProgress: 0,
    pageProgress: 0
  });

  // Explicit single-point detachment: freezes startRect once
  const detachCover = useCallback(() => {
    if (!isCoverDetachedRef.current) {
      const rect = onBeforeDetach ? onBeforeDetach() : null;
      coverStartRectRef.current = rect;
      setCoverStartRect(rect);
      isCoverDetachedRef.current = true;
      setIsCoverDetached(true);
    }
  }, [onBeforeDetach]);

  // Keep refs in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { openProgressRef.current = openProgress; }, [openProgress]);
  useEffect(() => { pageProgressRef.current = pageProgress; }, [pageProgress]);
  useEffect(() => {
    currentStoryIndexRef.current = currentStoryIndex;
    if (phaseRef.current === 'cover' || phaseRef.current === 'story') {
      targetStoryIndexRef.current = currentStoryIndex;
      setTargetStoryIndex(currentStoryIndex);
    }
  }, [currentStoryIndex]);
  useEffect(() => { targetStoryIndexRef.current = targetStoryIndex; }, [targetStoryIndex]);
  useEffect(() => { pageDirectionRef.current = pageDirection; }, [pageDirection]);

  // Reduced motion
  const prefersReducedMotion = useRef<boolean>(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Morph Animation (Cover <-> Story)
  const animateOpenProgressTo = useCallback((target: number, callback?: () => void) => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    const startVal = openProgressRef.current;
    const delta = target - startVal;
    
    if (Math.abs(delta) < 0.001 || prefersReducedMotion.current) {
      openProgressRef.current = target;
      setOpenProgress(target);
      const newPhase = target >= 0.99 ? 'story' : 'cover';
      phaseRef.current = newPhase;
      setPhase(newPhase);
      if (target <= 0.001) {
        requestAnimationFrame(() => {
          // A close can be followed by a new open before this cleanup frame
          // paints. Never detach the newly opened cover or erase its rect.
          if (phaseRef.current !== 'cover' || openProgressRef.current > 0.001) return;
          isCoverDetachedRef.current = false;
          setIsCoverDetached(false);
          requestAnimationFrame(() => {
            if (phaseRef.current !== 'cover' || openProgressRef.current > 0.001 || isCoverDetachedRef.current) return;
            coverStartRectRef.current = null;
            setCoverStartRect(null);
          });
        });
      }
      callback?.();
      return;
    }
    
    const nextPhase = target > startVal ? 'opening' : 'closing';
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
    const startTime = performance.now();
    const duration = 520;
    
    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = clamp(elapsed / duration, 0, 1);
      const easedT = easeOutCubic(t);
      const currentVal = startVal + delta * easedT;
      
      openProgressRef.current = currentVal;
      setOpenProgress(currentVal);
      
      if (t < 1) {
        animFrameIdRef.current = requestAnimationFrame(step);
      } else {
        animFrameIdRef.current = null;
        openProgressRef.current = target;
        setOpenProgress(target);
        const finalPhase = target >= 0.99 ? 'story' : 'cover';
        phaseRef.current = finalPhase;
        setPhase(finalPhase);
        
        if (target <= 0.001) {
          // TARGET IS 0: CLOSING COMPLETE
          // Frame B: openProgress = 0, phase = 'cover', surface is STILL fixed at startRect.
          // Wait 1 RAF frame so the browser paints the exact 100% rest cover frame.
          requestAnimationFrame(() => {
            // Reopening during the two-frame handoff must keep the detached
            // surface alive; otherwise the carousel can flash or lose its page.
            if (phaseRef.current !== 'cover' || openProgressRef.current > 0.001) return;
            // Frame C: Reattach cover into carousel (pixel-identical to Frame B)
            isCoverDetachedRef.current = false;
            setIsCoverDetached(false);
            
            // Clean up startRect after carousel is safely rendered underneath
            requestAnimationFrame(() => {
              if (phaseRef.current !== 'cover' || openProgressRef.current > 0.001 || isCoverDetachedRef.current) return;
              coverStartRectRef.current = null;
              setCoverStartRect(null);
            });
          });
        }
        callback?.();
      }
    };
    animFrameIdRef.current = requestAnimationFrame(step);
  }, []);

  // Page Flip Animation (Story N <-> Story M)
  const animatePageProgressTo = useCallback((target: number, callback?: () => void) => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    const startVal = pageProgressRef.current;
    const delta = target - startVal;

    const finalizeFlip = (completed: boolean) => {
      animFrameIdRef.current = null;
      pageProgressRef.current = 0;
      setPageProgress(0);
      setPageDirection(null);
      pageDirectionRef.current = null;
      phaseRef.current = 'story';
      setPhase('story');
      openProgressRef.current = 1;
      setOpenProgress(1);

      if (completed) {
        const finalIdx = targetStoryIndexRef.current;
        currentStoryIndexRef.current = finalIdx;
        targetStoryIndexRef.current = finalIdx;
        setTargetStoryIndex(finalIdx);
        onStoryIndexChange(finalIdx);
      } else {
        const stableIdx = currentStoryIndexRef.current;
        targetStoryIndexRef.current = stableIdx;
        setTargetStoryIndex(stableIdx);
      }
      callback?.();
    };
    
    if (Math.abs(delta) < 0.001 || prefersReducedMotion.current) {
      finalizeFlip(target >= 0.99);
      return;
    }
    
    phaseRef.current = 'page-settling';
    setPhase('page-settling');
    const startTime = performance.now();
    const duration = 400; // slightly faster than cover morph
    
    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = clamp(elapsed / duration, 0, 1);
      const easedT = easeOutCubic(t);
      const currentVal = startVal + delta * easedT;
      
      pageProgressRef.current = currentVal;
      setPageProgress(currentVal);
      
      if (t < 1) {
        animFrameIdRef.current = requestAnimationFrame(step);
      } else {
        finalizeFlip(target >= 0.99);
      }
    };
    animFrameIdRef.current = requestAnimationFrame(step);
  }, [onStoryIndexChange]);

  const openStory = useCallback(() => {
    detachCover();
    animateOpenProgressTo(1);
  }, [detachCover, animateOpenProgressTo]);
  const closeStory = useCallback(() => { animateOpenProgressTo(0); }, [animateOpenProgressTo]);
  const resetToCover = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    activePointerIdRef.current = null;
    gestureOwnerRef.current = null;
    gestureAxisRef.current = null;
    pageDirectionRef.current = null;
    currentStoryIndexRef.current = currentStoryIndex;
    targetStoryIndexRef.current = currentStoryIndex;
    openProgressRef.current = 0;
    pageProgressRef.current = 0;
    phaseRef.current = 'cover';
    isCoverDetachedRef.current = false;

    setIsPointerActive(false);
    setOpenProgress(0);
    setPageProgress(0);
    setPageDirection(null);
    setTargetStoryIndex(currentStoryIndex);
    setPhase('cover');
    setIsCoverDetached(false);
    setCoverStartRect(null);
    coverStartRectRef.current = null;
  }, [currentStoryIndex]);
  const toggleStory = useCallback(() => {
    if (phaseRef.current === 'story' || openProgressRef.current > 0.5) closeStory();
    else openStory();
  }, [openStory, closeStory]);

  const flipToNext = useCallback(() => {
    if (phaseRef.current !== 'story' || currentStoryIndexRef.current >= editionLooksCount - 1) return;
    const nextIdx = currentStoryIndexRef.current + 1;
    targetStoryIndexRef.current = nextIdx;
    setTargetStoryIndex(nextIdx);
    setPageDirection('next');
    pageDirectionRef.current = 'next';
    setPageProgress(0);
    pageProgressRef.current = 0;
    animatePageProgressTo(1);
  }, [editionLooksCount, animatePageProgressTo]);

  const flipToPrev = useCallback(() => {
    if (phaseRef.current !== 'story') return;
    if (currentStoryIndexRef.current <= 0) {
      closeStory();
      return;
    }
    const prevIdx = currentStoryIndexRef.current - 1;
    targetStoryIndexRef.current = prevIdx;
    setTargetStoryIndex(prevIdx);
    setPageDirection('previous');
    pageDirectionRef.current = 'previous';
    setPageProgress(0);
    pageProgressRef.current = 0;
    animatePageProgressTo(1);
  }, [animatePageProgressTo, closeStory]);

  // Pointer Handlers
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    // Never interrupt a settling cover/page animation with a second touch.
    // Interrupting here was the source of the "one or two swipes and stuck"
    // state on mobile: the visual animation was cancelled while the phase
    // still claimed to be opening or flipping.
    if (
      phaseRef.current === 'opening' ||
      phaseRef.current === 'closing' ||
      phaseRef.current === 'page-settling' ||
      phaseRef.current === 'page-dragging'
    ) {
      return;
    }

    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    // If interrupted during settling, resolve immediately to stable state
    if (phaseRef.current === 'page-settling' || phaseRef.current === 'page-dragging') {
      if (pageProgressRef.current >= 0.5) {
        const finalIdx = targetStoryIndexRef.current;
        currentStoryIndexRef.current = finalIdx;
        targetStoryIndexRef.current = finalIdx;
        setTargetStoryIndex(finalIdx);
        onStoryIndexChange(finalIdx);
      } else {
        const stableIdx = currentStoryIndexRef.current;
        targetStoryIndexRef.current = stableIdx;
        setTargetStoryIndex(stableIdx);
      }
      pageProgressRef.current = 0;
      setPageProgress(0);
      setPageDirection(null);
      pageDirectionRef.current = null;
      phaseRef.current = 'story';
      setPhase('story');
    } else if (phaseRef.current === 'opening' || phaseRef.current === 'closing') {
      if (openProgressRef.current >= 0.98) {
        openProgressRef.current = 1;
        setOpenProgress(1);
        phaseRef.current = 'story';
        setPhase('story');
      }
    }

    if (phaseRef.current === 'story' || openProgressRef.current >= 0.98) {
      openProgressRef.current = 1;
      setOpenProgress(1);
    }

    // Do NOT capture pointer or initiate drag if clicking any button, link, input or header control
    const target = e.target as HTMLElement | null;
    if (
      target?.closest(
        'button, a, input, select, textarea, [role="button"], [data-editorial-notes], #top-header-pills-bar, #menuOverlay'
      )
    ) {
      return;
    }

    if (activePointerIdRef.current !== null) return;
    
    activePointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    pointerStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    pointerLastRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velocityRef.current = { vx: 0, vy: 0 };
    gestureAxisRef.current = null;
    
    // Explicitly record gesture origin state
    gestureOriginRef.current = {
      phase: phaseRef.current,
      storyIndex: currentStoryIndexRef.current,
      openProgress: openProgressRef.current,
      pageProgress: 0
    };
    gestureOwnerRef.current = null;
    setIsPointerActive(true);
  }, [onStoryIndexChange]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    const now = performance.now();
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    const dt = now - pointerLastRef.current.time;
    if (dt > 8) {
      velocityRef.current = {
        vx: (e.clientX - pointerLastRef.current.x) / dt,
        vy: (e.clientY - pointerLastRef.current.y) / dt
      };
      pointerLastRef.current = { x: e.clientX, y: e.clientY, time: now };
    }

    const origin = gestureOriginRef.current;
    const activeStoryIdx = currentStoryIndexRef.current;
    const isAtStoryZero = activeStoryIdx === 0;
    const isStoryDetached =
      isCoverDetachedRef.current ||
      openProgressRef.current >= 0.98 ||
      phaseRef.current === 'story' ||
      phaseRef.current === 'page-dragging' ||
      phaseRef.current === 'page-settling';

    // ARBITRATE GESTURE OWNER
    if (gestureOwnerRef.current === null) {
      if (
        isStoryDetached &&
        (phaseRef.current === 'story' ||
          phaseRef.current === 'page-dragging' ||
          phaseRef.current === 'page-settling' ||
          openProgressRef.current >= 0.98)
      ) {
        // Lock the dominant axis only after a meaningful displacement. A
        // diagonal first few pixels must not turn a vertical page gesture
        // into an edition carousel gesture.
        if (!gestureAxisRef.current && Math.max(absX, absY) >= 18) {
          if (absY >= absX + 20) gestureAxisRef.current = 'vertical';
          else if (absX >= absY + 20) gestureAxisRef.current = 'horizontal';
        }
        if (gestureAxisRef.current === 'vertical') {
          if (deltaY < 0) {
            // swipe up -> next story
            if (activeStoryIdx < editionLooksCount - 1) {
              const nextIdx = activeStoryIdx + 1;
              targetStoryIndexRef.current = nextIdx;
              setTargetStoryIndex(nextIdx);
              setPageDirection('next');
              pageDirectionRef.current = 'next';
              gestureOwnerRef.current = 'page-flip';
            }
          } else {
            // swipe down -> prev story OR close morph if at story 0
            if (activeStoryIdx > 0) {
              // Story N > 0: STRICTLY Page Flip Previous, openProgress locked to 1!
              const prevIdx = activeStoryIdx - 1;
              targetStoryIndexRef.current = prevIdx;
              setTargetStoryIndex(prevIdx);
              setPageDirection('previous');
              pageDirectionRef.current = 'previous';
              gestureOwnerRef.current = 'page-flip';
            } else {
              // Story 0 ONLY: return to cover via cover-morph
              gestureOwnerRef.current = 'cover-morph';
            }
          }
        }
      } else if (origin.phase === 'cover' && !isStoryDetached) {
        const LOCK_THRESHOLD = 18;
        if (absX >= LOCK_THRESHOLD || absY >= LOCK_THRESHOLD) {
          if (!gestureAxisRef.current) {
            if (absX >= absY + 20) gestureAxisRef.current = 'horizontal';
            else if (absY >= absX + 20) gestureAxisRef.current = 'vertical';
          }
          if (gestureAxisRef.current === 'horizontal' && canNavigateHorizontal) {
            gestureOwnerRef.current = 'edition-carousel';
          } else if (gestureAxisRef.current === 'vertical' && deltaY < -LOCK_THRESHOLD) { // ONLY pull up opens from cover
            gestureOwnerRef.current = 'cover-morph';
            morphStartYRef.current = e.clientY;
            detachCover();
            openProgressRef.current = 0;
            setOpenProgress(0);
            phaseRef.current = 'opening';
            setPhase('opening');
            return; // Detach and paint initial fixed frame with progress=0
          }
        }
      } else if (origin.phase === 'opening' || origin.phase === 'closing') {
        if (isAtStoryZero && absY > 4) {
          gestureOwnerRef.current = 'cover-morph';
        }
      }
    }

    // EXECUTE GESTURE
    const owner = gestureOwnerRef.current;
    
    if (owner === 'edition-carousel') {
      onHorizontalDrag(deltaX);
      return;
    }
    
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    if (owner === 'cover-morph') {
      const transitionDistance = Math.max(260, windowHeight * 0.48);
      // Smooth continuous delta from origin openProgress without snapping
      let newOpenProgress: number;
      if (origin.phase === 'cover') {
        const pullUp = Math.max(0, morphStartYRef.current - e.clientY);
        newOpenProgress = clamp(pullUp / transitionDistance, 0, 1);
      } else {
        const deltaProgress = -deltaY / transitionDistance;
        newOpenProgress = clamp(origin.openProgress + deltaProgress, 0, 1);
      }
      const prevProgress = openProgressRef.current;
      openProgressRef.current = newOpenProgress;
      setOpenProgress(newOpenProgress);

      // Determine real phase based on state and real movement direction (GATE 2: never opening on descend)
      let nextPhase: EditorialPhase;
      if (newOpenProgress >= 0.999) {
        nextPhase = 'story';
      } else if (newOpenProgress <= 0.001) {
        nextPhase = 'cover';
      } else if (newOpenProgress < prevProgress) {
        nextPhase = 'closing';
      } else if (newOpenProgress > prevProgress) {
        nextPhase = 'opening';
      } else {
        nextPhase = phaseRef.current;
      }

      if (phaseRef.current !== nextPhase) {
        phaseRef.current = nextPhase;
        setPhase(nextPhase);
      }
      return;
    }

    if (owner === 'page-flip') {
      // openProgress MUST strictly remain 1.0 during page flips
      if (openProgressRef.current !== 1) {
        openProgressRef.current = 1;
        setOpenProgress(1);
      }
      const flipDistance = windowHeight * 0.55;
      let newPageProgress = 0;
      const dir = pageDirectionRef.current;
      if (dir === 'next') {
        const pullUp = Math.max(0, -deltaY);
        newPageProgress = clamp(pullUp / flipDistance, 0, 1);
      } else if (dir === 'previous') {
        const pullDown = Math.max(0, deltaY);
        newPageProgress = clamp(pullDown / flipDistance, 0, 1);
      }
      pageProgressRef.current = newPageProgress;
      setPageProgress(newPageProgress);
      if (phaseRef.current !== 'page-dragging') {
        phaseRef.current = 'page-dragging';
        setPhase('page-dragging');
      }
      return;
    }
  }, [canNavigateHorizontal, editionLooksCount, onHorizontalDrag]);

  const handlePointerEnd = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (activePointerIdRef.current !== e.pointerId && activePointerIdRef.current !== null) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    
    activePointerIdRef.current = null;
    setIsPointerActive(false);
    
    const deltaX = e.clientX - pointerStartRef.current.x;
    const { vx, vy } = velocityRef.current;
    const owner = gestureOwnerRef.current;
    const origin = gestureOriginRef.current;
    const dir = pageDirectionRef.current;
    
    gestureOwnerRef.current = null;
    gestureAxisRef.current = null;

    if (owner === 'edition-carousel') {
      onHorizontalDragEnd(deltaX, vx);
      return;
    }

    if (owner === 'cover-morph') {
      const currentProg = openProgressRef.current;
      const wasOpening = origin.phase === 'cover' || origin.phase === 'opening' || (origin.phase !== 'closing' && origin.openProgress < 0.5);
      if (wasOpening) {
        if (currentProg >= 0.4 || vy < -0.32) animateOpenProgressTo(1);
        else animateOpenProgressTo(0);
      } else {
        if (currentProg <= 0.6 || vy > 0.32) animateOpenProgressTo(0);
        else animateOpenProgressTo(1);
      }
      return;
    }

    if (owner === 'page-flip') {
      const currentProg = pageProgressRef.current;
      if (dir === 'next') {
        if (currentProg >= 0.28 || vy < -0.28) animatePageProgressTo(1);
        else animatePageProgressTo(0);
      } else if (dir === 'previous') {
        if (currentProg >= 0.28 || vy > 0.28) animatePageProgressTo(1);
        else animatePageProgressTo(0);
      } else {
        animatePageProgressTo(0);
      }
      return;
    }
    
    // Tap or minimal movement without lock
    if (phaseRef.current === 'opening' || phaseRef.current === 'closing') {
      if (openProgressRef.current > 0.5) animateOpenProgressTo(1);
      else animateOpenProgressTo(0);
    } else if (phaseRef.current === 'page-dragging') {
      if (pageProgressRef.current >= 0.28) animatePageProgressTo(1);
      else animatePageProgressTo(0);
    }
  }, [animateOpenProgressTo, animatePageProgressTo, onHorizontalDragEnd]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName || '') ||
        target?.closest('button, a, [role="button"]')
      ) return;
      
      const currentPhase = phaseRef.current;
      if (e.key === 'Escape' && (currentPhase === 'story' || openProgressRef.current > 0.5)) {
        e.preventDefault();
        closeStory();
      } else if ((e.key === 'ArrowUp' || e.key === 'Enter') && currentPhase === 'cover') {
        e.preventDefault();
        openStory();
      } else if (currentPhase === 'story') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          flipToPrev();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          flipToNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openStory, closeStory, flipToPrev, flipToNext]);

  // Global pointercancel / blur cleanup to guarantee no zombie gesture state
  useEffect(() => {
    const handleGlobalCancel = () => {
      const owner = gestureOwnerRef.current;
      if (activePointerIdRef.current !== null || owner === 'edition-carousel') {
        activePointerIdRef.current = null;
        setIsPointerActive(false);
        if (gestureOwnerRef.current === 'edition-carousel') {
          onHorizontalDragEnd(0, 0);
        }
        gestureOwnerRef.current = null;
        gestureAxisRef.current = null;

        // Resolve interrupted gestures to a stable page instead of leaving
        // the reader between states after a touch-cancel or app switch.
        if (owner === 'cover-morph') {
          animateOpenProgressTo(openProgressRef.current >= 0.45 ? 1 : 0);
        } else if (owner === 'page-flip') {
          animatePageProgressTo(pageProgressRef.current >= 0.28 ? 1 : 0);
        }
      }
    };
    window.addEventListener('blur', handleGlobalCancel);
    window.addEventListener('pointercancel', handleGlobalCancel);
    return () => {
      window.removeEventListener('blur', handleGlobalCancel);
      window.removeEventListener('pointercancel', handleGlobalCancel);
    };
  }, [animateOpenProgressTo, animatePageProgressTo, onHorizontalDragEnd]);

  return {
    phase,
    openProgress,
    isCoverDetached,
    coverStartRect,
    currentStoryIndex,
    targetStoryIndex,
    pageProgress,
    pageDirection,
    isPointerActive,
    openStory,
    closeStory,
    resetToCover,
    toggleStory,
    flipToNext,
    flipToPrev,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd
  };
}
