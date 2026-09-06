const fs = require('fs');
let code = fs.readFileSync('src/components/canvas/RainCanvas.tsx', 'utf8');

code = code.replace(
  "let gotas: Array<{ x: number; y: number; l: number; v: number; o: number }> = [];",
  "let gotas: Array<{ x: number; y: number; l: number; v: number; o: number }> = [];\n    let nubes: Array<{ x: number; y: number; r: number; v: number; o: number }> = [];\n    let neblina: Array<{ x: number; y: number; r: number; v: number; o: number }> = [];"
);

code = code.replace(
  "for (let i = 0; i < n; i++) {",
  "for (let i = 0; i < 12; i++) {\n        nubes.push({\n          x: Math.random() * W,\n          y: (Math.random() * 0.4 - 0.1) * H,\n          r: (150 + Math.random() * 300) * DPR,\n          v: (0.1 + Math.random() * 0.3) * DPR,\n          o: 0.1 + Math.random() * 0.3\n        });\n      }\n      for (let i = 0; i < 8; i++) {\n        neblina.push({\n          x: Math.random() * W,\n          y: H - (Math.random() * 0.3) * H,\n          r: (200 + Math.random() * 400) * DPR,\n          v: (0.05 + Math.random() * 0.2) * DPR,\n          o: 0.05 + Math.random() * 0.15\n        });\n      }\n      for (let i = 0; i < n; i++) {"
);

code = code.replace(
  "if (flashRef.current > 0.02) {",
  "// Draw Nubes (Clouds)\n      for (let i = 0; i < nubes.length; i++) {\n        const cld = nubes[i];\n        if (active) cld.x -= cld.v * dt;\n        if (cld.x < -cld.r) cld.x = W + cld.r;\n        const fLit = flashRef.current > 0.05 ? flashRef.current * 0.25 : 0;\n        cx.globalAlpha = cld.o;\n        const grad = cx.createRadialGradient(cld.x, cld.y, 0, cld.x, cld.y, cld.r);\n        grad.addColorStop(0, `rgba(28, 42, 53, ${0.7 + fLit})`);\n        grad.addColorStop(1, 'rgba(28, 42, 53, 0)');\n        cx.fillStyle = grad;\n        cx.beginPath();\n        cx.arc(cld.x, cld.y, cld.r, 0, Math.PI * 2);\n        cx.fill();\n      }\n      cx.globalAlpha = 1;\n\n      if (flashRef.current > 0.02) {"
);

code = code.replace(
  "cx.stroke();\n      }",
  "cx.stroke();\n      }\n      \n      // Draw Neblina (Fog at bottom)\n      for (let i = 0; i < neblina.length; i++) {\n        const neb = neblina[i];\n        if (active) neb.x += neb.v * dt;\n        if (neb.x > W + neb.r) neb.x = -neb.r;\n        const fLit = flashRef.current > 0.05 ? flashRef.current * 0.15 : 0;\n        cx.globalAlpha = neb.o;\n        const grad = cx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);\n        grad.addColorStop(0, `rgba(180, 200, 215, ${0.4 + fLit})`);\n        grad.addColorStop(1, 'rgba(180, 200, 215, 0)');\n        cx.fillStyle = grad;\n        cx.beginPath();\n        cx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);\n        cx.fill();\n      }\n      cx.globalAlpha = 1;"
);

fs.writeFileSync('src/components/canvas/RainCanvas.tsx', code);
