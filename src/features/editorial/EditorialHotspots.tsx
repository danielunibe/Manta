import React from 'react';
import { Hotspot } from '../../types';
import { tactile } from '../../utils/tactileFeedback';

interface EditorialHotspotsProps {
  hotspots?: Hotspot[];
  disabled?: boolean;
  onSelectProduct: (productId: string) => void;
}

export const EditorialHotspots: React.FC<EditorialHotspotsProps> = ({ hotspots = [], disabled = false, onSelectProduct }) => {
  if (disabled || hotspots.length === 0) return null;

  return (
    <div id="editorial-hotspots" className="absolute inset-0 z-25 pointer-events-none" aria-label="Piezas de la escena">
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          className="editorial-hotspot pointer-events-auto"
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          onClick={() => {
            tactile.selection();
            onSelectProduct(hotspot.productId);
          }}
          aria-label={`Ver ${hotspot.label}`}
        >
          <span className="editorial-hotspot-dot" aria-hidden="true" />
          <span className="editorial-hotspot-label">{hotspot.label}</span>
        </button>
      ))}
    </div>
  );
};

