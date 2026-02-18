# Performance Root-Cause Map (FCP/LCP Intensive)

## Context Snapshot
- Current PSI context: mobile performance ~57 with high FCP/LCP, render-blocking requests, cache lifetime warnings, and image delivery inefficiencies.
- This app is CSR-first (`<div id="root"></div>`), so JS/CSS critical-path cost directly delays first content and largest content rendering (`index.html:243`, `index.html:244`).
- Observed payload signals in repo/build:
  - `dist/assets/index-Daz9AV0w.js` = 345.80 KB (354,098 bytes)
  - `public/webflow.js` = 247,923 bytes
  - `public/original-styles.css` = 83,867 bytes (render-blocking stylesheet)
  - Several large images (notably `suryavanshi-logo.svg` 937.61 KB, `rgpv-logo.png` 446.14 KB)

## Root-Cause Map (Cause -> Mechanism -> Metric Effect)

### 1) Heavy first-route JS + duplicated runtime stack
- Cause:
  - App bundle is relatively large for first route (`dist/assets/index-Daz9AV0w.js` 345.80 KB).
  - Legacy runtime scripts are still loaded globally: jQuery CDN + `webflow.js` (`index.html:245`, `index.html:246`).
  - Unused heavy dependency path exists: `AIWorkflowDiagram` imported in `TechStackSection` but not rendered (`src/components/sections/TechStackSection.jsx:4`) while `reactflow` is present in deps (`package.json:41`).
- Mechanism:
  - More JS parse/compile/execute on mobile CPU before meaningful paint settles.
  - Main thread contention delays text/layout/paint and can shift LCP later.
- Metric effect:
  - FCP: high negative impact
  - LCP: high negative impact

### 2) Render-blocking CSS and legacy Webflow base styles in critical path
- Cause:
  - Large global stylesheet loaded synchronously in `<head>` (`index.html:237` -> `public/original-styles.css`).
  - CSS includes broad legacy framework surface and embedded assets, increasing parse/selector matching cost.
- Mechanism:
  - Browser must fetch and parse CSS before first render.
  - Large global style graph increases style calculation cost for full DOM.
- Metric effect:
  - FCP: high negative impact
  - LCP: medium-high negative impact

### 3) Below-the-fold content is eagerly rendered and discovered on initial load
- Cause:
  - All sections mount immediately in `App` (`src/App.jsx:80`, `src/App.jsx:88`, `src/App.jsx:91`).
  - Many below-fold images are eager by default (no `loading="lazy"` in multiple project/education image tags), e.g. `src/components/sections/ProjectSection.jsx:165`, `src/components/sections/ProjectSection.jsx:196`, `src/components/sections/EducationCard.jsx:16`.
- Mechanism:
  - Browser discovers many non-critical resources early and schedules them on same connection budget.
  - Network/decoding competition can delay LCP candidate completion.
- Metric effect:
  - FCP: medium negative impact
  - LCP: high negative impact

### 4) Image delivery inefficiency (oversized files + missing responsive strategy)
- Cause:
  - Very large image assets in `public/images` (notably 937.61 KB and 446.14 KB files).
  - No observed responsive `srcset/sizes` strategy for key card/media images.
  - Some images lack explicit dimensions/aspect reservations in markup, increasing layout churn risk.
- Mechanism:
  - Excess transfer + decode time on mobile networks.
  - Potential relayout and delayed stabilization around large visuals.
- Metric effect:
  - FCP: low-medium negative impact
  - LCP: high negative impact

### 5) Third-party image fan-out from icon CDN
- Cause:
  - Tech stack tooltip icons fetch many remote images from `cdn.simpleicons.org` (`src/components/sections/TechStackSection.jsx:179`, `src/components/sections/TechStackSection.jsx:205`).
- Mechanism:
  - Additional DNS/TLS/request overhead and connection contention.
  - Third-party cache policy is not controlled by origin and may not align with long-lived immutable strategy.
- Metric effect:
  - FCP: low-medium negative impact
  - LCP: medium negative impact

### 6) Cache lifetime/control gap on hosting edge
- Cause:
  - No explicit cache/header config files detected (`netlify.toml`, `vercel.json`, `_headers`, etc. absent in repo scan).
- Mechanism:
  - PSI flags short cache lifetimes for static assets, increasing repeat-view and field p75 costs.
- Metric effect:
  - FCP: low impact on first load, high on repeat loads
  - LCP: low-medium on first load, high on repeat loads

### 7) Runtime animation/instrumentation overhead on main thread
- Cause:
  - Frequent animation hooks across sections and production console logging in animation callbacks (`src/components/sections/HeroCard.jsx:26`, `src/hooks/useScrollAnimation.js:36`, `src/hooks/useScrollAnimation.js:103`).
- Mechanism:
  - Extra scripting and potential long tasks under scroll/paint pressure.
- Metric effect:
  - FCP: low impact
  - LCP: low-medium impact (mostly secondary)

## Ranked Bottlenecks by Estimated FCP/LCP Impact

## Scoring model
- Impact score = weighted expected improvement potential on mobile (first view), combining transfer, main-thread, and render-criticality.
- 10 = largest expected FCP/LCP win in this codebase context.

| Rank | Bottleneck | Est. Impact Score (10) | Est. FCP Gain | Est. LCP Gain | Why it ranks here |
|---|---|---:|---:|---:|---|
| 1 | Heavy JS critical path + legacy jQuery/Webflow runtime + unused `reactflow` import path | 9.3 | 500-1200 ms | 700-1600 ms | Directly blocks/competes with first meaningful render in CSR shell. |
| 2 | Eager rendering/loading of below-fold sections and media | 8.6 | 250-700 ms | 500-1300 ms | Resource discovery contention pushes true LCP resource later on mobile. |
| 3 | Image delivery inefficiency (oversized files, no responsive variants/prioritization) | 8.2 | 100-350 ms | 400-1200 ms | Large decode/transfer penalties are visible in LCP-heavy pages. |
| 4 | Render-blocking global stylesheet footprint | 7.6 | 250-650 ms | 200-500 ms | Blocks first paint and increases style calculation overhead early. |
| 5 | Cache lifetime/config gaps for static assets | 6.1 | 50-150 ms (first view) / 600-1800 ms (repeat) | 50-250 ms (first) / 700-2000 ms (repeat) | Less first-view critical, but large field/repeat penalties and PSI warnings. |
| 6 | Third-party icon CDN fan-out | 5.4 | 50-200 ms | 100-400 ms | Network overhead + uncertain third-party cache control. |
| 7 | Animation/logging overhead | 4.0 | 0-80 ms | 50-250 ms | Secondary contributor; mostly affects smoothness and tail latency. |

## Bottleneck Interactions (Why score is stuck around ~57)
- JS and CSS critical-path costs delay the initial render opportunity.
- Simultaneously, early discovery of non-critical images/sections competes with LCP candidate resources.
- Large image bytes and third-party fan-out amplify network contention.
- Weak cache controls keep field metrics from improving sustainably, especially for repeat users.

## High-Confidence Root Cause Cluster (Primary)
- Cluster A (Primary): `JS critical path + render-blocking CSS + early non-critical resource discovery`
  - This cluster is the most plausible explanation for both high FCP and high LCP.
- Cluster B (Secondary): `Image bytes/format strategy + cache lifetime policy`
  - This cluster likely explains PSI image-delivery and cache warnings and slows p75 improvement.

## Suggested Validation Sequence (for next profiling pass)
1. Capture baseline trace + Lighthouse mobile median (x3).
2. Temporarily disable `jquery` + `webflow.js` and remove unused `AIWorkflowDiagram` import; re-run lab tests to isolate JS main-thread savings.
3. Lazy-load below-fold media/sections and set one explicit LCP candidate priority; re-run to measure LCP delta.
4. Optimize top 3 heaviest images and re-test.
5. Add immutable cache headers for hashed assets and validate with PSI repeat-run + WebPageTest repeat view.

## Confidence
- Overall confidence: high for root-cause ranking (code and artifact signals align strongly with the given PSI symptom profile).
- Uncertainty: medium on exact millisecond deltas until controlled A/B traces are captured in identical test conditions.
