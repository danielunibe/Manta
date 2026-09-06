import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, X } from 'lucide-react';
import { EditorialMedia } from '../../domain/editorialMedia';

interface AudioDockProps {
  track: EditorialMedia | null;
  onClose: () => void;
}

interface AmbientAudioProps {
  track: EditorialMedia | null;
  fallbackTrack: EditorialMedia | null;
  enabled: boolean;
  unlocked: boolean;
}

const AMBIENT_VOLUME = 0.045;
const CROSSFADE_SECONDS = 7;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Quiet editorial bed. It waits for the first user gesture because browsers
 * block audible autoplay, then follows the active edition and falls back to
 * August when a seasonal track ends.
 */
export const AmbientAudio: React.FC<AmbientAudioProps> = ({ track, fallbackTrack, enabled, unlocked }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodesRef = useRef<WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>>(new WeakMap());
  const fadeFrameRef = useRef<number | null>(null);
  const crossfadeStartedRef = useRef(false);
  const [playbackTrack, setPlaybackTrack] = useState<EditorialMedia | null>(track);

  const stopFade = () => {
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  };

  const fadeVolume = (audio: HTMLAudioElement, from: number, to: number, durationMs: number, onComplete?: () => void) => {
    const startedAt = performance.now();
    stopFade();
    const step = (now: number) => {
      const progress = clamp((now - startedAt) / durationMs, 0, 1);
      audio.volume = from + (to - from) * (progress * (2 - progress));
      if (progress < 1) fadeFrameRef.current = requestAnimationFrame(step);
      else {
        fadeFrameRef.current = null;
        onComplete?.();
      }
    };
    fadeFrameRef.current = requestAnimationFrame(step);
  };

  const ensureAnalyser = (audio: HTMLAudioElement) => {
    if (typeof window === 'undefined' || !audio.src) return null;
    const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;
    let analyser = analyserRef.current;
    if (!analyser) {
      analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.88;
      analyser.connect(context.destination);
      analyserRef.current = analyser;
    }
    if (!sourceNodesRef.current.has(audio)) {
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      sourceNodesRef.current.set(audio, source);
    }
    return { context, analyser };
  };

  const announceAudioLevel = () => {
    const analyser = analyserRef.current;
    if (!analyser || typeof window === 'undefined') return;
    const values = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(values);
    let total = 0;
    for (const value of values) total += value;
    const level = clamp(total / values.length / 255, 0, 1);
    window.dispatchEvent(new CustomEvent('manta:audio-level', { detail: { level } }));
  };

  useEffect(() => {
    setPlaybackTrack(track);
    crossfadeStartedRef.current = false;
    stopFade();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0;
    }
    if (fallbackAudioRef.current) {
      fallbackAudioRef.current.pause();
      fallbackAudioRef.current.currentTime = 0;
      fallbackAudioRef.current.volume = 0;
    }
  }, [track?.id]);

  useEffect(() => {
    if (!enabled || !unlocked || !playbackTrack?.src || !audioRef.current) return;
    const audio = audioRef.current;
    const start = async () => {
      try {
        const analyser = ensureAnalyser(audio);
        await analyser?.context.resume();
        audio.volume = 0;
        await audio.play();
        fadeVolume(audio, 0, AMBIENT_VOLUME, 3200);
      } catch {
        // The user can still activate the visible AudioDock manually.
      }
    };
    void start();
  }, [enabled, unlocked, playbackTrack?.id]);

  useEffect(() => {
    if (!enabled || !unlocked || !playbackTrack?.src || !audioRef.current) return;
    const audio = audioRef.current;
    const fallbackAudio = fallbackAudioRef.current;
    let levelFrame = 0;
    let active = true;

    const monitor = () => {
      if (!active) return;
      announceAudioLevel();
      const remaining = Number.isFinite(audio.duration) ? audio.duration - audio.currentTime : Infinity;
      const canCrossfade = Boolean(fallbackAudio?.src && fallbackTrack?.src && fallbackTrack.src !== playbackTrack.src);
      if (canCrossfade && !crossfadeStartedRef.current && remaining <= CROSSFADE_SECONDS) {
        crossfadeStartedRef.current = true;
        const nextAudio = fallbackAudio as HTMLAudioElement;
        nextAudio.currentTime = 0;
        nextAudio.volume = 0;
        ensureAnalyser(nextAudio);
        void nextAudio.play().then(() => {
          const startedAt = performance.now();
          const mix = (now: number) => {
            const progress = clamp((now - startedAt) / (CROSSFADE_SECONDS * 1000), 0, 1);
            const eased = progress * (2 - progress);
            audio.volume = AMBIENT_VOLUME * (1 - eased);
            nextAudio.volume = AMBIENT_VOLUME * eased;
            if (progress < 1 && active) {
              fadeFrameRef.current = requestAnimationFrame(mix);
            } else {
              audio.pause();
              audio.currentTime = 0;
              nextAudio.volume = AMBIENT_VOLUME;
              fadeFrameRef.current = null;
            }
          };
          fadeFrameRef.current = requestAnimationFrame(mix);
        }).catch(() => undefined);
      }
      levelFrame = requestAnimationFrame(monitor);
    };
    levelFrame = requestAnimationFrame(monitor);

    return () => {
      active = false;
      cancelAnimationFrame(levelFrame);
      stopFade();
    };
  }, [enabled, unlocked, playbackTrack?.id, fallbackTrack?.id]);

  useEffect(() => () => {
    stopFade();
    audioRef.current?.pause();
    fallbackAudioRef.current?.pause();
    audioContextRef.current?.close().catch(() => undefined);
  }, []);

  if (!playbackTrack?.src || playbackTrack.kind !== 'audio') return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={playbackTrack.src}
        preload="none"
        loop={playbackTrack.id === fallbackTrack?.id}
        aria-label="Música ambiental de la edición"
      />
      {fallbackTrack?.src && fallbackTrack.src !== playbackTrack.src && (
        <audio ref={fallbackAudioRef} src={fallbackTrack.src} preload="none" loop aria-hidden="true" />
      )}
    </>
  );
};

export const AudioDock: React.FC<AudioDockProps> = ({ track, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [track?.id]);

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  // A planned track remains metadata-only. The editorial page must not expose
  // a disabled-looking Suno CTA before the local export exists.
  if (!track || track.kind !== 'audio' || !track.src) return null;

  const togglePlayback = async () => {
    if (!audioRef.current || !track.src) return;
    if (audioRef.current.paused) {
      await audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <aside
      className="fixed bottom-4 left-1/2 z-[55] w-[min(92vw,24rem)] -translate-x-1/2 rounded-2xl border border-white/15 bg-[#080c10]/95 p-3 text-white shadow-2xl backdrop-blur-xl sm:bottom-6 sm:w-[min(92vw,24rem)]"
      aria-label="Reproductor editorial"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-['Fraunces',Georgia,serif] text-base">{track.id.replace('audio-', '').replaceAll('-', ' ')}</p>
        </div>
        {track.src && (
          <button
            type="button"
            onClick={togglePlayback}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2c14e]/18 text-[#f2c14e] transition hover:bg-[#f2c14e]/28 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
          </button>
        )}
        <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f2c14e]" aria-label="Cerrar reproductor">
          <X className="h-4 w-4" />
        </button>
      </div>
        {track.src && (
          <audio
          ref={audioRef}
          src={track.src}
          preload="none"
            className="sr-only"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </aside>
  );
};
