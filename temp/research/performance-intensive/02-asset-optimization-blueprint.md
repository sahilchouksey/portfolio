# Asset Optimization Blueprint (Vite + React)

## Scope and Current Findings (from this repo)

- App uses Vite + React (`vite.config.js` is currently default/minimal).
- Large global CSS is loaded from `/original-styles.css` in `index.html` plus app CSS (`src/animations.css`).
- Legacy scripts are loaded on every page load:
  - jQuery from CloudFront
  - `/webflow.js`
- Heavy runtime libraries are bundled into initial app flow:
  - `reactflow` (`src/components/sections/AIWorkflowDiagram.jsx`)
  - `motion/react` (`src/components/RotatingText.jsx`)
- Images are mostly in `/public/images` as PNG/JPG/SVG; this bypasses Vite asset processing optimization by default.
- Fonts are declared in `public/original-styles.css` as remote OTF files (larger than WOFF2, slower decode).

---

## 1) Critical CSS Strategy

### Objectives

- Reduce render-blocking CSS for first paint (hero + nav + above-the-fold cards).
- Keep non-critical styles deferred without layout shift.

### Recommended Model

1. Split CSS into:
   - `critical.css` (nav, hero, base typography, root tokens, layout shell)
   - `app.css` (rest of sections/components)
2. Inline only `critical.css` in `index.html`.
3. Load non-critical CSS asynchronously.

### Vite-compatible implementation patterns

#### Pattern A (Simple and reliable)

- Create `src/styles/critical.css` and `src/styles/app.css`.
- Import `app.css` from `main.jsx`.
- Inline `critical.css` at build via a small Vite plugin that injects file contents into `<style>` in `index.html`.

Example `vite.config.js` concept:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'

function inlineCriticalCss() {
  return {
    name: 'inline-critical-css',
    transformIndexHtml(html) {
      const critical = fs.readFileSync('src/styles/critical.css', 'utf-8')
      return html.replace('<!-- critical-css -->', `<style>${critical}</style>`)
    },
  }
}

export default defineConfig({
  plugins: [react(), inlineCriticalCss()],
})
```

In `index.html`:

```html
<!-- critical-css -->
```

#### Pattern B (Automated extraction)

- Use a post-build `critical` generation script against built HTML/CSS.
- Best when CSS keeps changing and you want automated critical extraction.

### Guardrails

- Keep critical CSS budget around 12-18 KB gzip.
- Include only first viewport rules; move timeline/project/blog/footer styles out of critical.
- Keep design tokens in critical if they are used by above-the-fold components.

---

## 2) JS Chunking and Lazy Boundaries

### Objectives

- Reduce initial JS execution and parse time.
- Push non-essential libraries and sections behind viewport/user intent.

### Recommended boundaries for this codebase

1. **Immediate (eager):**
   - `Navigation`
   - `HeroCard`
   - first-contact CTA if it appears in initial viewport
2. **Deferred section-level chunks (React.lazy):**
   - `TechStackSection`
   - `ProjectSection`
   - `BlogSection`
   - `FooterSection`
3. **Heavy library isolation:**
   - `AIWorkflowDiagram` should be lazy-loaded only when its card approaches viewport.
   - Keep `reactflow` in its own chunk.
4. **Animation runtime isolation:**
   - Load `motion/react` only where necessary (already local in `RotatingText`, keep it isolated in a small chunk).

### Vite/Rollup chunk controls

Use `build.rollupOptions.output.manualChunks`:

```js
build: {
  sourcemap: false,
  target: 'es2022',
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('reactflow')) return 'reactflow'
        if (id.includes('motion')) return 'motion'
        if (id.includes('node_modules')) return 'vendor'
      },
    },
  },
}
```

### React lazy example

```jsx
import { lazy, Suspense } from 'react'

const TechStackSection = lazy(() => import('./components/sections/TechStackSection'))

<Suspense fallback={<section className="section skeleton" />}> 
  <TechStackSection />
</Suspense>
```

### Preload on intent (recommended)

- Trigger preloading when user scrolls near section (`rootMargin: '800px'`) or hovers nav links.
- Example: `import('./components/sections/TechStackSection')` on early signal.

### Legacy script strategy

- If jQuery/Webflow interactions are not required, remove both scripts.
- If needed, defer them and load only where required (e.g., marketing-only legacy block).

---

## 3) Font Strategy

### Current risk

- Remote OTF font loading from `uploads-ssl.webflow.com` in `original-styles.css`.
- OTF is heavy vs WOFF2 and can delay text rendering on slower links.

### Target strategy

1. Self-host fonts in `public/fonts` as WOFF2.
2. Subset by unicode range (Latin basic + needed symbols) using `pyftsubset`.
3. Serve only used weights (likely 400/500/600/700).
4. Preload only primary text face used above-the-fold.
5. Keep `font-display: swap` (already present), add metric overrides for CLS reduction.

Example:

```css
@font-face {
  font-family: 'Inter Display';
  src: url('/fonts/inter-display-latin-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  size-adjust: 102%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

Preload in `index.html`:

```html
<link rel="preload" href="/fonts/inter-display-latin-400.woff2" as="font" type="font/woff2" crossorigin>
```

### Budget

- Total critical font transfer target: <= 100 KB compressed for first view.

---

## 4) Image Pipeline (Modern formats + responsive sizes)

### Objectives

- Cut image bytes by 40-80% where possible.
- Match image dimensions to rendered slots.

### Current opportunities in this repo

- PNG/JPG assets in `/public/images`, notably:
  - `avatar.png`
  - `og-image.png`
  - `woods-bg.jpg`
  - education logos and favicon variants

### Recommended pipeline

1. For photographic assets (e.g., `woods-bg.jpg`, `og-image.png`):
   - Generate AVIF + WebP + fallback JPG/PNG.
2. For logos/icons:
   - Keep SVG where possible; otherwise use WebP/PNG at exact display size.
3. Generate responsive widths for raster images:
   - Typical widths: 320, 640, 960, 1280, 1600.
4. Use `<picture>` + `srcset` + `sizes`.
5. Add `loading="lazy"` and `decoding="async"` for below-the-fold images.
6. Add explicit `width`/`height` to reserve layout.

### Vite-compatible tooling options

- `vite-imagetools` for on-demand transforms in imports.
- Or prebuild script with `sharp` to generate deterministic assets into `public/images/generated`.

Example with `sharp` script outputs:

```bash
woods-bg-640.avif
woods-bg-960.avif
woods-bg-1280.avif
woods-bg-640.webp
...
```

Usage:

```html
<picture>
  <source type="image/avif" srcset="/images/generated/woods-bg-640.avif 640w, /images/generated/woods-bg-1280.avif 1280w" sizes="(max-width: 768px) 100vw, 50vw">
  <source type="image/webp" srcset="/images/generated/woods-bg-640.webp 640w, /images/generated/woods-bg-1280.webp 1280w" sizes="(max-width: 768px) 100vw, 50vw">
  <img src="/images/generated/woods-bg-1280.jpg" alt="Study in Woods project visual" loading="lazy" decoding="async" width="1280" height="720">
</picture>
```

### Quality guidance

- AVIF quality start: 42-50
- WebP quality start: 65-75
- Re-test visual quality for logos/text-heavy graphics (avoid AVIF artifacts).

---

## 5) Cache Headers and Delivery

### Objectives

- Long-cache immutable hashed assets.
- Short-cache HTML with fast revalidation.
- Correct caching for fonts/images from `public`.

### Vite behavior to leverage

- Vite build outputs hashed JS/CSS/assets under `dist/assets/*`.
- These should be cached with `immutable` for one year.

### Netlify-compatible header plan (repo currently has `_redirects`)

Add `public/_headers`:

```txt
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/index.html
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=2592000

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

/*.webmanifest
  Cache-Control: public, max-age=0, must-revalidate

/manifest.json
  Cache-Control: public, max-age=0, must-revalidate
```

If using another host (Cloudflare, Vercel, Nginx), map same policy semantics.

---

## 6) Vite Build Hardening Checklist

Add/verify in `vite.config.js`:

- `build.target = 'es2022'` (or audience-compatible modern target)
- `build.cssCodeSplit = true`
- `build.modulePreload = { polyfill: false }` for modern browsers
- `build.chunkSizeWarningLimit` tuned to budget goals (e.g., 250-350 KB raw)
- `manualChunks` for heavy libs (`reactflow`, `motion`, vendor)

Optional analysis plugin:

- `rollup-plugin-visualizer` to inspect chunk composition each release.

---

## 7) Suggested Performance Budgets

- Initial JS (gzip): <= 170 KB
- Initial CSS (gzip, critical + first chunk): <= 40 KB
- Largest image on first view: <= 120 KB compressed
- LCP target: <= 2.2s on 4G mid-tier device
- CLS target: <= 0.05
- INP target: <= 200ms

---

## 8) Execution Plan (phased)

### Phase 1 (highest impact, low risk)

1. Add section-level lazy loading for non-hero sections.
2. Isolate `reactflow` with dynamic import/manual chunk.
3. Remove or defer jQuery + `webflow.js` if unused.
4. Add cache headers (`public/_headers`).

### Phase 2

1. Create critical CSS + defer non-critical CSS.
2. Self-host WOFF2 fonts + preload primary weight.
3. Convert key JPG/PNG to AVIF/WebP responsive variants.

### Phase 3

1. Enforce budgets in CI (Lighthouse CI or custom size checks).
2. Add periodic bundle diff and image regression checks.

---

## 9) Validation and Measurement

- Build audit:
  - `npm run build`
  - inspect chunk sizes and count
- Runtime audit:
  - Lighthouse (mobile)
  - WebPageTest filmstrip + CPU throttling
  - DevTools Coverage for CSS/JS unused bytes
- Confirm no regressions in CLS after font/image changes.


This blueprint is intentionally Vite-native and aligned to the current repository architecture so it can be implemented incrementally without a full redesign.
