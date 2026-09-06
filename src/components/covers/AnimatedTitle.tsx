import React, { useEffect, useState, useRef } from 'react';
import { TextLine } from '../../types';

interface AnimatedTitleProps {
  lines: TextLine[];
  accentColor: string;
  activeKey: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ lines, accentColor, activeKey, style, className = '' }) => {
  const [animIn, setAnimIn] = useState(true);
  const prevKeyRef = useRef(activeKey);
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    if (prevKeyRef.current !== activeKey) {
      prevKeyRef.current = activeKey;
      setAnimIn(false);
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimIn(true);
        });
      });
      return () => cancelAnimationFrame(t);
    }
  }, [activeKey, lines]);

  let totalLetters = 0;

  return (
    <h1
      style={style}
      className={`font-['Abril_Fatface',serif] font-normal leading-[0.96] text-white transition-opacity ${animIn ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {lines.map((line, lIdx) => {
        const chars = Array.from(line.t);
        return (
          <span key={lIdx} className="block overflow-hidden pb-[0.05em]">
            {chars.map((char, cIdx) => {
              if (char === ' ') {
                return (
                  <span key={cIdx} className="inline-block w-[0.28em]">
                    &nbsp;
                  </span>
                );
              }
              const delay = 0.12 + totalLetters * 0.035;
              totalLetters++;
              return (
                <span
                  key={cIdx}
                  style={{
                    color: line.em ? accentColor : undefined,
                    transform: animIn ? 'translateY(0)' : 'translateY(118%)',
                    transition: 'transform 0.75s cubic-bezier(0.2, 0.85, 0.25, 1)',
                    transitionDelay: `${delay}s`
                  }}
                  className="inline-block"
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};
