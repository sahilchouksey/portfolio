# Performance Measurement and Governance Framework

## Goal and Operating Model

This framework gives a solo maintainer a low-noise, high-signal process to:
- continuously measure real and synthetic performance,
- detect regressions early,
- block harmful changes in CI,
- and maintain a weekly performance rhythm without heavy overhead.

Design principles:
- **Mobile-first** thresholds (p75 where applicable).
- **Field data > lab data** for user impact, with Lighthouse for pre-merge guardrails.
- **Fast feedback** on pull requests, deeper checks on main branch and weekly.
- **Actionable alerts only** (avoid alert fatigue for a solo workflow).

---

## Metric Framework

Track two classes of signals:

1. **RUM (Web Vitals, production users)**
   - Primary: `LCP`, `INP`, `CLS`, `TTFB`
   - Supporting: `FCP`, `navigationType`, `effectiveType`, `deviceMemory`, `route`
   - Aggregation: daily and 7-day rolling p75 by route segment and device class

2. **Lab/CI (Lighthouse CI, controlled checks)**
   - Performance category score
   - Numeric audits: `largest-contentful-paint`, `total-blocking-time`, `cumulative-layout-shift`, `speed-index`, `interactive`
   - Bundle size budgets (JS/CSS/image)

---

## SLOs, Alert Thresholds, and Action Bands

Use three bands for each metric:

| Metric | Target (Green) | Warning (Amber) | Critical (Red / Gate) |
|---|---:|---:|---:|
| LCP (p75, mobile) | <= 2.5s | > 2.5s and <= 3.0s | > 3.0s |
| INP (p75, mobile) | <= 200ms | > 200ms and <= 300ms | > 300ms |
| CLS (p75) | <= 0.10 | > 0.10 and <= 0.18 | > 0.18 |
| TTFB (p75, mobile) | <= 800ms | > 800ms and <= 1200ms | > 1200ms |
| Lighthouse Perf Score | >= 90 | 80-89 | < 80 |
| Lighthouse LCP (lab) | <= 2500ms | 2501-3000ms | > 3000ms |
| Lighthouse TBT (lab) | <= 200ms | 201-300ms | > 300ms |
| Lighthouse CLS (lab) | <= 0.10 | 0.11-0.18 | > 0.18 |
| Initial JS (gzip) | <= 220KB | 221-260KB | > 260KB |
| Initial CSS (gzip) | <= 30KB | 31-40KB | > 40KB |
| Hero image payload | <= 120KB | 121-180KB | > 180KB |

Notes:
- For lab runs, compare medians of 3 runs.
- For field data, use p75 over at least 7 days and minimum sample size (e.g., >= 100 sessions) before declaring regressions.

---

## Lighthouse CI Governance

### 1) Add CI dependencies and scripts

Install:

```bash
npm i -D @lhci/cli
```

Add scripts in `package.json`:

```json
{
  "scripts": {
    "perf:build": "npm run build",
    "perf:serve": "vite preview --host 0.0.0.0 --port 4173",
    "perf:lhci": "lhci autorun --config=./lighthouserc.json"
  }
}
```

### 2) Lighthouse config (`lighthouserc.json`)

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run perf:serve",
      "startServerReadyPattern": "Local:",
      "url": [
        "http://localhost:4173/"
      ],
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "total-blocking-time": ["error", { "maxNumericValue": 200 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "speed-index": ["warn", { "maxNumericValue": 3400 }],
        "interactive": ["warn", { "maxNumericValue": 3800 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

If you prefer mobile emulation for gating (recommended after initial stabilization), replace `preset` with explicit mobile throttling settings and keep the same thresholds adjusted for mobile reality.

### 3) Lighthouse budget file (`.lighthouse/budgets.json`)

```json
[
  {
    "path": "/*",
    "resourceSizes": [
      { "resourceType": "script", "budget": 260 },
      { "resourceType": "stylesheet", "budget": 40 },
      { "resourceType": "image", "budget": 350 }
    ],
    "resourceCounts": [
      { "resourceType": "script", "budget": 20 },
      { "resourceType": "stylesheet", "budget": 8 },
      { "resourceType": "font", "budget": 6 },
      { "resourceType": "third-party", "budget": 10 }
    ]
  }
]
```

Integrate with Lighthouse by adding `"budgets": [{ "path": ".lighthouse/budgets.json" }]` inside `collect.settings` if your setup supports it directly, or enforce size budgets in a separate build artifact check script.

---

## Regression Gates (PR and Main)

### PR gate policy

A pull request fails when any of the following are true:
- Lighthouse assertion marked as `error` fails.
- Initial JS/CSS budget exceeds critical threshold.
- Performance score drops by >= 0.05 versus `main` baseline.
- LCP or TBT regresses by > 10% versus `main` baseline.

Allow one controlled override label (e.g., `perf-exception`) only when:
- there is a linked issue,
- rollback strategy is documented,
- and remediation is scheduled in the next sprint.

### Main branch gate policy

On merge to `main`:
- Run Lighthouse CI again and store results artifact.
- Update baseline JSON used for PR diff checks.
- Trigger RUM dashboard refresh job (daily summary is enough for solo maintainer).

### Example GitHub Actions workflow (`.github/workflows/perf.yml`)

```yaml
name: Performance

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run perf:build
      - run: npm run perf:lhci
```

Keep this lightweight first; add baseline comparison in a second phase if needed.

---

## Web Vitals RUM Instrumentation

### 1) Client collection

Install:

```bash
npm i web-vitals
```

Create `src/performance/reportWebVitals.js`:

```js
import { onCLS, onINP, onLCP, onTTFB, onFCP } from 'web-vitals';

const ENDPOINT = '/api/vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    delta: metric.delta,
    navigationType: metric.navigationType,
    url: location.pathname,
    ts: Date.now(),
    ua: navigator.userAgent,
    et: navigator.connection?.effectiveType || null,
    dm: navigator.deviceMemory || null,
  });

  navigator.sendBeacon?.(ENDPOINT, body) ||
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    });
}

export function startWebVitals() {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onFCP(sendToAnalytics);
}
```

Call `startWebVitals()` in your app bootstrap (production only).

### 2) Backend ingestion

For solo maintainability, use one of:
- serverless endpoint + Postgres/Supabase table,
- analytics provider custom events,
- managed APM with web-vitals support.

Minimum schema:
- `ts`, `name`, `value`, `rating`, `url`, `id`, `navigation_type`, `effective_type`, `device_memory`, `user_agent_hash`.

### 3) Aggregations required

Daily jobs should produce:
- p75 by metric for mobile and desktop,
- route-level p75 for top 5 routes/sections,
- week-over-week delta,
- sample size and confidence flags.

---

## Alerting Strategy (Solo-Friendly)

Use 3 alert types only:

1. **Immediate critical alert (Slack/email/push)**
   - Trigger: any metric enters Red band for 2 consecutive days with >= 100 samples/day.
   - Action: create `P1 perf regression` issue automatically.

2. **Degradation trend alert (daily digest)**
   - Trigger: 7-day p75 worsens by >= 10% week-over-week for LCP/INP/TTFB.
   - Action: add to weekly report backlog.

3. **Gate failure alert (CI)**
   - Trigger: Lighthouse assertion or budget gate fails on PR.
   - Action: block merge until resolved or exception applied.

Noise control:
- no alerts on low sample size,
- no duplicate alert within 24h for same metric + route,
- auto-close alert when metric returns to Green for 3 consecutive days.

---

## Weekly Reporting Template (copy/paste)

Use this in `temp/research/performance-intensive/reports/YYYY-WW-performance.md`.

```md
# Weekly Performance Report - YYYY-WW

## 1) Executive Snapshot
- Overall status: Green / Amber / Red
- Biggest improvement:
- Biggest regression:
- User impact summary (1-2 lines):

## 2) Core Web Vitals (Field, p75)
| Metric | This Week | Last Week | Delta | Status |
|---|---:|---:|---:|---|
| LCP (mobile) |  |  |  |  |
| INP (mobile) |  |  |  |  |
| CLS (mobile) |  |  |  |  |
| TTFB (mobile) |  |  |  |  |
| LCP (desktop) |  |  |  |  |
| INP (desktop) |  |  |  |  |

## 3) Lab / CI Results
- Lighthouse median score (home):
- LCP / TBT / CLS medians:
- Budget status (JS/CSS/image): Pass/Fail
- Gate failures this week:

## 4) Route-Level Insights
| Route/Section | Main issue | Metric impact | Hypothesis |
|---|---|---|---|
| / |  |  |  |

## 5) Regressions and Incidents
- Incident ID:
- Start date:
- Detection method:
- Root cause:
- Fix shipped:
- Time to mitigate:

## 6) Changes Shipped This Week
- PR # / Commit:
- Perf intent:
- Measured outcome:

## 7) Next Week Plan (Top 3)
1.
2.
3.

## 8) Exceptions and Risks
- Active perf exceptions:
- Expiry date:
- Risk if not fixed:
```

---

## Operating Cadence (Lightweight)

- **Per PR**: run Lighthouse CI + budget gates.
- **Daily (automated)**: aggregate RUM p75 and send digest.
- **Weekly (30 min)**: fill weekly template, review deltas, set top 3 actions.
- **Monthly (60 min)**: recalibrate thresholds and budgets based on historical stability.

---

## Governance Rules of Engagement

1. No merge on Red CI gates without documented exception.
2. Every performance exception must have owner + due date (max 14 days).
3. Any feature with expected payload increase must include explicit budget impact note.
4. Performance work must report before/after metrics (lab and, when available, field).
5. Keep dashboard simple: one CWV panel + one budgets panel + one incidents panel.

---

## First Implementation Checklist

- [ ] Add `@lhci/cli` and `web-vitals` dependencies.
- [ ] Add `lighthouserc.json` and optional `.lighthouse/budgets.json`.
- [ ] Add `perf.yml` GitHub Action.
- [ ] Add `reportWebVitals.js` and bootstrap call.
- [ ] Implement `/api/vitals` ingestion endpoint.
- [ ] Create first weekly report using template.
- [ ] Define initial baseline from 3 Lighthouse runs + 7 days RUM.

This gives you immediate governance with minimal process overhead, while still strong enough to prevent silent regressions in a solo-maintainer setup.
