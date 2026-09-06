const fs = require('fs');
let code = fs.readFileSync('src/components/canvas/FireworksCanvas.tsx', 'utf8');
code = code.replace("if (rk.y <= rk.ty) {", "if (rk.y <= rk.ty) {\n          const g = cx.createRadialGradient(rk.x, rk.y, 0, rk.x, rk.y, 400 * DPR);\n          g.addColorStop(0, 'rgba(255,255,255,0.15)');\n          g.addColorStop(1, 'rgba(255,255,255,0)');\n          cx.fillStyle = g;\n          cx.fillRect(0, 0, W, H);\n");
// Make the explosion bigger
code = code.replace("90 + ((Math.random() * 60) | 0)", "160 + ((Math.random() * 80) | 0)");
code = code.replace("v = (1 + Math.random() * 4.2) * dpr * pow;", "v = (1.5 + Math.random() * 6.5) * dpr * pow;");
fs.writeFileSync('src/components/canvas/FireworksCanvas.tsx', code);
