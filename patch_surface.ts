import fs from 'fs';

let content = fs.readFileSync('src/features/editorial/transition/CoverStorySurface.tsx', 'utf-8');

// Remove import of useStoryPageFlip
content = content.replace(/import \{ useStoryPageFlip \} from '\.\.\/pageFlip\/useStoryPageFlip';\n/, '');

// Add new props to the interface
content = content.replace(/progress: number;/, `progress: number;
  phase: string;
  pageProgress: number;
  pageDirection: 'next' | 'previous' | null;
  targetStoryIndex: number;
  flipToNext: () => void;
  flipToPrev: () => void;`);

// Destructure new props
content = content.replace(/progress,\n  isCoverActive,\n  coverElement/, `progress,
  isCoverActive,
  coverElement,
  phase,
  pageProgress,
  pageDirection,
  targetStoryIndex,
  flipToNext,
  flipToPrev`);

// Remove internal useStoryPageFlip call
content = content.replace(/  const \{\n    pageProgress: pageFlipProgress,\n    direction: pageFlipDirection,\n    isFlipping,\n    targetStoryIndex,\n    flipToNext,\n    flipToPrev,\n    handlePointerDown: handleStoryPointerDown,\n    handlePointerMove: handleStoryPointerMove,\n    handlePointerEnd: handleStoryPointerEnd\n  \} = useStoryPageFlip\(\{ edition, currentStoryIndex: currentLookIdx, onStoryIndexChange: onSelectLook \}\);\n/, '');

// Update StoryPageFlip props (pageFlipProgress -> pageProgress, etc)
content = content.replace(/progress=\{pageFlipProgress\}/, `progress={pageProgress}`);
content = content.replace(/direction=\{pageFlipDirection\}/, `direction={pageDirection}`);
content = content.replace(/isFlipping=\{isFlipping\}/, `isFlipping={phase === 'page-dragging' || phase === 'page-settling'}`);

content = content.replace(/pageFlipProgress > 0.01/g, `pageProgress > 0.01`);
content = content.replace(/pageFlipProgress > 0.05/g, `pageProgress > 0.05`);
content = content.replace(/isFlipping/g, `(phase === 'page-dragging' || phase === 'page-settling')`);

// Remove handleStoryPointerDown etc since useCoverStoryTransition handles it now
content = content.replace(/onPointerDown=\{isStoryActive \? handleStoryPointerDown : undefined\}/, `// Pointer events handled by App.tsx main`);
content = content.replace(/onPointerMove=\{isStoryActive \? handleStoryPointerMove : undefined\}/, `// Pointer events handled by App.tsx main`);
content = content.replace(/onPointerUp=\{isStoryActive \? handleStoryPointerEnd : undefined\}/, `// Pointer events handled by App.tsx main`);
content = content.replace(/onPointerCancel=\{isStoryActive \? handleStoryPointerEnd : undefined\}/, `// Pointer events handled by App.tsx main`);

fs.writeFileSync('src/features/editorial/transition/CoverStorySurface.tsx', content);
