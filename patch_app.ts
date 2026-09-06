import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(/const \{\s*progress,\s*mode,\s*openStory/m, `const {
    phase,
    openProgress: progress,
    openStory`);

content = content.replace(/useCoverStoryTransition\(\{\s*onHorizontalDrag/m, `useCoverStoryTransition({
    currentStoryIndex: lookIndices[currentIndex],
    editionLooksCount: EDITIONS[currentIndex]?.looks.length || 1,
    onStoryIndexChange: (idx) => handleLookChange(currentIndex, idx),
    onHorizontalDrag`);

content = content.replace(/mode !== 'cover'/g, `phase !== 'cover'`);
content = content.replace(/mode === 'cover'/g, `phase === 'cover'`);

fs.writeFileSync('src/App.tsx', content);
