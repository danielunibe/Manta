import React, { useEffect, useRef } from 'react';

interface FireworksCanvasProps {
  active: boolean;
  burstTrigger?: number;
}

// Shell types for realistic fireworks repertoire
type ShellType = 'peony' | 'willow' | 'chrysanthemum' | 'ring' | 'crossette' | 'strobe';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  coreColor: string;
  size: number;
  life: number;
  maxLife: number;
  drag: number;
  gravity: number;
  trail: Array<{ x: number; y: number }>;
  maxTrail: number;
  flicker: boolean;
  flickerSpeed: number;
  flickerPhase: number;
  canCrackle?: boolean;
  hasCrackled?: boolean;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  shellType: ShellType;
  palette: string[];
  trail: Array<{ x: number; y: number }>;
  life: number;
}

interface Flash {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

interface SmokePuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({ active, burstTrigger = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(performance.now());
  const timerRef = useRef<number>(0);

  // Palettes strictly curated without purple/magenta:
  // Pure Gold, Emerald Green, Imperial Crimson, Platinum White, Sapphire Blue, Warm Amber
  const PALETTES = [
    // 0: Tricolor Mexicano Clásico (Verde Esmeralda, Blanco Puro, Rojo Carmín, Oro)
    ['#00a859', '#ffffff', '#e61c24', '#ffd700'],
    // 1: Gran Corona de Oro (Brocade Willow / Kamuro)
    ['#ffe17d', '#ffb703', '#ffd000', '#ffffff', '#ff9e00'],
    // 2: Zafiro Real & Platino Celestial
    ['#0077b6', '#00b4d8', '#90e0ef', '#ffffff', '#ffd166'],
    // 3: Fuego Solar & Ámbar Volcánico
    ['#ff4800', '#ff7b00', '#ffaa00', '#ffd000', '#ffffff'],
    // 4: Esmeralda Titán & Oro Puro
    ['#00c853', '#69f0ae', '#ffd700', '#ffffff', '#ffb703'],
    // 5: Rubí Carmín & Oro Champán
    ['#d90429', '#ef233c', '#ffd166', '#ffffff', '#ffb703']
  ];

  const sparksRef = useRef<Spark[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const flashesRef = useRef<Flash[]>([]);
  const smokeRef = useRef<SmokePuff[]>([]);

  // Spawn smoke puff illuminated by firework
  const addSmoke = (x: number, y: number, color: string, dpr: number) => {
    smokeRef.current.push({
      x: x + (Math.random() - 0.5) * 30 * dpr,
      y: y + (Math.random() - 0.5) * 30 * dpr,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: -0.15 * dpr - Math.random() * 0.2 * dpr,
      radius: (25 + Math.random() * 35) * dpr,
      maxRadius: (90 + Math.random() * 60) * dpr,
      color,
      alpha: 0.18 + Math.random() * 0.12,
      life: 0,
      maxLife: 90 + Math.random() * 60
    });

    if (smokeRef.current.length > 40) {
      smokeRef.current.shift();
    }
  };

  // Create explosion burst of a specific shell type
  const burst = (
    x: number,
    y: number,
    palette: string[],
    shellType: ShellType = 'peony',
    power = 1.0,
    dpr = 1
  ) => {
    // Add sky flash
    flashesRef.current.push({
      x,
      y,
      radius: (240 + Math.random() * 150) * power * dpr,
      color: palette[0] || '#ffffff',
      alpha: 0.45,
      decay: 0.035
    });

    // Add multiple soft smoke clouds illuminated by the burst
    for (let s = 0; s < 3; s++) {
      addSmoke(x, y, palette[s % palette.length], dpr);
    }

    let count = 100;
    if (shellType === 'willow') count = 145;
    if (shellType === 'chrysanthemum') count = 125;
    if (shellType === 'crossette') count = 80;
    if (shellType === 'ring') count = 90;
    if (shellType === 'strobe') count = 110;

    for (let i = 0; i < count; i++) {
      let angle = Math.random() * Math.PI * 2;
      let speed = (2 + Math.random() * 7) * power * dpr;
      let drag = 0.965;
      let gravity = 0.055 * dpr;
      let maxLife = 55 + Math.random() * 40;
      let maxTrail = 5;
      let flicker = false;
      let canCrackle = false;
      let size = (1.5 + Math.random() * 1.8) * dpr;
      let color = palette[i % palette.length];
      const coreColor = '#ffffff';

      switch (shellType) {
        case 'willow':
          // Long glittering golden streamers that droop gracefully like golden rain
          speed = (1.8 + Math.random() * 5.2) * power * dpr;
          drag = 0.978;
          gravity = 0.04 * dpr;
          maxLife = 90 + Math.random() * 55;
          maxTrail = 9;
          flicker = Math.random() < 0.6;
          size = (1.8 + Math.random() * 1.5) * dpr;
          color = Math.random() < 0.8 ? '#ffd56b' : '#ffffff';
          break;

        case 'chrysanthemum':
          // Long dense streaks with strong trails
          speed = (2.5 + Math.random() * 6.5) * power * dpr;
          drag = 0.962;
          gravity = 0.05 * dpr;
          maxLife = 65 + Math.random() * 35;
          maxTrail = 7;
          size = (1.6 + Math.random() * 1.6) * dpr;
          break;

        case 'ring': {
          // Circular shockwave ring + small core
          if (i < count * 0.75) {
            angle = (i / (count * 0.75)) * Math.PI * 2;
            speed = (5.5 + (Math.random() - 0.5) * 0.6) * power * dpr;
            maxLife = 60 + Math.random() * 20;
            maxTrail = 4;
            color = palette[0];
          } else {
            speed = (1.2 + Math.random() * 2.5) * power * dpr;
            maxLife = 40 + Math.random() * 20;
            maxTrail = 3;
            color = palette[1 % palette.length];
          }
          break;
        }

        case 'crossette':
          // High speed stars that will burst/crackle into micro-stars
          speed = (3.5 + Math.random() * 5) * power * dpr;
          drag = 0.968;
          maxLife = 35 + Math.random() * 20;
          maxTrail = 6;
          canCrackle = true;
          size = 2.2 * dpr;
          break;

        case 'strobe':
          // Twinkling glitter stars that blink
          speed = (2 + Math.random() * 6) * power * dpr;
          drag = 0.955;
          gravity = 0.035 * dpr;
          maxLife = 70 + Math.random() * 45;
          maxTrail = 4;
          flicker = true;
          color = Math.random() < 0.5 ? '#ffffff' : palette[i % palette.length];
          break;

        case 'peony':
        default:
          speed = (2 + Math.random() * 7.5) * power * dpr;
          drag = 0.96;
          maxLife = 55 + Math.random() * 30;
          maxTrail = 5;
          break;
      }

      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        coreColor,
        size,
        life: 0,
        maxLife,
        drag,
        gravity,
        trail: [],
        maxTrail,
        flicker,
        flickerSpeed: 0.2 + Math.random() * 0.3,
        flickerPhase: Math.random() * Math.PI * 2,
        canCrackle,
        hasCrackled: false
      });
    }

    // Safety cap
    if (sparksRef.current.length > 1600) {
      sparksRef.current.splice(0, sparksRef.current.length - 1600);
    }
  };

  // Spawn micro crackle burst from dying crossette spark
  const crackle = (x: number, y: number, color: string, dpr: number) => {
    for (let c = 0; c < 5; c++) {
      const a = Math.random() * Math.PI * 2;
      const s = (1.5 + Math.random() * 3.5) * dpr;
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        color: Math.random() < 0.6 ? '#ffffff' : color,
        coreColor: '#ffffff',
        size: (1.2 + Math.random() * 1.2) * dpr,
        life: 0,
        maxLife: 16 + Math.random() * 12,
        drag: 0.92,
        gravity: 0.04 * dpr,
        trail: [],
        maxTrail: 3,
        flicker: true,
        flickerSpeed: 0.5,
        flickerPhase: Math.random() * Math.PI * 2
      });
    }
  };

  // Launch rocket from bottom
  const launchRocket = (tx: number, ty: number, h: number, dpr = 1) => {
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const shellTypes: ShellType[] = ['willow', 'peony', 'chrysanthemum', 'ring', 'crossette', 'strobe'];
    const shellType = shellTypes[Math.floor(Math.random() * shellTypes.length)];

    const startX = tx + (Math.random() - 0.5) * 80 * dpr;
    const distanceY = h - ty;
    // Calculate initial velocity so rocket naturally slows down near peak
    const vy = -Math.sqrt(2 * 0.12 * dpr * distanceY) * (0.95 + Math.random() * 0.1);

    rocketsRef.current.push({
      x: startX,
      y: h + 15 * dpr,
      vx: (tx - startX) / (Math.abs(vy) * 16) + (Math.random() - 0.5) * 0.6 * dpr,
      vy,
      targetY: ty,
      color: palette[0],
      shellType,
      palette,
      trail: [],
      life: 0
    });
  };

  // Trigger grand burst sequence on interaction / pulse
  useEffect(() => {
    if (burstTrigger > 0 && canvasRef.current) {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth * dpr;
      const h = window.innerHeight * dpr;

      // Grand simultaneous fireworks barrage (Tricolor Mexicano + Brocade Gold + Amber Sun)
      burst(w * 0.25, h * 0.25, PALETTES[0], 'willow', 1.35, dpr);
      burst(w * 0.75, h * 0.28, PALETTES[0], 'chrysanthemum', 1.35, dpr);
      setTimeout(() => {
        burst(w * 0.50, h * 0.20, PALETTES[1], 'ring', 1.4, dpr);
      }, 160);
      setTimeout(() => {
        burst(w * 0.35, h * 0.38, PALETTES[3], 'crossette', 1.25, dpr);
        burst(w * 0.65, h * 0.36, PALETTES[4], 'strobe', 1.25, dpr);
      }, 340);
    }
  }, [burstTrigger]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d', { alpha: true });
    if (!cx) return;

    let W = 0;
    let H = 0;
    let DPR = 1;

    const measure = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = cv.width = Math.round(window.innerWidth * DPR);
      H = cv.height = Math.round(window.innerHeight * DPR);
      cv.style.width = window.innerWidth + 'px';
      cv.style.height = window.innerHeight + 'px';
    };

    measure();
    window.addEventListener('resize', measure);

    const autoLaunch = () => {
      // Launch in left or right sector towards sky center
      const tx = (0.15 + Math.random() * 0.7) * W;
      const ty = (0.12 + Math.random() * 0.38) * H;
      launchRocket(tx, ty, H, DPR);
    };

    const loop = (t: number) => {
      const dt = Math.min(34, t - prevTimeRef.current) / 16.7;
      prevTimeRef.current = t;

      cx.clearRect(0, 0, W, H);

      // Automatic launch cadence
      if (active) {
        timerRef.current += dt;
        if (timerRef.current > 75) {
          timerRef.current = Math.random() * 25; // Variable rhythm
          autoLaunch();
          if (Math.random() < 0.35) {
            // Secondary companion rocket for dynamic duos
            setTimeout(() => {
              if (active) autoLaunch();
            }, 250);
          }
        }
      }

      // 1. RENDER SMOKE PUFFS (Layered background ambient depth)
      cx.globalCompositeOperation = 'screen';
      const smoke = smokeRef.current;
      for (let s = smoke.length - 1; s >= 0; s--) {
        const sm = smoke[s];
        sm.life += dt;
        sm.x += sm.vx * dt;
        sm.y += sm.vy * dt;
        sm.radius += 0.25 * DPR * dt;

        const progress = sm.life / sm.maxLife;
        if (progress >= 1) {
          smoke.splice(s, 1);
          continue;
        }

        const alpha = sm.alpha * (1 - progress) * (1 - progress);
        const grad = cx.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, sm.radius);
        grad.addColorStop(0, `rgba(40, 50, 60, ${alpha * 0.5})`);
        grad.addColorStop(0.6, `rgba(25, 30, 40, ${alpha * 0.25})`);
        grad.addColorStop(1, 'rgba(10, 15, 20, 0)');

        cx.fillStyle = grad;
        cx.beginPath();
        cx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
        cx.fill();
      }

      // 2. RENDER SKY FLASHES (Ambient glow illuminating the night)
      const flashes = flashesRef.current;
      for (let f = flashes.length - 1; f >= 0; f--) {
        const fl = flashes[f];
        fl.alpha -= fl.decay * dt;
        if (fl.alpha <= 0) {
          flashes.splice(f, 1);
          continue;
        }

        const grad = cx.createRadialGradient(fl.x, fl.y, 0, fl.x, fl.y, fl.radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${fl.alpha * 0.7})`);
        if (fl.color.startsWith('#')) {
          grad.addColorStop(0.35, `rgba(255, 225, 150, ${fl.alpha * 0.35})`);
        } else {
          grad.addColorStop(0.35, fl.color.replace(')', `, ${fl.alpha * 0.4})`).replace('rgb', 'rgba'));
        }
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        cx.fillStyle = grad;
        cx.beginPath();
        cx.arc(fl.x, fl.y, fl.radius, 0, Math.PI * 2);
        cx.fill();
      }

      // 3. RENDER ASCENDING ROCKETS
      cx.globalCompositeOperation = 'lighter';
      const rockets = rocketsRef.current;
      for (let r = rockets.length - 1; r >= 0; r--) {
        const rk = rockets[r];
        rk.life += dt;
        rk.trail.unshift({ x: rk.x, y: rk.y });
        if (rk.trail.length > 9) rk.trail.pop();

        // Gravity slowing the rocket
        rk.vy += 0.11 * DPR * dt;
        rk.x += rk.vx * dt;
        rk.y += rk.vy * dt;

        // Draw ascending fiery trail
        if (rk.trail.length > 1) {
          cx.beginPath();
          cx.moveTo(rk.trail[0].x, rk.trail[0].y);
          for (let i = 1; i < rk.trail.length; i++) {
            cx.lineTo(rk.trail[i].x, rk.trail[i].y);
          }
          cx.strokeStyle = '#ffd9a0';
          cx.lineWidth = 2.2 * DPR;
          cx.stroke();

          // Core bright white head
          cx.beginPath();
          cx.moveTo(rk.trail[0].x, rk.trail[0].y);
          cx.lineTo(rk.trail[1].x, rk.trail[1].y);
          cx.strokeStyle = '#ffffff';
          cx.lineWidth = 1.4 * DPR;
          cx.stroke();
        }

        // Rocket spark shedding
        if (Math.random() < 0.7) {
          sparksRef.current.push({
            x: rk.x + (Math.random() - 0.5) * 4 * DPR,
            y: rk.y + 4 * DPR,
            vx: (Math.random() - 0.5) * 1.2 * DPR,
            vy: (Math.random() * 2 + 1) * DPR,
            color: '#ffa500',
            coreColor: '#ffffff',
            size: (1 + Math.random()) * DPR,
            life: 0,
            maxLife: 15 + Math.random() * 10,
            drag: 0.94,
            gravity: 0.05 * DPR,
            trail: [],
            maxTrail: 2,
            flicker: true,
            flickerSpeed: 0.4,
            flickerPhase: Math.random() * Math.PI * 2
          });
        }

        // Explode when reaching apex or targetY
        if (rk.vy >= -0.5 || rk.y <= rk.targetY) {
          burst(rk.x, rk.y, rk.palette, rk.shellType, 1.1 + Math.random() * 0.3, DPR);
          rockets.splice(r, 1);
        }
      }

      // 4. RENDER EXPLODING SPARKS & GLITTER TRAILS
      const sparks = sparksRef.current;
      for (let p = sparks.length - 1; p >= 0; p--) {
        const pt = sparks[p];
        pt.life += dt;

        // Record motion trail
        if (pt.maxTrail > 0) {
          pt.trail.unshift({ x: pt.x, y: pt.y });
          if (pt.trail.length > pt.maxTrail) pt.trail.pop();
        }

        // Physical updates
        pt.vx *= Math.pow(pt.drag, dt);
        pt.vy = pt.vy * Math.pow(pt.drag, dt) + pt.gravity * dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;

        const k = 1 - pt.life / pt.maxLife;

        // Crossette secondary crackle pop
        if (pt.canCrackle && !pt.hasCrackled && k < 0.25) {
          pt.hasCrackled = true;
          crackle(pt.x, pt.y, pt.color, DPR);
        }

        if (k <= 0) {
          sparks.splice(p, 1);
          continue;
        }

        // Sparkle / Twinkle / Strobe calculation
        let alpha = Math.max(0, k);
        if (pt.flicker) {
          const flickerVal = Math.sin(pt.life * pt.flickerSpeed + pt.flickerPhase);
          alpha *= flickerVal > 0.1 ? 1 : 0.2;
        }

        cx.globalAlpha = alpha;

        // Draw luminous trail ribbon
        if (pt.trail.length > 1) {
          cx.beginPath();
          cx.moveTo(pt.x, pt.y);
          for (let i = 0; i < pt.trail.length; i++) {
            cx.lineTo(pt.trail[i].x, pt.trail[i].y);
          }
          cx.strokeStyle = pt.color;
          cx.lineWidth = Math.max(0.6 * DPR, pt.size * k * 0.85);
          cx.stroke();

          // Bright center line
          cx.strokeStyle = pt.coreColor;
          cx.lineWidth = Math.max(0.3 * DPR, pt.size * k * 0.4);
          cx.stroke();
        }

        // Glowing spark head with soft halo
        cx.fillStyle = pt.color;
        cx.beginPath();
        cx.arc(pt.x, pt.y, pt.size * k * 1.3, 0, Math.PI * 2);
        cx.fill();

        // White hot center
        cx.fillStyle = pt.coreColor;
        cx.beginPath();
        cx.arc(pt.x, pt.y, Math.max(0.4 * DPR, pt.size * k * 0.6), 0, Math.PI * 2);
        cx.fill();
      }

      cx.globalAlpha = 1;
      cx.globalCompositeOperation = 'source-over';

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', measure);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
};
