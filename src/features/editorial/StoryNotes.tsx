import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Headphones, Volume2, VolumeX } from 'lucide-react';
import { Story } from '../../domain/content';
import { getEditorialMedia } from '../../domain/editorialMedia';
import { getProduct } from '../../domain/catalog';
import { Product } from '../../types';
import { EditorialProductTile, EditorialProductTilePlacement } from './EditorialProductTile';

interface StoryNotesProps {
  story: Story;
  onSelectProduct?: (productId: string) => void;
  onPlayAudio?: (trackId: string) => void;
  onPreviousStory?: () => void;
  onNextStory?: () => void;
  canGoNext?: boolean;
  videoAudioEnabled?: boolean;
}

interface EditorialVideoProps {
  src: string;
  poster?: string;
  alt: string;
  reduceMotion: boolean;
  audioEnabled: boolean;
  orientation?: 'portrait' | 'landscape';
}

const EditorialVideo: React.FC<EditorialVideoProps> = ({ src, poster, alt, reduceMotion, audioEnabled, orientation = 'portrait' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasVideoFrame, setHasVideoFrame] = useState(false);
  const isLandscape = orientation === 'landscape';
  const mediaClassName = isLandscape
    ? 'absolute inset-x-4 top-[12svh] h-auto max-h-[62svh] w-[calc(100%-2rem)] object-contain'
    : 'absolute inset-0 h-full w-full object-cover';

  useEffect(() => {
    setHasVideoFrame(false);
  }, [src, poster]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    if (audioEnabled) void video.play().catch(() => undefined);
  }, [audioEnabled, isMuted]);

  if (reduceMotion) {
    if (!poster) return null;
    return (
      <div className={`absolute inset-0 overflow-hidden ${isLandscape ? 'bg-[#0b1114]' : ''}`}>
        {isLandscape && (
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className="absolute inset-[-8%] h-[116%] w-[116%] scale-110 object-cover opacity-35 blur-[18px]"
          />
        )}
        <img src={poster} alt={alt} className={mediaClassName} loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${isLandscape ? 'bg-[#0b1114]' : ''}`}
    >
      {isLandscape && poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-[-8%] h-[116%] w-[116%] scale-110 object-cover opacity-35 blur-[18px]"
        />
      )}
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className={`${mediaClassName} transition-opacity duration-300 ${hasVideoFrame ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      <video
        ref={videoRef}
        className={`${mediaClassName} z-[2] transition-opacity duration-300 ${hasVideoFrame || !poster ? 'opacity-100' : 'opacity-0'}`}
        src={src}
        poster={poster}
        autoPlay
        muted={isMuted}
        volume={0.86}
        loop
        playsInline
        preload="metadata"
        controls={false}
        aria-label={alt}
        onLoadedData={() => {
          setHasVideoFrame(true);
          void videoRef.current?.play().catch(() => undefined);
        }}
        onContextMenu={(event) => event.preventDefault()}
      />
      <button
        type="button"
        aria-label={isMuted ? 'Activar sonido del video' : 'Silenciar video'}
        aria-pressed={!isMuted}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          const nextMuted = !isMuted;
          setIsMuted(nextMuted);
          const video = videoRef.current;
          if (video) {
            video.muted = nextMuted;
            video.volume = 0.86;
            void video.play().catch(() => undefined);
          }
        }}
        className="absolute bottom-[max(92px,env(safe-area-inset-bottom)+72px)] right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white/75 backdrop-blur-sm transition hover:bg-black/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
};

const productList = (ids: string[]): Product[] => ids
  .map((id) => getProduct(id))
  .filter((product): product is Product => Boolean(product));

const overlayPlacementFor = (index: number, primary: 'left' | 'center' | 'right'): EditorialProductTilePlacement => {
  const placements: Record<'left' | 'center' | 'right', EditorialProductTilePlacement[]> = {
    left: ['left', 'right', 'center'],
    right: ['right', 'left', 'center'],
    center: ['center', 'left', 'right']
  };
  return placements[primary][index] ?? placements[primary][placements[primary].length - 1];
};

export const StoryNotes: React.FC<StoryNotesProps> = ({
  story,
  onSelectProduct,
  onPlayAudio,
  onPreviousStory,
  onNextStory,
  videoAudioEnabled = false
}) => {
  const notes = story.notes ?? [];
  const [noteIndex, setNoteIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const gestureAxisRef = useRef<'horizontal' | 'vertical' | null>(null);
  const wheelLockRef = useRef(0);
  const transitionLockRef = useRef(0);

  useEffect(() => {
    setNoteIndex(0);
    setDragOffset(0);
    gestureAxisRef.current = null;
  }, [story.id]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.('change', update);
    return () => mediaQuery.removeEventListener?.('change', update);
  }, []);

  if (notes.length === 0) return null;

  const moveNote = (direction: 1 | -1) => {
    const now = performance.now();
    if (now < transitionLockRef.current) return;
    transitionLockRef.current = now + 560;
    const nextIndex = noteIndex + direction;
    if (nextIndex >= 0 && nextIndex < notes.length) {
      setNoteIndex(nextIndex);
      return;
    }

    if (direction === 1) onNextStory?.();
    else onPreviousStory?.();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (performance.now() < transitionLockRef.current) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a, input, select, textarea, [role="button"]')) return;
    pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    gestureAxisRef.current = null;
    setIsDragging(true);
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch {}
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!pointerRef.current || pointerRef.current.id !== event.pointerId) return;
    const deltaX = event.clientX - pointerRef.current.x;
    const deltaY = event.clientY - pointerRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (!gestureAxisRef.current && Math.max(absX, absY) >= 16) {
      if (absY >= absX + 18) gestureAxisRef.current = 'vertical';
      else if (absX >= absY + 18) gestureAxisRef.current = 'horizontal';
    }
    if (gestureAxisRef.current === 'vertical') setDragOffset(deltaY);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!pointerRef.current || pointerRef.current.id !== event.pointerId) return;
    const deltaX = event.clientX - pointerRef.current.x;
    const deltaY = event.clientY - pointerRef.current.y;
    pointerRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
    const axis = gestureAxisRef.current;
    gestureAxisRef.current = null;
    if (axis === 'vertical' && Math.abs(deltaY) >= 56) {
      // Notes read as a continuous vertical magazine. Only after the last
      // sheet do we cut to the next story/scene.
      moveNote(deltaY < 0 ? 1 : -1);
    }
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
  };

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a, input, select, textarea, video')) return;
    const deltaX = Math.abs(event.deltaX);
    const deltaY = Math.abs(event.deltaY);
    if (deltaY <= deltaX || deltaY < 12) return;
    const now = Date.now();
    if (now < wheelLockRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    wheelLockRef.current = now + 520;
    moveNote(event.deltaY > 0 ? -1 : 1);
  };

  return (
    <section
      id={`story-notes-${story.id}`}
      data-editorial-notes="true"
      aria-label={`Contenido editorial de ${story.title}`}
      className="pointer-events-auto absolute inset-0 z-[26] h-full overflow-hidden"
      style={{ touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onWheel={handleWheel}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-transparent">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-end px-5 pb-3 pt-[max(16px,env(safe-area-inset-top))] md:px-10">
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.18em] text-white/45">
            {String(noteIndex + 1).padStart(2, '0')} / {String(notes.length).padStart(2, '0')}
          </span>
          <div className="pointer-events-auto flex items-center gap-1">
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => { event.stopPropagation(); moveNote(-1); }}
              aria-label="Contenido anterior"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] text-white/65 transition hover:bg-white/[0.14] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => { event.stopPropagation(); moveNote(1); }}
              aria-label="Contenido siguiente"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] text-white/65 transition hover:bg-white/[0.14] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden" aria-live="polite">
          <div
            className={`flex h-full flex-col ${isDragging || reduceMotion ? '' : 'transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]'}`}
            style={{ transform: `translateY(calc(-${noteIndex * 100}% + ${dragOffset}px))` }}
          >
            {notes.map((note, index) => {
              const media = note.mediaIds.map((id) => getEditorialMedia(id)).filter(Boolean);
              const video = media.find((item) => item?.kind === 'video' && item.status === 'ready' && item.src);
              const poster = media.find((item) => item?.kind === 'poster' && item.src);
              const track = note.audioTrackId ? getEditorialMedia(note.audioTrackId) : undefined;
              const products = productList(note.productIds);
              const primaryOverlayProduct = note.productOverlaySrc
                ? products.find((product) => product.image === note.productOverlaySrc)
                : undefined;
              const overlayProducts = [
                ...(primaryOverlayProduct ? [primaryOverlayProduct] : []),
                ...products.filter((product) => product.id !== primaryOverlayProduct?.id)
              ].slice(0, 3);
              const primaryOverlayPosition = note.productOverlayPosition ?? 'right';

              return (
                <article key={note.id} className="relative h-full min-h-0 w-full shrink-0 overflow-hidden px-5 pb-[max(22px,env(safe-area-inset-bottom))] pt-20 md:px-12 md:pb-10">
                  <div className="absolute inset-0 overflow-hidden bg-[#111719]">
                    {video?.src ? (
                      <EditorialVideo src={video.src} poster={poster?.src} orientation={video.orientation} alt={`Movimiento de ${note.title}`} reduceMotion={reduceMotion} audioEnabled={videoAudioEnabled} />
                    ) : poster?.src ? (
                      <img src={poster.src} alt={poster.alt ?? note.title} className="h-full w-full object-cover" loading={index === noteIndex ? 'eager' : 'lazy'} />
                    ) : (
                      <div className="flex h-full items-end p-5 font-['Fraunces',Georgia,serif] text-[clamp(5rem,18vw,10rem)] leading-none text-white/10">{String(index + 1).padStart(2, '0')}</div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,10,.04)_0%,rgba(3,8,10,.03)_36%,rgba(3,8,10,.16)_54%,rgba(3,8,10,.88)_100%)]" aria-hidden="true" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-[min(78%,760px)] bg-[linear-gradient(90deg,rgba(3,8,10,.44)_0%,rgba(3,8,10,.08)_78%,transparent_100%)]" aria-hidden="true" />
                  </div>

                  {note.commerceEnabled && overlayProducts.length > 0 && (
                    <div className="pointer-events-none absolute inset-0 z-[12]" aria-label="Productos de esta página">
                      {overlayProducts.map((product, productIndex) => (
                        <EditorialProductTile
                          key={product.id}
                          product={product}
                          featured={productIndex === 0}
                          placement={overlayPlacementFor(productIndex, primaryOverlayPosition)}
                          onOpen={(productId) => onSelectProduct?.(productId)}
                        />
                      ))}
                    </div>
                  )}

                  <div className="relative z-10 flex h-full min-h-0 flex-col justify-end pb-2 pt-1 md:pb-4">
                    <div className="max-w-[min(90vw,760px)] pb-3 md:pb-5">
                      <div className="flex items-center justify-between gap-4 text-[9px] uppercase tracking-[0.2em] text-[#f2c14e]">
                        <span>{note.eyebrow}</span>
                        <span className="text-white/45">{story.title}</span>
                      </div>
                      <h3 className="mt-2 max-w-xl font-['Fraunces',Georgia,serif] text-[clamp(1.85rem,5vw,3.8rem)] font-semibold leading-[.94] tracking-[-.035em] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,.5)]">
                        {note.title}
                      </h3>
                      <div className="mt-3 max-h-[24vh] max-w-[min(88vw,680px)] space-y-2 overflow-hidden text-[12px] leading-[1.45] text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,.65)] sm:text-[13px] md:mt-4 md:max-h-[28vh] md:text-[14px] md:leading-[1.5]">
                        {note.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </div>
                    </div>

                    <div className="flex min-h-[44px] items-end justify-end gap-3 pt-3">
                      {track?.src && (
                        <button
                          type="button"
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={(event) => { event.stopPropagation(); onPlayAudio?.(track.id); }}
                          aria-label={`Escuchar ${note.title}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.07] text-white/70 transition hover:bg-white/[0.14] hover:text-[#f2c14e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]"
                        >
                          <Headphones className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
