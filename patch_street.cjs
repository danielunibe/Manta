const fs = require('fs');
let code = fs.readFileSync('src/components/canvas/StreetBokehCanvas.tsx', 'utf8');

code = code.replace(
  "const avesRef = useRef<Array<{ x: number; y: number; vx: number; ph: number; s: number }>>([]);",
  "const avesRef = useRef<Array<{ x: number; y: number; vx: number; ph: number; s: number }>>([]);\n  const polvoRef = useRef<Array<{ x: number; y: number; s: number; vx: number; vy: number; p: number }>>([]);\n  const cochesRef = useRef<Array<{ x: number; y: number; v: number; w: number; c: string; alpha: number }>>([]);"
);

code = code.replace(
  "const proxBandadaRef = useRef<number>(300);",
  "const proxBandadaRef = useRef<number>(300);\n  const proxCocheRef = useRef<number>(100);"
);

code = code.replace(
  "const bandada = () => {",
  "const cocheLuz = () => {\n    const dir = Math.random() < 0.5 ? 1 : -1;\n    cochesRef.current.push({\n      x: dir > 0 ? -0.3 : 1.3,\n      y: 0.7 + Math.random() * 0.2,\n      v: dir * (0.008 + Math.random() * 0.015),\n      w: 0.15 + Math.random() * 0.25,\n      c: dir > 0 ? '#ff1111' : '#ffe8b3',\n      alpha: 0.3 + Math.random() * 0.5\n    });\n  };\n\n  const bandada = () => {"
);

code = code.replace(
  "bandada();\n    }",
  "bandada();\n      cocheLuz();\n      cocheLuz();\n    }"
);

code = code.replace(
  "bokehRef.current = [];\n    for (let i = 0; i < 42; i++) {",
  "bokehRef.current = [];\n    polvoRef.current = [];\n    for (let i = 0; i < 150; i++) {\n      polvoRef.current.push({\n        x: Math.random(),\n        y: Math.random(),\n        s: Math.random() * 1.5,\n        vx: (Math.random() - 0.5) * 0.0005,\n        vy: (Math.random() - 0.5) * 0.0005,\n        p: Math.random() * 6.28\n      });\n    }\n    for (let i = 0; i < 42; i++) {"
);

code = code.replace(
  "proxBandadaRef.current -= dt;",
  "proxCocheRef.current -= dt;\n        if (proxCocheRef.current <= 0) {\n          proxCocheRef.current = 60 + Math.random() * 120;\n          cocheLuz();\n        }\n        proxBandadaRef.current -= dt;"
);

code = code.replace(
  "const aves = avesRef.current;",
  "// Draw Polvo (Dust)\n      const polvo = polvoRef.current;\n      cx.fillStyle = 'rgba(255,240,210,0.6)';\n      for (let i = 0; i < polvo.length; i++) {\n        const p = polvo[i];\n        if (active) {\n          p.x += p.vx * dt;\n          p.y += p.vy * dt;\n          p.p += 0.02 * dt;\n          if (p.x > 1) p.x = 0; else if (p.x < 0) p.x = 1;\n          if (p.y > 1) p.y = 0; else if (p.y < 0) p.y = 1;\n        }\n        const op = 0.2 + 0.8 * Math.abs(Math.sin(p.p));\n        cx.globalAlpha = op * (flashRef.current > 0.05 ? 1 : 0.4);\n        cx.beginPath();\n        cx.arc(p.x * W, p.y * H, p.s * DPR, 0, 6.283);\n        cx.fill();\n      }\n      cx.globalAlpha = 1;\n\n      // Draw Coches (Car light streaks)\n      const coches = cochesRef.current;\n      cx.globalCompositeOperation = 'screen';\n      for (let i = coches.length - 1; i >= 0; i--) {\n        const c = coches[i];\n        if (active) c.x += c.v * dt;\n        if (c.x < -0.4 || c.x > 1.4) {\n          coches.splice(i, 1);\n          continue;\n        }\n        const grad = cx.createLinearGradient((c.x - c.w/2)*W, 0, (c.x + c.w/2)*W, 0);\n        grad.addColorStop(0, 'rgba(0,0,0,0)');\n        grad.addColorStop(0.5, c.c);\n        grad.addColorStop(1, 'rgba(0,0,0,0)');\n        cx.fillStyle = grad;\n        cx.globalAlpha = c.alpha * (0.8 + 0.2 * Math.sin(t * 0.01));\n        cx.fillRect((c.x - c.w/2)*W, c.y*H, c.w*W, 6*DPR);\n      }\n      cx.globalCompositeOperation = 'source-over';\n      cx.globalAlpha = 1;\n\n      const aves = avesRef.current;"
);

fs.writeFileSync('src/components/canvas/StreetBokehCanvas.tsx', code);
