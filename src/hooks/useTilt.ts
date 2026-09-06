import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TiltState } from '../types';

export const useTilt = (onTriggerBurst?: () => void) => {
  const [tiltState, setTiltState] = useState<TiltState>({
    rotX: 0,
    rotY: 0,
    px: 0,
    py: 0,
    gx: '50%',
    gy: '30%',
    isPulsing: false
  });

  const tiltRef = useRef<HTMLDivElement | null>(null);
  const pulseTimeoutRef = useRef<number | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;
    const r = tiltRef.current.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const ny = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));

    const rotX = Number(((0.5 - ny) * 7).toFixed(2));
    const rotY = Number(((nx - 0.5) * 9).toFixed(2));
    const px = Number((nx - 0.5).toFixed(3));
    const py = Number((ny - 0.5).toFixed(3));
    const gx = `${(nx * 100).toFixed(1)}%`;
    const gy = `${(ny * 100).toFixed(1)}%`;

    setTiltState(prev => ({
      ...prev,
      rotX,
      rotY,
      px,
      py,
      gx,
      gy
    }));
  }, []);

  const handlePointerLeave = useCallback(() => {
    setTiltState(prev => ({
      ...prev,
      rotX: 0,
      rotY: 0
    }));
  }, []);

  const resetTilt = useCallback(() => {
    setTiltState(prev => ({
      ...prev,
      rotX: 0,
      rotY: 0,
      px: 0,
      py: 0
    }));
  }, []);

  const triggerPulse = useCallback(() => {
    setTiltState(prev => ({ ...prev, isPulsing: true }));
    if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = window.setTimeout(() => {
      setTiltState(prev => ({ ...prev, isPulsing: false }));
    }, 500);

    if (onTriggerBurst) {
      onTriggerBurst();
    }
  }, [onTriggerBurst]);

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
    };
  }, []);

  return {
    tiltRef,
    tiltState,
    handlePointerMove,
    handlePointerLeave,
    resetTilt,
    triggerPulse
  };
};
