import React, { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const CustomCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);

  // Mouse positions
  const mouseRef = useRef({ x: -100, y: -100 });
  const prevMouseRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const isVisibleRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isTextTargetRef = useRef(false);
  const isMouseDownRef = useRef(false);

  // Magnetic state
  const magneticTargetRef = useRef<HTMLElement | null>(null);
  const magneticCenterRef = useRef<{ x: number; y: number } | null>(null);

  // Staggered echo trail nodes
  const ECHO_COUNT = 4;
  const echoPosRef = useRef(Array.from({ length: ECHO_COUNT }, () => ({ x: -100, y: -100 })));
  const echoRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Trail and ripples
  const trailRef = useRef<TrailPoint[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // UI state for reactive classes
  const [cursorState, setCursorState] = useState<{
    visible: boolean;
    hovered: boolean;
    text: boolean;
    mouseDown: boolean;
    magnetic: boolean;
  }>({
    visible: false,
    hovered: false,
    text: false,
    mouseDown: false,
    magnetic: false,
  });

  useEffect(() => {
    // Only run on client side and if device supports fine pointer
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      return;
    }

    // Add custom cursor active class to document
    document.documentElement.classList.add('custom-cursor-enabled');

    // Canvas setup
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Track mouse move
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        ringPosRef.current.x = e.clientX;
        ringPosRef.current.y = e.clientY;
        setCursorState((s) => ({ ...s, visible: true }));
      }

      // Calculate movement velocity
      const vx = e.clientX - prevMouseRef.current.x;
      const vy = e.clientY - prevMouseRef.current.y;
      const speed = Math.sqrt(vx * vx + vy * vy);

      prevMouseRef.current.x = e.clientX;
      prevMouseRef.current.y = e.clientY;

      // Add trail point when moving
      if (speed > 1.2) {
        trailRef.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.min(6, Math.max(2.5, speed * 0.15)),
          alpha: 0.75,
          vx: -vx * 0.08,
          vy: -vy * 0.08,
        });

        // Limit trail length
        if (trailRef.current.length > 28) {
          trailRef.current.shift();
        }
      }

      // Check for magnetic interactive targets
      checkMagneticTarget(e.clientX, e.clientY);
    };

    // Check magnetic target
    const checkMagneticTarget = (clientX: number, clientY: number) => {
      const target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
      if (!target) {
        releaseMagnetic();
        return;
      }

      // Detect clickable / magnetic interactive elements
      const interactiveEl = target.closest<HTMLElement>(
        'button, a, input, select, textarea, [role="button"], [data-magnetic], .cursor-pointer'
      );

      const isText =
        (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'text') ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      isTextTargetRef.current = isText;

      if (interactiveEl && !isText) {
        if (magneticTargetRef.current && magneticTargetRef.current !== interactiveEl) {
          releaseMagnetic();
        }

        isHoveredRef.current = true;
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Apply magnetic pull if reasonably sized (not full-page containers)
        if (rect.width < 450 && rect.height < 180) {
          magneticTargetRef.current = interactiveEl;
          magneticCenterRef.current = { x: centerX, y: centerY };

          // Pull the element subtly towards the cursor (magnetic feel)
          const distMagX = (clientX - centerX) * 0.24;
          const distMagY = (clientY - centerY) * 0.24;
          interactiveEl.style.transform = `translate3d(${distMagX}px, ${distMagY}px, 0px)`;
          interactiveEl.style.transition = 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)';
        } else {
          releaseMagnetic();
        }

        setCursorState((s) => ({
          ...s,
          hovered: true,
          text: false,
          magnetic: !!magneticCenterRef.current,
        }));
      } else {
        releaseMagnetic();
        isHoveredRef.current = false;
        setCursorState((s) => ({
          ...s,
          hovered: false,
          text: isText,
          magnetic: false,
        }));
      }
    };

    const releaseMagnetic = () => {
      if (magneticTargetRef.current) {
        const el = magneticTargetRef.current;
        el.style.transform = '';
        el.style.transition = 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)';
        setTimeout(() => {
          if (el && el !== magneticTargetRef.current) {
            el.style.transition = '';
          }
        }, 260);
        magneticTargetRef.current = null;
        magneticCenterRef.current = null;
      }
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
      setCursorState((s) => ({ ...s, mouseDown: true }));

      // Create acoustic ripple on click
      ripplesRef.current.push({
        x: mouseRef.current.x,
        y: mouseRef.current.y,
        radius: 4,
        maxRadius: 36,
        alpha: 0.9,
      });
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      setCursorState((s) => ({ ...s, mouseDown: false }));
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      releaseMagnetic();
      setCursorState((s) => ({ ...s, visible: false }));
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setCursorState((s) => ({ ...s, visible: true }));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animation loop for physics, magnetic snapping, and trail rendering
    const render = () => {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // 1. Render acoustic ripples
        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const r = ripplesRef.current[i];
          r.radius += 1.8;
          r.alpha *= 0.92;

          ctx.save();
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(6, 182, 212, ${r.alpha.toFixed(3)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Second subtle harmonic wave
          if (r.radius > 10) {
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(59, 130, 246, ${(r.alpha * 0.5).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.restore();

          if (r.alpha < 0.02 || r.radius >= r.maxRadius) {
            ripplesRef.current.splice(i, 1);
          }
        }

        // 2. Render particle trail with acoustic pulse glow
        if (trailRef.current.length > 1) {
          ctx.save();
          for (let i = 0; i < trailRef.current.length; i++) {
            const p = trailRef.current[i];
            const progress = i / trailRef.current.length;

            p.x += p.vx;
            p.y += p.vy;
            p.alpha *= 0.92;
            p.size *= 0.96;

            const radius = Math.max(1, p.size * progress);
            const alpha = Math.max(0, p.alpha * progress);

            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            // Gradient from cyan to blue
            ctx.fillStyle = `rgba(6, 182, 212, ${alpha.toFixed(3)})`;
            ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
            ctx.shadowBlur = 6;
            ctx.fill();
          }

          // Connecting fluent fluid wave line between trail nodes
          ctx.beginPath();
          ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
          for (let i = 1; i < trailRef.current.length; i++) {
            const prev = trailRef.current[i - 1];
            const curr = trailRef.current[i];
            const midX = (prev.x + curr.x) / 2;
            const midY = (prev.y + curr.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
          }
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();

          // Clean up dead points
          while (trailRef.current.length > 0 && trailRef.current[0].alpha < 0.04) {
            trailRef.current.shift();
          }
        }
      }

      // 3. Update DOM cursor positions with smooth magnetic lerp
      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      // Magnetic snapping for the outer ring when over an element
      if (magneticCenterRef.current) {
        const mc = magneticCenterRef.current;
        // Blend 40% towards center of button for magnetic snap feel
        targetX = targetX * 0.6 + mc.x * 0.4;
        targetY = targetY * 0.6 + mc.y * 0.4;
      }

      // Smooth lerp for outer ring
      const ease = isHoveredRef.current ? 0.25 : 0.18;
      ringPosRef.current.x += (targetX - ringPosRef.current.x) * ease;
      ringPosRef.current.y += (targetY - ringPosRef.current.y) * ease;

      // Update staggered echo trail nodes
      let prevX = mouseRef.current.x;
      let prevY = mouseRef.current.y;
      for (let i = 0; i < ECHO_COUNT; i++) {
        const echo = echoPosRef.current[i];
        const delay = 0.38 - i * 0.07;
        echo.x += (prevX - echo.x) * delay;
        echo.y += (prevY - echo.y) * delay;
        prevX = echo.x;
        prevY = echo.y;

        const el = echoRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${echo.x}px, ${echo.y}px, 0px) translate(-50%, -50%)`;
        }
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0px) translate(-50%, -50%)`;
      }

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0px) translate(-50%, -50%)`;
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled');
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      releaseMagnetic();
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[100000] transition-opacity duration-300 ${
        cursorState.visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Background Canvas for fluid acoustic trail and ripples */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none w-full h-full"
      />

      {/* Staggered Echo Trail Beads */}
      {!cursorState.text && (
        <>
          {Array.from({ length: ECHO_COUNT }).map((_, idx) => {
            const size = Math.max(2, 5 - idx * 0.9);
            const opacity = 0.55 - idx * 0.12;
            return (
              <div
                key={idx}
                ref={(el) => {
                  echoRefs.current[idx] = el;
                }}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity,
                }}
                className="fixed top-0 left-0 pointer-events-none rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]"
              />
            );
          })}
        </>
      )}

      {/* Smooth Magnetic Outer Ring */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 pointer-events-none rounded-full transition-[width,height,background-color,border-color,transform] duration-200 ease-out flex items-center justify-center ${
          cursorState.text
            ? 'w-1 h-6 bg-cyan-400/90 border-0 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.8)]'
            : cursorState.magnetic
            ? 'w-12 h-12 border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_16px_rgba(6,182,212,0.4)] backdrop-blur-[1px]'
            : cursorState.hovered
            ? 'w-11 h-11 border border-cyan-400 bg-cyan-500/15 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
            : cursorState.mouseDown
            ? 'w-6 h-6 border border-cyan-400/80 bg-cyan-400/20'
            : 'w-8 h-8 border border-cyan-400/50 bg-cyan-400/5 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
        }`}
      >
        {/* Subtle acoustic crosshair tick marks when hovering */}
        {cursorState.hovered && !cursorState.text && (
          <div className="absolute inset-0 flex items-center justify-center opacity-60">
            <span className="w-1.5 h-[1px] bg-cyan-300 absolute left-0" />
            <span className="w-1.5 h-[1px] bg-cyan-300 absolute right-0" />
            <span className="h-1.5 w-[1px] bg-cyan-300 absolute top-0" />
            <span className="h-1.5 w-[1px] bg-cyan-300 absolute bottom-0" />
          </div>
        )}
      </div>

      {/* Center Precision Acoustic Dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 pointer-events-none rounded-full transition-transform duration-75 ${
          cursorState.text
            ? 'opacity-0'
            : cursorState.mouseDown
            ? 'w-3 h-3 bg-white shadow-[0_0_14px_rgba(255,255,255,0.9),0_0_6px_#06b6d4]'
            : cursorState.hovered
            ? 'w-2 h-2 bg-cyan-300 shadow-[0_0_10px_#06b6d4]'
            : 'w-2 h-2 bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
        }`}
      />
    </div>
  );
};
