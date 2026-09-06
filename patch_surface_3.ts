import fs from 'fs';

let content = fs.readFileSync('src/features/editorial/transition/CoverStorySurface.tsx', 'utf-8');

// Remove the remaining useStoryPageFlip call
content = content.replace(/  \/\/ Story Page Flip vertical gesture & 3D folding engine hook[\s\S]*?\}\);/, '');

// Fix the JSX prop
content = content.replace(/direction=\{pageDirection\}\s*\(phase === 'page-dragging' \|\| phase === 'page-settling'\)=\{phase === 'page-dragging' \|\| phase === 'page-settling'\}/, `direction={pageDirection}
          isFlipping={phase === 'page-dragging' || phase === 'page-settling'}`);

fs.writeFileSync('src/features/editorial/transition/CoverStorySurface.tsx', content);
