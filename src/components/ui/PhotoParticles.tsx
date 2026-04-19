'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface PhotoParticlesProps {
  imageSrc: string;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  active: boolean; // true if displaced from origin
}

// ─── Tuning ─────────────────────────────────────────────────────────────────
const PARTICLE_SIZE = 2;
const GRID_STEP     = 2;   // 2px size + 0px gap
const PUSH_RADIUS   = 80;
const PUSH_STRENGTH = 40;

// ─── Duotone palette ────────────────────────────────────────────────────────
const SHADOW_R = 0x1a, SHADOW_G = 0x2a, SHADOW_B = 0x35;   // #1a2a35
const LIGHT_R  = 0xff, LIGHT_G  = 0xff, LIGHT_B  = 0xe3;   // #FFFFE3

export default function PhotoParticles({ imageSrc, className = '' }: PhotoParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef       = useRef<number>(0);
  const mouseRef     = useRef({ x: -9999, y: -9999, active: false });
  const imgRef       = useRef<HTMLImageElement | null>(null);
  const builtRef     = useRef(false);

  // ── Build particles ───────────────────────────────────────────────────
  const buildParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    // Size canvas to exactly match container (1:1 CSS pixels)
    canvas.width  = w;
    canvas.height = h;

    const drawFromImage = (img: HTMLImageElement) => {
      // Offscreen canvas to sample pixel data
      const off = document.createElement('canvas');
      off.width  = w;
      off.height = h;
      const offCtx = off.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      // Draw image scaled to fill the entire canvas (object-fit: cover)
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const boxAspect = w / h;
      let sx: number, sy: number, sw: number, sh: number;

      if (boxAspect > imgAspect) {
        sw = img.naturalWidth;
        sh = img.naturalWidth / boxAspect;
        sx = 0;
        sy = (img.naturalHeight - sh) / 2;
      } else {
        sh = img.naturalHeight;
        sw = img.naturalHeight * boxAspect;
        sx = (img.naturalWidth - sw) / 2;
        sy = 0;
      }

      offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

      const data = offCtx.getImageData(0, 0, w, h).data;
      const particles: Particle[] = [];

      for (let py = 0; py < h; py += GRID_STEP) {
        for (let px = 0; px < w; px += GRID_STEP) {
          const i = (py * w + px) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 10) continue;

          // ── Duotone: grayscale → lerp shadow↔highlight ──
          const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          const fr = Math.round(SHADOW_R + (LIGHT_R - SHADOW_R) * gray);
          const fg = Math.round(SHADOW_G + (LIGHT_G - SHADOW_G) * gray);
          const fb = Math.round(SHADOW_B + (LIGHT_B - SHADOW_B) * gray);

          particles.push({
            x: px,
            y: py,
            originX: px,
            originY: py,
            color: `rgb(${fr},${fg},${fb})`,
            active: false,
          });
        }
      }

      particlesRef.current = particles;
      builtRef.current = true;
    };

    // If image already loaded, reuse it; otherwise load fresh
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      drawFromImage(imgRef.current);
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        imgRef.current = img;
        drawFromImage(img);
      };
    }
  }, [imageSrc]);

  // ── Render loop ───────────────────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) { rafRef.current = requestAnimationFrame(render); return; }

    const ctx = canvas.getContext('2d');
    if (!ctx) { rafRef.current = requestAnimationFrame(render); return; }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const len = particles.length;

    for (let i = 0; i < len; i++) {
      const p = particles[i];

      if (mouse.active) {
        // ── Fast bounding-box pre-check (avoids sqrt) ──
        const dx = p.originX - mouse.x;
        const dy = p.originY - mouse.y;

        if (Math.abs(dx) > PUSH_RADIUS || Math.abs(dy) > PUSH_RADIUS) {
          // Outside radius — snap to origin if displaced
          if (p.active) {
            p.x = p.originX;
            p.y = p.originY;
            p.active = false;
          }
        } else {
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < PUSH_RADIUS && dist > 0.1) {
            const force = ((PUSH_RADIUS - dist) / PUSH_RADIUS) * PUSH_STRENGTH;
            const angle = Math.atan2(dy, dx);
            p.x = p.originX + Math.cos(angle) * force;
            p.y = p.originY + Math.sin(angle) * force;
            p.active = true;
          } else if (p.active) {
            p.x = p.originX;
            p.y = p.originY;
            p.active = false;
          }
        }
      }

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, PARTICLE_SIZE, PARTICLE_SIZE);
    }

    rafRef.current = requestAnimationFrame(render);
  }, []);

  // ── Lifecycle ─────────────────────────────────────────────────────────
  useEffect(() => {
    buildParticles();
    rafRef.current = requestAnimationFrame(render);

    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      particlesRef.current.forEach((p) => gsap.killTweensOf(p));
      buildParticles();
    });
    if (el) ro.observe(el);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      particlesRef.current.forEach((p) => gsap.killTweensOf(p));
    };
  }, [buildParticles, render]);

  // ── Mouse handlers ────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;

    // Kill snap-back tweens so direct positioning takes over
    particlesRef.current.forEach((p) => {
      if (p.active) gsap.killTweensOf(p);
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    mouseRef.current.active = false;

    // Elastic snap-back only for displaced particles
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.active || Math.abs(p.x - p.originX) > 0.5 || Math.abs(p.y - p.originY) > 0.5) {
        gsap.to(p, {
          x: p.originX,
          y: p.originY,
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)',
          overwrite: true,
          onComplete: () => { p.active = false; },
        });
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          cursor: 'default',
        }}
      />
    </div>
  );
}
