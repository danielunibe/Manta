import React from 'react';
import { BackgroundEngine } from '../../types';
import { RainCanvas } from './RainCanvas';
import { FireworksCanvas } from './FireworksCanvas';
import { StreetBokehCanvas } from './StreetBokehCanvas';

interface BackgroundCanvasManagerProps {
  currentEngine: BackgroundEngine;
  burstTrigger: number;
}

export const BackgroundCanvasManager: React.FC<BackgroundCanvasManagerProps> = ({
  currentEngine,
  burstTrigger
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <RainCanvas active={currentEngine === 'rain'} burstTrigger={currentEngine === 'rain' ? burstTrigger : 0} />
      <FireworksCanvas active={currentEngine === 'fireworks'} burstTrigger={currentEngine === 'fireworks' ? burstTrigger : 0} />
      <StreetBokehCanvas active={currentEngine === 'street'} burstTrigger={currentEngine === 'street' ? burstTrigger : 0} />
    </div>
  );
};
