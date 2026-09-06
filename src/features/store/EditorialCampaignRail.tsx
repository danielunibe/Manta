import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Story } from '../../domain/content';
import { getEditorialMedia } from '../../domain/editorialMedia';

interface EditorialCampaignRailProps {
  stories: Story[];
  onReadStory: (storyId: string) => void;
}

export const EditorialCampaignRail: React.FC<EditorialCampaignRailProps> = ({ stories, onReadStory }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ id: number; x: number; scrollLeft: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const update = () => setActiveIndex(Math.max(0, Math.min(stories.length - 1, Math.round(scroller.scrollLeft / Math.max(scroller.clientWidth, 1)))));
    scroller.addEventListener('scroll', update, { passive: true });
    update();
    return () => scroller.removeEventListener('scroll', update);
  }, [stories.length]);

  const move = (direction: 1 | -1) => {
    const next = Math.max(0, Math.min(stories.length - 1, activeIndex + direction));
    scrollerRef.current?.scrollTo({ left: next * (scrollerRef.current.clientWidth || 1), behavior: 'smooth' });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button')) return;
    dragRef.current = { id: event.pointerId, x: event.clientX, scrollLeft: scrollerRef.current?.scrollLeft ?? 0 };
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch {}
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.id !== event.pointerId || !scrollerRef.current) return;
    scrollerRef.current.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.x);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.id !== event.pointerId) return;
    dragRef.current = null;
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch {}
  };

  return (
    <section id="store-editorial-campaigns" aria-labelledby="store-editorial-campaigns-title" className="space-y-4">
      <div className="flex items-end justify-between px-1">
        <div>
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] uppercase tracking-[0.24em] text-[#f2c14e]">Entre páginas</span>
          <h2 id="store-editorial-campaigns-title" className="mt-1 font-['Fraunces',Georgia,serif] text-2xl text-white sm:text-3xl">Historias de Agosto</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] tracking-[0.16em] text-white/45" aria-live="polite">{String(activeIndex + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}</span>
          <button type="button" onClick={() => move(-1)} aria-label="Historia anterior" disabled={activeIndex === 0} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white/65 transition hover:bg-white/[0.12] disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]"><ArrowLeft className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => move(1)} aria-label="Historia siguiente" disabled={activeIndex === stories.length - 1} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white/65 transition hover:bg-white/[0.12] disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]"><ArrowRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div ref={scrollerRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain no-scrollbar" style={{ touchAction: 'pan-x' }}>
        {stories.map((story) => {
          const poster = story.campaign ? getEditorialMedia(story.campaign.posterMediaId) : undefined;
          const isLandscape = poster?.orientation === 'landscape';
          const note = story.notes?.[0];
          return (
            <article key={story.id} className="relative min-w-full snap-center overflow-hidden bg-[#101719]">
              <button type="button" onClick={() => onReadStory(story.id)} className="group relative block aspect-[4/5] w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f2c14e] sm:aspect-[16/8]" aria-label={`Leer historia ${story.title}`}>
                {poster?.src && <img src={poster.src} alt={poster.alt ?? story.title} loading="lazy" className={`absolute inset-0 h-full w-full transition duration-700 group-hover:scale-[1.015] ${isLandscape ? 'object-contain' : 'object-cover'}`} />}
                <span className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/12 to-transparent" aria-hidden="true" />
                <span className="absolute inset-x-5 bottom-5 z-10 max-w-[min(88vw,620px)] sm:inset-x-8 sm:bottom-8">
                  <span className="block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] uppercase tracking-[0.22em] text-[#f2c14e]">{story.title}</span>
                  <span className="mt-1 block font-['Fraunces',Georgia,serif] text-[clamp(1.7rem,4vw,3.5rem)] leading-[.95] text-white">{story.subtitle}</span>
                  {note && <span className="mt-2 block max-w-xl text-xs leading-relaxed text-white/62">{note.title}</span>}
                </span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};
