import React from 'react';
import { ChevronUp } from 'lucide-react';
import { mapRange } from '../../features/editorial/transition/transitionMath';

interface SwipeUpHintProps {
  onClick?: () => void;
  progress?: number;
}

export const SwipeUpHint: React.FC<SwipeUpHintProps> = ({ onClick, progress = 0 }) => {
  const opacity = mapRange(progress, 0, 0.25, 1, 0);

  if (opacity <= 0.01) return null;

  return (
    <button
      id="btn-swipe-up-enter"
      type="button"
      onClick={onClick}
      aria-label="Abrir edición / Desliza hacia arriba para entrar"
      style={{ opacity }}
      className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 text-white/80 hover:text-white transition-opacity duration-150 select-none cursor-pointer group outline-none border-none bg-transparent px-4 py-2 pointer-events-auto"
    >
      <ChevronUp className="w-4 h-4 text-white/80 group-hover:text-white animate-bounce stroke-[1.5]" />
      <span className="text-[11px] font-normal tracking-[0.25em] uppercase text-white/60 group-hover:text-white transition-colors">
        Desliza para entrar
      </span>
    </button>
  );
};
