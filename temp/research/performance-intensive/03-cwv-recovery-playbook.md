# Core Web Vitals Recovery Playbook (Mobile 85+ Fast, Then 90+)

## Objective
Move Lighthouse mobile performance toward **85+ quickly** (phase 1), then harden toward **90+** (phase 2), while improving real-user Core Web Vitals (LCP, INP, CLS).

## Current Repo Signals (from code/build review)
- App is a Vite + React SPA with a single main JS chunk around **354 KB raw / 112 KB gzip** and CSS around **35.8 KB raw / 7.0 KB gzip**.
- `index.html` includes legacy scripts: external jQuery and local `webflow.js` (~248 KB) in addition to React app scripts.
- `TechStackSection.jsx` imports `AIWorkflowDiagram` (ReactFlow stack), but component is not rendered in the file today; this can still pull unnecessary code/CSS into startup path.
- Several image assets are disproportionately large for mobile (notably `public/images/suryavanshi-logo.svg` ~938 KB, plus medium PNG/JPG assets).
- Blog data fetch starts on mount; network and main-thread work begin immediately even if section is below fold.

---

## Delivery Strategy
- **Phase 0 (1 day): baseline + guardrails**
- **Phase 1 (2-5 days): quick wins for 85+**
- **Phase 2 (1-3 weeks): structural refactors for 90+**

Use these score targets:
- **Fast target:** Mobile Lighthouse Perf >= 85, LCP <= 2.8s, INP <= 250ms, CLS <= 0.1
- **Hard target:** Mobile Lighthouse Perf >= 90, LCP <= 2.5s, INP <= 200ms, CLS <= 0.08

> Note: expected gains are directional and not strictly additive.

---

## Phase 0 - Baseline + Measurement Guardrails (Do First)

### Action 0.1 - Establish repeatable mobile test profile
- Run 5 Lighthouse mobile runs on homepage (median + p75).
- Add Web Vitals RUM capture (LCP/INP/CLS with attribution) to production analytics.
- Freeze test profile: same URL, same throttling, clean cache, no devtools open.

**Expected gain**
- No direct score gain; prevents false positives and regression drift.

**Risk notes**
- Low risk. Main risk is inconsistent methodology; mitigate via scripted CI runs.

### Action 0.2 - Performance budget gates
- Add CI budget checks for JS, CSS, and image totals.
- Suggested initial budgets:
  - initial JS (gzip): <= 90 KB
  - critical CSS (gzip): <= 10 KB
  - largest image resource: <= 120 KB mobile-variant

**Expected gain**
- No immediate score gain; medium-term stability benefit.

**Risk notes**
- Medium process risk if too strict too early; start with warn-only then fail builds.

---

## Phase 1 - Quick Wins (Primary path to 85+)

### Action 1.1 - Remove/Defer legacy Webflow runtime on initial load
- Audit whether jQuery + `webflow.js` behavior is still required for nav/menu interactions.
- If not required, remove both scripts from `index.html`.
- If partially required, lazy-load them only on interaction or only on routes/sections that need them.

**Expected gain**
- Lighthouse mobile: **+6 to +15**
- TBT/INP improvement from less startup script evaluation.

**Risk notes**
- High regression risk for legacy interactions (menu/nav/animations).
- Mitigate with visual and interaction smoke tests for nav, overlays, and responsive menu.

### Action 1.2 - Eliminate unused ReactFlow startup cost
- Remove unused import of `AIWorkflowDiagram` from `TechStackSection.jsx` if not rendered.
- If feature is needed later, load with `React.lazy` + viewport-triggered mount.

**Expected gain**
- Lighthouse mobile: **+4 to +9**
- Lower JS parse/execute, improved TTI/TBT/INP.

**Risk notes**
- Low functional risk if unused.
- Medium risk if hidden dependency existed; confirm no visual section relies on it.

### Action 1.3 - Compress and right-size heavy image assets
- Replace oversized SVG/PNG/JPG assets with optimized variants.
- Ship responsive image sets (`srcset`, `sizes`) and modern formats (WebP/AVIF where practical).
- Prioritize first-view and above-fold assets first.

**Expected gain**
- Lighthouse mobile: **+3 to +10**
- LCP reduction typically **150-600ms** depending on device/network.

**Risk notes**
- Medium brand-quality risk (logo sharpness/colors).
- Mitigate with side-by-side visual QA and fallback format for edge cases.

### Action 1.4 - Defer below-the-fold network work (blog/API)
- Delay Hashnode fetch until Blog section enters viewport (IntersectionObserver).
- Optionally prefetch when user scroll intent is detected.

**Expected gain**
- Lighthouse mobile: **+2 to +5**
- Better initial main-thread/network contention; possible INP gains.

**Risk notes**
- Low risk; slight delay in blog card appearance when scrolled quickly.
- Mitigate with skeleton loading and prefetch threshold.

### Action 1.5 - Tighten animation cost on mobile
- Respect `prefers-reduced-motion` and disable non-essential animation effects on low-end mobile.
- Avoid broad `transition: all` in critical paths; transition only `opacity/transform`.
- Reduce concurrent animated elements entering viewport.

**Expected gain**
- Lighthouse mobile: **+1 to +4**
- INP + smoothness improvements under CPU pressure.

**Risk notes**
- Medium design intent risk.
- Mitigate by keeping desktop motion richness while reducing mobile intensity.

### Action 1.6 - Early rendering hints for LCP candidate
- Preload/prioritize likely LCP resource (if image-based), otherwise prioritize critical CSS and fonts.
- Ensure image dimensions are explicit to avoid layout recalculation.

**Expected gain**
- Lighthouse mobile: **+2 to +6**
- LCP often improves **100-400ms**.

**Risk notes**
- Low risk; wrong preload choice can waste bandwidth.
- Validate with Lighthouse "LCP element" attribution before finalizing.

---

## Phase 2 - Deeper Refactors (Path from 85+ to 90+)

### Action 2.1 - Route/section-level code splitting by visibility
- Split sections that are non-critical for first paint (Projects, Blog, advanced interactions).
- Hydrate/render expensive blocks only when near viewport.

**Expected gain**
- Lighthouse mobile: **+3 to +8**
- Better long-task profile and lower startup JS.

**Risk notes**
- Medium complexity and QA overhead (loading boundaries, race conditions).

### Action 2.2 - Reduce dependency footprint
- Audit if `motion` and `reactflow` usage justifies full dependency cost.
- Replace heavy packages with lighter alternatives for simple effects/diagrams.

**Expected gain**
- Lighthouse mobile: **+2 to +7**

**Risk notes**
- Medium-high refactor risk; API migration effort and visual parity checks required.

### Action 2.3 - CSS architecture split (critical vs non-critical)
- Extract minimal above-fold critical styles; defer non-critical bundles.
- Remove dead utility blocks and duplicated style layers.

**Expected gain**
- Lighthouse mobile: **+1 to +4**
- Faster first render and reduced style recalculation pressure.

**Risk notes**
- Medium risk of flash/unstyled states; requires careful sequencing.

### Action 2.4 - Move toward static data for first fold where possible
- Precompute or cache content that currently fetches at runtime but is not user-specific.
- For blog previews, consider build-time snapshot with background refresh.

**Expected gain**
- Lighthouse mobile: **+1 to +4**
- More stable field LCP/INP under weak network.

**Risk notes**
- Medium content freshness trade-off; solve with TTL revalidation.

### Action 2.5 - Server and caching hardening
- Strong immutable cache headers for hashed assets.
- Brotli + proper CDN cache policy, stale-while-revalidate for HTML where applicable.

**Expected gain**
- Lighthouse repeat-view and CrUX trend lift; direct lab gains moderate.

**Risk notes**
- Low-medium ops risk if cache invalidation policy is incorrect.

---

## Prioritized Execution Order (Most Impact First)
1. Remove/defer jQuery + `webflow.js` startup load.
2. Remove unused ReactFlow import path from initial bundle.
3. Optimize largest images and set responsive delivery.
4. Defer Blog API fetch until near viewport.
5. Mobile animation simplification + reduced-motion path.
6. LCP-targeted preload/priority tuning.
7. Deeper code/CSS splitting and dependency slimming.

---

## 2-Week Sprint Plan (Practical)

### Week 1 (Aim: reach 85+)
- Day 1: Baseline, RUM, budgets.
- Day 2-3: Legacy script removal/defer + regression tests.
- Day 3-4: ReactFlow startup-path cleanup + bundle verification.
- Day 4-5: Image optimization pass (top 10 assets) + responsive images.
- Day 5: Blog lazy fetch + animation tuning + validation run.

**Expected sprint outcome**
- Mobile perf score likely **+12 to +25** from current baseline (environment dependent).

### Week 2+ (Aim: stabilize 90+)
- Section-level lazy loading and visibility-based rendering.
- Dependency trimming and CSS critical-path split.
- Caching and edge delivery hardening.

**Expected outcome**
- Additional **+4 to +10** with stronger field-metric stability.

---

## Risk Register (Top Concerns)
- **Legacy behavior regressions** after removing Webflow/jQuery.
- **Visual deltas** from image compression and responsive variants.
- **Perceived loading shifts** from lazy rendering/fetching below fold.
- **Over-optimization** that harms maintainability.

Mitigations:
- Keep a rollback branch per high-risk action.
- Add visual snapshots and mobile interaction smoke suite.
- Ship behind short-lived feature flags for script/defer experiments.

---

## Definition of Done
- Mobile Lighthouse median >= 85 (phase 1) then >= 90 (phase 2).
- p75 field metrics: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.
- No regression in core interactions (nav menu, section links, project/blog cards).
- Budgets enforced in CI and documented for future contributors.

---

## Repo-Specific High-Impact Candidates to Tackle First
- `index.html` legacy runtime scripts (`jquery` + `webflow.js`) in startup path.
- `src/components/sections/TechStackSection.jsx` unused `AIWorkflowDiagram` import.
- Heavy assets in `public/images`, especially `public/images/suryavanshi-logo.svg`.
- Early blog fetch in `src/components/sections/BlogSection.jsx`.
