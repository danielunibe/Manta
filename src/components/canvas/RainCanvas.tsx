import React, { useEffect, useRef } from 'react';

interface RainCanvasProps {
  active: boolean;
  burstTrigger?: number;
}

interface NubeItem {
  sprite: HTMLCanvasElement;
  escala: number;
  x: number;
  y: number;
  vel: number;
  alfa: number;
  factViento: number;
}

interface GotaItem {
  x: number;
  y: number;
  z: number;
  vel: number;
  largo: number;
  alfa: number;
  grosor: number;
}

interface GotaCercanaItem {
  x: number;
  y: number;
  vel: number;
  largo: number;
  alfa: number;
  grosor: number;
}

interface SalpicaduraItem {
  x: number;
  y: number;
  r: number;
  vida: number;
  velR: number;
}

interface ParticulaItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vida: number;
}

interface NeblinaItem {
  sprite: HTMLCanvasElement;
  esc: number;
  x: number;
  y: number;
  vel: number;
  alfa: number;
}

interface CortinaItem {
  sprite: HTMLCanvasElement;
  alfa: number;
  vel: number;
  shear: number;
}

interface RayoPuntos {
  puntos: Array<{ x: number; y: number }>;
  ramas: Array<Array<{ x: number; y: number }>>;
  origen: { x: number; y: number };
}

interface RayoItem {
  datos: RayoPuntos;
  inicio: number;
  dur: number;
  pulsos: Array<{ t: number; amp: number }>;
}

export const RainCanvas: React.FC<RainCanvasProps> = ({ active, burstTrigger = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const triggerLightningRef = useRef<boolean>(false);
  const audioLevelRef = useRef(0);

  // Trigger immediate thunderbolt and wind surge on user click / burst
  useEffect(() => {
    if (burstTrigger > 0) {
      triggerLightningRef.current = true;
    }
  }, [burstTrigger]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const handleAudioLevel = (event: Event) => {
      const level = Number((event as CustomEvent<{ level?: number }>).detail?.level ?? 0);
      const nextLevel = Math.max(0, Math.min(1, level));
      audioLevelRef.current += (nextLevel - audioLevelRef.current) * 0.22;
    };
    window.addEventListener('manta:audio-level', handleAudioLevel);

    let W = 0;
    let H = 0;
    let dpr = 1;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const limitar = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

    /* ==================== ESTADO ==================== */
    let capasNube: NubeItem[] = [];
    let gotas: GotaItem[] = [];
    let gotasCercanas: GotaCercanaItem[] = [];
    let salpicaduras: SalpicaduraItem[] = []; // anillos en el suelo
    let particulas: ParticulaItem[] = []; // gotitas que rebotan
    let neblinas: NeblinaItem[] = [];
    let cortinas: CortinaItem[] = []; // cortinas de lluvia lejana
    let vineta: HTMLCanvasElement | null = null;
    let rayo: RayoItem | null = null;
    let proximoRayo = 0;
    let ultimo = performance.now() / 1000;

    /* ==================== VIENTO ==================== */
    function vientoEn(t: number) {
      const v =
        0.12 +
        0.28 * Math.sin(t * 0.1) +
        0.16 * Math.sin(t * 0.043 + 1.7) +
        0.1 * Math.sin(t * 0.27 + 0.6);
      return limitar(v, -0.3, 0.6);
    }

    /* ==================== SPRITES DE NUBE ==================== */
    function pintarMancha(g: CanvasRenderingContext2D, x: number, y: number, r: number, tono: number) {
      const gr = g.createRadialGradient(x, y, r * 0.05, x, y, r);
      gr.addColorStop(0, `rgba(200,210,230,${0.5 * tono})`);
      gr.addColorStop(0.65, `rgba(188,198,220,${0.27 * tono})`);
      gr.addColorStop(1, 'rgba(188,198,220,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }

    function crearNubeSprite(anch: number, alt: number, tono: number) {
      const c = document.createElement('canvas');
      c.width = anch;
      c.height = alt;
      const g = c.getContext('2d');
      if (!g) return c;
      const rBase = alt * 0.3;

      // Silueta principal: puffs a lo ancho
      const numManchas = 16 + Math.floor(Math.random() * 10);
      for (let i = 0; i < numManchas; i++) {
        const prog = i / (numManchas - 1);
        const bx = anch * (0.08 + prog * 0.84) + rand(-anch * 0.04, anch * 0.04);
        const by = alt * (0.52 + (Math.random() - 0.5) * 0.3);
        const r = rBase * rand(0.55, 1.15) * (1 - Math.abs(prog - 0.5) * 0.65);
        pintarMancha(g, bx, by, Math.max(6, r), tono);
      }
      // Puffs extra para dar volumen
      for (let i = 0; i < 9; i++) {
        pintarMancha(g, anch * rand(0.15, 0.85), alt * rand(0.35, 0.68), rBase * rand(0.3, 0.85), tono);
      }

      // Sombreado vertical: luz arriba, panza oscura debajo
      g.globalCompositeOperation = 'source-atop';
      const som = g.createLinearGradient(0, 0, 0, alt);
      som.addColorStop(0, `rgba(235,240,250,${0.2 * tono})`);
      som.addColorStop(0.42, 'rgba(0,0,0,0)');
      som.addColorStop(1, 'rgba(6,10,20,0.62)');
      g.fillStyle = som;
      g.fillRect(0, 0, anch, alt);

      // Bordes laterales suaves (evita cantos visibles del sprite)
      g.globalCompositeOperation = 'destination-out';
      const fi = g.createLinearGradient(0, 0, anch * 0.18, 0);
      fi.addColorStop(0, 'rgba(0,0,0,1)');
      fi.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = fi;
      g.fillRect(0, 0, anch * 0.18, alt);
      const fd = g.createLinearGradient(anch, 0, anch * 0.82, 0);
      fd.addColorStop(0, 'rgba(0,0,0,1)');
      fd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = fd;
      g.fillRect(anch * 0.82, 0, anch * 0.18, alt);
      g.globalCompositeOperation = 'source-over';

      return c;
    }

    function prepararCapaNube(
      cantidad: number,
      velMin: number,
      velMax: number,
      escMin: number,
      escMax: number,
      fracYmin: number,
      fracYmax: number,
      alfa: number,
      tono: number,
      factViento: number
    ): NubeItem[] {
      const capa: NubeItem[] = [];
      for (let i = 0; i < cantidad; i++) {
        const sprite = crearNubeSprite(460, 180, tono);
        const escala = rand(escMin, escMax);
        const anchura = sprite.width * escala;
        capa.push({
          sprite,
          escala,
          x: rand(-anchura, W),
          y: rand(fracYmin * H, fracYmax * H),
          vel: rand(velMin, velMax),
          alfa,
          factViento
        });
      }
      return capa;
    }

    /* ==================== CORTINAS DE LLUVIA LEJANA ==================== */
    function crearCortinaSprite() {
      const c = document.createElement('canvas');
      c.width = 320;
      c.height = 512;
      const g = c.getContext('2d');
      if (!g) return c;
      g.lineCap = 'round';
      for (let i = 0; i < 170; i++) {
        const x = rand(4, 316);
        const l = rand(24, 80);
        const y = rand(10, 500 - l);
        const a = rand(0.05, 0.2);
        const gr = g.createLinearGradient(x, y, x, y + l);
        gr.addColorStop(0, 'rgba(178,198,230,0)');
        gr.addColorStop(0.5, `rgba(178,198,230,${a})`);
        gr.addColorStop(1, 'rgba(178,198,230,0)');
        g.strokeStyle = gr;
        g.lineWidth = rand(0.6, 1.4);
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x, y + l);
        g.stroke();
      }
      return c;
    }

    /* ==================== NEBLINA ==================== */
    function crearSpriteNeblina() {
      const c = document.createElement('canvas');
      c.width = 760;
      c.height = 240;
      const g = c.getContext('2d');
      if (!g) return c;
      const gr = g.createRadialGradient(380, 120, 20, 380, 120, 380);
      gr.addColorStop(0, 'rgba(185,198,222,0.32)');
      gr.addColorStop(1, 'rgba(185,198,222,0)');
      g.fillStyle = gr;
      g.save();
      g.translate(380, 120);
      g.scale(1, 0.3);
      g.translate(-380, -120);
      g.fillRect(0, 0, 760, 240);
      g.restore();
      return c;
    }

    /* ==================== VIÑETA ==================== */
    function prepararVineta() {
      const c = document.createElement('canvas');
      c.width = Math.max(2, W);
      c.height = Math.max(2, H);
      const g = c.getContext('2d');
      if (!g) return;
      const gr = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.78);
      gr.addColorStop(0, 'rgba(0,0,0,0)');
      gr.addColorStop(1, 'rgba(3,6,13,0.55)');
      g.fillStyle = gr;
      g.fillRect(0, 0, W, H);
      vineta = c;
    }

    /* ==================== LLUVIA ==================== */
    function crearGota(): GotaItem {
      const z = Math.random(); // 0 = lejos, 1 = cerca
      return {
        x: rand(-80, W + 80),
        y: rand(-H, H),
        z,
        vel: 320 + z * 640,
        largo: 9 + z * 21,
        alfa: 0.1 + z * 0.28,
        grosor: 0.6 + z * 1.1
      };
    }

    function reiniciarGota(g: GotaItem) {
      g.z = Math.random();
      g.y = rand(-140, -10);
      g.x = rand(-80, W + 80);
      g.vel = 320 + g.z * 640;
      g.largo = 9 + g.z * 21;
      g.alfa = 0.1 + g.z * 0.28;
      g.grosor = 0.6 + g.z * 1.1;
    }

    function poblarLluvia() {
      const objetivo = Math.min(360, Math.floor((W * H) / 4600));
      gotas = [];
      for (let i = 0; i < objetivo; i++) gotas.push(crearGota());

      // Gotas gigantes muy cercanas a cámara (sensación de profundidad)
      gotasCercanas = [];
      for (let i = 0; i < 7; i++) {
        gotasCercanas.push({
          x: rand(0, W),
          y: rand(-H, H),
          vel: rand(950, 1350),
          largo: rand(60, 115),
          alfa: rand(0.07, 0.15),
          grosor: rand(2.0, 3.2)
        });
      }
    }

    /* ==================== RAYOS ==================== */
    function crearTrazadoRayo(): RayoPuntos {
      const puntos: Array<{ x: number; y: number }> = [];
      let x = W * rand(0.15, 0.85);
      let y = H * rand(0.02, 0.09);
      const fin = H * rand(0.58, 0.88);
      puntos.push({ x, y });
      while (y < fin) {
        y += rand(14, 40);
        x += rand(-32, 32);
        puntos.push({ x, y });
      }
      const ramas: Array<Array<{ x: number; y: number }>> = [];
      for (let i = 2; i < puntos.length - 2; i++) {
        if (Math.random() < 0.45) {
          const rama = [{ x: puntos[i].x, y: puntos[i].y }];
          let rx = puntos[i].x;
          let ry = puntos[i].y;
          const dir = Math.random() < 0.5 ? -1 : 1;
          const pasos = 2 + Math.floor(Math.random() * 5);
          for (let p = 0; p < pasos; p++) {
            rx += dir * rand(12, 42);
            ry += rand(12, 30);
            rama.push({ x: rx, y: ry });
          }
          ramas.push(rama);
        }
      }
      return { puntos, ramas, origen: { x: puntos[0].x, y: puntos[0].y } };
    }

    function iniciarRayo(t: number) {
      const pulsos = [{ t: 0, amp: rand(0.85, 1) }];
      const extras = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < extras; i++) {
        pulsos.push({ t: rand(0.09, 0.16) * (i + 1), amp: rand(0.35, 0.8) });
      }
      rayo = { datos: crearTrazadoRayo(), inicio: t, dur: rand(0.55, 1.05), pulsos };
      proximoRayo = t + rand(5, 13);
    }

    function intensidadRayo(t: number) {
      if (!rayo) return 0;
      const e = t - rayo.inicio;
      if (e < 0 || e > rayo.dur) return 0;
      let v = 0;
      for (const p of rayo.pulsos) {
        const dt = e - p.t;
        if (dt >= 0) v += p.amp * Math.exp(-dt * 8.5);
      }
      return limitar(v, 0, 1);
    }

    function polilinea(puntos: Array<{ x: number; y: number }>) {
      ctx.beginPath();
      ctx.moveTo(puntos[0].x, puntos[0].y);
      for (let i = 1; i < puntos.length; i++) ctx.lineTo(puntos[i].x, puntos[i].y);
      ctx.stroke();
    }

    function trazarCanal(
      puntos: Array<{ x: number; y: number }>,
      intens: number,
      anchoBase: number,
      alfaBase: number
    ) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Halo con brillo
      ctx.shadowColor = `rgba(140,180,255,${0.9 * intens})`;
      ctx.shadowBlur = 26 * intens;
      ctx.strokeStyle = `rgba(185,212,255,${0.5 * intens * alfaBase})`;
      ctx.lineWidth = anchoBase * 2.6;
      polilinea(puntos);
      ctx.shadowBlur = 0;
      // Cuerpo
      ctx.strokeStyle = `rgba(228,238,255,${0.85 * intens * alfaBase})`;
      ctx.lineWidth = anchoBase;
      polilinea(puntos);
      // Núcleo blanco
      ctx.strokeStyle = `rgba(255,255,255,${intens * alfaBase})`;
      ctx.lineWidth = Math.max(0.8, anchoBase * 0.42);
      polilinea(puntos);
      ctx.restore();
    }

    /* ==================== ESCENA ==================== */
    function prepararEscena() {
      capasNube = [
        ...prepararCapaNube(6, 6, 12, 0.6, 1.0, -0.06, 0.34, 0.5, 0.5, 14), // lejanas
        ...prepararCapaNube(5, 13, 21, 0.9, 1.5, -0.04, 0.28, 0.75, 0.75, 30), // medias
        ...prepararCapaNube(4, 24, 36, 1.4, 2.2, -0.05, 0.18, 0.95, 1.0, 55) // cercanas
      ];

      neblinas = [];
      for (let i = 0; i < 3; i++) {
        const sprite = crearSpriteNeblina();
        const esc = rand(1.4, 2.5);
        neblinas.push({
          sprite,
          esc,
          x: rand(-sprite.width * esc, W),
          y: H * rand(0.55, 0.85),
          vel: rand(4, 9),
          alfa: rand(0.1, 0.2)
        });
      }

      cortinas = [
        { sprite: crearCortinaSprite(), alfa: 0.4, vel: rand(150, 190), shear: 0.22 },
        { sprite: crearCortinaSprite(), alfa: 0.55, vel: rand(240, 300), shear: 0.3 }
      ];

      poblarLluvia();
      prepararVineta();
      salpicaduras = [];
      particulas = [];
    }

    function redimensionar() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.floor(W * dpr);
      cv.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      prepararEscena();
    }

    window.addEventListener('resize', redimensionar);
    redimensionar();
    proximoRayo = ultimo + rand(2.5, 6);

    /* ==================== BUCLE ==================== */
    function fotograma(ahoraMs: number) {
      const ahora = ahoraMs / 1000;
      const dt = limitar(ahora - ultimo, 0, 0.05);
      ultimo = ahora;

      const viento = vientoEn(ahora);
      const audioLevel = audioLevelRef.current;
      const lluviaRespira = 1 + audioLevel * 0.1;

      // Gestión del rayo e interactividad por burstTrigger
      if (triggerLightningRef.current && active) {
        iniciarRayo(ahora);
        triggerLightningRef.current = false;
      } else if (!rayo && ahora >= proximoRayo && active) {
        iniciarRayo(ahora);
      }

      const intens = intensidadRayo(ahora);
      if (rayo && ahora - rayo.inicio > rayo.dur + 0.5) rayo = null;

      // Sacudida sutil de cámara durante el relámpago
      const ampSac = intens * 3;
      const sx = (Math.random() - 0.5) * 2 * ampSac;
      const sy = (Math.random() - 0.5) * 1.6 * ampSac;

      ctx.save();
      ctx.translate(sx, sy);

      /* --- Cielo --- */
      const cielo = ctx.createLinearGradient(0, 0, 0, H);
      cielo.addColorStop(0, '#131a29');
      cielo.addColorStop(0.45, '#28334a');
      cielo.addColorStop(0.78, '#43506c');
      cielo.addColorStop(1, '#59667f');
      ctx.fillStyle = cielo;
      ctx.fillRect(-10, -10, W + 20, H + 20);

      // Resplandor ambiental difuso tras las nubes
      ctx.globalCompositeOperation = 'screen';
      const gx = W * (0.55 + 0.18 * Math.sin(ahora * 0.021));
      const gy = H * 0.16;
      const gl = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.55);
      gl.addColorStop(0, 'rgba(96,118,160,0.17)');
      gl.addColorStop(1, 'rgba(96,118,160,0)');
      ctx.fillStyle = gl;
      ctx.fillRect(-10, -10, W + 20, H + 20);
      ctx.globalCompositeOperation = 'source-over';

      /* --- Nubes lejanas --- */
      for (let i = 0; i < 6; i++) {
        const n = capasNube[i];
        if (!n) continue;
        if (active) n.x += (n.vel + viento * n.factViento) * dt;
        const anchura = n.sprite.width * n.escala;
        if (n.x > W + 60) n.x = -anchura - 60;
        else if (n.x + anchura < -60) n.x = W + 60;
        ctx.globalAlpha = n.alfa;
        ctx.drawImage(n.sprite, n.x, n.y, anchura, n.sprite.height * n.escala);
      }
      ctx.globalAlpha = 1;

      /* --- Cortina de lluvia lejana (detrás de nubes medias) --- */
      if (cortinas[0]) {
        ctx.save();
        ctx.transform(1, 0, viento * cortinas[0].shear, 1, 0, 0);
        ctx.globalAlpha = cortinas[0].alfa * (0.96 + audioLevel * 0.08);
        const des0 = (ahora * cortinas[0].vel) % H;
        ctx.drawImage(cortinas[0].sprite, 0, des0 - H, W, H);
        ctx.drawImage(cortinas[0].sprite, 0, des0, W, H);
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      /* --- Nubes medias --- */
      for (let i = 6; i < 11; i++) {
        const n = capasNube[i];
        if (!n) continue;
        if (active) n.x += (n.vel + viento * n.factViento) * dt;
        const anchura = n.sprite.width * n.escala;
        if (n.x > W + 60) n.x = -anchura - 60;
        else if (n.x + anchura < -60) n.x = W + 60;
        ctx.globalAlpha = n.alfa;
        ctx.drawImage(n.sprite, n.x, n.y, anchura, n.sprite.height * n.escala);
      }
      ctx.globalAlpha = 1;

      /* --- Segunda cortina de lluvia --- */
      if (cortinas[1]) {
        ctx.save();
        ctx.transform(1, 0, viento * cortinas[1].shear, 1, 0, 0);
        ctx.globalAlpha = cortinas[1].alfa * (0.76 + audioLevel * 0.08);
        const des1 = (ahora * cortinas[1].vel) % H;
        ctx.drawImage(cortinas[1].sprite, 0, des1 - H, W, H);
        ctx.drawImage(cortinas[1].sprite, 0, des1, W, H);
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      /* --- Rayo --- */
      if (rayo && intens > 0.02) {
        // Nubes iluminadas alrededor del origen
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const respl = ctx.createRadialGradient(
          rayo.datos.origen.x,
          rayo.datos.origen.y,
          10,
          rayo.datos.origen.x,
          rayo.datos.origen.y,
          H * 0.55
        );
        respl.addColorStop(0, `rgba(185,208,255,${intens * 0.5})`);
        respl.addColorStop(1, 'rgba(185,208,255,0)');
        ctx.fillStyle = respl;
        ctx.fillRect(-10, -10, W + 20, H + 20);
        ctx.restore();

        trazarCanal(rayo.datos.puntos, intens, 3.2, 1);
        for (const rama of rayo.datos.ramas) {
          trazarCanal(rama, intens, 1.4, 0.6);
        }
      }

      /* --- Nubes cercanas --- */
      for (let i = 11; i < capasNube.length; i++) {
        const n = capasNube[i];
        if (!n) continue;
        if (active) n.x += (n.vel + viento * n.factViento) * dt;
        const anchura = n.sprite.width * n.escala;
        if (n.x > W + 60) n.x = -anchura - 60;
        else if (n.x + anchura < -60) n.x = W + 60;
        ctx.globalAlpha = n.alfa;
        ctx.drawImage(n.sprite, n.x, n.y, anchura, n.sprite.height * n.escala);
      }
      ctx.globalAlpha = 1;

      // Techo oscuro de tormenta
      const techo = ctx.createLinearGradient(0, 0, 0, H * 0.42);
      techo.addColorStop(0, 'rgba(5,8,17,0.85)');
      techo.addColorStop(1, 'rgba(5,8,17,0)');
      ctx.fillStyle = techo;
      ctx.fillRect(-10, -10, W + 20, H * 0.42 + 10);

      /* --- Neblina --- */
      for (const nb of neblinas) {
        if (active) nb.x += (nb.vel + viento * 6) * dt;
        const anchura = nb.sprite.width * nb.esc;
        if (nb.x > W + 60) nb.x = -anchura - 60;
        else if (nb.x + anchura < -60) nb.x = W + 60;
        ctx.globalAlpha = nb.alfa;
        ctx.drawImage(nb.sprite, nb.x, nb.y, anchura, nb.sprite.height * nb.esc);
      }
      ctx.globalAlpha = 1;

      /* --- Lluvia principal --- */
      ctx.lineCap = 'round';
      for (const gota of gotas) {
        if (active) {
          gota.y += gota.vel * lluviaRespira * dt;
          gota.x += viento * gota.vel * 0.32 * dt;

          if (gota.y > H + 20) {
            if (gota.z > 0.55) {
              if (salpicaduras.length < 90) {
                salpicaduras.push({ x: gota.x, y: H - rand(0, 12), r: 1, vida: 1, velR: rand(16, 34) });
              }
              if (particulas.length < 150) {
                for (let k = 0; k < 2; k++) {
                  particulas.push({
                    x: gota.x,
                    y: H - 2,
                    vx: rand(-45, 45) + viento * 60,
                    vy: rand(-110, -35),
                    vida: 1
                  });
                }
              }
            }
            reiniciarGota(gota);
          }
        }

        const inclinacion = viento * gota.largo * 0.9;
        ctx.strokeStyle = `rgba(176,198,230,${gota.alfa * (0.94 + audioLevel * 0.12)})`;
        ctx.lineWidth = gota.grosor;
        ctx.beginPath();
        ctx.moveTo(gota.x, gota.y);
        ctx.lineTo(gota.x + inclinacion, gota.y + gota.largo);
        ctx.stroke();
      }

      /* --- Gotas gigantes cercanas --- */
      for (const gd of gotasCercanas) {
        if (active) {
          gd.y += gd.vel * lluviaRespira * dt;
          gd.x += viento * gd.vel * 0.3 * dt;
          if (gd.y - gd.largo > H + 40) {
            gd.y = rand(-220, -60);
            gd.x = rand(-60, W + 60);
          }
        }
        const gr = ctx.createLinearGradient(gd.x, gd.y - gd.largo, gd.x, gd.y);
        gr.addColorStop(0, 'rgba(196,214,242,0)');
        gr.addColorStop(1, `rgba(202,220,246,${gd.alfa})`);
        ctx.strokeStyle = gr;
        ctx.lineWidth = gd.grosor;
        ctx.beginPath();
        ctx.moveTo(gd.x, gd.y - gd.largo);
        ctx.lineTo(gd.x + viento * gd.largo * 0.55, gd.y);
        ctx.stroke();
      }

      /* --- Anillos de salpicadura --- */
      for (let i = salpicaduras.length - 1; i >= 0; i--) {
        const s = salpicaduras[i];
        if (active) {
          s.r += s.velR * dt;
          s.vida -= dt * 3.2;
        }
        if (s.vida <= 0) {
          salpicaduras.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(192,210,238,${s.vida * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r, s.r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* --- Gotitas rebotando --- */
      for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];
        if (active) {
          p.vy += 520 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vida -= dt * 2.6;
        }
        if (p.vida <= 0 || p.y > H + 10) {
          particulas.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(200,218,244,${p.vida * 0.5})`;
        ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }

      /* --- Suelo brumoso --- */
      const suelo = ctx.createLinearGradient(0, H * 0.8, 0, H);
      suelo.addColorStop(0, 'rgba(10,14,24,0)');
      suelo.addColorStop(1, 'rgba(10,14,24,0.55)');
      ctx.fillStyle = suelo;
      ctx.fillRect(-10, H * 0.8, W + 20, H * 0.2 + 10);

      ctx.restore(); // fin sacudida

      /* --- Destello general del relámpago --- */
      if (intens > 0.02) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = `rgba(160,190,255,${intens * 0.26})`;
        ctx.fillRect(0, 0, W, H);
        const fl = ctx.createLinearGradient(0, 0, 0, H * 0.5);
        fl.addColorStop(0, `rgba(205,222,255,${intens * 0.22})`);
        fl.addColorStop(1, 'rgba(205,222,255,0)');
        ctx.fillStyle = fl;
        ctx.fillRect(0, 0, W, H * 0.5);
        ctx.restore();
      }

      /* --- Viñeta --- */
      if (vineta) {
        ctx.drawImage(vineta, 0, 0, W, H);
      }

      rafRef.current = requestAnimationFrame(fotograma);
    }

    rafRef.current = requestAnimationFrame(fotograma);

    return () => {
      window.removeEventListener('resize', redimensionar);
      window.removeEventListener('manta:audio-level', handleAudioLevel);
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
