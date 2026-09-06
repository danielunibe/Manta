import React, { useEffect, useRef, useState } from 'react';

interface StreetBokehCanvasProps {
  active: boolean;
  burstTrigger?: number;
}

interface GhostData {
  id: number;
  mode: 'rise' | 'cross';
  size: number;
  maxOp: number;
  ph: number;
  swayF: number;
  swayA: number;
  flip: boolean;
  startX: number;
  startY?: number;
  baseY?: number;
  rise?: number;
  drift?: number;
  vx?: number;
  dur: number;
  t: number;
  x: number;
  y: number;
  opacity: number;
}

export const StreetBokehCanvas: React.FC<StreetBokehCanvasProps> = ({ active, burstTrigger = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const ghostsRef = useRef<GhostData[]>([]);
  const [ghostsState, setGhostsState] = useState<GhostData[]>([]);
  const ghostElsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const lastTimeRef = useRef<number>(0);
  const nextShootRef = useRef<number>(6000);
  const shootRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number } | null>(null);

  // Helper random
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  // Initialize a ghost
  const initGhost = (gh: Partial<GhostData>, stagger: boolean, w: number, h: number): GhostData => {
    const mode = Math.random() < 0.55 ? 'rise' : 'cross';
    const size = rand(46, 118);
    const maxOp = size < 64 ? rand(0.35, 0.5) : rand(0.6, 0.88);
    const ph = rand(0, 6.283);
    const swayF = rand(0.6, 1.2);
    const swayA = rand(8, 26);
    const flip = Math.random() < 0.5;

    let startX = 0;
    let startY: number | undefined;
    let baseY: number | undefined;
    let rise: number | undefined;
    let drift: number | undefined;
    let vx: number | undefined;
    let dur = 10;

    if (mode === 'rise') {
      startX = rand(w * 0.06, w * 0.9);
      startY = rand(h * 0.7, h * 0.92);
      rise = rand(26, 50);
      drift = rand(-9, 9);
      const dist = rand(h * 0.5, h * 0.75);
      dur = Math.min(24, Math.max(10, dist / rise));
    } else {
      const dir = Math.random() < 0.5 ? 1 : -1;
      startX = dir === 1 ? -(size + 30) : w + size + 30;
      baseY = rand(h * 0.16, h * 0.58);
      vx = dir * rand(26, 55);
      dur = (w + size * 2 + 80) / Math.abs(vx);
    }

    const t = stagger ? rand(0, dur * 0.55) : 0;

    return {
      id: gh.id ?? Math.random(),
      mode,
      size,
      maxOp,
      ph,
      swayF,
      swayA,
      flip,
      startX,
      startY,
      baseY,
      rise,
      drift,
      vx,
      dur,
      t,
      x: startX,
      y: startY || baseY || 0,
      opacity: 0
    };
  };

  const envOpacity = (k: number) => {
    const fi = Math.min(k / 0.18, 1);
    const fo = Math.min((1 - k) / 0.22, 1);
    return Math.max(0, Math.min(fi, fo));
  };

  // Burst trigger: spawn shooting star and extra bat
  useEffect(() => {
    if (burstTrigger > 0 && canvasRef.current) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      shootRef.current = {
        x: w * (0.6 + Math.random() * 0.3),
        y: h * (0.05 + Math.random() * 0.15),
        vx: -(7 + Math.random() * 5),
        vy: 2.0 + Math.random() * 1.5,
        life: 80
      };
    }
  }, [burstTrigger]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let DPR = Math.min(window.devicePixelRatio || 1, 2);

    let stars: Array<{ x: number; y: number; r: number; p: number; s: number }> = [];
    let bats: Array<{ x: number; base: number; y: number; s: number; vx: number; ph: number; fs: number; amp: number }> = [];

    const makeStars = () => {
      stars = [];
      const n = Math.min(220, Math.floor((W * H) / 9000));
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.58,
          r: Math.random() * 1.3 + 0.3,
          p: Math.random() * 6.283,
          s: 0.4 + Math.random() * 1.4
        });
      }
    };

    const spawnBat = () => {
      const dir = Math.random() < 0.5 ? -1 : 1;
      bats.push({
        x: dir === 1 ? -70 : W + 70,
        base: H * (0.08 + Math.random() * 0.38),
        y: 0,
        s: 0.8 + Math.random() * 1.3,
        vx: (1 + Math.random() * 1.5) * dir,
        ph: Math.random() * 6.283,
        fs: 9 + Math.random() * 6,
        amp: 8 + Math.random() * 20
      });
    };

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.floor(W * DPR);
      cv.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      makeStars();
    };

    resize();
    window.addEventListener('resize', resize);

    // Initial bats
    for (let i = 0; i < 5; i++) {
      spawnBat();
      bats[i].x = Math.random() * W;
    }

    // Initial ghosts
    const initialGhosts: GhostData[] = [];
    for (let g = 0; g < 4; g++) {
      initialGhosts.push(initGhost({ id: g }, true, W, H));
    }
    ghostsRef.current = initialGhosts;
    setGhostsState(initialGhosts);

    const drawBat = (b: typeof bats[0], ts: number) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(b.s * (b.vx < 0 ? -1 : 1), b.s);
      const f = Math.sin(ts * b.fs + b.ph);
      const wy = -2 + f * 5;
      const wm = -1 + f * 2.5;

      ctx.fillStyle = 'rgba(9,4,18,.93)';
      ctx.beginPath();
      ctx.moveTo(0, -1);
      ctx.quadraticCurveTo(-5, wm - 3, -13, wy);
      ctx.quadraticCurveTo(-9, wm + 2, -5, 2);
      ctx.quadraticCurveTo(-2, 3, 0, 2);
      ctx.moveTo(0, -1);
      ctx.quadraticCurveTo(5, wm - 3, 13, wy);
      ctx.quadraticCurveTo(9, wm + 2, 5, 2);
      ctx.quadraticCurveTo(2, 3, 0, 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 0.5, 1.8, 3, 0, 0, 6.283);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-1.4, -2);
      ctx.lineTo(-2.6, -4.6);
      ctx.lineTo(-0.4, -2.7);
      ctx.moveTo(1.4, -2);
      ctx.lineTo(2.6, -4.6);
      ctx.lineTo(0.4, -2.7);
      ctx.fill();
      ctx.restore();
    };

    const loop = (t: number) => {
      const ts = t / 1000;
      const dt = Math.min(0.05, lastTimeRef.current ? (t - lastTimeRef.current) / 1000 : 0.016);
      lastTimeRef.current = t;

      ctx.clearRect(0, 0, W, H);

      // Twinkling stars
      ctx.fillStyle = '#ffeecf';
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        ctx.globalAlpha = 0.25 + 0.75 * Math.abs(Math.sin(ts * s.s + s.p));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Occasional shooting star
      if (!shootRef.current && t > nextShootRef.current && active) {
        shootRef.current = {
          x: W * (0.4 + Math.random() * 0.55),
          y: H * (0.05 + Math.random() * 0.18),
          vx: -(5 + Math.random() * 4),
          vy: 1.5 + Math.random() * 1.2,
          life: 70
        };
        nextShootRef.current = t + 9000 + Math.random() * 12000;
      }

      if (shootRef.current) {
        const sh = shootRef.current;
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life--;
        const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        g.addColorStop(0, 'rgba(255,255,255,.9)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        ctx.stroke();
        if (sh.life <= 0 || sh.x < -120) shootRef.current = null;
      }

      // Bats flying
      for (let j = 0; j < bats.length; j++) {
        const b = bats[j];
        if (active) {
          b.x += b.vx;
          b.y = b.base + Math.sin(ts * 1.3 + b.ph) * b.amp;
          if (b.vx > 0 && b.x > W + 70) {
            b.x = -70;
            b.base = H * (0.08 + Math.random() * 0.38);
          }
          if (b.vx < 0 && b.x < -70) {
            b.x = W + 70;
            b.base = H * (0.08 + Math.random() * 0.38);
          }
        }
        drawBat(b, ts);
      }

      // Update ghosts DOM directly for ultra-smooth 60fps
      if (active) {
        const ghosts = ghostsRef.current;
        for (let q = 0; q < ghosts.length; q++) {
          const gh = ghosts[q];
          gh.t += dt;
          const k = gh.t / gh.dur;
          if (k >= 1) {
            ghosts[q] = initGhost({ id: gh.id }, false, W, H);
            continue;
          }

          let x = 0;
          let y = 0;
          if (gh.mode === 'rise') {
            x = gh.startX + (gh.drift || 0) * gh.t + Math.sin(gh.t * gh.swayF + gh.ph) * gh.swayA;
            y = (gh.startY || 0) - (gh.rise || 0) * gh.t;
          } else {
            x = gh.startX + (gh.vx || 0) * gh.t;
            y = (gh.baseY || 0) + Math.sin(gh.t * gh.swayF + gh.ph) * gh.swayA;
          }

          const op = gh.maxOp * envOpacity(k);
          const el = ghostElsRef.current[gh.id];
          if (el) {
            el.style.transform = `translate3d(${(x - gh.size / 2).toFixed(1)}px, ${(y - gh.size * 0.575).toFixed(1)}px, 0)${gh.flip ? ' scaleX(-1)' : ''}`;
            el.style.opacity = op.toFixed(3);
            el.style.width = `${gh.size}px`;
            el.style.filter =
              gh.size < 64
                ? 'blur(1.2px) drop-shadow(0 0 8px rgba(255,255,255,.3))'
                : 'drop-shadow(0 0 12px rgba(255,255,255,.35))';
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 overflow-hidden ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ background: '#000000' }}
    >
      {/* 1. FAINT MIST IN THE DISTANCE */}
      <div
        className="absolute z-[1] h-[70px] w-[46vw] rounded-full"
        style={{
          top: '16%',
          filter: 'blur(22px)',
          opacity: 0.05,
          background: 'radial-gradient(50% 100% at 50% 50%, #ffffff, transparent 70%)',
          animation: 'halloweenCloudMove 70s linear infinite'
        }}
      />
      <div
        className="absolute z-[1] h-[52px] w-[34vw] rounded-full"
        style={{
          top: '30%',
          filter: 'blur(22px)',
          opacity: 0.04,
          background: 'radial-gradient(50% 100% at 50% 50%, #ffffff, transparent 70%)',
          animation: 'halloweenCloudMove 95s linear infinite reverse'
        }}
      />

      {/* 2. STARS & BATS CANVAS */}
      <canvas ref={canvasRef} id="fx" className="absolute inset-0 z-[3] w-full h-full" />

      {/* 3. GHOSTS SVG DEFINITIONS & CONTAINERS */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="gGradHalloween" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c8c8cf" />
          </linearGradient>
        </defs>
      </svg>

      <div id="ghosts" className="absolute inset-0 z-[4] pointer-events-none">
        {ghostsState.map((gh) => (
          <div
            key={gh.id}
            ref={(el) => (ghostElsRef.current[gh.id] = el)}
            className="absolute left-0 top-0 will-change-transform pointer-events-none"
            style={{
              opacity: 0,
              transform: 'translate3d(-200px, -200px, 0)'
            }}
          >
            <svg viewBox="0 0 100 115" className="w-full h-auto" aria-hidden="true">
              <path
                d="M50 4 C27 4 18 24 18 48 L18 92 q8 14 16 0 q8 14 16 0 q8 14 16 0 q8 14 16 0 L82 48 C82 24 73 4 50 4 Z"
                fill="url(#gGradHalloween)"
              />
              <ellipse cx="37" cy="46" rx="5.5" ry="9" fill="#000000" />
              <ellipse cx="63" cy="46" rx="5.5" ry="9" fill="#000000" />
              <ellipse cx="50" cy="63" rx="4.5" ry="6" fill="#000000" opacity=".85" />
            </svg>
          </div>
        ))}
      </div>

      {/* 4. SUBTLE MID FOG */}
      <div
        className="absolute left-[-25%] w-[150%] pointer-events-none z-[5] bottom-[10%] h-[30%]"
        style={{
          filter: 'blur(28px)',
          opacity: 0.12,
          background: `
            radial-gradient(45% 60% at 20% 70%, rgba(255,255,255,.12), transparent 70%),
            radial-gradient(50% 65% at 80% 75%, rgba(255,255,255,.08), transparent 70%)
          `,
          animation: 'halloweenDriftA 46s ease-in-out infinite alternate'
        }}
      />

      {/* 5. GROUND ELEMENTS (NO HILLS, ANCHORED SILHOUETTES & GLOWING PUMPKINS) */}
      <svg
        className="absolute left-0 right-0 bottom-0 z-[6] w-full h-[34vh] min-h-[190px] block pointer-events-none"
        viewBox="0 0 1440 320"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="pumpGlow" x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle Ground Baseline */}
        <rect x="0" y="312" width="1440" height="8" fill="#000000" />

        {/* Withered Tree */}
        <g stroke="#060606" fill="none" strokeLinecap="round">
          <path d="M1150 322 C1146 272 1148 240 1152 210" strokeWidth="17" />
          <path
            d="M1152 210 C1150 185 1135 165 1112 150 M1152 210 C1158 180 1178 160 1200 148 M1150 252 C1128 242 1112 228 1100 210 M1151 262 C1172 252 1188 242 1204 226 M1112 150 C1100 138 1096 124 1096 112 M1200 148 C1212 136 1218 122 1220 110"
            strokeWidth="7"
          />
          <path
            d="M1096 112 C1090 100 1082 94 1072 90 M1220 110 C1228 98 1238 92 1248 88 M1100 210 C1088 204 1080 196 1074 186 M1204 226 C1216 220 1226 212 1232 202 M1178 160 C1186 148 1188 136 1186 124"
            strokeWidth="4"
          />
        </g>

        {/* Tombstones */}
        <g fill="#070707">
          <path d="M240 320 L240 262 Q240 240 262 240 Q284 240 284 262 L284 320 Z" />
          <path
            d="M410 322 L410 274 Q410 258 426 258 Q442 258 442 274 L442 322 Z"
            transform="rotate(-5 426 320)"
          />
          <path d="M600 320 L600 268 L588 268 L588 254 L600 254 L600 236 L614 236 L614 254 L626 254 L626 268 L614 268 L614 320 Z" />
          <path
            d="M880 320 L880 268 Q880 248 900 248 Q920 248 920 268 L920 320 Z"
            transform="rotate(4 900 320)"
          />
          <path
            d="M1310 322 L1310 276 Q1310 260 1326 260 Q1342 260 1342 276 L1342 322 Z"
            transform="rotate(-3 1326 320)"
          />
        </g>

        {/* Big Pumpkin */}
        <g filter="url(#pumpGlow)" transform="translate(330 292)">
          <ellipse cx="0" cy="0" rx="22" ry="17" fill="#ff7a1a" />
          <ellipse cx="-10" cy="0" rx="9" ry="16" fill="#e05e08" opacity=".75" />
          <ellipse cx="10" cy="0" rx="9" ry="16" fill="#e05e08" opacity=".75" />
          <rect x="-3" y="-23" width="6" height="9" rx="2.5" fill="#3f6b1f" />
          <g className="animate-[pumpFlicker_4s_ease-in-out_infinite]" fill="#ffd94f">
            <path d="M-11 -3 L-5.5 -8.5 L-1 -3 Z" />
            <path d="M1 -3 L6.5 -8.5 L11 -3 Z" />
            <path d="M-8 5 L8 5 Q5 11 0 11 Q-5 11 -8 5 Z" />
          </g>
        </g>

        {/* Small Pumpkin */}
        <g filter="url(#pumpGlow)" transform="translate(372 302) scale(.62)">
          <ellipse cx="0" cy="0" rx="22" ry="17" fill="#ff8a2e" />
          <ellipse cx="-10" cy="0" rx="9" ry="16" fill="#e05e08" opacity=".75" />
          <ellipse cx="10" cy="0" rx="9" ry="16" fill="#e05e08" opacity=".75" />
          <rect x="-3" y="-23" width="6" height="9" rx="2.5" fill="#3f6b1f" />
          <g
            className="animate-[pumpFlicker_3.2s_ease-in-out_infinite]"
            style={{ animationDelay: '-1.2s' }}
            fill="#ffd94f"
          >
            <path d="M-11 -3 L-5.5 -8.5 L-1 -3 Z" />
            <path d="M1 -3 L6.5 -8.5 L11 -3 Z" />
            <path d="M-8 5 L8 5 Q5 11 0 11 Q-5 11 -8 5 Z" />
          </g>
        </g>

        {/* Right Pumpkin */}
        <g filter="url(#pumpGlow)" transform="translate(1058 300) scale(.8)">
          <ellipse cx="0" cy="0" rx="22" ry="17" fill="#ff7a1a" />
          <ellipse cx="-10" cy="0" rx="9" ry="16" fill="#e05e08" opacity=".75" />
          <ellipse cx="10" cy="0" rx="9" ry="16" fill="#e05e08" opacity=".75" />
          <rect x="-3" y="-23" width="6" height="9" rx="2.5" fill="#3f6b1f" />
          <g
            className="animate-[pumpFlicker_3.2s_ease-in-out_infinite]"
            style={{ animationDelay: '-1.2s' }}
            fill="#ffd94f"
          >
            <path d="M-11 -3 L-5.5 -8.5 L-1 -3 Z" />
            <path d="M1 -3 L6.5 -8.5 L11 -3 Z" />
            <path d="M-8 5 L8 5 Q5 11 0 11 Q-5 11 -8 5 Z" />
          </g>
        </g>
      </svg>

      {/* 6. SUBTLE FRONT FOG */}
      <div
        className="absolute left-[-25%] w-[150%] pointer-events-none z-[7] bottom-[-6%] h-[20%]"
        style={{
          filter: 'blur(26px)',
          opacity: 0.08,
          background: `
            radial-gradient(35% 80% at 25% 85%, rgba(255,255,255,.25), transparent 70%),
            radial-gradient(40% 70% at 65% 90%, rgba(255,255,255,.18), transparent 70%)
          `,
          animation: 'halloweenDriftA 26s ease-in-out infinite alternate'
        }}
      />

      {/* 7. CINEMATIC VIGNETTE */}
      <div
        className="absolute inset-0 z-[8] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,.7) 100%)'
        }}
      />
    </div>
  );
};
