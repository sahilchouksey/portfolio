# SEO Execution Roadmap (30/60/90) - Implementation Grade

Date: 2026-02-17  
Repository: `/Volumes/T7/Developer/fun/portfolio`  
Primary domain: `https://sahilchouksey.in/`

## Operating Goal
Grow qualified organic demand for commercial and local intent queries (India, Madhya Pradesh, Jabalpur) by fixing technical crawl/index issues first, then shipping proof-heavy landing pages and topical authority content.

## Strategic Constraints This Plan Solves
- SPA rendering + weak indexable surface area
- Sitemap/canonical quality issues (hash-fragment URLs)
- Limited commercial/local landing pages for buyer intent
- External-blog dependency reducing first-party topical authority
- CWV overhead from legacy scripts and oversized assets
- Need for stronger E-E-A-T trust pages and measurable proof blocks

---

## KPI Framework (Targets by Milestone)

## KPI Ownership
- SEO/Content DRI: Sahil
- Technical SEO + CWV DRI: Sahil
- Analytics/Measurement DRI: Sahil
- Review cadence owner: Sahil (weekly and monthly)

## Baseline to establish in Week 1
- Google Search Console: query, page, coverage baseline
- GA4 or equivalent: organic sessions, engagement, contact CTR baseline
- Lighthouse + PSI (mobile): LCP, INP, CLS, TTFB baseline
- Index count baseline: indexed non-homepage URLs

## Day 30 targets (Foundation complete)
- Indexable canonical URLs in sitemap: `>= 6` (no fragment URLs)
- Hash URLs in sitemap: `0`
- Prerender/SSR coverage: homepage plus all new money pages
- CWV (mobile p75 proxy): LCP `<= 2.8s`, INP `<= 250ms`, CLS `<= 0.10`, TTFB `<= 0.8s`
- Published geo/commercial pages: `4` (`/ai-engineer-india`, `/ai-engineer-madhya-pradesh`, `/ai-engineer-jabalpur`, `/hire-ai-engineer-india`)
- Indexed non-homepage pages: `>= 4`

## Day 60 targets (Authority build)
- Indexed first-party SEO URLs: `>= 14`
- Pillar/support content published on-domain: `>= 8` posts/pages
- Non-branded impressions (28-day): `>= 600`
- Average CTR on non-branded landing pages: `>= 2.5%`
- Local terms ranking trajectory: at least `2` priority terms in top 20
- Qualified organic inquiries (cumulative): `>= 4`

## Day 90 targets (Compounding growth)
- Indexed first-party SEO URLs: `>= 24`
- Non-branded impressions (28-day): `>= 1500`
- Priority term rankings: `ai engineer in jabalpur` top 10; `ai engineer in madhya pradesh` top 15
- Qualified organic inquiries (90-day cumulative): `8-12`
- Blog-to-service assisted conversions: `>= 10`
- CWV green stability (all key templates): `>= 80%` URLs passing

---

## 30/60/90 Implementation Plan

## Phase 1: Day 0-30 (Technical + Intent Architecture)

### Workstream A - Technical SEO remediation (P0)
**Owner:** Sahil  
**Cadence:** 2 implementation blocks/week + Friday QA

1. Fix crawl/index fundamentals
   - Update `public/sitemap.xml` to canonical URLs only (remove `#` entries)
   - Simplify `public/robots.txt` (remove global crawl-delay, keep minimal allow/disallow and sitemap)
   - Validate canonical consistency in `index.html` and all new pages
   - Review `public/_redirects` behavior to reduce soft-404 risk where host supports true 404

2. Improve renderability for bots
   - Implement prerender/SSG for homepage and new SEO pages via Vite-compatible prerender strategy
   - Ensure page source contains meaningful H1/body text for key pages

3. Clean schema architecture
   - Keep `Person` + `WebSite` in base graph
   - Add `WebPage/ProfilePage` node and remove fragment-only breadcrumb assumptions
   - Add page-level `FAQPage` or `Service/ProfessionalService` only when visible content exists

**Definition of done:**
- Search Console accepts sitemap without low-value URL patterns
- View-source validation passes for homepage and new landing pages
- Schema validates without critical errors

### Workstream B - Commercial and local page launch (P0)
**Owner:** Sahil  
**Cadence:** Publish 1 page every 5-7 days

Build and publish:
- `/ai-engineer-india`
- `/ai-engineer-madhya-pradesh`
- `/ai-engineer-jabalpur`
- `/hire-ai-engineer-india`

Content requirements per page:
- 700+ words (target 900-1300)
- 40%+ unique copy vs other location pages
- 2-3 measurable proof points
- FAQ + conversion CTA + response SLA
- Internal links to a project proof page and contact endpoint

**Definition of done:**
- Indexed or submitted for indexing
- Unique title/meta/H1/canonical
- Internal linking and schema checks complete

### Workstream C - CWV quick wins (P0/P1)
**Owner:** Sahil  
**Cadence:** Weekly performance sprint

Actions:
- Remove/defer legacy scripts in `index.html` (`webflow.js`, jQuery) if non-essential
- Remove unused heavy imports in `src/components/sections/TechStackSection.jsx`
- Add image dimensions/aspect-ratio and lazy-loading policies in section components
- Compress oversized assets under `public/images`

**Definition of done:**
- Initial JS payload reduced materially from baseline
- CLS stabilized on project/blog cards
- Lighthouse median improves after each batch

---

## Phase 2: Day 31-60 (Topical Authority + E-E-A-T Packaging)

### Workstream D - On-domain topical cluster rollout (P1)
**Owner:** Sahil  
**Cadence:** 2 posts/week (Tue/Thu)

Priority sequence:
1. RAG pillar + support (`/blog/rag-engineering-guide`, architecture, evaluation)
2. Agentic systems support (`/blog/langgraph-production-patterns`, single vs multi-agent)
3. Healthcare and compliance support (`/blog/medical-rag-system-design`, HIPAA architecture)

Linking requirements per post:
- 1 service page link
- 1 proof/case-study link
- 1 conversion link (`/contact` or hire page)

**Definition of done:**
- Post indexed on first-party domain
- Article schema valid
- Internal-link graph updated weekly

### Workstream E - E-E-A-T trust surface expansion (P1)
**Owner:** Sahil  
**Cadence:** 1 trust/proof asset per week

Launch pages:
- `/about`
- `/privacy`
- `/ai-policy`
- `/editorial-policy`

Upgrade proof assets:
- Add project outcome snapshot blocks for top projects
- Add engineering decision record snippets
- Add last-updated and reviewed-by metadata where applicable

**Definition of done:**
- Trust pages linked sitewide
- Proof blocks visible on core commercial pages
- Claims in schema and copy remain consistent

### Workstream F - Local SEO entity/citation setup (conditional)
**Owner:** Sahil  
**Cadence:** Weekly citation QA

Actions:
- Finalize canonical NAP format and publish consistently
- Create citation tracker sheet and launch priority profiles (Bing Places, Apple Business Connect, Justdial, Clutch, GoodFirms)
- Activate Google Business Profile only if policy-eligible for actual local service operation

**Definition of done:**
- 90%+ NAP consistency in top citations
- No duplicate/inconsistent entity records

---

## Phase 3: Day 61-90 (Scale, Optimization, and Governance)

### Workstream G - Scale content with quality gates (P1/P2)
**Owner:** Sahil  
**Cadence:** Continue 2 posts/week + biweekly refreshes

Actions:
- Expand to 20+ indexed first-party SEO URLs
- Publish comparative/decision content (`build vs buy`, hiring checklists, pricing/engagement guides)
- Refresh top landing pages using Search Console query/CTR data

**Expansion rule:**
- Do not add more location pages unless 2 of 4 KPI gates are hit (impressions growth, clicks/CTR trend, organic leads, stable indexation)

### Workstream H - Automation and regression prevention (P2)
**Owner:** Sahil  
**Cadence:** Weekly CI checks + monthly full audit

Implement guardrails:
- CI validation: sitemap has no `#`, canonical present, key pages prerendered
- Lighthouse or equivalent budget checks to prevent CWV regressions
- Monthly schema and internal-link integrity audit

**Definition of done:**
- Regressions blocked before deployment
- Monthly audit report generated and tracked

---

## Owner Cadence (Execution Rhythm)

## Weekly cadence
- Monday (45 min): KPI review (GSC + analytics + ranking snapshot), prioritize sprint tasks
- Tuesday: publish/ship primary SEO asset (page or pillar post)
- Thursday: publish support asset (post, case-study update, FAQ expansion)
- Friday (45 min): technical QA (CWV, schema, crawl checks), decision log updates

## Monthly cadence
- Week 4 monthly: prune/merge/noindex weak pages, refresh top performers, re-baseline CWV and index coverage

## Reporting cadence
- Weekly dashboard update (leading indicators)
- 30/60/90 milestone review (lagging outcomes and next-quarter plan)

---

## Risk Controls and Mitigation Matrix

| Risk | Leading Indicator | Preventive Control | Contingency | Owner |
|---|---|---|---|---|
| Thin/duplicate location pages | Low engagement + duplicate copy patterns | Enforce 700+ words, 40% uniqueness, proof blocks, manual review | Merge/redirect weaker page; pause new location pages | Sahil |
| Index bloat from low-value URLs | Coverage report shows alternate/duplicate/soft 404 spikes | Sitemap gating + noindex draft workflow | Remove from sitemap, canonicalize, request recrawl | Sahil |
| CWV regressions after new features | LCP/INP/CLS trend worsens >10% | CI budgets + script/image governance | Roll back offending changes and re-optimize assets | Sahil |
| Schema-content mismatch | Rich results warnings or manual trust issues | Schema parity checklist on every publish | Remove unsupported schema types immediately | Sahil |
| Over-reliance on external blog platform | Low indexation of authority content on main domain | Publish full canonical content on first-party URLs | Migrate priority posts fully on-domain | Sahil |
| GBP suspension/compliance risk | Listing warnings or verification failure | Activate GBP only if policy-eligible and NAP-consistent | Disable GBP effort and reallocate to citations/content | Sahil |
| Execution overload (single owner) | Missed publishing cadence for 2+ weeks | Fixed sprint scope, cap major initiatives per month | Shift to maintenance mode: technical + 1 post/week | Sahil |

---

## Repository-Level Implementation Backlog (First 30 Days)

1. Technical SEO files
   - `public/sitemap.xml`
   - `public/robots.txt`
   - `public/_redirects`
   - `index.html`
   - `vite.config.js`

2. Core app and template files
   - `src/App.jsx`
   - `src/main.jsx`
   - `src/components/sections/BlogSection.jsx`
   - `src/components/sections/TechStackSection.jsx`
   - image-heavy section components for CLS fixes

3. New SEO URL/page templates (implementation path depends on routing choice)
   - `/ai-engineer-india`
   - `/ai-engineer-madhya-pradesh`
   - `/ai-engineer-jabalpur`
   - `/hire-ai-engineer-india`

4. Governance artifacts
   - SEO quality checklist (publish gate)
   - KPI dashboard sheet
   - Citation/NAP tracking sheet

---

## Success Decision at Day 90

Continue scaling only if all are true:
- Technical hygiene remains stable (no recurring crawl/index/CWV regressions)
- Non-branded visibility and qualified lead trend are both positive
- Local + commercial pages demonstrate conversion contribution

If not, shift strategy toward fewer high-proof pages, stronger case studies, and deeper refreshes rather than net-new page volume.
