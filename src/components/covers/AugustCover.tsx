import React, { useState, useEffect } from 'react';
import { MagazineEdition } from '../../types';
import { useTilt } from '../../hooks/useTilt';
import { AnimatedTitle } from './AnimatedTitle';
import { mapRange, lerp, clamp } from '../../features/editorial/transition/transitionMath';
import { hasNativeHover } from '../../utils/tactileFeedback';

interface AugustCoverProps {
  edition: MagazineEdition;
  onTriggerBurst: () => void;
  isActive: boolean;
  isDragging?: boolean;
  lookIndex?: number;
  onLookChange?: (idx: number) => void;
  progress?: number;
  isDetached?: boolean;
}

export const AugustCover: React.FC<AugustCoverProps> = ({
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

  // Auto-advance looks when hovering (only when at rest in carousel)
  useEffect(() => {
    if (!isActive || !isHovered || isDragging || isMorphed) return;
    const interval = setInterval(() => {
      updateLook((currentLookIdx + 1) % edition.looks.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isActive, isHovered, isDragging, isMorphed, edition.looks.length, currentLookIdx]);

  const currentLook = edition.looks[currentLookIdx] || edition.looks[0];

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
      className={
        isMorphed
          ? 'relative w-full h-full [transform-style:preserve-3d] select-none'
          : `relative w-[min(68vw,calc(55svh*5/7))] md:w-[min(42vw,calc(50svh*5/7))] lg:w-[min(330px,calc(48svh*5/7))] [transform-style:preserve-3d] will-change-transform cursor-grab active:cursor-grabbing select-none ${
              tiltState.isPulsing ? 'animate-pulso' : ''
            }`
      }
    >
      <article
        id="rev-aug"
        aria-label="Portada del catálogo MANTA, familia latina con paraguas, agosto 2026"
        style={{
          '--px': isMorphed ? 0 : tiltState.px,
          '--py': isMorphed ? 0 : tiltState.py,
          '--gx': isMorphed ? '50%' : tiltState.gx,
          '--gy': isMorphed ? '50%' : tiltState.gy,
          '--acento': currentLook.acento
        } as React.CSSProperties}
        className={
          isMorphed
            ? 'relative w-full h-full overflow-hidden text-[#f2ecdd] bg-[#101a22]'
            : 'relative aspect-[5/7] overflow-hidden rounded-[4px] text-[#f2ecdd] [container-type:inline-size] bg-[#101a22] shadow-[inset_0_2px_0_rgba(255,255,255,0.06),0_60px_120px_rgba(0,0,0,0.75),0_18px_44px_rgba(0,0,0,0.6)]'
        }
      >
        {/* ========================================================================= */}
        {/* 1. MEDIA LAYER: Photography & Atmospheric Textures (object-fit: cover)   */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
          {edition.looks.map((look, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 z-0 ${
                p > 0.05 ? 'transition-none' : 'transition-opacity duration-1200 ease-in-out'
              } ${idx === currentLookIdx ? 'opacity-100' : 'opacity-0'}`}
            >
              <div
                style={{
                  transform: isMorphed
                    ? 'none'
                    : `translate(calc(${tiltState.px} * -1cqw), calc(${tiltState.py} * -0.8cqw))`
                }}
                className="absolute inset-0"
              >
                <img
                  src={look.image}
                  alt={look.alt}
                  draggable={false}
                  className="w-full h-full object-cover object-[50%_45%] block animate-respirarAug group-hover:running pointer-events-none select-none"
                  style={{ animationPlayState: isHovered && !isMorphed ? 'running' : 'paused' }}
                />
              </div>
            </div>
          ))}

          {/* Vignette gradients that evolve softly */}
          <div
            className="absolute inset-0 z-1 pointer-events-none bg-[linear-gradient(180deg,rgba(16,26,34,0.94)_0%,rgba(16,26,34,0.6)_9%,rgba(16,26,34,0)_24%),linear-gradient(0deg,rgba(6,11,15,0.97)_0%,rgba(6,11,15,0.72)_16%,transparent_42%),radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(6,11,15,0.35)_100%)]"
            style={{ opacity: mapRange(p, 0.0, 0.65, 1.0, 0.0) }}
          />
          <div
            className="absolute inset-0 z-2 opacity-[0.07] pointer-events-none bg-grain"
            style={{ opacity: mapRange(p, 0.0, 0.70, 0.07, 0.02) }}
          />
        </div>

        {/* ========================================================================= */}
        {/* 2. EDITORIAL CONTENT LAYER: Continuous, independent choreography         */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 z-10 select-none pointer-events-none">

          {/* Framing border (dissolves progressively) */}
          {/* The cover image must end cleanly; the former framing rule read as a stray line. */}

          {/* Vertical left text (shifts outward and dissolves) */}
          <span
            className="hidden sm:block absolute left-[8px] top-1/2 z-4 [writing-mode:vertical-rl] tracking-[0.5em] uppercase text-[#f0f4f6]/55 font-medium [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
            style={{
              fontSize: `${lerp(7, 9, p)}px`,
              transform: `translateY(-50%) translateX(${-p * 24}px) rotate(180deg)`,
              opacity: mapRange(p, 0.20, 0.60, 1.0, 0.0)
            }}
          >
            aguacero · caminata · familia · agosto
          </span>

          {/* Left bottom credits (shifts slightly and dissolves) */}
          <aside
            className="hidden sm:block absolute left-[18px] bottom-[22px] z-7 uppercase leading-[2.2] text-[#f0f4f6]/90 font-medium [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]"
            style={{
              fontSize: `${lerp(7.5, 9, p)}px`,
              letterSpacing: `${lerp(0.2, 0.25, p)}em`,
              transform: `translateX(${-p * 20}px)`,
              opacity: mapRange(p, 0.20, 0.65, 1.0, 0.0)
            }}
          >
            <span className="block text-[#f0f4f6]/55 tracking-[0.3em]">
              La familia camina
            </span>
            <span className="block">
              la lluvia{' '}
              <span
                style={{ color: currentLook.acento }}
                className="inline-block h-[1.4em] overflow-hidden align-bottom font-bold min-w-[36px] text-left"
              >
                <span className={`flex flex-col animate-rotar ${isHovered && !isMorphed ? 'running' : 'paused'}`}>
                  <span className="h-[1.4em] leading-[1.4]">nos viste</span>
                  <span className="h-[1.4em] leading-[1.4]">nos une</span>
                  <span className="h-[1.4em] leading-[1.4]">nos sigue</span>
                  <span className="h-[1.4em] leading-[1.4]">nos espera</span>
                  <span className="h-[1.4em] leading-[1.4]">nos viste</span>
                </span>
              </span>
            </span>
          </aside>

          {/* Base bottom tricolor shimmer line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2.5px] z-6 overflow-hidden bg-[linear-gradient(90deg,#d64545_0_33.4%,#e8b23a_33.4%_66.7%,#2f8f83_66.7%_100%)] shadow-[0_-1px_4px_rgba(0,0,0,0.5)]"
            style={{ opacity: mapRange(p, 0.25, 0.70, 1.0, 0.0) }}
          >
            <div
              className={`absolute inset-0 bg-[linear-gradient(90deg,transparent_30%,rgba(255,255,255,0.7)_50%,transparent_70%)] -translate-x-full animate-shimmer ${
                isHovered && !isMorphed ? 'running' : 'paused'
              }`}
            />
          </div>

          {/* Rain Stamp (travels, un-rotates, dissolves) */}
          <div
            className="absolute z-7 text-center border-[1.5px] border-[#e8b23a]/90 text-[#e8b23a] rounded-[3px] uppercase font-bold leading-[1.7] bg-[#080f14]/45 shadow-[0_3px_10px_rgba(0,0,0,0.5)]"
            style={{
              top: `${lerp(16, 24, p)}px`,
              right: `clamp(12px, 3.5vw, ${lerp(14, 28, p)}px)`,
              padding: `${lerp(3, 4.5, p)}px ${lerp(6, 9, p)}px`,
              fontSize: `${lerp(7, 8.5, p)}px`,
              letterSpacing: `${lerp(0.26, 0.30, p)}em`,
              transform: `rotate(${lerp(8, 0, p)}deg) scale(${lerp(1.0, 1.1, p)})`,
              transformOrigin: 'center',
              opacity: mapRange(p, 0.40, 0.80, 1.0, 0.0)
            }}
          >
            Edición
            <br />
            lluvia · 08
          </div>

          {/* Top Branding: MANTA Masthead & Date (Moves, grows, preserves proportions) */}
          <header
            className="absolute left-1/2 z-6 flex flex-col items-center"
            style={{
              top: `${lerp(14, 26, p)}px`,
              transform: `translateX(-50%) scale(${lerp(1.0, 1.22, p)})`,
              transformOrigin: 'top center',
              opacity: mapRange(p, 0.0, 0.35, 1.0, 0.0)
            }}
          >
            <div className="relative overflow-hidden font-['Abril_Fatface',serif] leading-[0.9] text-white tracking-[0.02em] [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]"
              style={{ fontSize: `${lerp(32, 42, p)}px` }}
            >
              <span className="inline-block transition-transform duration-800 delay-100">M</span>
              <span className="inline-block transition-transform duration-800 delay-200">a</span>
              <span className="inline-block transition-transform duration-800 delay-300">n</span>
              <span className="inline-block transition-transform duration-800 delay-400">t</span>
              <span className="inline-block transition-transform duration-800 delay-500">a</span>
              <sup
                style={{ color: currentLook.acento, fontSize: `${lerp(8, 10.5, p)}px`, verticalAlign: `${lerp(8, 10.5, p)}px` }}
                className="font-['Space_Grotesk'] font-bold opacity-100 ml-[1px]"
              >
                ®
              </sup>
              {/* Shimmer light over logo */}
              <div
                className={`absolute inset-[-10%_-5%] pointer-events-none mix-blend-screen bg-[linear-gradient(105deg,transparent_40%,rgba(255,250,235,0.6)_50%,transparent_60%)] animate-marcaBrillo ${
                  isHovered && !isMorphed ? 'running' : 'paused'
                }`}
              />
            </div>

            <div
              className="flex items-center uppercase text-[#f0f4f6]/85 font-medium [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
              style={{
                marginTop: `${lerp(5, 9, p)}px`,
                gap: `${lerp(5, 8, p)}px`,
                fontSize: `${lerp(7, 9.5, p)}px`,
                letterSpacing: `${lerp(0.28, 0.34, p)}em`,
                opacity: lerp(0.85, 0.95, p)
              }}
            >
              <span>Agosto · 2026</span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                style={{
                  fill: currentLook.acento,
                  width: `${lerp(9, 12, p)}px`,
                  height: `${lerp(9, 12, p)}px`
                }}
              >
                <path d="M12 2a10 10 0 0 1 10 10h-8.5v7.5a2.5 2.5 0 0 1-5 0V20h2v-.5a.5.5 0 0 0 1 0V12H2A10 10 0 0 1 12 2Z" />
              </svg>
              <span>Catálogo Nº 08</span>
            </div>
          </header>

          {/* ========================================================================= */}
          {/* 3. CORE SHARED HEADLINE (Chip, Animated Title & Subtitle)                */}
          {/* Never duplicates: expands, separates lines, shifts smoothly into Story   */}
          {/* ========================================================================= */}
          <section
            className="absolute z-7 text-right"
            style={{
              right: `clamp(14px, ${lerp(3.5, 4.5, p)}vw, ${lerp(16, 44, p)}px)`,
              bottom: `clamp(18px, ${lerp(4.5, 5, p)}vh, ${lerp(22, 42, p)}px)`,
              maxWidth: `min(${lerp(220, 580, p)}px, 86vw)`,
              transformOrigin: 'bottom right'
            }}
          >
            {/* Tag / Chip */}
            <span
              style={{
                backgroundColor: currentLook.acento,
                fontSize: `${lerp(7.5, 11.5, p)}px`,
                letterSpacing: `${lerp(0.24, 0.30, p)}em`,
                padding: `${lerp(2.5, 4.5, p)}px ${lerp(6, 11, p)}px`,
                borderRadius: `${lerp(2, 4, p)}px`,
                gap: `${lerp(3, 5.5, p)}px`
              }}
              className="inline-flex items-center font-bold uppercase text-[#0c1216] shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-colors duration-500"
            >
              {currentLook.chip}
              <span
                style={{
                  width: `${lerp(3.5, 5.5, p)}px`,
                  height: `${lerp(3.5, 5.5, p)}px`
                }}
                className={`inline-block rounded-full bg-[#0c1216] animate-latChip ${
                  isHovered && !isMorphed ? 'running' : 'paused'
                }`}
              />
            </span>

            {/* Continuous Animated Title: expands responsively from ~30px to ~52px without overflow */}
            <div
              style={{
                marginTop: `${lerp(6, 12, p)}px`,
                textShadow: `0 ${lerp(3, 8, p)}px ${lerp(10, 24, p)}px rgba(0,0,0,0.85)`
              }}
            >
              <AnimatedTitle
                lines={currentLook.lineas}
                accentColor={currentLook.acento}
                activeKey={`${currentLookIdx}-${currentLook.chip}`}
                style={{
                  fontSize: `clamp(${lerp(24, 30, p)}px, ${lerp(6, 4.2, p)}vw + ${lerp(0, 16, p)}px, ${lerp(30, 52, p)}px)`,
                  lineHeight: lerp(0.96, 1.04, p)
                }}
              />
            </div>

            {/* Subtitle: breathes, expands maxWidth and fontSize with guaranteed mobile lateral air */}
            <p
              style={{
                marginTop: `${lerp(5, 12, p)}px`,
                fontSize: `${lerp(9.5, 14.5, p)}px`,
                lineHeight: lerp(1.45, 1.58, p),
                maxWidth: `min(${lerp(190, 440, p)}px, 82vw)`,
                opacity: lerp(0.9, 0.95, p),
                textShadow: `0 ${lerp(2, 6, p)}px ${lerp(6, 16, p)}px rgba(0,0,0,0.85)`
              }}
              className="font-['Space_Grotesk'] text-[#f4f7f8] ml-auto font-normal"
            >
              {currentLook.sub}
            </p>
          </section>

        </div>

        {/* Radial Mouse Light (only in carousel hover) */}
        {!isMorphed && (
          <div
            style={{
              background: `radial-gradient(circle at ${tiltState.gx} ${tiltState.gy}, rgba(255,250,235,0.13), transparent 52%)`,
              opacity: isHovered ? 1 : 0
            }}
            className="absolute inset-0 z-11 pointer-events-none transition-opacity duration-450"
          />
        )}
      </article>
    </div>
  );
};
