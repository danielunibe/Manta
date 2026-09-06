const fs = require('fs');
let code = fs.readFileSync('src/components/canvas/FireworksCanvas.tsx', 'utf8');
code = code.replace("if (rk.y <= rk.ty) {", "if (rk.y <= rk.ty) {\n          // Flash effect\n          const g = cx.createRadialGradient(rk.x, rk.y, 0, rk.x, rk.y, 400 * DPR);\n          g.addColorStop(0, 'rgba(255,255,255,0.4)');\n          g.addColorStop(1, 'rgba(255,255,255,0)');\n          cx.fillStyle = g;\n          cx.fillRect(0, 0, W, H);\n");
fs.writeFileSync('src/components/canvas/FireworksCanvas.tsx', code);
