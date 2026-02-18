# Runtime React Diagnostics (Intensive)

## Scope and baseline
- App entry is pure client render (`createRoot`) in `src/main.jsx:6`; there is no current SSR hydration path (`hydrateRoot`) to diagnose.
- Runtime risk is therefore mostly main-thread render/animation cost, layout/paint invalidations, and interaction latency under constrained devices.
- Codebase has a custom scroll animation system + large CSS animation surface + one very heavy imperative ASCII animation loop.

## Quick risk ranking
1. **Highest:** `AsciiAvatar` frame loop cost and paint volume (`src/components/sections/AsciiAvatar.jsx:379`, `src/components/sections/AsciiAvatar.jsx:596`).
2. **High:** forced synchronous layout in animation registry (`src/core/AnimationRegistry.js:43`).
3. **High:** broad `transition: all` patterns and filter/text-shadow-heavy effects (`src/animations.css:11`, `src/animations.css:18`, `src/animations.css:189`, `src/animations.css:235`).
4. **Medium:** repeated object/array creation in render for data-heavy sections (`src/components/sections/TechStackSection.jsx:30`, `src/components/sections/ProjectSection.jsx:6`, `src/components/sections/AIWorkflowDiagram.jsx:13`).
5. **Medium:** responsiveness risk from third-party/remote assets and non-critical work on startup (Hashnode fetch and multiple icon/image usage).

---

## 1) Hydration/render costs

### Findings
- **No hydration today:** current boot is CSR-only, so hydration mismatch/cost is not the bottleneck at the moment.
- **Render-time allocation churn:** large literal structures are created on each render in multiple components:
  - `techIcons`, `techStack`, `highlights`, `education`, `experience` in `src/components/sections/TechStackSection.jsx`.
  - `projects` and inline subcomponents in `src/components/sections/ProjectSection.jsx`.
  - `workflowData` nodes/edges in `src/components/sections/AIWorkflowDiagram.jsx`.
- **Heavy section work competes with input:** `AsciiAvatar` runs continuously and can overlap with interaction windows.
- **Dev-only caveat:** `StrictMode` in `src/main.jsx:7` doubles some lifecycle calls in development; this inflates local profiling unless measured in production build.

### Recommendations
- Move static data constants outside component bodies (module scope) or wrap in `useMemo` where props influence data.
- Use route/section-level code splitting for heavy visual blocks (`React.lazy` + `Suspense`) and defer non-critical sections until near viewport.
- Add `content-visibility: auto; contain-intrinsic-size: ...` for below-the-fold sections to reduce initial render cost.
- For future SSR adoption:
  - Avoid non-deterministic first render values (time/random) on server-rendered paths.
  - Keep dynamic time values client-only after mount (already done for YOE calculation).

---

## 2) Forced reflow hotspots

### Findings
- **Explicit forced reflow:** `element.offsetHeight` in `src/core/AnimationRegistry.js:43` intentionally flushes layout after style writes.
- **Transition scope too broad:** `transition: all` appears in animation classes (`src/animations.css:11`, `src/animations.css:18`) and in JS-set transition (`src/core/AnimationRegistry.js:37` uses `all`).
- **Potential layout+paint amplification:** broad transitions can accidentally animate layout-affecting properties if style objects evolve.

### Recommendations
- Replace forced reflow pattern with class toggle + double-`requestAnimationFrame` commit pattern (or Web Animations API) to avoid sync layout reads.
- Restrict transitions to compositor-friendly properties:
  - `transition-property: transform, opacity` only.
  - Never animate `width/height/top/left/border-radius/filter` on frequently updated elements in hot paths.
- Add `contain: layout paint style;` on isolated cards/sections where possible to limit layout invalidation scope.
- Keep `will-change` temporary (set shortly before animation, clear after) to avoid memory pressure.

---

## 3) Animation cost controls

### Findings
- `AsciiAvatar` loop updates a full character grid, then rebuilds full text and sets `textContent` each frame (`src/components/sections/AsciiAvatar.jsx:576` to `src/components/sections/AsciiAvatar.jsx:596`).
- During rendering, each cell can do `rainDrops.find(...)` (`src/components/sections/AsciiAvatar.jsx:586`), increasing per-frame complexity.
- Class reset/re-apply each frame (`src/components/sections/AsciiAvatar.jsx:602` to `src/components/sections/AsciiAvatar.jsx:615`) adds extra style recalculation churn.
- Multiple glow/filter effects (`drop-shadow`, strong `text-shadow`) and infinite animations can become paint-bound on low-end GPUs.

### Recommendations
- Add an **adaptive quality controller** (at startup and on runtime pressure):
  - Inputs: `navigator.hardwareConcurrency`, `navigator.deviceMemory`, `prefers-reduced-motion`, dropped-frame ratio.
  - Modes: `high`, `balanced`, `low`.
  - In low mode: fewer rain drops, shorter trails, lower update rate (20-30 FPS), reduced shadow/filter intensity, disable non-essential pulses.
- Precompute rain occupancy map per frame to remove `find` inside cell loop.
- Only mutate container classes on state transitions (`rain phase -> formation -> fully revealed`), not every frame.
- Pause expensive animation when component is off-screen using `IntersectionObserver`; `document.hidden` alone is insufficient.
- Consider canvas/WebGL rendering for ASCII effect if this visual is mission-critical and persistent.

---

## 4) Interaction responsiveness on low-end mobile

### Findings
- Ongoing animation work can delay click/tap handling and cause poor INP in scroll-heavy or tap-heavy sessions.
- Remote assets and API fetches add contention:
  - Blog GraphQL fetch in `src/components/sections/BlogSection.jsx:14`.
  - Multiple remote icon/image sources in tech stack and blog cards.
- Hover-oriented visual enhancements are desktop-first and may not justify mobile paint cost.

### Recommendations
- Set explicit mobile performance mode defaults:
  - Disable or reduce non-essential infinite animations on touch devices.
  - Use smaller shadows and fewer layered effects.
- Defer non-critical network and rendering work with `requestIdleCallback`/post-task scheduling after first meaningful paint.
- Add resource hints for required third-party domains (`preconnect` / `dns-prefetch`) and lazy-load non-visible media.
- Ensure all interaction handlers stay lightweight; move expensive derived calculations out of input event windows.
- Target mobile interaction budget: keep main-thread tasks under 50ms during active input periods.

---

## 5) Instrumentation and diagnostics plan (recommended sequence)

1. **RUM metrics:** integrate `web-vitals` and collect `INP`, `LCP`, `CLS`, `TTFB` segmented by device class.
2. **PerformanceObserver:** log long tasks and their attribution (`longtask`, `event`, `layout-shift`, `paint`) into a lightweight debug channel.
3. **React profiling:** use React DevTools Profiler on production bundle to identify expensive commits in section components.
4. **Low-end simulation:** Chrome performance runs at 4x-6x CPU throttle + slow 4G with screenshots disabled; compare before/after for:
   - Total blocking time
   - Long task count > 50ms
   - INP p75
   - FPS stability while ASCII animation is active
5. **Regression guardrails:** set budgets in CI Lighthouse runs for mobile profile and fail on significant regressions.

---

## High-impact implementation checklist
- Remove forced reflow in `AnimationRegistry` and replace transition startup mechanism.
- Convert all `transition: all` in runtime-critical classes to explicit property lists.
- Introduce adaptive animation quality mode with low-end defaults.
- Refactor `AsciiAvatar` inner loop to reduce per-cell lookups and class churn.
- Move static section data structures outside render paths.
- Add real-user performance telemetry and mobile budget thresholds.

## Expected outcomes after applying top fixes
- Lower long-task frequency during first interaction windows.
- Better INP on low-end Android devices (especially during/after initial animation period).
- Reduced layout/paint instability from broad transitions and forced reflow.
- More consistent frame pacing in animated hero section.
