import React, { memo, useRef, useEffect, useState } from 'react';
import frameArt from '../../assets/sky-frame.txt?raw';

const AsciiFrame = memo(({
  color = '#FFD700',
  opacity = 0.9,
  className = '',
  enableGlow = true
}) => {
  const containerRef = useRef(null);
  const preRef = useRef(null);
  const [transform, setTransform] = useState('scale(1)');

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !preRef.current) return;
      
      const container = containerRef.current;
      const pre = preRef.current;
      
      // Get container dimensions
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Get natural pre dimensions
      const preWidth = pre.scrollWidth;
      const preHeight = pre.scrollHeight;
      
      if (preWidth === 0 || preHeight === 0) return;
      
      // Calculate scale to fill entire container (cover, not contain)
      const scaleX = containerWidth / preWidth;
      const scaleY = containerHeight / preHeight;
      
      setTransform(`scale(${scaleX}, ${scaleY})`);
    };

    // Initial calculation
    const timer = setTimeout(updateScale, 50);
    
    // Observe container resize
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`ascii-frame-container ${className}`}>
      <pre
        ref={preRef}
        className={`ascii-frame ${enableGlow ? 'ascii-frame--glow' : ''}`}
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
    </div>
  );
});

AsciiFrame.displayName = 'AsciiFrame';

export default AsciiFrame;
