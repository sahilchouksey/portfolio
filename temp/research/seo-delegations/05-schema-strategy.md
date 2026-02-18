# Structured Data Strategy - Personal Portfolio (Industry Grade)

## 1) Objectives
- Build a clean **entity graph** around `Person -> WebSite -> WebPage -> Work/Content` so Google, Bing, and AI assistants can reliably identify the portfolio owner and expertise.
- Improve eligibility for rich results where applicable (Article, Breadcrumb, Sitelinks Search Box, Organization/Person understanding).
- Improve **AI engineer discoverability** by expressing skills, projects, work history, and authored content as machine-readable facts.

---

## 2) Recommended Schema Types by Page/Section

### Core types to implement now (high priority)
1. `Person` (primary entity)
2. `WebSite`
3. `WebPage` (homepage)
4. `ProfilePage` (for personal portfolio homepage intent)
5. `BreadcrumbList`
6. `ItemList` (projects list)
7. `SoftwareSourceCode` (for open-source/GitHub projects)
8. `SoftwareApplication` (for deployed apps/products)
9. `Blog` (external publication entity)
10. `BlogPosting`/`Article` (for first-party blog pages if/when hosted under your domain)

### Conditional / future types (only when matching visible content)
11. `FAQPage` (only if a visible FAQ section exists on-page)
12. `Service` or `ProfessionalService` (only if you publish concrete service offerings, scope, pricing/contact flow)
13. `Organization` (optional personal brand node if needed for publisher/ownership abstraction)
14. `CollectionPage` (for `/projects`, `/blog` index pages if split into dedicated routes)

---

## 3) Property Requirements: Required vs Recommended

> Notes:
> - "Required" here means required for valid, meaningful implementation and/or rich result eligibility intent.
> - Always keep values identical to on-page visible content.

### A) Person (primary node)
**Required**
- `@type`: `Person`
- `@id` (stable URI fragment, e.g. `https://sahilchouksey.in/#person`)
- `name`
- `url`

**Recommended**
- `givenName`, `familyName`
- `description`
- `image`
- `email` (omit if you do not want public extraction)
- `address` (`PostalAddress` with locality/region/country)
- `sameAs` (GitHub, LinkedIn, X, WakaTime, Hashnode)
- `jobTitle` (string or array)
- `knowsAbout` (skills/topics)
- `worksFor` / `memberOf`
- `alumniOf`
- `hasOccupation`
- `knowsLanguage`

### B) WebSite
**Required**
- `@type`: `WebSite`
- `@id`
- `url`
- `name`

**Recommended**
- `description`
- `publisher` (link to `Person` or `Organization`)
- `inLanguage`
- `potentialAction` as `SearchAction` (only if real site search endpoint exists)

### C) WebPage + ProfilePage (homepage)
**Required**
- `@type`: include `WebPage` and `ProfilePage`
- `@id`
- `url`
- `name`
- `isPartOf` (link to WebSite)
- `about` (link to Person)

**Recommended**
- `description`
- `breadcrumb` (link to BreadcrumbList)
- `primaryImageOfPage`
- `inLanguage`
- `mainEntity` (Person)

### D) BreadcrumbList
**Required**
- `@type`: `BreadcrumbList`
- `itemListElement` with ordered `ListItem` objects (`position`, `name`, `item`)

**Recommended**
- Match only actual crawlable navigation paths; avoid fragment-only breadcrumbs as primary breadcrumb for Google rich results.

### E) ItemList (Projects)
**Required**
- `@type`: `ItemList`
- `name`
- `itemListElement` (`ListItem` with `position` + `item`)

**Recommended**
- Each `item` should be typed accurately as either `SoftwareApplication` or `SoftwareSourceCode`
- `url`, `description`, `keywords`, `creator` (Person)
- `codeRepository` for open-source projects

### F) SoftwareApplication (deployed products)
**Required**
- `@type`: `SoftwareApplication`
- `name`
- `applicationCategory`
- `operatingSystem` (for web: `Web`)

**Recommended**
- `url`
- `description`
- `creator` (Person)
- `offers` (`Offer` with price/currency, even `0` if free)
- `featureList`
- `softwareVersion`
- `screenshot`

### G) SoftwareSourceCode (GitHub/open-source)
**Required**
- `@type`: `SoftwareSourceCode`
- `name`
- `codeRepository`

**Recommended**
- `description`
- `programmingLanguage`
- `runtimePlatform`
- `license`
- `author` (Person)
- `keywords`
- `url` (live demo if available)

### H) Blog / BlogPosting / Article
**Blog (publication entity) required**
- `@type`: `Blog`
- `name`
- `url`

**BlogPosting/Article required (per post page)**
- `@type`: `BlogPosting` (or `Article`)
- `headline`
- `author` (Person)
- `datePublished`
- `mainEntityOfPage`

**Recommended**
- `dateModified`
- `image`
- `publisher`
- `articleSection`
- `keywords`
- `wordCount`
- `inLanguage`

### I) FAQPage (conditional)
**Required**
- `@type`: `FAQPage`
- `mainEntity` array of `Question` with `name` and `acceptedAnswer.text`

**Recommended**
- Keep FAQ text visibly present on same URL; do not inject hidden SEO-only Q&A.

### J) Service / ProfessionalService (conditional)
**Required**
- `@type`: `Service` (or `ProfessionalService`)
- `name`
- `provider` (Person/Organization)
- `description`

**Recommended**
- `serviceType`
- `areaServed`
- `audience`
- `offers` (`Offer`, contact/price model)
- `termsOfService`, `url`

---

## 4) Current Portfolio Audit (from existing JSON-LD)

### What is already good
- Uses `@graph` with `Person`, `WebSite`, `BreadcrumbList`, and project `ItemList`.
- Includes strong `sameAs`, skills (`knowsAbout`), education (`alumniOf`), and occupation context.

### Improvements needed
1. Add explicit `WebPage/ProfilePage` node for homepage semantics.
2. Add `mainEntity` and `about` links between homepage and person.
3. Replace/augment fragment-only breadcrumbs with route-based breadcrumbs when dedicated pages exist.
4. Split project item typing:
   - GitHub repos -> `SoftwareSourceCode`
   - Live products -> `SoftwareApplication`
5. Add `Blog` node for `https://blog.sahilchouksey.in` and model recent posts as `BlogPosting` in a `hasPart`/`ItemList` pattern.
6. Remove empty properties (example: empty `telephone`) to reduce low-quality signals.
7. Add `@id` to every major node and reuse consistently.

---

## 5) JSON-LD Implementation Architecture (Recommended)

## Graph design
- Keep a **single consolidated JSON-LD block** in `<head>` for base entities (`Person`, `WebSite`, homepage `WebPage/ProfilePage`).
- Add **section/page-specific JSON-LD** close to relevant route render:
  - Projects route/section: `ItemList` + project nodes
  - Blog route/section: `Blog` + optional `BlogPosting` items
  - FAQ route: `FAQPage`

## Stable IDs pattern
Use permanent IDs to form a knowledge graph:
- `https://sahilchouksey.in/#person`
- `https://sahilchouksey.in/#website`
- `https://sahilchouksey.in/#webpage`
- `https://sahilchouksey.in/#projects`
- `https://sahilchouksey.in/#blog`

## Canonical consistency rules
- `url`, canonical tags, Open Graph URLs, and JSON-LD URLs must match exactly.
- Prefer absolute URLs.
- Keep dates in ISO 8601.

## Rendering guidance (React/Vite)
- For static global schema, place in `index.html` (already done).
- For dynamic entries (blog posts/projects), generate JSON-LD in React and inject via a script tag with `type="application/ld+json"`.
- Sanitize and stringify once; avoid malformed JSON from template interpolation.

---

## 6) AI Engineer Discoverability Guidance

### Why this matters
LLM agents and AI search systems infer expertise from explicit, linked entities. Strong schema increases confidence in:
- Identity resolution (who you are)
- Skill attribution (what you know)
- Work attribution (what you built)
- Authorship credibility (what you wrote)

### High-impact fields for AI discoverability
- `sameAs` links across identity surfaces (GitHub, LinkedIn, X, Hashnode, WakaTime)
- `knowsAbout` mapped to your target keywords (RAG, LangGraph, Vertex AI, Go, React)
- `hasOccupation`, `worksFor`, `alumniOf` for career provenance
- `author`/`creator` links from projects and articles back to `#person`
- `codeRepository` for OSS verification
- `mentions` / `about` on pages for topic grounding

### Content-to-schema parity rule
Every major claim in schema should also be visible in page copy or linked source. This helps avoid trust downgrades from search engines and LLM retrievers.

---

## 7) Example Industry-Grade JSON-LD Blueprint

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://sahilchouksey.in/#person",
      "name": "Sahil Chouksey",
      "url": "https://sahilchouksey.in/",
      "image": "https://sahilchouksey.in/images/avatar.png",
      "jobTitle": ["Full Stack Developer", "Applied AI Engineer"],
      "sameAs": [
        "https://github.com/sahilchouksey",
        "https://linkedin.com/in/sahilchouksey",
        "https://x.com/SahilChouksey9",
        "https://wakatime.com/@sahilchouksey",
        "https://blog.sahilchouksey.in"
      ],
      "knowsAbout": ["LangGraph", "RAG", "Vertex AI", "Golang", "React", "Node.js"]
    },
    {
      "@type": "WebSite",
      "@id": "https://sahilchouksey.in/#website",
      "url": "https://sahilchouksey.in/",
      "name": "Sahil Chouksey - Portfolio",
      "publisher": { "@id": "https://sahilchouksey.in/#person" },
      "inLanguage": "en-US"
    },
    {
      "@type": ["WebPage", "ProfilePage"],
      "@id": "https://sahilchouksey.in/#webpage",
      "url": "https://sahilchouksey.in/",
      "name": "Sahil Chouksey | Full Stack Developer & AI Engineer",
      "isPartOf": { "@id": "https://sahilchouksey.in/#website" },
      "about": { "@id": "https://sahilchouksey.in/#person" },
      "mainEntity": { "@id": "https://sahilchouksey.in/#person" },
      "inLanguage": "en-US"
    },
    {
      "@type": "ItemList",
      "@id": "https://sahilchouksey.in/#projects",
      "name": "Projects by Sahil Chouksey",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "SoftwareApplication",
            "name": "BRIO Health AI",
            "url": "https://briohealth.ai",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web",
            "creator": { "@id": "https://sahilchouksey.in/#person" }
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "SoftwareSourceCode",
            "name": "Study in Woods",
            "codeRepository": "https://github.com/sahilchouksey/study-in-woods",
            "author": { "@id": "https://sahilchouksey.in/#person" }
          }
        }
      ]
    }
  ]
}
```

---

## 8) Validation and QA Checklist
- Validate with Google Rich Results Test and Schema.org validator.
- Ensure no trailing commas or invalid JSON.
- Ensure all URLs resolve (especially `sameAs` and `codeRepository`).
- Remove empty/null fields.
- Keep schema synchronized with visible content updates.
- Re-test after each major content deployment.

---

## 9) Recommended Rollout Plan
1. **Phase 1 (now):** Normalize `Person + WebSite + WebPage/ProfilePage + ItemList` graph IDs and clean properties.
2. **Phase 2:** Add per-project typed nodes (`SoftwareApplication` vs `SoftwareSourceCode`) with richer fields.
3. **Phase 3:** Add `Blog` + post-level schema integration for dynamic blog cards.
4. **Phase 4 (optional):** Add `FAQPage` or `Service` only after publishing matching visible sections.

This sequence maximizes correctness, discoverability, and long-term maintainability while minimizing structured-data spam risk.
