import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// First extract all the new variables from useCoverStoryTransition
content = content.replace(/const \{\n    phase,\n    openProgress: progress,\n    openStory/, `const {
    phase,
    openProgress: progress,
    pageProgress,
    pageDirection,
    targetStoryIndex,
    flipToNext,
    flipToPrev,
    openStory`);

// Then pass them to CoverStorySurface
content = content.replace(/<CoverStorySurface\s+edition=\{activeEdition\}/, `<CoverStorySurface
                      edition={activeEdition}
                      phase={phase}
                      pageProgress={pageProgress}
                      pageDirection={pageDirection}
                      targetStoryIndex={targetStoryIndex}
                      flipToNext={flipToNext}
                      flipToPrev={flipToPrev}`);

fs.writeFileSync('src/App.tsx', content);
