# Technical SEO Audit - React + Vite Portfolio (`/Volumes/T7/Developer/fun/portfolio`)

Date: 2026-02-16
Scope: crawlability, indexation, canonicalization, metadata, sitemap/robots, rendering

## Executive Take

This portfolio has strong basic metadata and structured data, but it is currently exposed as a client-rendered SPA with a sitemap that includes hash-fragment URLs. The two highest-impact technical fixes are:

1. make important content available in prerendered HTML (or SSR/SSG)
2. correct sitemap/canonical behavior so only indexable canonical URLs are submitted

---

## Audit Checklist (Pass/Fail)

### 1) Crawlability

| Check | Pass Criteria | Status | Evidence | Recommendation |
|---|---|---|---|---|
| `robots.txt` exists and is reachable | `/robots.txt` present with valid directives | PASS | `public/robots.txt` | Keep file, simplify to reduce maintenance risk |
| XML sitemap declared in robots | `Sitemap:` points to canonical domain sitemap | PASS | `public/robots.txt:9` | Keep |
| Main pages not blocked by robots | No `Disallow` for important URLs | PASS | `public/robots.txt` | Keep |
| Avoid crawler-hostile directives | No unnecessary crawl throttling for generic bots | FAIL | `public/robots.txt:17` (`Crawl-delay: 1`) | Remove global crawl-delay; most major engines ignore it, some obey and crawl slower |
| Internal links discover core sections | Key sections linked in nav/footer | PASS | `src/components/sections/Navigation.jsx` | Keep |

### 2) Indexation

| Check | Pass Criteria | Status | Evidence | Recommendation |
|---|---|---|---|---|
| Indexable homepage | `meta robots` allows index/follow | PASS | `index.html:13-14` | Keep |
| Sitemap contains only indexable canonical URLs | No fragments, no non-canonical duplicates | FAIL | `public/sitemap.xml:23,31,39` contain `#Experience`, `#Projects`, `#Footer` | Remove fragment URLs; include canonical pages only |
| Thin/utility URLs excluded from sitemap | Non-SEO utility files omitted | PARTIAL | `resume.pdf` included (valid but optional) | Keep `resume.pdf` only if intended to rank |
| 404 handling for unknown paths | Clear 404 response/page | FAIL | `public/_redirects:1` rewrites all to `index.html` (200) | For static hosts, add explicit 404 handling where supported; avoid soft-404 behavior |

### 3) Canonicalization

| Check | Pass Criteria | Status | Evidence | Recommendation |
|---|---|---|---|---|
| Canonical tag present | One canonical URL on page | PASS | `index.html:15` | Keep |
| Canonical URL consistency | Canonical, OG URL, Twitter URL, sitemap URL align | PASS | `index.html:15,34,46`; `public/sitemap.xml:10` | Keep |
| Non-canonical host/protocol redirected | `http` -> `https`, `www` -> apex (or reverse) | UNKNOWN | Not configurable in repo only | Enforce host/protocol redirects at hosting layer |

### 4) Metadata

| Check | Pass Criteria | Status | Evidence | Recommendation |
|---|---|---|---|---|
| Unique title + description | Clear, intent-aligned, non-truncated | PASS | `index.html:8-10` | Keep |
| Open Graph complete | `og:title`, `og:description`, `og:image`, `og:url` | PASS | `index.html:33-43` | Keep |
| Twitter card complete | `summary_large_image` + title/desc/image | PASS | `index.html:45-52` | Keep |
| Structured data valid and relevant | JSON-LD includes `Person`/`WebSite` and valid URLs | PARTIAL | `index.html:70-234` includes Breadcrumb with fragment URLs | Keep Person/WebSite; remove/adjust Breadcrumb entries using hash fragments |
| Deprecated/no-value tags minimized | Avoid stale tags (`keywords`, `rating`, etc.) | PARTIAL | `index.html:11,55-58` | Safe to remove low-value legacy tags |

### 5) Sitemap / Robots Quality

| Check | Pass Criteria | Status | Evidence | Recommendation |
|---|---|---|---|---|
| Sitemap protocol validity | Valid XML and namespace usage | PASS | `public/sitemap.xml` | Keep format |
| URL strategy is canonical-only | One URL per indexable page | FAIL | Hash URLs included as separate `<url>` entries | Restrict to real canonical pages |
| `lastmod` maintenance quality | Dates update with meaningful content changes | PARTIAL | Static date `2025-01-15` for all entries | Automate sitemap generation in build/deploy |
| Robots complexity manageable | Concise rules, low conflict potential | PARTIAL | `public/robots.txt` has many agent blocks and duplicate casing | Simplify to `User-agent: *` + sitemap + minimal disallow rules |

### 6) Rendering (JS SEO)

| Check | Pass Criteria | Status | Evidence | Recommendation |
|---|---|---|---|---|
| Critical content visible without client JS execution | Primary headings/body links present in initial HTML | FAIL | `index.html:243` has only `<div id="root"></div>` | Add prerender/SSG for `/` (or SSR) |
| Stable crawlable HTML for key sections | Search bots can parse section content reliably | FAIL | Core content rendered by React after hydration (`src/main.jsx`) | Pre-render homepage HTML snapshot |
| Third-party data does not gate core discoverability | Core SEO text not blocked by runtime fetches | PARTIAL | Blog cards fetched at runtime (`src/components/sections/BlogSection.jsx`) | Keep blog as external links, but prerender static intro + links |

---

## Top Issues by Impact

### High impact

1. **Client-rendered-only main content (no prerender/SSR)**
   - Why it matters: indexation reliability, crawl budget efficiency, and snippet quality suffer when body content requires JS rendering.
   - Evidence: `index.html` contains no meaningful body content beyond root mount point.

2. **Sitemap includes fragment (`#`) URLs as standalone URLs**
   - Why it matters: fragments are not separate indexable documents; submitting them creates low-quality signals and wasted crawl requests.
   - Evidence: `public/sitemap.xml` entries for `/#Experience`, `/#Projects`, `/#Footer`.

### Medium impact

3. **Potential soft-404 behavior with universal rewrite to 200**
   - Why it matters: unknown URLs can appear indexable and reduce quality signals.
   - Evidence: `public/_redirects` rewrites all paths to `index.html 200`.

4. **Overly complex robots ruleset and global crawl-delay**
   - Why it matters: unnecessary complexity increases risk of contradictory behavior and can slow compliant crawlers.
   - Evidence: `public/robots.txt` extensive per-bot blocks and `Crawl-delay: 1`.

5. **Breadcrumb structured data references hash anchors**
   - Why it matters: breadcrumb schema is intended for hierarchical pages; fragment-based breadcrumb items are weak/non-standard for SEO value.
   - Evidence: `index.html:173-200`.

### Low impact

6. **Legacy meta tags (`keywords`, `rating`, etc.) and static `lastmod`**
   - Why it matters: low direct ranking effect; mostly cleanup and data hygiene.

---

## Specific Implementation Recommendations for This Repo

## A) Fix rendering for SEO (highest priority)

Recommended path (fastest with Vite + React SPA): prerender homepage HTML during build.

- Option 1 (recommended): add a prerender plugin for `/`
  - Add dependency (example): `vite-plugin-prerender` or equivalent maintained prerender plugin.
  - Configure `vite.config.js` to prerender `/` so crawlers receive full HTML for hero, experience, projects, and contact content.
- Option 2: migrate to framework-level SSR/SSG (Next.js/Astro) if future multi-page SEO is planned.

Minimum acceptance criteria:
- View source of deployed `/` contains meaningful text content (h1, section headings, project summaries, contact text), not only root div.

## B) Correct sitemap strategy

Update `public/sitemap.xml` to include only canonical, indexable URLs:

- Keep: `https://sahilchouksey.in/`
- Optional: `https://sahilchouksey.in/resume.pdf` only if you want PDF indexed
- Remove: all fragment URLs (`#Experience`, `#Projects`, `#Footer`)

If staying single-page, your sitemap can legitimately contain only 1-2 URLs.

## C) Simplify robots.txt

Trim `public/robots.txt` to a conservative baseline:

```txt
User-agent: *
Allow: /
Disallow: /*.map$
Sitemap: https://sahilchouksey.in/sitemap.xml
```

Notes:
- remove global `Crawl-delay`
- keep any extra bot-specific rules only if there is a clear policy reason

## D) Improve canonical/indexation controls

- Keep canonical in `index.html` as-is.
- Enforce host/protocol canonicalization at deploy provider:
  - `http` -> `https`
  - `www` <-> apex (pick one, currently apex is used)
- Ensure unknown paths return true 404 where possible (avoid long-term indexing of arbitrary rewritten URLs).

## E) Refine metadata/schema

- Keep strong title/description/OG/Twitter tags currently present.
- Update JSON-LD:
  - retain `Person` and `WebSite`
  - remove or simplify `BreadcrumbList` with fragment items
- Optional cleanup: remove low-value legacy tags (`keywords`, `rating`, `x-ua-compatible`) to reduce noise.

## F) Build/deploy automation

Add post-build checks (CI or local script):

1. validate sitemap has no `#` URLs
2. validate canonical URL is present and absolute
3. validate rendered HTML for `/` contains h1 + key section text
4. validate robots/sitemap are reachable in preview/deploy

---

## Suggested Priority Plan

1. Implement prerender for `/` in Vite build
2. Replace sitemap with canonical-only URLs
3. Simplify robots and remove crawl-delay
4. Remove hash-based breadcrumb entries from JSON-LD
5. Add deploy-level host/protocol canonical redirects and 404 behavior

---

## Quick Wins vs Structural Wins

- Quick wins (same day): sitemap fix, robots simplification, breadcrumb cleanup
- Structural win (best SEO ROI): prerendered HTML output for homepage content

---

## File-Level Notes (Repo Specific)

- Main SEO head config is in `index.html`
- Robots config is in `public/robots.txt`
- Sitemap is in `public/sitemap.xml`
- SPA rewrite behavior is in `public/_redirects`
- Runtime-rendered app entry is `src/main.jsx` and `src/App.jsx`
- Blog cards rely on client fetch: `src/components/sections/BlogSection.jsx`
