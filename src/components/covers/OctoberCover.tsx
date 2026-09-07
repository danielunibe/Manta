import React, { useState, useEffect } from 'react';
import { MagazineEdition } from '../../types';
import { useTilt } from '../../hooks/useTilt';
import { AnimatedTitle } from './AnimatedTitle';
import { lerp, mapRange, clamp } from '../../features/editorial/transition/transitionMath';
import { hasNativeHover } from '../../utils/tactileFeedback';

interface OctoberCoverProps {
  edition: MagazineEdition;
  onTriggerBurst: () => void;
  isActive: boolean;
  isDragging?: boolean;
  lookIndex?: number;
  onLookChange?: (idx: number) => void;
  progress?: number;
  isDetached?: boolean;
}

export const OctoberCover: React.FC<OctoberCoverProps> = ({
  edition,
  onTriggerBurst,
  isActive,
  isDragging = false,
  lookIndex: controlledLookIdx,
  onLookChange,
  progress = 0,
  isDetached = false
}) => {
  const [internalLookIdx, setInternalLookIdx] = useState(0);
  const currentLookIdx = typeof controlledLookIdx === 'number' ? controlledLookIdx : internalLookIdx;
  const [isHovered, setIsHovered] = useState(false);
  const pointerStartRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const maxPointerDistRef = React.useRef<number>(0);
  const { tiltRef, tiltState, handlePointerMove, handlePointerLeave, resetTilt, triggerPulse } = useTilt(onTriggerBurst);

  const p = clamp(progress, 0, 1);
  const isMorphed = p > 0.001;

  const updateLook = (newIdx: number) => {
    setInternalLookIdx(newIdx);
    onLookChange?.(newIdx);
  };

  // Suspend tilt immediately on dragging or progress
  useEffect(() => {
    if (isDragging || isMorphed) {
      resetTilt();
    }
  }, [isDragging, isMorphed, resetTilt]);

  // Auto-advance looks when hovering in resting state
  useEffect(() => {
    if (!isActive || !isHovered || isDragging || isMorphed) return;
    const interval = setInterval(() => {
      updateLook((currentLookIdx + 1) % edition.looks.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isActive, isHovered, isDragging, isMorphed, edition.looks.length, currentLookIdx]);

  const currentLook = edition.looks[currentLookIdx];

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMorphed) return;
    resetTilt();
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    maxPointerDistRef.current = 0;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging || isMorphed || maxPointerDistRef.current > 8) return;
    const dist = Math.hypot(e.clientX - pointerStartRef.current.x, e.clientY - pointerStartRef.current.y);
    if (dist < 8) {
      updateLook((currentLookIdx + 1) % edition.looks.length);
      triggerPulse();
    }
  };

  return (
    <div
      ref={tiltRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={(e) => {
        const d = Math.hypot(e.clientX - pointerStartRef.current.x, e.clientY - pointerStartRef.current.y);
        if (d > maxPointerDistRef.current) maxPointerDistRef.current = d;
        if (!isDragging && !isMorphed) handlePointerMove(e);
      }}
      onPointerLeave={() => {
        handlePointerLeave();
        setIsHovered(false);
      }}
      onPointerEnter={() => {
        if (!isDragging && !isMorphed && hasNativeHover()) setIsHovered(true);
      }}
      style={{
        transform: isMorphed
          ? 'none'
          : `rotateX(${tiltState.rotX}deg) rotateY(${tiltState.rotY}deg)`,
        transition: isDragging || isMorphed ? 'none' : 'transform 0.3s ease'
      }}
      className={`relative [transform-style:preserve-3d] will-change-transform select-none ${
        isMorphed
          ? 'w-full h-full'
          : 'w-[min(84vw,calc(72svh*5/7))] md:w-[min(42vw,calc(50svh*5/7))] lg:w-[min(330px,calc(48svh*5/7))] cursor-grab active:cursor-grabbing manta-cover-tilt'
      } ${tiltState.isPulsing && !isMorphed ? 'animate-pulso' : ''}`}
    >
      <article
        id="rev-oct"
        aria-label="Portada del catálogo MANTA, Noche tapatía"
        style={{
          '--px': tiltState.px,
          '--py': tiltState.py,
          '--gx': tiltState.gx,
          '--gy': tiltState.gy,
          '--acento': currentLook.acento
        } as React.CSSProperties}
        className={`relative overflow-hidden text-[#f6f1e6] bg-[#171310] ${
          isMorphed
            ? 'w-full h-full rounded-none shadow-none'
            : 'aspect-[5/7] rounded-[4px] shadow-[inset_0_2px_0_rgba(255,255,255,0.06),0_40px_80px_rgba(0,0,0,0.8),0_12px_32px_rgba(0,0,0,0.65)]'
        }`}
      >
        {/* ========================================================================= */}
        {/* 1. MEDIA LAYER: Fotografía editorial nocturna de Guadalajara                 */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          {edition.looks.map((look, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 ${
                isMorphed ? 'transition-none' : 'transition-opacity duration-1000 ease-in-out'
              } ${idx === currentLookIdx ? 'opacity-100' : 'opacity-0'}`}
            >
              <div
                style={{
                  transform: isMorphed
                    ? 'none'
                    : `translate(calc(${tiltState.px} * -10px), calc(${tiltState.py} * -8px))`
                }}
                className="absolute inset-0 manta-cover-media"
              >
                <img
                  src={look.image}
                  alt={look.alt}
                  draggable={false}
                  className="w-full h-full object-cover object-[50%_50%] block pointer-events-none select-none"
                />
              </div>
            </div>
          ))}

          {/* Vignette gradients evolving softly */}
          <div
            className="absolute inset-0 z-1 pointer-events-none bg-[linear-gradient(180deg,rgba(23,19,16,0.75)_0%,rgba(23,19,16,0.3)_14%,transparent_30%),linear-gradient(0deg,rgba(16,11,9,0.92)_0%,rgba(16,11,9,0.55)_14%,transparent_36%),radial-gradient(120%_90%_at_50%_45%,transparent_56%,rgba(14,9,7,0.4)_100%)]"
            style={{ opacity: mapRange(p, 0.0, 0.65, 1.0, 0.0) }}
          />
          <div
            className="absolute inset-0 z-2 opacity-[0.07] pointer-events-none bg-grain"
            style={{ opacity: mapRange(p, 0.0, 0.70, 0.07, 0.02) }}
          />
        </div>

        {/* ========================================================================= */}
        {/* 2. EDITORIAL CONTENT LAYER: dirección de calle tapatía                    */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 z-10 select-none pointer-events-none">

          {/* Framing border (dissolves progressively) */}
          <div className="hidden" aria-hidden="true" />

          {/* Base: Yellow Road Stripe with Shimmer (dissolves) */}
          {/* Yellow Rotator Tag (Right Bottom: shifts outward and dissolves) */}
          <div className="hidden" aria-hidden="true" />

          {/* Right Vertical Bar (shifts outward and dissolves) */}
          <span className="hidden" aria-hidden="true">cdmx · roma norte · editorial calle</span>

          <div className="hidden" aria-hidden="true">San Juan de Dios · Guadalajara · Jalisco</div>

          {/* Top Left: Metadata (shifts, adjusts typography smoothly) */}
          <div
            className="absolute z-6 uppercase text-[#f6f1e6]/90 font-medium [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]"
            style={{
              top: `${lerp(16, 26, p)}px`,
              left: `clamp(14px, 4vw, ${lerp(16, 36, p)}px)`,
              fontSize: `${lerp(7.5, 9.5, p)}px`,
              letterSpacing: `${lerp(0.26, 0.32, p)}em`,
              lineHeight: lerp(1.7, 1.9, p),
              opacity: lerp(0.9, 0.95, p)
            }}
          >
            <b className="block font-bold tracking-[0.22em]">MANTA</b>
            <span className="block mt-1">Octubre · 2026 · Nº 10</span>
          </div>

          {/* ========================================================================= */}
          {/* 3. CORE EDITORIAL CARTEL: copy directly on the photograph                */}
          {/* ========================================================================= */}
          <section
            className="absolute z-7 text-[#f6f1e6] transition-opacity duration-500"
            style={{
              left: `clamp(16px, ${lerp(5, 7, p)}vw, ${lerp(20, 72, p)}px)`,
              top: `${lerp(41, 28, p)}%`,
              maxWidth: `min(${lerp(220, 680, p)}px, 86vw)`,
              transform: `rotate(${lerp(-1, 0, p)}deg)`,
              transformOrigin: 'top left'
            }}
          >
            <span
              style={{
                color: currentLook.acento,
                fontSize: `${lerp(7, 10, p)}px`,
                letterSpacing: `${lerp(0.22, 0.3, p)}em`
              }}
              className="inline-block font-bold uppercase [text-shadow:0_1px_5px_rgba(0,0,0,0.8)] transition-colors duration-500"
            >
              OCTUBRE · ADELANTO
            </span>

            <span className="mt-3 block font-['Spline_Sans_Mono',ui-monospace,monospace] text-[8px] font-bold uppercase tracking-[0.2em] text-white/70 [text-shadow:0_1px_5px_rgba(0,0,0,0.8)]">
              SAN JUAN DE DIOS · GDL
            </span>

            {/* Continuous Animated Title: scales from ~18px to ~44px without overflow */}
            <div
              style={{
                marginTop: `${lerp(5, 12, p)}px`
              }}
            >
              <AnimatedTitle
                lines={currentLook.lineas}
                accentColor={currentLook.acento}
                activeKey={`${currentLookIdx}-${currentLook.chip}`}
                className="text-[#f6f1e6] [text-shadow:0_3px_18px_rgba(0,0,0,0.72)]"
                style={{
                  fontSize: `clamp(${lerp(18, 24, p)}px, ${lerp(5, 3.8, p)}vw + ${lerp(0, 14, p)}px, ${lerp(22, 44, p)}px)`,
                  lineHeight: lerp(0.96, 1.04, p)
                }}
              />
            </div>

            {/* Subtitle: expands naturally with guaranteed lateral air */}
            <p
              style={{
                marginTop: `${lerp(4, 10, p)}px`,
                fontSize: `${lerp(9, 13.5, p)}px`,
                lineHeight: lerp(1.42, 1.56, p),
                maxWidth: `min(${lerp(175, 410, p)}px, 78vw)`
              }}
              className="text-[#4a4238] font-medium font-['Space_Grotesk']"
            >
              Moda, calle y neón después de la lluvia.
            </p>
          </section>

          {/* ========================================================================= */}
          {/* 4. GIANT BOTTOM LOGO WATERMARK: Display typography across bottom          */}
          {/* Persists, breathes, adjusts scale, anchors cleanly at bottom              */}
          {/* ========================================================================= */}
          <div className="hidden" aria-hidden="true">Manta</div>

        </div>

        {/* Radial Mouse Light (Carousel hover only) */}
        {!isMorphed && (
          <div
            style={{
              background: `radial-gradient(circle at ${tiltState.gx} ${tiltState.gy}, rgba(255,244,220,0.13), transparent 52%)`,
              opacity: isHovered ? 1 : 0
            }}
            className="absolute inset-0 z-11 pointer-events-none transition-opacity duration-450"
          />
        )}
      </article>
    </div>
  );
};
