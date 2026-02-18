import React, { memo, useRef, useEffect, useState } from 'react';
import frameArt from '../../assets/sky-frame.txt?raw';

const AsciiFrame = memo(({
  color = '#FFD700',
  opacity = 0.9,
  className = '',
  enableGlow = true,
}) => {
  const containerRef = useRef(null);
  const preRef = useRef(null);
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
      
      const scaleX = containerWidth / preWidth;
      const scaleY = containerHeight / preHeight;
      
      setTransform(`scale(${scaleX}, ${scaleY})`);
    };

    const timer = setTimeout(updateScale, 50);
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Play sweep animation once on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSweep(true);
      // Hide after animation completes (4s duration)
      setTimeout(() => setShowSweep(false), 4000);
    }, 500); // Small delay after page load

    return () => clearTimeout(timer);
  }, []);

  // Handle hover - trigger sweep animation
  const handleMouseEnter = () => {
    if (!showSweep) {
      setShowSweep(true);
      setTimeout(() => setShowSweep(false), 4000);
    }
  };

  const frameClasses = [
    'ascii-frame',
    enableGlow ? 'ascii-frame--glow' : '',
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={containerRef} 
      className={`ascii-frame-container ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ pointerEvents: 'auto' }}
    >
      {/* The ASCII frame */}
      <pre
        ref={preRef}
        className={frameClasses}
        style={{ 
          color, 
          opacity,
          transform,
          transformOrigin: 'top left'
        }}
        aria-hidden="true"
      >
        {frameArt}
      </pre>
      
      {/* Shine sweep - only visible when triggered */}
      {showSweep && <div className="shine-sweep-overlay shine-sweep-active" />}
    </div>
  );
});

AsciiFrame.displayName = 'AsciiFrame';

export default AsciiFrame;
