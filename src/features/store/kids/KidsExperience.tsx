import React, { useEffect, useRef } from 'react';
import { KidsHero } from './KidsHero';
import { KidsMarquee } from './KidsMarquee';
import { KidsBento } from './KidsBento';
import { KidsCatalog } from './KidsCatalog';
import { KidsQuoteStrip } from './KidsQuoteStrip';
import { Product } from '../../../types';

interface KidsExperienceProps {
  favoriteIds: Set<string>;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  addedProductId?: string | null;
}

export const KidsExperience: React.FC<KidsExperienceProps> = ({
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  addedProductId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Poetic ambient rain effect from the original HTML design
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    interface Drop {
      x: number;
      y: number;
      len: number;
      spd: number;
      op: number;
    }

    const dropCount = Math.min(65, Math.floor(width / 18));
    const drops: Drop[] = Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: 12 + Math.random() * 20,
      spd: 2 + Math.random() * 3.5,
      op: 0.05 + Math.random() * 0.16
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(156,195,232,0.45)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.beginPath();
        ctx.globalAlpha = d.op;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.5, d.y + d.len);
        ctx.stroke();

        d.y += d.spd;
        d.x -= 0.3;
        if (d.y > height + 20) {
          d.y = -30;
          d.x = Math.random() * width;
        }
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById('kids-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative w-full overflow-hidden text-[#ece7de]">
      {/* Background Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        aria-hidden="true"
      />

      {/* Atmospheric Ambient Glows */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(600px 400px at 10% 5%, rgba(242,193,78,0.08), transparent 60%),
            radial-gradient(700px 500px at 90% 25%, rgba(192,57,43,0.09), transparent 60%),
            radial-gradient(800px 600px at 50% 90%, rgba(156,195,232,0.06), transparent 60%)
          `
        }}
        aria-hidden="true"
      />

      {/* Main Content Sections */}
      <div className="relative z-10 space-y-12">
        <KidsHero onExploreCatalog={scrollToCatalog} />

        <KidsMarquee />

        <KidsBento
          onAddToCart={onAddToCart}
          onSelectProduct={onSelectProduct}
          onScrollToCatalog={scrollToCatalog}
          addedProductId={addedProductId}
        />

        <KidsQuoteStrip />

        <KidsCatalog
          favoriteIds={favoriteIds}
          onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
          onSelectProduct={onSelectProduct}
          addedProductId={addedProductId}
        />
      </div>
    </div>
  );
};
