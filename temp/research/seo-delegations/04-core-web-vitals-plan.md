# Core Web Vitals Optimization Plan (SEO-Focused)

## Executive Priority Order

1. **Cut JS execution and third-party overhead above the fold** (largest SEO gain for LCP + INP)
2. **Stabilize layout for all images/cards** (fastest route to CLS < 0.1)
3. **Improve server and cache strategy for HTML/critical assets** (TTFB + faster repeat visits)
4. **Add continuous field measurement (RUM) + CI budgets** (prevents regressions)

---

## Current Repository Signals (What matters most)

- `index.html` loads **`/webflow.js` (~242 KB)** and external **jQuery** on every page load.
- `src/components/sections/TechStackSection.jsx` imports `AIWorkflowDiagram` but does not render it; this can pull `reactflow` code/CSS into the critical bundle path.
- Production JS bundle is currently ~**354 KB** (`dist/assets/index-*.js`), which is high for a one-page portfolio.
- Several images are large for their visual use (example: `public/images/suryavanshi-logo.svg` ~938 KB, `public/images/rgpv-logo.png` ~446 KB).
- Multiple `<img>` tags are missing explicit `width`/`height` or controlled aspect-ratio, increasing CLS risk.

---

## Prioritized Recommendations (Impact / Effort)

| Priority | Recommendation | CWV Impact | Effort | Why this matters for SEO |
|---|---|---|---|---|
| P0 | Remove or defer legacy Webflow/jQuery runtime from `index.html` | LCP: High, INP: High | M | Reduces parse/execute time and main-thread blocking on initial load. |
| P0 | Remove unused `AIWorkflowDiagram` import or lazy-load diagram-only code | LCP: High, INP: Medium | S | Prevents non-critical graph/animation code from shipping in initial route. |
| P0 | Define fixed image dimensions/aspect-ratio across cards, logos, blog thumbnails | CLS: High | S | Directly reduces unexpected layout movement (ranking + UX). |
| P1 | Optimize oversized image assets (SVG simplification, responsive WebP/AVIF variants) | LCP: High, CLS: Medium | M | Smaller transfer + faster decode for hero and project visuals. |
| P1 | Defer below-the-fold sections with code splitting (`BlogSection`, heavy interactive parts) | LCP: Medium, INP: High | M | Keeps first render cheap and improves interaction responsiveness. |
| P1 | Reduce animation CPU work and avoid unnecessary console logging in production | INP: Medium | S | Improves responsiveness under scroll/tap load on mobile. |
| P2 | Harden TTFB via CDN edge caching + compression + immutable asset caching | TTFB: High | M | Better crawl efficiency and p75 mobile speed stability. |
| P2 | Add preconnect/preload only for true critical resources | LCP: Medium | S | Prioritizes resource loading for above-the-fold content. |

---

## Code-Level Actions

### 1) Remove/defer non-critical scripts in `index.html`

**File:** `index.html`

- Re-evaluate need for:
  - `https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1...`
  - `/webflow.js`
- If still required for specific effects, load after hydration and idle time rather than on first paint.

Example strategy:

```html
<!-- Keep critical app bootstrap only -->
<script type="module" src="/src/main.jsx"></script>

<!-- Load legacy scripts only if needed, deferred -->
<script defer src="/webflow.js"></script>
```

If those scripts are not needed anymore, remove them entirely (best outcome).

---

### 2) Eliminate non-critical imports from initial bundle

**File:** `src/components/sections/TechStackSection.jsx`

- Remove unused `AIWorkflowDiagram` import if not rendered.
- If diagram is planned later, lazy-load with dynamic import and render only when visible.

Example:

```jsx
const AIWorkflowDiagram = React.lazy(() => import('./AIWorkflowDiagram'));
```

Then gate rendering with intersection observer for below-the-fold content.

---

### 3) Enforce CLS-safe images

**Files:**
- `src/components/sections/ProjectSection.jsx`
- `src/components/sections/TechStackSection.jsx`
- `src/components/sections/BlogSection.jsx`
- `src/components/sections/EducationCard.jsx`
- `src/components/sections/ProjectItem.jsx`

Actions:
- Add explicit `width` and `height` attributes wherever possible.
- Add `decoding="async"` for non-critical images.
- Use `loading="lazy"` for below-fold images; keep above-fold image eager.
- Add CSS `aspect-ratio` for image containers to reserve space.

Example:

```jsx
<img
  src={project.imageSrc}
  alt={project.title}
  width="320"
  height="180"
  loading="lazy"
  decoding="async"
/>
```

---

### 4) Prioritize true LCP resource

**Likely LCP candidates:** hero text block, hero visual (`/images/avatar.png`), or top card.

**Files:** `index.html`, `src/components/sections/HeroCard.jsx`

- If hero image becomes LCP, set:
  - `fetchpriority="high"`
  - `loading="eager"`
  - Optional `<link rel="preload" as="image" href="/images/avatar.png">`
- Keep only one high-priority image.

---

### 5) Improve runtime responsiveness (INP)

**Files:** `src/hooks/useScrollAnimation.js`, animation-heavy components

- Remove production `console.log`/`console.error` noise in hot paths.
- Reduce number of simultaneously animated elements.
- Prefer transform/opacity only (already mostly true) and lower animation duration for mobile.
- Respect `prefers-reduced-motion` and skip non-essential motion.

---

### 6) Vite bundling and chunk strategy

**File:** `vite.config.js`

- Split vendor chunks to isolate infrequently needed code.
- Lazy-load below-fold sections and interactive libraries.
- Add build budget checks in CI (fail PR when JS/CSS grows beyond budget).

---

## Asset-Level Actions

### Image and icon optimization

**Directory:** `public/images`

- Compress/clean large SVGs (especially `suryavanshi-logo.svg`).
- Convert large PNG/JPG to modern formats (`.webp` / `.avif`) where acceptable.
- Generate responsive sizes for blog/project thumbnails (e.g., 320/640/960 widths).
- Replace remote `cdn.simpleicons.org` runtime icon fetches with local sprite/optimized static assets to avoid many network round-trips.

### Caching policy

- Serve hashed assets (`dist/assets/*`) with:
  - `Cache-Control: public, max-age=31536000, immutable`
- Serve HTML with short cache and revalidation:
  - `Cache-Control: public, max-age=0, s-maxage=600, stale-while-revalidate=86400`

### Transport and compression

- Enable Brotli for text assets (HTML/CSS/JS/SVG).
- Ensure HTTP/2 or HTTP/3 at edge.
- Preconnect only to required external origins (or remove dependency entirely).

---

## Measurement Plan (Lab + Field)

## 1) Target thresholds (p75, mobile-first)

- **LCP:** <= **2.5s** (goal stretch: <= 2.0s)
- **INP:** <= **200ms** (goal stretch: <= 150ms)
- **CLS:** <= **0.10** (goal stretch: <= 0.05)
- **TTFB:** <= **800ms** (goal stretch: <= 500ms at edge)

## 2) Baseline + cadence

- Capture baseline before changes:
  - Lighthouse (mobile, throttled) x3 runs and median
  - PageSpeed Insights field + lab snapshot
  - Chrome DevTools performance trace for initial load
- Re-run after each P0/P1 batch.
- Weekly CWV trend check until stable for 28-day window.

## 3) Instrument real-user monitoring (RUM)

Implement `web-vitals` reporting in production and ship to analytics endpoint.

Example:

```js
import { onCLS, onINP, onLCP, onTTFB } from 'web-vitals';

const report = (metric) => {
  navigator.sendBeacon('/analytics/vitals', JSON.stringify(metric));
};

onCLS(report);
onINP(report);
onLCP(report);
onTTFB(report);
```

Track by route, device type, and connection class.

## 4) CI guardrails

- Add Lighthouse CI or equivalent in PR pipeline.
- Fail PR if:
  - LCP score regresses >10%
  - INP/TBT proxy regresses >10%
  - JS bundle budget exceeded (e.g., initial JS > 220 KB gzip target)

---

## Suggested Implementation Sequence (2-week sprint)

### Sprint A (Highest ROI)

1. Remove/defer `webflow.js` + jQuery.
2. Remove unused `AIWorkflowDiagram` import and verify bundle drop.
3. Add image dimensions/aspect-ratio fixes across key components.

### Sprint B (Stabilize and scale)

4. Optimize oversized image assets and localize external icon dependencies.
5. Add lazy loading/chunking for below-the-fold sections.
6. Ship RUM + CI budgets.

---

## Success Criteria

- Mobile p75 CWV enters green zone for all 4 tracked metrics.
- Initial JS payload reduced materially from current level.
- No significant CLS spikes during image/blog/content hydration.
- Performance regressions blocked automatically in CI.
