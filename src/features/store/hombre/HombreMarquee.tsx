import React from 'react';

export const HombreMarquee: React.FC = () => {
  const tickerWords = [
    'Hombre',
    'Abrigos',
    'Tejidos',
    'Mochilas',
    'Accesorios',
    'Calzado',
    'Probador digital'
  ];

  return (
    <div className="my-8 border-y border-white/10 py-3.5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <div className="inline-flex whitespace-nowrap animate-[marquee_28s_linear_infinite]">
        {[0, 1, 2, 3].map((rep) => (
          <span key={rep} className="inline-flex items-center">
            {tickerWords.map((word, idx) => (
              <React.Fragment key={`${rep}-${idx}`}>
                <span className="font-['Fraunces',Georgia,serif] italic text-base sm:text-lg text-[#d8d2c6]">
                  {word}
                </span>
                <span className="text-[#f2c14e] font-normal px-4 text-sm">✦</span>
              </React.Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};
