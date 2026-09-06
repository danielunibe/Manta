import fs from 'fs';

let content = fs.readFileSync('src/features/editorial/transition/CoverStorySurface.tsx', 'utf-8');
content = content.replace(/\(phase === 'page-dragging' \|\| phase === 'page-settling'\),/, '');
fs.writeFileSync('src/features/editorial/transition/CoverStorySurface.tsx', content);
