import * as THREE from 'three';
import { PageFlipDirection } from './pageFlipTypes';
import { calculateFoldParameters, clamp } from './pageFlipMath';

/**
 * Creates a custom double-sided page material.
 * Front side: Crisp editorial story texture.
 * Back side (when folded): Desaturated, slightly darkened with paper tint.
 * Respects: Single texture source, no duplicate image loading.
 */
export function createEditorialPageMaterial(): THREE.ShaderMaterial {
  const customMaterial = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 }
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      varying vec2 vUv;

      void main() {
        if (gl_FrontFacing) {
          // FRONTAL: Fidelidad 1:1 absoluta a los píxeles originales sin modificación
          vec4 texColor = texture2D(map, vUv);
          gl_FragColor = vec4(texColor.rgb, texColor.a * opacity);
        } else {
          // REVERSO: Superficie de papel editorial neutro y limpio
          vec3 neutralPaper = vec3(0.935, 0.925, 0.910);
          gl_FragColor = vec4(neutralPaper, opacity);
        }
      }
    `,
    side: THREE.DoubleSide,
    transparent: false,
    depthTest: true,
    depthWrite: true,
    toneMapped: false
  });

  return customMaterial;
}

/**
 * Encapsulates the 3D meshes, geometries, and physical deformations for vertical page flipping.
 */
export class PageFlipMeshSystem {
  public width: number;
  public height: number;

  // Groups anchored at the hinge (y = 0)
  public currentTopGroup: THREE.Group;
  public currentBottomGroup: THREE.Group;
  public nextTopGroup: THREE.Group;
  public nextBottomGroup: THREE.Group;

  // Subdivided Meshes
  public currentTopMesh: THREE.Mesh;
  public currentBottomMesh: THREE.Mesh;
  public nextTopMesh: THREE.Mesh;
  public nextBottomMesh: THREE.Mesh;

  // Materials
  public currentMaterial: THREE.ShaderMaterial;
  public nextMaterial: THREE.ShaderMaterial;

  // Shadows and visual paper depth
  public hingeShadowMesh: THREE.Mesh;
  public underShadowMesh: THREE.Mesh;
  public edgeHighlightMesh: THREE.Mesh;

  constructor(scene: THREE.Scene, width: number, height: number) {
    this.width = width;
    this.height = height;

    // Materials with single-texture front/backface rendering
    this.currentMaterial = createEditorialPageMaterial();
    this.nextMaterial = createEditorialPageMaterial();

    // Pivot groups at hinge (y = 0)
    this.currentTopGroup = new THREE.Group();
    this.currentBottomGroup = new THREE.Group();
    this.nextTopGroup = new THREE.Group();
    this.nextBottomGroup = new THREE.Group();

    // Build subdivided geometries (32 segments in vertical for smooth paper arch)
    const topGeom = this.createSubdividedGeometry(true, 32);
    const bottomGeom = this.createSubdividedGeometry(false, 32);

    this.currentTopMesh = new THREE.Mesh(topGeom, this.currentMaterial);
    this.currentBottomMesh = new THREE.Mesh(bottomGeom, this.currentMaterial);
    this.nextTopMesh = new THREE.Mesh(topGeom.clone(), this.nextMaterial);
    this.nextBottomMesh = new THREE.Mesh(bottomGeom.clone(), this.nextMaterial);

    this.currentTopGroup.add(this.currentTopMesh);
    this.currentBottomGroup.add(this.currentBottomMesh);
    this.nextTopGroup.add(this.nextTopMesh);
    this.nextBottomGroup.add(this.nextBottomMesh);

    // Shadows: Hinge crease shadow
    const hingeCanvas = document.createElement('canvas');
    hingeCanvas.width = 64;
    hingeCanvas.height = 256;
    const hCtx = hingeCanvas.getContext('2d');
    if (hCtx) {
      const grad = hCtx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.35, 'rgba(5,7,10,0.18)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.65)');
      grad.addColorStop(0.65, 'rgba(5,7,10,0.18)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      hCtx.fillStyle = grad;
      hCtx.fillRect(0, 0, 64, 256);
    }
    const hingeTex = new THREE.CanvasTexture(hingeCanvas);
    hingeTex.colorSpace = THREE.NoColorSpace;
    const hingeGeom = new THREE.PlaneGeometry(this.width * 1.05, 120);
    const hingeMat = new THREE.MeshBasicMaterial({
      map: hingeTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false
    });
    this.hingeShadowMesh = new THREE.Mesh(hingeGeom, hingeMat);
    this.hingeShadowMesh.position.set(0, 0, 2);

    // Under-page drop shadow
    const underCanvas = document.createElement('canvas');
    underCanvas.width = 64;
    underCanvas.height = 256;
    const uCtx = underCanvas.getContext('2d');
    if (uCtx) {
      const grad = uCtx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, 'rgba(0,0,0,0.4)');
      grad.addColorStop(0.48, 'rgba(0,0,0,0.15)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      uCtx.fillStyle = grad;
      uCtx.fillRect(0, 0, 64, 256);
    }
    const underTex = new THREE.CanvasTexture(underCanvas);
    underTex.colorSpace = THREE.NoColorSpace;
    const underGeom = new THREE.PlaneGeometry(this.width, this.height);
    const underMat = new THREE.MeshBasicMaterial({
      map: underTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false
    });
    this.underShadowMesh = new THREE.Mesh(underGeom, underMat);
    this.underShadowMesh.position.set(0, 0, -1);

    // Edge highlight (specular paper edge visible when edge-on around progress 0.5)
    const edgeCanvas = document.createElement('canvas');
    edgeCanvas.width = 32;
    edgeCanvas.height = 8;
    const eCtx = edgeCanvas.getContext('2d');
    if (eCtx) {
      eCtx.fillStyle = 'rgba(255,255,255,0.85)';
      eCtx.fillRect(0, 0, 32, 8);
    }
    const edgeTex = new THREE.CanvasTexture(edgeCanvas);
    edgeTex.colorSpace = THREE.NoColorSpace;
    const edgeGeom = new THREE.PlaneGeometry(this.width, 3);
    const edgeMat = new THREE.MeshBasicMaterial({
      map: edgeTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false
    });
    this.edgeHighlightMesh = new THREE.Mesh(edgeGeom, edgeMat);
    this.edgeHighlightMesh.position.set(0, 0, 4);

    // Disable artificial overlay planes that cause clipping and hard cut lines across the center
    this.hingeShadowMesh.visible = false;
    this.underShadowMesh.visible = false;
    this.edgeHighlightMesh.visible = false;

    // Add to scene in depth order
    scene.add(this.underShadowMesh);
    scene.add(this.nextBottomGroup);
    scene.add(this.nextTopGroup);
    scene.add(this.currentTopGroup);
    scene.add(this.currentBottomGroup);
    scene.add(this.hingeShadowMesh);
    scene.add(this.edgeHighlightMesh);
  }

  /**
   * Creates a subdivided plane geometry anchored at the hinge (y = 0).
   * isTop: extends towards +halfH (top), with a 1px overlap skirt at hinge to prevent subpixel cracks.
   * !isTop: extends towards -halfH (bottom), anchored precisely at hinge (y = 0).
   */
  public createSubdividedGeometry(isTop: boolean, segmentsY: number = 32): THREE.BufferGeometry {
    const halfH = this.height / 2;
    const w = this.width;
    const segmentsX = 4;
    const seamOverlap = 1.0; // 1px bridge across the hinge seam to eliminate hairline rendering cracks

    const geom = new THREE.BufferGeometry();
    const pos: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let iy = 0; iy <= segmentsY; iy++) {
      const v = iy / segmentsY; // 0 at hinge, 1 at outer edge
      let y: number;
      let uvY: number;

      if (isTop) {
        if (iy === 0) {
          y = -seamOverlap;
          uvY = 0.5 - (seamOverlap / this.height);
        } else {
          y = v * halfH;
          uvY = 0.5 + v * 0.5;
        }
      } else {
        y = -v * halfH;
        uvY = 0.5 - v * 0.5;
      }

      for (let ix = 0; ix <= segmentsX; ix++) {
        const u = ix / segmentsX;
        const x = (u - 0.5) * w;

        pos.push(x, y, 0);
        uvs.push(u, uvY);
      }
    }

    const gridW = segmentsX + 1;
    for (let iy = 0; iy < segmentsY; iy++) {
      for (let ix = 0; ix < segmentsX; ix++) {
        const a = iy * gridW + ix;
        const b = (iy + 1) * gridW + ix;
        const c = (iy + 1) * gridW + (ix + 1);
        const d = iy * gridW + (ix + 1);

        if (isTop) {
          indices.push(a, d, c);
          indices.push(a, c, b);
        } else {
          indices.push(b, c, d);
          indices.push(b, d, a);
        }
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    return geom;
  }

  /**
   * Normalizes explicitly all meshes, positions, rotations, curvatures, and shadows
   * before applying the current frame, ensuring zero residual state.
   */
  public resetState() {
    this.currentTopGroup.visible = false;
    this.currentTopGroup.rotation.set(0, 0, 0);
    this.currentTopGroup.position.set(0, 0, 0);

    this.currentBottomGroup.visible = false;
    this.currentBottomGroup.rotation.set(0, 0, 0);
    this.currentBottomGroup.position.set(0, 0, 0);

    this.nextTopGroup.visible = false;
    this.nextTopGroup.rotation.set(0, 0, 0);
    this.nextTopGroup.position.set(0, 0, 0);

    this.nextBottomGroup.visible = false;
    this.nextBottomGroup.rotation.set(0, 0, 0);
    this.nextBottomGroup.position.set(0, 0, 0);

    this.resetCurvature(this.currentTopMesh);
    this.resetCurvature(this.currentBottomMesh);
    this.resetCurvature(this.nextTopMesh);
    this.resetCurvature(this.nextBottomMesh);

    (this.hingeShadowMesh.material as THREE.MeshBasicMaterial).opacity = 0;
    (this.underShadowMesh.material as THREE.MeshBasicMaterial).opacity = 0;
    (this.edgeHighlightMesh.material as THREE.MeshBasicMaterial).opacity = 0;
  }

  /**
   * Updates positions, rotations, paper curvature arch, and dynamic shadows.
   */
  public update(progress: number, direction: PageFlipDirection = 'next') {
    const dir = direction || 'next';
    const params = calculateFoldParameters(progress, dir);

    // 0. Explicit normalization of all meshes to eliminate residual state
    this.resetState();

    // 1. Dynamic paper curvature on the moving halves
    if (dir === 'next') {
      if (params.activePhase === 'first-half') {
        this.applyCurvature(this.currentBottomMesh, params.paperCurvature, params.currentHalfAngle, false, 'next');
      } else {
        this.applyCurvature(this.nextTopMesh, params.paperCurvature, params.nextHalfAngle, true, 'next');
      }
    } else {
      if (params.activePhase === 'first-half') {
        this.applyCurvature(this.currentTopMesh, params.paperCurvature, params.currentHalfAngle, true, 'previous');
      } else {
        this.applyCurvature(this.nextBottomMesh, params.paperCurvature, params.nextHalfAngle, false, 'previous');
      }
    }

    // 2. Hierarchy group rotations around the hinge (strictly anchored at y=0, z=0)
    if (dir === 'next') {
      if (params.activePhase === 'first-half') {
        // Phase 1 (0 -> 0.5): Active leaf is currentBottom lifting UP around hinge
        this.currentTopGroup.visible = true;
        this.currentTopGroup.rotation.set(0, 0, 0);
        this.currentTopGroup.position.set(0, 0, 0);

        this.currentBottomGroup.visible = true;
        this.currentBottomGroup.rotation.set(params.currentHalfAngle, 0, 0);
        this.currentBottomGroup.position.set(0, 0, 0);

        // Next page bottom half sits cleanly underneath
        this.nextBottomGroup.visible = true;
        this.nextBottomGroup.rotation.set(0, 0, 0);
        this.nextBottomGroup.position.set(0, 0, -1.0);

        this.nextTopGroup.visible = false;
      } else {
        // Phase 2 (0.5 -> 1.0): Active leaf is nextTop unfolding DOWN around hinge
        this.currentBottomGroup.visible = false;

        // Next page bottom half is flat at Z = 0
        this.nextBottomGroup.visible = true;
        this.nextBottomGroup.rotation.set(0, 0, 0);
        this.nextBottomGroup.position.set(0, 0, 0);

        // Next page top half unfolds from 90 deg down to 0 deg
        this.nextTopGroup.visible = true;
        this.nextTopGroup.rotation.set(params.nextHalfAngle, 0, 0);
        this.nextTopGroup.position.set(0, 0, 0);

        // Current top half sits cleanly underneath as it is covered
        this.currentTopGroup.visible = true;
        this.currentTopGroup.rotation.set(0, 0, 0);
        this.currentTopGroup.position.set(0, 0, -1.0);
      }
    } else {
      // Reverse direction: pulling down
      if (params.activePhase === 'first-half') {
        // Phase 1 (0 -> 0.5): Active leaf is currentTop folding DOWN around hinge
        this.currentBottomGroup.visible = true;
        this.currentBottomGroup.rotation.set(0, 0, 0);
        this.currentBottomGroup.position.set(0, 0, 0);

        this.currentTopGroup.visible = true;
        this.currentTopGroup.rotation.set(params.currentHalfAngle, 0, 0);
        this.currentTopGroup.position.set(0, 0, 0);

        // Next page top half sits cleanly underneath
        this.nextTopGroup.visible = true;
        this.nextTopGroup.rotation.set(0, 0, 0);
        this.nextTopGroup.position.set(0, 0, -1.0);

        this.nextBottomGroup.visible = false;
      } else {
        // Phase 2 (0.5 -> 1.0): Active leaf is nextBottom unfolding UP around hinge
        this.currentTopGroup.visible = false;

        // Next page top half is flat at Z = 0
        this.nextTopGroup.visible = true;
        this.nextTopGroup.rotation.set(0, 0, 0);
        this.nextTopGroup.position.set(0, 0, 0);

        // Next page bottom half unfolds from -90 deg up to 0 deg
        this.nextBottomGroup.visible = true;
        this.nextBottomGroup.rotation.set(params.nextHalfAngle, 0, 0);
        this.nextBottomGroup.position.set(0, 0, 0);

        // Current bottom half sits cleanly underneath as it is covered
        this.currentBottomGroup.visible = true;
        this.currentBottomGroup.rotation.set(0, 0, 0);
        this.currentBottomGroup.position.set(0, 0, -1.0);
      }
    }

    // 3. Disable shadow and highlight overlay planes to prevent lines and clipping
    this.hingeShadowMesh.visible = false;
    this.underShadowMesh.visible = false;
    this.edgeHighlightMesh.visible = false;
  }

  /**
   * Applies vertex-level paper deflection for authentic tactile curvature.
   */
  private applyCurvature(
    mesh: THREE.Mesh,
    curvatureAmount: number,
    angle: number,
    isTop: boolean,
    direction: PageFlipDirection
  ) {
    const geom = mesh.geometry as THREE.BufferGeometry;
    const posAttr = geom.getAttribute('position');
    const halfH = this.height / 2;

    const angleFactor = Math.sin(Math.abs(angle));
    const baseDeflection = curvatureAmount * angleFactor * 55;
    const sign = direction === 'next' ? (isTop ? -1 : 1) : (isTop ? 1 : -1);

    const count = posAttr.count;
    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i);
      const normalizedDist = clamp(Math.abs(y) / halfH, 0, 1);
      // Paper arch anchored at hinge
      const arch = Math.sin(normalizedDist * Math.PI);
      const curve = sign * arch * baseDeflection;
      posAttr.setZ(i, curve);
    }
    posAttr.needsUpdate = true;
    geom.computeVertexNormals();
  }

  private resetCurvature(mesh: THREE.Mesh) {
    const geom = mesh.geometry as THREE.BufferGeometry;
    const posAttr = geom.getAttribute('position');
    let needsUpdate = false;
    for (let i = 0; i < posAttr.count; i++) {
      if (posAttr.getZ(i) !== 0) {
        posAttr.setZ(i, 0);
        needsUpdate = true;
      }
    }
    if (needsUpdate) {
      posAttr.needsUpdate = true;
      geom.computeVertexNormals();
    }
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.currentTopMesh.geometry.dispose();
    this.currentBottomMesh.geometry.dispose();
    this.nextTopMesh.geometry.dispose();
    this.nextBottomMesh.geometry.dispose();

    const topGeom = this.createSubdividedGeometry(true, 32);
    const bottomGeom = this.createSubdividedGeometry(false, 32);

    this.currentTopMesh.geometry = topGeom;
    this.currentBottomMesh.geometry = bottomGeom;
    this.nextTopMesh.geometry = topGeom.clone();
    this.nextBottomMesh.geometry = bottomGeom.clone();

    this.hingeShadowMesh.geometry.dispose();
    this.hingeShadowMesh.geometry = new THREE.PlaneGeometry(this.width * 1.05, 120);

    this.underShadowMesh.geometry.dispose();
    this.underShadowMesh.geometry = new THREE.PlaneGeometry(this.width, this.height);

    this.edgeHighlightMesh.geometry.dispose();
    this.edgeHighlightMesh.geometry = new THREE.PlaneGeometry(this.width, 3);
  }

  public dispose() {
    this.currentTopMesh.geometry.dispose();
    this.currentBottomMesh.geometry.dispose();
    this.nextTopMesh.geometry.dispose();
    this.nextBottomMesh.geometry.dispose();

    this.hingeShadowMesh.geometry.dispose();
    (this.hingeShadowMesh.material as THREE.Material).dispose();

    this.underShadowMesh.geometry.dispose();
    (this.underShadowMesh.material as THREE.Material).dispose();

    this.edgeHighlightMesh.geometry.dispose();
    (this.edgeHighlightMesh.material as THREE.Material).dispose();

    this.currentMaterial.dispose();
    this.nextMaterial.dispose();
  }
}
