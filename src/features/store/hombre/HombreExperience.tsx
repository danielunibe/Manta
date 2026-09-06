import React, { useEffect, useRef, useState } from 'react';
import { HombreHero } from './HombreHero';
import { HombreMarquee } from './HombreMarquee';
import { HombreProbador } from './HombreProbador';
import { HombreMochilasRow } from './HombreMochilasRow';
import { HombreHighlights } from './HombreHighlights';
import { HombreCatalog } from './HombreCatalog';
import { HombreQuoteStrip } from './HombreQuoteStrip';
import { Product } from '../../../types';

interface HombreExperienceProps {
  favoriteIds: Set<string>;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  addedProductId?: string | null;
}

export const HombreExperience: React.FC<HombreExperienceProps> = ({
  favoriteIds,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  addedProductId
}) => {
  const [activeCatalogCategory, setActiveCatalogCategory] = useState<string>('Todos');
  const rainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const catalogRef = useRef<HTMLDivElement | null>(null);

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectHighlightCategory = (category: string) => {
    setActiveCatalogCategory(category);
    scrollToCatalog();
  };

  // Ambient rain particle canvas
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let drops: Array<{ x: number; y: number; len: number; spd: number; op: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(130, Math.floor(window.innerWidth / 12));
      drops = [];
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          len: 12 + Math.random() * 24,
          spd: 2 + Math.random() * 3.6,
          op: 0.06 + Math.random() * 0.16
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.strokeStyle = `rgba(190, 205, 225, ${d.op})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 1.4, d.y + d.len);
        ctx.stroke();

        d.y += d.spd;
        if (d.y > canvas.height + 40) {
          drops[i] = {
            x: Math.random() * canvas.width,
            y: -40,
            len: 12 + Math.random() * 24,
            spd: 2 + Math.random() * 3.6,
            op: 0.06 + Math.random() * 0.16
          };
        }
      }

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full text-[#ece7de] space-y-12 sm:space-y-16 pb-12">
      {/* Background Rain Canvas */}
      <canvas
        ref={rainCanvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.85 }}
      />

      {/* Atmospheric Glow Overlays */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(600px 400px at 10% -5%, rgba(242, 193, 78, 0.07), transparent 60%),
            radial-gradient(700px 500px at 92% 15%, rgba(47, 143, 138, 0.08), transparent 60%),
            radial-gradient(800px 600px at 50% 110%, rgba(166, 58, 43, 0.09), transparent 60%)
          `
        }}
      />

      {/* Main Content Layer */}
      <div className="relative z-10 space-y-12 sm:space-y-16">
        {/* 1. Masthead & Editorial Portada */}
        <HombreHero />

        {/* 2. Marquee Ticker */}
        <HombreMarquee />

        {/* 3. Probador Digital con Fotos Reales */}
        <HombreProbador
          onAddToCart={onAddToCart}
          onScrollToCatalog={scrollToCatalog}
          onSelectProduct={onSelectProduct}
        />

        {/* 4. La Fila de Mochilas */}
        <HombreMochilasRow
          onAddToCart={onAddToCart}
          onSelectProduct={onSelectProduct}
          addedProductId={addedProductId}
        />

        {/* 5. Destacados / Atajos de Temporada */}
        <HombreHighlights onSelectCategory={handleSelectHighlightCategory} />

        {/* 6. Gran Catálogo Completo (31 piezas) */}
        <div ref={catalogRef}>
          <HombreCatalog
            favoriteIds={favoriteIds}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            onSelectProduct={onSelectProduct}
            addedProductId={addedProductId}
            activeCategory={activeCatalogCategory}
            onCategoryChange={setActiveCatalogCategory}
          />
        </div>

        {/* 7. Quote Strip */}
        <HombreQuoteStrip />
      </div>
    </div>
  );
};
