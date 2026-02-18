# Advanced Schema Deployment Blueprint for Portfolio

## 1) Objectives and Principles

- Build a durable, linked Schema.org graph that represents the portfolio as a single entity ecosystem, not isolated JSON-LD blocks.
- Use stable `@id` URIs for every major node so search engines can reconcile updates over time.
- Prioritize eligibility-critical fields first (required), then trust/context fields (recommended), then enrichment fields (advanced).
- Keep schema aligned with visible page content and avoid unverifiable claims.
- Centralize reusable entities (Person, Organization, WebSite) and reference them from page-level entities.

---

## 2) Entity Graph Architecture

Use one graph model across the whole site.

Core entities:

- `WebSite` (site root)
- `WebPage` variants (Home, About, Project detail, Blog post, Services, FAQ)
- `Person` (site owner)
- Optional `Organization` (if services are offered under a brand)
- `Project` (implemented as `CreativeWork` or `SoftwareSourceCode`, depending on project type)
- `BlogPosting`
- `Service`
- `FAQPage` + `Question` + `Answer`
- `BreadcrumbList` for navigational pages

Recommended graph shape:

- `WebSite` publishes `BlogPosting` and contains `WebPage` entries.
- `Person` is main `author`, `creator`, or `provider` across content.
- `Project` nodes are linked from project pages and optionally from blog posts discussing them.
- `Service` is offered by `Person` (or `Organization`) and surfaced on service pages.
- `FAQPage` is attached to service/sales/support pages where FAQs are visibly rendered.

---

## 3) Canonical @id Linking Strategy

### 3.1 Rules

- Use absolute HTTPS URLs for all `@id` values.
- Use hash URIs for reusable entities:
  - `https://example.com/#person`
  - `https://example.com/#website`
  - `https://example.com/#organization`
- Use canonical page URL + fragment for page-scoped entities:
  - `https://example.com/projects/my-app/#project`
  - `https://example.com/blog/schema-guide/#blogposting`
  - `https://example.com/services/seo/#service`
  - `https://example.com/services/seo/faq/#faq`
- Never change an `@id` once deployed unless URL architecture changes.
- If URLs change, preserve equivalence using redirects and update `mainEntityOfPage` + canonicals.

### 3.2 Reuse matrix

- `Person.@id` reused in `author`, `creator`, `publisher` (if individual publisher), `provider`, `founder`.
- `WebSite.@id` reused in `isPartOf`, `publisher` (if publisher modeled as site org), `about`.
- `Organization.@id` reused in `publisher`, `provider`, `brand`.
- Page-level entity uses `mainEntityOfPage` pointing to that page’s canonical URL.

---

## 4) Required vs Recommended Properties by Type

Note: “Required” here means practically required for rich result eligibility and robust understanding, even when Schema.org itself is permissive.

### 4.1 Person

Required (deployment baseline):

- `@type`: `Person`
- `@id`
- `name`
- `url`

Recommended:

- `jobTitle`
- `description`
- `image`
- `sameAs` (GitHub, LinkedIn, X, Dribbble, etc.)
- `knowsAbout`
- `worksFor` (if applicable)

Advanced:

- `alumniOf`
- `award`
- `hasCredential`

### 4.2 Project (Portfolio)

Use `CreativeWork` for general case; use `SoftwareSourceCode` for code-first projects.

Required:

- `@type`: `CreativeWork` or `SoftwareSourceCode`
- `@id`
- `name`
- `description`
- `url`
- `creator` or `author` (link to Person)

Recommended:

- `dateCreated`
- `datePublished` (if launch/public release date exists)
- `dateModified`
- `image`
- `keywords`
- `inLanguage`
- `license` (for open source)
- `codeRepository` (if `SoftwareSourceCode`)
- `programmingLanguage` (if software)

Advanced:

- `isBasedOn`
- `funding`
- `maintainer`

### 4.3 BlogPosting

Required:

- `@type`: `BlogPosting`
- `@id`
- `headline`
- `description`
- `datePublished`
- `dateModified`
- `author` (Person `@id`)
- `mainEntityOfPage`

Recommended:

- `image`
- `publisher` (Organization or Person)
- `inLanguage`
- `keywords`
- `articleSection`
- `wordCount`

Advanced:

- `about` (link to Project/Service/Topic nodes)
- `mentions`
- `speakable` (where appropriate)

### 4.4 FAQPage

Required:

- `@type`: `FAQPage`
- `@id`
- `mainEntity` (array of `Question`)
- Each `Question` has:
  - `@type`: `Question`
  - `name`
  - `acceptedAnswer` with:
    - `@type`: `Answer`
    - `text`

Recommended:

- `mainEntityOfPage`
- Page-level `WebPage` linkage via `isPartOf`
- Keep Q/A text substantially matching visible content

Advanced:

- Topic linkage using `about`
- Locale segmentation for multilingual FAQs

### 4.5 Service

Required:

- `@type`: `Service`
- `@id`
- `name`
- `description`
- `provider` (Person or Organization `@id`)
- `serviceType`
- `areaServed` (if region-specific)

Recommended:

- `url`
- `offers` (`Offer` with price specs where publicly listed)
- `termsOfService`
- `audience`
- `availableChannel`

Advanced:

- `hasOfferCatalog`
- `review` / `aggregateRating` (only if compliant and genuine)
- `category`

---

## 5) JSON-LD Implementation Pattern

### 5.1 Sitewide graph block (layout-level)

- Inject reusable entities (`WebSite`, `Person`, optional `Organization`) globally.
- Keep entity data centralized in one source (e.g., typed config module).
- Emit page-specific entities in page templates/components.
- Always wrap as `{"@context": "https://schema.org", "@graph": [...]}`.

### 5.2 Single-source schema registry

Maintain a schema registry map by entity key:

- `person`
- `website`
- `organization`
- `project:{slug}`
- `blog:{slug}`
- `service:{slug}`
- `faq:{slug}`

Benefits:

- Prevents duplicate/conflicting definitions.
- Supports deterministic IDs.
- Enables automated QA checks.

---

## 6) Validation Workflow (Build + CI + Production)

### 6.1 Local validation (developer workflow)

- Validate JSON syntax and required fields with a local schema contract (custom Zod/TypeBox/JSON Schema).
- Enforce deterministic `@id` format and canonical URL parity.
- Assert that all linked IDs resolve to declared entities or canonical external nodes.

### 6.2 Pre-merge CI checks

Automated checks per PR:

- Extract rendered JSON-LD from built pages.
- Verify:
  - No duplicate `@id` with conflicting payloads.
  - Required fields for each type are present.
  - `dateModified >= datePublished` where relevant.
  - `mainEntityOfPage` equals canonical URL.
  - FAQ Q/A parity with visible content snapshots.
- Run Google Rich Results Test (where supported types exist) and Schema Markup Validator.

### 6.3 Production monitoring

- Weekly crawl of key URLs to diff JSON-LD payloads.
- Alert on:
  - Missing graph block.
  - Broken JSON.
  - Unexpected `@id` changes.
  - Field regressions on required properties.
- Track Search Console enhancements/performance by schema type.

---

## 7) Rollout Phases

### Phase 0: Discovery and inventory

- Inventory existing templates and content types.
- Define canonical URL policy and slug consistency.
- Create entity map and ID conventions document.

Deliverables:

- Entity catalog
- ID naming spec
- Required/recommended property matrix

### Phase 1: Foundation graph

- Deploy global `WebSite` + `Person` (+ optional `Organization`) graph.
- Add `WebPage` + `BreadcrumbList` for primary templates.
- Verify no syntax/ID errors.

Success criteria:

- 100% key pages emit valid baseline graph.

### Phase 2: Content entities

- Deploy `Project`, `BlogPosting`, `Service`, and `FAQPage` markup on relevant pages.
- Add cross-linking via `@id` references.
- Begin CI gating for required fields.

Success criteria:

- All target templates pass automated validation.

### Phase 3: Enrichment

- Add recommended/advanced fields (offers, topics, language, repository metadata).
- Improve image consistency and metadata completeness.
- Expand inter-entity links (`about`, `mentions`, `isPartOf`).

Success criteria:

- >90% recommended-field completeness across core entities.

### Phase 4: Optimization and governance

- Add drift monitoring and change detection.
- Set editorial rules for schema-bearing fields.
- Review performance impact quarterly.

Success criteria:

- Zero critical schema errors for 30 days.
- Stable rich result visibility where eligible.

---

## 8) Example JSON-LD Blocks

Replace `example.com` and sample values with real portfolio data.

### 8.1 Person

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://example.com/#person",
  "name": "Alex Rivera",
  "url": "https://example.com/about",
  "jobTitle": "Full-Stack Developer",
  "description": "Developer specializing in performance-focused web products.",
  "image": "https://example.com/images/alex-rivera.jpg",
  "sameAs": [
    "https://github.com/alexrivera",
    "https://www.linkedin.com/in/alexrivera"
  ],
  "knowsAbout": ["TypeScript", "Next.js", "SEO", "Technical Architecture"]
}
```

### 8.2 Project (SoftwareSourceCode)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "@id": "https://example.com/projects/schema-lab/#project",
  "name": "Schema Lab",
  "description": "A schema orchestration toolkit for validating and deploying JSON-LD at scale.",
  "url": "https://example.com/projects/schema-lab",
  "creator": { "@id": "https://example.com/#person" },
  "dateCreated": "2024-08-10",
  "dateModified": "2026-01-18",
  "codeRepository": "https://github.com/alexrivera/schema-lab",
  "programmingLanguage": ["TypeScript"],
  "license": "https://opensource.org/licenses/MIT",
  "keywords": ["structured data", "schema.org", "json-ld"]
}
```

### 8.3 BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://example.com/blog/advanced-schema-blueprints/#blogposting",
  "headline": "Advanced Schema Blueprints for Developer Portfolios",
  "description": "A practical system for modeling linked schema entities across portfolio sites.",
  "datePublished": "2026-01-10",
  "dateModified": "2026-02-01",
  "author": { "@id": "https://example.com/#person" },
  "publisher": { "@id": "https://example.com/#person" },
  "mainEntityOfPage": "https://example.com/blog/advanced-schema-blueprints",
  "image": "https://example.com/images/blog/schema-blueprint-cover.jpg",
  "articleSection": "Technical SEO",
  "inLanguage": "en",
  "about": [
    { "@id": "https://example.com/services/technical-seo/#service" },
    { "@id": "https://example.com/projects/schema-lab/#project" }
  ]
}
```

### 8.4 FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://example.com/services/technical-seo/faq/#faq",
  "mainEntityOfPage": "https://example.com/services/technical-seo/faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does technical SEO implementation take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most portfolio-scale implementations take 1-2 weeks for foundation schema and validation setup."
      }
    },
    {
      "@type": "Question",
      "name": "Do you support ongoing schema maintenance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, ongoing maintenance includes monitoring, validation, and iterative enrichment based on content changes."
      }
    }
  ]
}
```

### 8.5 Service

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://example.com/services/technical-seo/#service",
  "name": "Technical SEO and Schema Deployment",
  "description": "Design and implementation of linked structured data systems for content and conversion pages.",
  "serviceType": "Technical SEO",
  "provider": { "@id": "https://example.com/#person" },
  "url": "https://example.com/services/technical-seo",
  "areaServed": "Worldwide",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/contact",
    "availability": "https://schema.org/InStock"
  }
}
```

---

## 9) Governance Checklist

- Every schema node has stable `@id` and canonical alignment.
- Every page-level entity includes `mainEntityOfPage`.
- All required fields are present before merge.
- Recommended fields are tracked with coverage targets.
- FAQ and review-related schema always reflect visible content.
- Schema diffs are reviewed in PRs for high-impact templates.

---

## 10) Practical Deployment Notes

- Emit one consolidated `@graph` script per page where possible to reduce fragmentation.
- Keep timestamps ISO 8601 and timezone-consistent.
- Do not include fake ratings, fake offers, or hidden FAQ content.
- For multilingual pages, localize both content and schema fields (`inLanguage`, translated text).
- Version the schema generators and include changelog entries for type/property changes.
