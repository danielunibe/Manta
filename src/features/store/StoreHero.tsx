import React, { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { MagazineEdition } from '../../types';
import { tactile } from '../../utils/tactileFeedback';
import { getEditorialMedia } from '../../domain/editorialMedia';

interface StoreHeroProps {
  activeEdition?: MagazineEdition;
  onExploreCampaign?: () => void;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ activeEdition, onExploreCampaign }) => {
  const editionId = activeEdition?.id || 'august';
  const month = activeEdition?.month || 'Agosto';
  const year = activeEdition?.year || '2026';
  const number = activeEdition?.number || '08';
  const campaignVideo = editionId === 'august' ? getEditorialMedia('video-august-after-rain') : undefined;
  const fallbackImage = activeEdition?.looks[0]?.image || '/assets/editorial/directed/august-cover-hero-vertical.png';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    video.volume = 0.72;
    setIsMuted(nextMuted);
    void video.play().catch(() => undefined);
  };

  return (
    <section id="store-editorial-hero" aria-label={`Portada editorial de ${month}`} className="group relative isolate -mx-4 min-h-[min(52svh,560px)] overflow-hidden bg-[#090e11] sm:-mx-6 md:-mx-10">
      {campaignVideo?.status === 'ready' && campaignVideo.src ? (
        <video ref={videoRef} src={campaignVideo.src} poster={campaignVideo.posterSrc || fallbackImage} aria-label={`Video editorial de ${month}`} autoPlay muted={isMuted} loop preload="metadata" playsInline controls={false} className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.015]" />
      ) : (
        <img src={fallbackImage} alt={`Portada editorial de ${month}`} className="absolute inset-0 h-full w-full object-cover object-center" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,10,.12)_0%,rgba(4,8,10,.04)_42%,rgba(4,8,10,.8)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" aria-hidden="true" />

      <div className="absolute inset-x-5 bottom-[max(28px,env(safe-area-inset-bottom)+22px)] z-10 max-w-[min(92vw,620px)] sm:inset-x-8 sm:bottom-10 md:inset-x-12">
        <p className="font-['Spline_Sans_Mono',ui-monospace,monospace] text-[9px] uppercase tracking-[0.24em] text-[#f2c14e]">Edición nº{number} · {month} {year}</p>
        <h1 className="mt-2 max-w-[15ch] font-['Fraunces',Georgia,serif] text-[clamp(2.2rem,7vw,5rem)] font-semibold leading-[.9] tracking-[-.045em] text-white drop-shadow-[0_3px_22px_rgba(0,0,0,.55)]">La ciudad después del <em className="font-normal text-[#f2c14e]">agua.</em></h1>
        <div className="mt-5 flex items-center gap-4">
          {onExploreCampaign && <button type="button" onClick={() => { tactile.selection(); onExploreCampaign(); }} className="border-b border-white/70 pb-1 font-['Spline_Sans_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:border-[#f2c14e] hover:text-[#f2c14e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]">Leer revista ↗</button>}
          {campaignVideo?.src && <button type="button" onClick={toggleSound} aria-label={isMuted ? 'Activar sonido del video' : 'Silenciar video'} aria-pressed={!isMuted} className="flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white/75 backdrop-blur-sm transition hover:bg-black/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c14e]">{isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}</button>}
        </div>
      </div>
    </section>
  );
};
