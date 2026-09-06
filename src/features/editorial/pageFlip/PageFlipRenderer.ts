import * as THREE from 'three';
import { Look, MagazineEdition } from '../../../types';
import { PageFlipDirection } from './pageFlipTypes';
import { renderStoryToCanvas } from '../storyVisualSpec';
import { PageFlipMeshSystem } from './PageFlipMesh';

export class PageFlipRenderer {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private width: number = 0;
  private height: number = 0;
  private fov: number = 42;
  private cameraDistance: number = 1000;

  // Dedicated Mesh and Material System
  private meshSystem: PageFlipMeshSystem;

  // Texture caching & management
  private textureCache = new Map<string, THREE.CanvasTexture | THREE.Texture>();
  private inFlightTexturePromises = new Map<string, Promise<THREE.Texture>>();
  private currentLook: Look | null = null;
  private nextLook: Look | null = null;
  private currentEdition: MagazineEdition | null = null;
  private currentIdx: number = 0;
  private nextIdx: number = 0;
  private totalLooks: number = 0;
  private lastProgress: number = 0;
  private lastDirection: PageFlipDirection = 'next';
  private texturesReady: boolean = false;
  private rendererReady: boolean = true;
  private firstFrameRendered: boolean = false;
  private loadVersion: number = 0;
  private isDisposed: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    // 1. Scene & Renderer setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.fov, this.width / this.height, 0.1, 4000);
    this.updateCamera();

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.container.appendChild(this.renderer.domElement);

    // 2. Paper lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8ee, 0.45);
    dirLight.position.set(0, 300, 800);
    this.scene.add(dirLight);

    // 3. Initialize Mesh & Material System (Subdivided geometry, backface shaders, hinge & under shadows)
    this.meshSystem = new PageFlipMeshSystem(this.scene, this.width, this.height);

    // Temporary manual scrub testing tool for QA/auditing deterministic frames (Section 6)
    if (typeof window !== 'undefined') {
      (window as unknown as { __testPageFlipScrub?: unknown }).__testPageFlipScrub = (p: number, dir: PageFlipDirection = 'next') => {
        this.updateFold(p, dir);
        return { progress: p, direction: dir };
      };
      (window as unknown as { __runPageFlipScrubTest?: unknown }).__runPageFlipScrubTest = (dir: PageFlipDirection = 'next') => {
        const testValues = [0, 0.1, 0.2, 0.3, 0.4, 0.49, 0.5, 0.51, 0.6, 0.7, 0.8, 0.9, 1.0];
        for (const val of testValues) {
          this.updateFold(val, dir);
        }
        return `Tested ${testValues.length} discrete steps successfully.`;
      };
    }
  }

  private updateCamera() {
    this.camera.aspect = this.width / this.height;
    // Perspective equivalent ~1200px: cameraDistance matches viewport height mathematically
    this.cameraDistance = (this.height / 2) / Math.tan((this.fov * Math.PI) / 360);
    this.camera.position.set(0, 0, this.cameraDistance);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  /**
   * Preloads textures for all looks in an edition to ensure zero stutter on first swipe.
   */
  public preloadAllStories(edition: MagazineEdition) {
    const total = edition.looks.length;
    edition.looks.forEach((look, idx) => {
      this.loadPageTexture(look, edition, idx, total).catch(() => {});
    });
  }

  /**
   * Generates or retrieves an editorial composite texture for a look.
   * Checks both cache and in-flight promises to avoid duplicate canvas generation.
   */
  public async loadPageTexture(look: Look, edition: MagazineEdition, index: number, total: number): Promise<THREE.Texture> {
    const key = `${edition.id}_${look.chip}_${this.width}x${this.height}`;
    if (this.textureCache.has(key)) {
      return this.textureCache.get(key)!;
    }

    if (this.inFlightTexturePromises.has(key)) {
      return this.inFlightTexturePromises.get(key)!;
    }

    const loadPromise = (async () => {
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {}
      }

      const canvas = document.createElement('canvas');
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(this.width * scale);
      canvas.height = Math.round(this.height * scale);
      const ctx = canvas.getContext('2d');

      const maxAnisotropy = Math.min(this.renderer.capabilities.getMaxAnisotropy(), 8);

      if (!ctx) {
        const loader = new THREE.TextureLoader();
        const tex = await loader.loadAsync(look.image);
        tex.colorSpace = THREE.NoColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = maxAnisotropy;
        this.textureCache.set(key, tex);
        return tex;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = look.image;

      await new Promise<void>((resolve) => {
        if (img.complete) resolve();
        else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });

      renderStoryToCanvas(
        ctx,
        edition,
        look,
        index,
        total,
        img,
        this.width,
        this.height,
        scale
      );

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.NoColorSpace;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = maxAnisotropy;
      texture.needsUpdate = true;

      this.textureCache.set(key, texture);
      this.inFlightTexturePromises.delete(key);
      return texture;
    })().catch((err) => {
      this.inFlightTexturePromises.delete(key);
      throw err;
    });

    this.inFlightTexturePromises.set(key, loadPromise);
    return loadPromise;
  }

  public areTexturesReady(): boolean {
    return this.texturesReady;
  }

  public areStoriesLoaded(currentLook: Look, nextLook: Look, edition: MagazineEdition): boolean {
    const keyCurrent = `${edition.id}_${currentLook.chip}_${this.width}x${this.height}`;
    const keyNext = `${edition.id}_${nextLook.chip}_${this.width}x${this.height}`;
    return this.textureCache.has(keyCurrent) && this.textureCache.has(keyNext);
  }

  /**
   * Assigns current and target textures to front/back materials.
   * Single texture source per story: the shader handles front vs. back desaturation.
   */
  public async setStories(
    currentLook: Look,
    nextLook: Look,
    edition: MagazineEdition,
    currentIdx: number,
    nextIdx: number,
    total: number
  ) {
    if (this.isDisposed) return;
    const version = ++this.loadVersion;

    this.currentLook = currentLook;
    this.nextLook = nextLook;
    this.currentEdition = edition;
    this.currentIdx = currentIdx;
    this.nextIdx = nextIdx;
    this.totalLooks = total;

    const keyCurrent = `${edition.id}_${currentLook.chip}_${this.width}x${this.height}`;
    const keyNext = `${edition.id}_${nextLook.chip}_${this.width}x${this.height}`;

    if (this.textureCache.has(keyCurrent) && this.textureCache.has(keyNext)) {
      const curTex = this.textureCache.get(keyCurrent)!;
      const nxtTex = this.textureCache.get(keyNext)!;
      this.meshSystem.currentMaterial.uniforms.map.value = curTex;
      this.meshSystem.currentMaterial.needsUpdate = true;
      this.meshSystem.nextMaterial.uniforms.map.value = nxtTex;
      this.meshSystem.nextMaterial.needsUpdate = true;
      this.texturesReady = true;

      // Pre-heat WebGL immediately so the GPU canvas has a valid rendered frame before any swipe!
      this.updateFold(this.lastProgress, this.lastDirection);
      this.firstFrameRendered = true;
      return;
    }

    this.texturesReady = false;
    this.firstFrameRendered = false;

    const [currentTex, nextTex] = await Promise.all([
      this.loadPageTexture(currentLook, edition, currentIdx, total),
      this.loadPageTexture(nextLook, edition, nextIdx, total)
    ]);

    if (this.isDisposed || version !== this.loadVersion) {
      return;
    }

    this.meshSystem.currentMaterial.uniforms.map.value = currentTex;
    this.meshSystem.currentMaterial.needsUpdate = true;

    this.meshSystem.nextMaterial.uniforms.map.value = nextTex;
    this.meshSystem.nextMaterial.needsUpdate = true;
    this.texturesReady = true;

    // Pre-heat WebGL immediately so the GPU canvas has a valid rendered frame before any swipe!
    this.updateFold(this.lastProgress, this.lastDirection);
    this.firstFrameRendered = true;
  }

  /**
   * Updates fold positions, angles, paper arch, and renders a frame.
   */
  public updateFold(progress: number, direction: PageFlipDirection = 'next') {
    if (this.isDisposed) return;

    const dir = direction || 'next';
    this.lastProgress = progress;
    this.lastDirection = dir;

    this.meshSystem.update(progress, dir);
    this.renderer.render(this.scene, this.camera);
    this.firstFrameRendered = true;
  }

  public isRendererReady(): boolean {
    return !this.isDisposed && this.rendererReady;
  }

  public isTexturesReady(): boolean {
    return this.texturesReady;
  }

  public isFirstFrameRendered(): boolean {
    return this.firstFrameRendered;
  }

  public isGpuVisualReady(): boolean {
    return !this.isDisposed && this.rendererReady && this.texturesReady && this.firstFrameRendered;
  }

  public resize(newWidth: number, newHeight: number) {
    if (this.isDisposed || newWidth <= 0 || newHeight <= 0) return;
    if (Math.abs(this.width - newWidth) < 1 && Math.abs(this.height - newHeight) < 1) return;
    this.width = newWidth;
    this.height = newHeight;

    this.renderer.setSize(this.width, this.height);
    this.updateCamera();
    this.meshSystem.resize(this.width, this.height);

    if (this.currentLook && this.nextLook && this.currentEdition) {
      this.setStories(
        this.currentLook,
        this.nextLook,
        this.currentEdition,
        this.currentIdx,
        this.nextIdx,
        this.totalLooks
      );
    }

    this.updateFold(this.lastProgress, this.lastDirection);
  }

  public dispose() {
    this.isDisposed = true;
    this.meshSystem.dispose();

    this.textureCache.forEach((tex) => tex.dispose());
    this.textureCache.clear();
    this.inFlightTexturePromises.clear();

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
