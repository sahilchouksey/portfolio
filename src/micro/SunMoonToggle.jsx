import { useEffect, useRef } from "react";
import MicroFigure from "./MicroFigure";

/**
 * SunMoonToggle: the sun/moon figure standing in for the theme toggle. Dark
 * theme holds the crescent, light holds the sun; a click flips the site.
 */
export default function SunMoonToggle({ resolvedTheme, toggleTheme, className = "", size = 44 }) {
  const figRef = useRef(null);
  useEffect(() => {
    figRef.current?.set?.(resolvedTheme === "dark" ? 1 : 0);
  }, [resolvedTheme]);
  return (
    <div
      className={className}
      onClick={() => toggleTheme()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); }
      }}
      role="button"
      tabIndex={0}
      aria-label="Toggle colour theme"
      title="flip dark / light"
      style={{ cursor: 'pointer', userSelect: 'none', width: size }}
    >
      <MicroFigure name="sunmoon" read={false} figRef={figRef} />
    </div>
  );
}
