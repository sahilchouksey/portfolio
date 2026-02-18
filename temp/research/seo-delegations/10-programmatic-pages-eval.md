# Programmatic / Location Pages Evaluation for Portfolio SEO

Date: 2026-02-16  
Repo: `/Volumes/T7/Developer/fun/portfolio`

## Decision

**Conditional GO** for a **small, quality-controlled set** of location/intent pages.  
**NO-GO** for scaled or template-spun programmatic pages.

Why:
- Current research in this repo shows stronger opportunity in local long-tail (`Jabalpur`, `Madhya Pradesh`) than broad head terms.
- This is a personal portfolio with limited true service-area depth; large-scale pSEO would create thin/duplicate risk quickly.
- The site currently has SPA + crawlability constraints, so quality should be prioritized over page volume.

---

## Go / No-Go Criteria

Use this gate before publishing any new location/programmatic page.

### GO (all should be true)
- Query has real buyer intent and relevance to your service offering (not just traffic curiosity).
- You can provide **location-specific first-hand proof** (project relevance, client context, local insight, or operating model).
- Page can include unique content beyond token city swaps (custom intro, proof, FAQs, examples).
- You can support page with internal links and at least one supporting content asset (case study/blog/FAQ).
- Conversion path is explicit and useful (contact method, response expectation, engagement model).

### NO-GO (any one is enough)
- Only variable changed is `{city}` with mostly identical copy.
- No distinct proof or practical differentiation for that location.
- Location has no plausible business relevance to your current positioning.
- You cannot meet minimum content/evidence thresholds defined below.
- You plan to publish many pages at once without quality review.

### Portfolio-specific rollout rule
- Start with **3 pages max**: India, Madhya Pradesh, Jabalpur.
- Expand only if these show traction (impressions/clicks/qualified leads) and pass quality checks.

---

## Template Recommendations

Use a **modular template with hard-required unique blocks**, not a single rigid clone.

### Recommended URL set (phase 1)
- `/ai-engineer-india`
- `/ai-engineer-madhya-pradesh`
- `/ai-engineer-jabalpur`

### Page template (recommended order)
1. **Hero + intent match**
   - H1: `AI Engineer in {Location}`
   - 1-2 sentence value proposition for target buyers.
2. **Who I help in {Location}**
   - Startup/SMB/healthcare or other concrete ICPs.
3. **Services and deliverables**
   - RAG, agentic workflows, backend/API integration, etc.
4. **Proof section (non-negotiable)**
   - 2-3 measurable outcomes from real projects.
5. **How engagement works**
   - Discovery -> scope -> build -> handoff/support; typical timeline.
6. **Location-specific section**
   - Collaboration model for local/regional clients, timezone overlap, communication cadence.
7. **FAQ**
   - Cost bands, timeline, stack, data privacy/compliance, engagement mode.
8. **CTA block**
   - Contact email + expected response window.

### Metadata/schema pattern
- Unique title + meta description per page.
- Canonical self-reference per page.
- Add `Service` or `ProfessionalService` only when visible service content exists.
- Add `FAQPage` only when FAQ text is visible on the same URL.

---

## Minimum Content Requirements (Anti-Thin Baseline)

A page is not publishable until all minimums are met.

### Content depth
- Main body text: **>= 700 words** (target 900-1,300 for stronger differentiation).
- At least **6 distinct sections** (excluding nav/footer).
- At least **1 location-specific paragraph** (>= 120 words) not reusable verbatim on other pages.

### Uniqueness and differentiation
- At least **40% of on-page copy must be unique** vs other location pages.
- At least **3 page elements must be location-specific**, e.g.:
  - local/regional use-case details,
  - localized FAQ wording,
  - location-specific buyer objections,
  - local collaboration/logistics details.

### Evidence and trust
- At least **2 proof items** with measurable outcomes (metric, timeline, or impact).
- At least **1 linked case study/project** relevant to the page’s promise.
- Clear owner identity and contact path (person-led service, not anonymous template content).

### UX and linking
- At least **3 internal links**: one project, one related page, one contact anchor/page.
- At least **1 unique CTA** sentence specific to page intent.
- No placeholder text, duplicate FAQs, or empty sections.

---

## Quality Safeguards (Safe Anti-Thin-Content Approach)

### 1) Indexation gating (publish safely)
- Draft new pages as `noindex` until they pass quality checklist.
- Move to indexable only after content, links, and proof are complete.
- Include in sitemap only after indexation gate is passed.

### 2) Programmatic guardrails
- No bulk generation from city lists.
- Maximum publishing velocity: **1 new location page per 2-3 weeks**.
- Every page requires manual editorial pass with a checklist sign-off.

### 3) Canonical + duplication controls
- One canonical URL per intent/location.
- Avoid overlap pages like both `/ai-engineer-jabalpur` and `/hire-ai-engineer-jabalpur` unless content intent is materially different.
- If pages are too similar after review, merge and 301 weaker page.

### 4) Content quality QA checklist
Before publish, confirm:
- Search intent match is explicit in H1, intro, and CTA.
- Claims are supported by visible proof.
- FAQ answers are substantive (not one-line generic responses).
- Internal links are contextually relevant.
- Title/meta/H1/URL are unique and aligned.

### 5) Performance and crawl safeguards
- Do not expand page count until foundational technical fixes are stable (sitemap quality, canonical correctness, crawlable content).
- Monitor for soft-404 signals and low-quality indexing patterns.

### 6) Pruning policy (critical)
Review every 60-90 days:
- If a page has low impressions + no engagement + weak uniqueness, improve or consolidate.
- If no strategic value remains, `noindex` then remove/redirect.
- Keep only pages with clear business intent and measurable utility.

---

## Recommended KPI Gates for Expansion

Only add more location pages if phase-1 pages meet at least 2 of these:
- Rising non-branded impressions for target location-intent queries.
- At least one page reaches meaningful clicks/CTR trend.
- Organic leads/contact starts attributable to location pages.
- Stable indexation without duplicate/canonical issues.

If gates are not met, shift effort to proof-heavy case studies and on-domain informational content rather than more location variants.

---

## Final Recommendation

For this portfolio, treat location pages as **precision landing pages**, not a scaled pSEO engine.  
A small set of high-evidence pages is likely beneficial; mass location expansion is high risk for thin content and should be avoided.
