import { useEffect, useRef } from "react";
import HL from "./kernel.js";
import FIGS from "./figures/index.js";

const NS = "http://www.w3.org/2000/svg";

/**
 * <MicroFigure name="pin" /> mounts a hairline figure into a 400 × 320
 * viewBox stage that sizes itself to its container (aspect 5/4). The site's
 * theme (data-theme + color-scheme on <html>) drives the light/dark palettes
 * through the kernel's injected CSS. Hover/click interactions come with the
 * figure. The optional read line shows the figure's own wordy read-out.
 */
export default function MicroFigure({
  name,
  read = true,
  readRef,
  figRef,
  value,
  className = "",
  style,
  stretch = false, /* preserveAspectRatio:none — frame-like figures that hug the box */
  clip = false, /* hard-clip the svg at its box instead of overflowing it */
  bombers = false, /* the B2 bombers fly only when this is on */
}) {
  const ref = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return undefined;
    const fig = FIGS[name];
    if (!fig) { console.error("[micro] no figure:", name); return undefined; }

    HL.inject(document);
    host.innerHTML = "";
    host.setAttribute("data-hairline", name);
    host.setAttribute("role", "img");
    host.setAttribute("aria-label", name);

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", fig.viewBox || "0 0 400 320");
    svg.setAttribute("aria-hidden", "true");
    if (stretch) svg.setAttribute("preserveAspectRatio", "none");
    svg.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block;overflow:${clip ? "hidden" : "visible"}`;
    host.appendChild(svg);

    const readEl = document.createElement("div");
    readEl.style.cssText =
      "position:absolute;left:10%;right:10%;bottom:6px;font:11px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:#7ee0f0;opacity:0;pointer-events:none;transition:opacity .25s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left";
    if (read) host.appendChild(readEl);
    const ro = {
      get textContent() { return readEl.textContent; },
      set textContent(v) {
        readEl.textContent = v == null ? "" : String(v);
        readEl.style.opacity = v ? "0.95" : "0";
        const alt = readRef?.current;
        if (alt) {
          alt.textContent = v == null ? "" : String(v);
          alt.style.opacity = v ? "0.95" : "0.75";
        }
      },
    };

    let handle;
    try {
      const mid = value ?? (fig.range ? (fig.range[0] + fig.range[1]) / 2 : undefined);
      handle = fig.mount({ stage: host, svg, read: ro }, mid);
      handleRef.current = handle;
      if (figRef) figRef.current = handle;
    } catch (e) {
      console.error("[micro]", name, e);
    }

    return () => {
      if (figRef) figRef.current = null;
      handleRef.current = null;
      try { handle?.destroy?.(); } catch { /* the kernel cleans the loop */ }
      host.innerHTML = "";
      host.removeAttribute("data-hairline");
      host.removeAttribute("role");
      host.removeAttribute("aria-label");
    };
  }, [name, value, readRef?.current]);

  /* the B2 toggle: flip the fleet on/off in place, no remount */
  useEffect(() => {
    const host = ref.current;
    const handle = handleRef.current;
    if (handle?.setBombers) handle.setBombers(!!bombers);
    else if (host) host.style.setProperty("--bombers-on", bombers ? "1" : "0");
  }, [bombers]);

  return <div ref={ref} className={`micro-fig ${className}`} style={{ position: "relative", aspectRatio: "5 / 4", width: "100%", ...style }} />;
}
