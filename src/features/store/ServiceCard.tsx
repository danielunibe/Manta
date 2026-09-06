import React from 'react';
import { Umbrella, Clock, RotateCcw } from 'lucide-react';

export const ServiceCard: React.FC = () => {
  return (
    <div
      id="service-card"
      className="col-span-1 rounded-2xl bg-black/40 border border-white/10 p-4 sm:p-5 flex flex-col justify-between group transition-all duration-300 relative"
    >
      <div className="flex items-center justify-between text-[9px] font-['Spline_Sans_Mono',ui-monospace,monospace] tracking-[0.2em] text-[#2f8f8a] uppercase font-semibold">
        <span>SERVICIO & ENVÍO</span>
        <span className="text-white/40">GDL / MÉXICO</span>
      </div>

      <div className="space-y-1.5 my-2.5">
        <div className="flex items-center gap-2 text-xs text-[#ece7de]">
          <Clock className="w-3.5 h-3.5 text-[#f2c14e] shrink-0" />
          <span className="font-medium">Entregas 24-48h hábiles</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#ece7de]">
          <Umbrella className="w-3.5 h-3.5 text-[#2f8f8a] shrink-0" />
          <span className="font-medium">Empaque 100% impermeable</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#ece7de]">
          <RotateCcw className="w-3.5 h-3.5 text-white/60 shrink-0" />
          <span className="font-medium">Cambios y devoluciones gratis</span>
        </div>
      </div>

      <div className="text-[9.5px] font-['Spline_Sans_Mono',ui-monospace,monospace] text-white/40 tracking-wider uppercase">
        ATENCIÓN ATELIER PERSONAL
      </div>
    </div>
  );
};
