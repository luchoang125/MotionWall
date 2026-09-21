import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Wallpaper, EngineType } from '../types';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, RefreshCw } from 'lucide-react';
import { soundEngine, triggerHaptic } from '../utils/audio';

interface WallpaperEngineProps {
  wallpaper: Wallpaper;
  aspectRatio?: '19.5:9' | '20:9' | '16:9' | 'full';
  interactive?: boolean;
  autoPlay?: boolean;
  quality?: 'high' | 'saver';
  showControls?: boolean;
  onFullScreen?: () => void;
  className?: string;
  speedMultiplier?: number;
  bloomIntensity?: number;
}

export const WallpaperEngine: React.FC<WallpaperEngineProps> = ({
  wallpaper,
  aspectRatio = '19.5:9',
  interactive = true,
  autoPlay = true,
  quality = 'high',
  showControls = true,
  onFullScreen,
  className = '',
  speedMultiplier = 1.0,
  bloomIntensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [interactiveSparkles, setInteractiveSparkles] = useState<{ x: number; y: number; id: number; color: string }[]>([]);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const touchPointsRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string }[]>([]);

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    triggerHaptic('light');
  };

  // Toggle audio
  const toggleAudio = () => {
    const audioCategory =
      wallpaper.category === 'cyberpunk' || wallpaper.category === 'gaming' || wallpaper.category === 'neon'
        ? 'cyber'
        : wallpaper.category === 'space' || wallpaper.category === 'scifi'
        ? 'cosmic'
        : 'relax';
    const active = soundEngine.toggle(audioCategory);
    setIsMuted(!active);
    triggerHaptic('medium');
  };

  // Handle pointer interaction (interactive spark trails)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!interactive) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Add trail particles
      const colors = wallpaper.colors || ['#00f0ff', '#ff0077', '#a855f7'];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < 3; i++) {
        touchPointsRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1.0,
          color: chosenColor,
        });
      }

      if (Math.random() < 0.2) {
        setInteractiveSparkles((prev) => [
          ...prev.slice(-10),
          { x, y, id: Date.now() + Math.random(), color: chosenColor },
        ]);
      }
    },
    [interactive, wallpaper.colors]
  );

  // Procedural 60 FPS Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 640);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 360;
      height = canvas.height = canvas.parentElement.clientHeight || 640;
    };

    window.addEventListener('resize', handleResize);

    // Color extraction
    const [c1, c2, c3] = wallpaper.colors || ['#00f0ff', '#ff0077', '#090a14'];
    const engineType: EngineType = wallpaper.engineType || 'particles';

    // Particle pool for space / particles / sakura / rain
    const particleCount = quality === 'high' ? 80 : 40;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      radius: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    let lastFrameTime = performance.now();
    const targetFps = quality === 'high' ? 60 : 30;
    const frameInterval = 1000 / targetFps;

    const render = (time: number) => {
      const elapsed = time - lastFrameTime;

      if (!isPlayingRef.current) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      if (elapsed < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      lastFrameTime = time - (elapsed % frameInterval);
      const t = (time - startTimeRef.current) * 0.001 * speedMultiplier;

      // Clear with deep space/black base
      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, width, height);

      // Render based on Engine Type
      switch (engineType) {
        case 'blackhole': {
          // Accretion disk & gravitational lensing
          const cx = width / 2;
          const cy = height * 0.45;
          const r = Math.min(width, height) * 0.22;

          // Outer glowing accretion disk
          const grad = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 2.4);
          grad.addColorStop(0, 'rgba(255, 200, 50, 0.95)');
          grad.addColorStop(0.3, c1);
          grad.addColorStop(0.65, c2);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(t * 0.35);

          // Tilted elliptical accretion ring
          ctx.scale(1, 0.42);
          ctx.beginPath();
          ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Swirling particles in orbit
          for (let i = 0; i < 40; i++) {
            const angle = i * 0.15 + t * (1.2 + i * 0.02);
            const dist = r * (0.85 + (i % 12) * 0.1);
            const px = Math.cos(angle) * dist;
            const py = Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = i % 2 === 0 ? '#fff' : c1;
            ctx.fill();
          }
          ctx.restore();

          // Black hole event horizon (pure light-absorbent sphere)
          ctx.beginPath();
          ctx.arc(cx, cy, r * 0.82, 0, Math.PI * 2);
          ctx.fillStyle = '#000000';
          ctx.fill();

          // Relativistic photon ring glow
          ctx.beginPath();
          ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 240, 200, ${0.7 + Math.sin(t * 3) * 0.2})`;
          ctx.lineWidth = 3;
          ctx.stroke();
          break;
        }

        case 'galaxy':
        case 'nebula': {
          // Spiral galaxy arms or cosmic dust
          const cx = width / 2;
          const cy = height * 0.48;

          // Background nebula cloud
          const nebulaGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.8);
          nebulaGrad.addColorStop(0, `${c2}33`);
          nebulaGrad.addColorStop(0.5, `${c1}22`);
          nebulaGrad.addColorStop(1, 'rgba(5, 7, 14, 0)');
          ctx.fillStyle = nebulaGrad;
          ctx.fillRect(0, 0, width, height);

          // Spiral arms stars
          const starsCount = quality === 'high' ? 120 : 60;
          for (let i = 0; i < starsCount; i++) {
            const arm = i % 2 === 0 ? 0 : Math.PI;
            const dist = (i / starsCount) * (width * 0.45);
            const angle = arm + dist * 0.035 + t * 0.25;
            const sx = cx + Math.cos(angle) * dist;
            const sy = cy + Math.sin(angle) * dist * 0.55;

            ctx.beginPath();
            ctx.arc(sx, sy, Math.sin(t * 2 + i) * 1.2 + 1.8, 0, Math.PI * 2);
            ctx.fillStyle = i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? c1 : c2;
            ctx.fill();
          }
          break;
        }

        case 'cyberpunk_city':
        case 'matrix': {
          // Perspective neon grid & digital rain
          const horizonY = height * 0.65;

          // Sky gradient with neon haze
          const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
          skyGrad.addColorStop(0, '#04050a');
          skyGrad.addColorStop(0.7, `${c2}22`);
          skyGrad.addColorStop(1, `${c1}44`);
          ctx.fillStyle = skyGrad;
          ctx.fillRect(0, 0, width, horizonY);

          // Distant skyscrapers silhouettes
          ctx.fillStyle = '#0a0d18';
          const buildingWidths = [45, 60, 35, 55, 70, 40, 50, 65, 45, 55];
          let bx = 0;
          buildingWidths.forEach((bw, idx) => {
            const bh = 80 + ((idx * 37) % 110);
            ctx.fillRect(bx, horizonY - bh, bw, bh);
            // Neon windows
            for (let wy = horizonY - bh + 10; wy < horizonY - 10; wy += 14) {
              if ((idx + wy) % 5 === 0) {
                ctx.fillStyle = (idx + wy) % 2 === 0 ? c1 : c2;
                ctx.fillRect(bx + 8, wy, 4, 6);
                ctx.fillStyle = '#0a0d18';
              }
            }
            bx += bw + 5;
          });

          // Moving 3D Cyber grid floor
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, horizonY, width, height - horizonY);
          ctx.clip();

          // Vanishing point lines
          const vpX = width / 2;
          ctx.strokeStyle = `${c1}66`;
          ctx.lineWidth = 1.5;

          for (let x = -width; x <= width * 2; x += 35) {
            ctx.beginPath();
            ctx.moveTo(vpX, horizonY);
            ctx.lineTo(x, height);
            ctx.stroke();
          }

          // Horizontal lines moving forward
          const gridSpeed = (t * 60) % 30;
          for (let d = 0; d < height - horizonY; d += 22) {
            const progress = (d + gridSpeed) / (height - horizonY);
            const lineY = horizonY + Math.pow(progress, 2.2) * (height - horizonY);
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(width, lineY);
            ctx.strokeStyle = `rgba(0, 240, 255, ${progress * 0.75})`;
            ctx.stroke();
          }
          ctx.restore();

          // Falling digital rain or neon drops
          particles.forEach((p) => {
            p.y = (p.y + p.vy * 4) % height;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + 12);
            ctx.strokeStyle = `${c1}aa`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          });
          break;
        }

        case 'aurora':
        case 'waves': {
          // Undulating organic ribbons of light
          const bands = 5;
          for (let b = 0; b < bands; b++) {
            ctx.beginPath();
            const bandColor = b % 2 === 0 ? c1 : c2;
            ctx.strokeStyle = `${bandColor}88`;
            ctx.lineWidth = 30 + b * 10;
            ctx.lineCap = 'round';

            for (let x = 0; x <= width; x += 15) {
              const y =
                height * (0.3 + b * 0.09) +
                Math.sin(x * 0.008 + t * 1.5 + b) * 45 +
                Math.cos(x * 0.012 - t * 0.8) * 30;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }

          // Floating background stars
          particles.slice(0, 35).forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(t * 3 + p.phase) * 0.4 + 0.6})`;
            ctx.fill();
          });
          break;
        }

        case 'liquidgold': {
          // Molten fluid metallic waves
          for (let layer = 0; layer < 4; layer++) {
            ctx.beginPath();
            const layerGrad = ctx.createLinearGradient(0, height * 0.2, width, height);
            layerGrad.addColorStop(0, c1);
            layerGrad.addColorStop(0.5, c2);
            layerGrad.addColorStop(1, '#000000');

            ctx.fillStyle = layerGrad;
            ctx.moveTo(0, height);

            for (let x = 0; x <= width; x += 12) {
              const y =
                height * (0.45 + layer * 0.12) +
                Math.sin(x * 0.01 + t * (1.2 - layer * 0.2) + layer) * (35 + layer * 10) +
                Math.cos(x * 0.006 - t * 0.6) * 20;
              ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.globalAlpha = 0.65;
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
          break;
        }

        case 'synthwave':
        case 'supercar': {
          // Giant synthwave sun and wireframe road
          const cx = width / 2;
          const sunY = height * 0.4;
          const sunRadius = Math.min(width, height) * 0.25;

          // Sun with horizontal scanline slices
          const sunGrad = ctx.createLinearGradient(cx, sunY - sunRadius, cx, sunY + sunRadius);
          sunGrad.addColorStop(0, '#ff0077');
          sunGrad.addColorStop(1, '#ffaa00');

          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, sunY, sunRadius, 0, Math.PI * 2);
          ctx.fillStyle = sunGrad;
          ctx.fill();

          // Cut horizontal slices out of bottom half of sun
          ctx.fillStyle = '#06070a';
          for (let i = 0; i < 7; i++) {
            const sy = sunY + (i / 7) * sunRadius;
            const sliceH = (i + 1) * 1.8;
            ctx.fillRect(cx - sunRadius, sy, sunRadius * 2, sliceH);
          }
          ctx.restore();

          // Road perspective
          ctx.save();
          const roadH = height - (sunY + sunRadius * 0.6);
          const roadY = sunY + sunRadius * 0.6;
          ctx.beginPath();
          ctx.moveTo(cx - 10, roadY);
          ctx.lineTo(cx + 10, roadY);
          ctx.lineTo(width * 0.85, height);
          ctx.lineTo(width * 0.15, height);
          ctx.closePath();
          ctx.fillStyle = '#0a0d18';
          ctx.fill();
          ctx.strokeStyle = c1;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Center dash line moving
          const dashOffset = (t * 120) % 40;
          ctx.strokeStyle = '#ffff00';
          ctx.lineWidth = 3;
          ctx.setLineDash([20, 20]);
          ctx.lineDashOffset = -dashOffset;
          ctx.beginPath();
          ctx.moveTo(cx, roadY);
          ctx.lineTo(cx, height);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
          break;
        }

        case 'lightning':
        case 'plasma': {
          // High voltage electrical arcs
          const cx = width / 2;
          const cy = height / 2;

          // Central plasma ball
          const orbGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 65);
          orbGrad.addColorStop(0, '#ffffff');
          orbGrad.addColorStop(0.4, c1);
          orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = orbGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, 65, 0, Math.PI * 2);
          ctx.fill();

          // Branching lightning bolts
          const boltCount = 6;
          for (let b = 0; b < boltCount; b++) {
            const angle = (b / boltCount) * Math.PI * 2 + t * 0.5;
            let lx = cx + Math.cos(angle) * 30;
            let ly = cy + Math.sin(angle) * 30;
            const targetX = cx + Math.cos(angle + (Math.random() - 0.5) * 0.5) * (width * 0.42);
            const targetY = cy + Math.sin(angle + (Math.random() - 0.5) * 0.5) * (height * 0.42);

            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.strokeStyle = b % 2 === 0 ? c1 : c2;
            ctx.lineWidth = Math.random() * 2 + 1.2;

            for (let s = 0; s < 7; s++) {
              lx += (targetX - lx) * 0.28 + (Math.random() - 0.5) * 22;
              ly += (targetY - ly) * 0.28 + (Math.random() - 0.5) * 22;
              ctx.lineTo(lx, ly);
            }
            ctx.stroke();
          }
          break;
        }

        case 'sakura': {
          // Falling Japanese cherry blossom petals
          particles.forEach((p) => {
            p.y = (p.y + p.vy * 1.8) % height;
            p.x = (p.x + Math.sin(t * 2 + p.phase) * 1.5 + width) % width;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(t * p.z + p.phase);
            ctx.beginPath();
            ctx.ellipse(0, 0, p.radius * 2.8, p.radius * 1.4, 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 180, 210, ${p.alpha})`;
            ctx.fill();
            ctx.restore();
          });
          break;
        }

        default: {
          // Dynamic floating kinetic particles with velocity & links
          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
            ctx.fillStyle = p.z > 1.8 ? c1 : c2;
            ctx.shadowBlur = 12 * bloomIntensity;
            ctx.shadowColor = c1;
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          // Draw interconnecting energy webs between close particles
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x;
              const dy = particles[i].y - particles[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 85) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 85) * 0.25})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          }
          break;
        }
      }

      // Render interactive touch points & sparks
      for (let i = touchPointsRef.current.length - 1; i >= 0; i--) {
        const tp = touchPointsRef.current[i];
        tp.x += tp.vx;
        tp.y += tp.vy;
        tp.life -= 0.04;

        if (tp.life <= 0) {
          touchPointsRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(tp.x, tp.y, tp.life * 4, 0, Math.PI * 2);
        ctx.fillStyle = tp.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = tp.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [wallpaper, quality, speedMultiplier, bloomIntensity]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none bg-neutral-950 ${className}`}
      style={{
        aspectRatio:
          aspectRatio === '19.5:9'
            ? '9 / 19.5'
            : aspectRatio === '20:9'
            ? '9 / 20'
            : aspectRatio === '16:9'
            ? '9 / 16'
            : 'auto',
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        className="w-full h-full block cursor-crosshair active:scale-[0.99] transition-transform duration-150"
      />

      {/* Interactive sparkles DOM floating indicators */}
      {interactiveSparkles.map((sp) => (
        <span
          key={sp.id}
          className="pointer-events-none absolute w-2 h-2 rounded-full animate-ping"
          style={{
            left: sp.x,
            top: sp.y,
            backgroundColor: sp.color,
            boxShadow: `0 0 10px ${sp.color}`,
          }}
        />
      ))}

      {/* Subtle bottom vignette gradient so overlays are legible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

      {/* Floating Micro Controls (Play, Audio, Fullscreen) */}
      {showControls && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          <button
            id={`btn-toggle-sound-${wallpaper.id}`}
            onClick={toggleAudio}
            title={isMuted ? 'Unmute Ambient Drone' : 'Mute Ambient Drone'}
            className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          <button
            id={`btn-toggle-play-${wallpaper.id}`}
            onClick={togglePlay}
            title={isPlaying ? 'Pause Animation' : 'Play Animation'}
            className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />}
          </button>

          {onFullScreen && (
            <button
              id={`btn-fullscreen-${wallpaper.id}`}
              onClick={onFullScreen}
              title="Full-screen View"
              className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-white/80" />
            </button>
          )}
        </div>
      )}

      {/* FPS & 4K Tag */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none z-20">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-black/60 border border-cyan-500/30 text-cyan-400 backdrop-blur-md flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          60 FPS
        </span>
      </div>
    </div>
  );
};
