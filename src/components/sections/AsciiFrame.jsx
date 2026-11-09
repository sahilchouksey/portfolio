import React, { memo, useRef, useEffect, useState } from 'react';
import frameArt from '../../assets/sky-frame.txt?raw';

/**
 * AsciiFrame: the original sky-frame character border. Themed from the site's
 * own tokens, and active exactly like the micro figures: it traces in once
 * (the sweep), then a bright patch of the same glyphs follows the pointer on
 * a spring — and the loop stops dead when the pointer leaves. Nothing runs
 * on its own.
 */
const AsciiFrame = memo(({
  color = 'var(--text-secondary)',
  opacity = 0.55,
  className = '',
  enableGlow = true,
}) => {
  const containerRef = useRef(null);
  const preRef = useRef(null);
  const glowRef = useRef(null);
  const pointer = useRef(null);
  const [transform, setTransform] = useState('scale(1)');
  const [showSweep, setShowSweep] = useState(false);

  // Scale frame to fit container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !preRef.current) return;
      const container = containerRef.current;
      const pre = preRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const preWidth = pre.scrollWidth;
      const preHeight = pre.scrollHeight;
      if (preWidth === 0 || preHeight === 0) return;
      setTransform(`scale(${containerWidth / preWidth}, ${containerHeight / preHeight})`);
    };

    const timer = setTimeout(updateScale, 50);
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Verify the sweep animation triggered once on page load
  useEffect(() => {
    const timer = setTimeout(() => setShowSweep(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Spring-followed lit patch: the pointer sets a target, one rAF eases the
  // patch toward it, and the rAF stops the moment the pointer is gone.
  useEffect(() => {
    const c = containerRef.current;
    if (!c || !glowRef.current || !enableGlow) return undefined;
    const S = { x: 0, y: 0, tx: 0, ty: 0, raf: 0, on: false };
    const tick = () => {
      S.x += (S.tx - S.x) * 0.14; /* the figure's easing — settles, no snap */
      S.y += (S.ty - S.y) * 0.14;
      c.style.setProperty('--mx', `${Math.round(S.x)}px`);
      c.style.setProperty('--my', `${Math.round(S.y)}px`);
      if (S.on || Math.abs(S.tx - S.x) > 0.6 || Math.abs(S.ty - S.y) > 0.6) {
        S.raf = requestAnimationFrame(tick);
      }
    };
    const move = (e) => {
      const r = c.getBoundingClientRect();
      const nx = e.clientX - r.left, ny = e.clientY - r.top;
      if (!S.on) { S.on = true; S.x = nx; S.y = ny; }
      S.tx = nx; S.ty = ny;
      c.style.setProperty('--map-on', '1');
      if (!S.raf) S.raf = requestAnimationFrame(tick);
    };
    const leave = () => {
      S.on = false;
      c.style.setProperty('--map-on', '0');
    };
    c.addEventListener('pointermove', move);
    c.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(S.raf);
      c.removeEventListener('pointermove', move);
      c.removeEventListener('pointerleave', leave);
    };
  }, [enableGlow]);

  // Sweep overlay: once on load, freshly on hover
  const handleMouseEnter = () => {
    if (!showSweep) {
      setShowSweep(true);
      setTimeout(() => setShowSweep(false), 4000);
    }
  };

  const frameClasses = ['ascii-frame', enableGlow ? 'ascii-frame--glow' : ''].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={`ascii-frame-container ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ pointerEvents: 'auto' }}
    >
      {/* the plain character border */}
      <pre ref={preRef} className={frameClasses} style={{ color, opacity, transform, transformOrigin: 'top left' }} aria-hidden="true">
        {frameArt}
      </pre>

      {/* the lit patch: the same glyphs, brighter, masked to a small pool
          around the cursor — this is what makes the border answer you */}
      {enableGlow && (
        <div ref={glowRef} className="ascii-frame-glow" aria-hidden="true">
          <pre className="ascii-frame ascii-frame--lit" style={{ transform, transformOrigin: 'top left' }}>
            {frameArt}
          </pre>
        </div>
      )}

      {/* Shine sweep - only visible when triggered */}
      {showSweep && <div className="shine-sweep-overlay shine-sweep-active" />}
    </div>
  );
});

AsciiFrame.displayName = 'AsciiFrame';

export default AsciiFrame;
