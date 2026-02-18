# E-E-A-T Authority Plan - Technical Personal Brand (AI Engineer)

Date: 2026-02-16
Repo: `/Volumes/T7/Developer/fun/portfolio`
Primary entity: Sahil Chouksey (`sahilchouksey.in`)

---

## Goal

Strengthen E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) so the site can rank for high-intent AI engineer queries while also improving conversion confidence for recruiters, founders, and technical buyers.

---

## Current E-E-A-T Baseline (from repository)

### Strong signals already present
- Clear identity graph in JSON-LD (`Person`, `WebSite`, project `ItemList`) in `index.html`.
- Public identity consistency: GitHub, LinkedIn, X, WakaTime in `sameAs` and social links.
- Public authorship and AI-readable profile assets:
  - `public/humans.txt`
  - `public/llms.txt`
  - `public/llms-full.txt`
- Security contact transparency via `public/.well-known/security.txt`.
- Real projects with domain alignment (healthcare AI + RAG + LangGraph) represented on-page.

### Material gaps to close
- Proof is present but not yet packaged as explicit evidence blocks (metrics, architecture decisions, role ownership, artifacts).
- Authority is mostly implicit; limited explicit third-party validation and citation graph from external sites.
- Trust pages are limited (no dedicated privacy, AI use policy, editorial policy, or update-history signals for key pages).
- Single-page architecture limits topical depth and weakens expertise clustering.

---

## Deliverable 1: Experience and Expertise Proof Blocks

Use these as reusable content modules on homepage, service pages, and project detail pages.

## 1) Project Outcome Proof Block (primary)

Purpose: prove hands-on experience and measurable impact.

Copy block template:

```md
### Project Outcome Snapshot: [Project Name]
- Context: [Who had what problem]
- My role: [Exact responsibility and ownership]
- Stack: [LangGraph, Vertex AI, Go, React, etc.]
- Constraints: [Latency, compliance, cost, timeline]
- What I built: [Architecture + key implementation]
- Measured outcomes:
  - [Metric 1: e.g., response time reduced 42%]
  - [Metric 2: e.g., retrieval relevance improved from X to Y]
  - [Metric 3: e.g., support load reduced N%]
- Artifacts:
  - Live demo: [URL]
  - Code repo or sanitized code sample: [URL]
  - Technical writeup: [URL]
  - Related talk/post: [URL]
```

Implementation notes:
- Add 2-4 of these for top projects (BRIO Health AI first).
- Keep all metrics verifiable and non-inflated.

## 2) Engineering Decision Record Block

Purpose: show expert reasoning, not just outcomes.

Copy block template:

```md
### Engineering Decision: [Decision Title]
- Problem: [What was failing or blocked]
- Options considered: [Option A, B, C]
- Decision: [What was chosen]
- Why: [Trade-off analysis]
- Result: [Observed effect on quality, cost, or speed]
```

Use cases:
- Why LangGraph over simpler chaining.
- Why pgvector/Vertex AI stack for healthcare retrieval.

## 3) Production Reliability Block

Purpose: demonstrate real-world operation competence.

Copy block template:

```md
### Reliability and Operations
- Deployment environment: [Cloud provider + runtime]
- Monitoring: [logs, traces, alerting]
- Failure handling: [fallback strategy, retries, guardrails]
- Data and model safety controls: [validation, filters, human review]
- Incident example: [what broke, how fixed, what changed]
```

## 4) Domain Expertise Block (Healthcare AI)

Purpose: link technical expertise to domain-aware constraints.

Copy block template:

```md
### Domain Constraint Handling: Healthcare AI
- Risk handled: [hallucination, outdated evidence, unsafe suggestion]
- Control implemented: [source citation, confidence threshold, escalation]
- Compliance-aware behavior: [privacy handling, non-diagnostic guardrails]
- User impact: [faster evidence retrieval, safer output framing]
```

## 5) Open Source and Public Build Trail Block

Purpose: make claims auditable by third parties.

Copy block template:

```md
### Public Build Trail
- Open-source projects: [links]
- Commit activity and release cadence: [links]
- Technical articles and deep dives: [links]
- Community contributions: [issues, PRs, discussions]
```

---

## Deliverable 2: Authority Reinforcement Steps

## Priority 1 (high ROI, on-site)
1. Create dedicated authority pages:
   - `/about` (full background + working style + specialties)
   - `/case-studies` (proof-first index)
   - `/services` (commercial clarity for AI engineering engagements)
2. Expand structured entity graph per page:
   - Add `WebPage` + `ProfilePage` + typed project nodes (`SoftwareApplication` and `SoftwareSourceCode`) consistently.
3. Publish technical thought leadership series (first-party):
   - RAG in healthcare production
   - LangGraph architecture decisions
   - AI reliability and guardrails in real systems
4. Add citation-backed claims in all long-form content:
   - Link standards, docs, benchmarks, papers when discussing methods.

## Priority 2 (off-site authority graph)
5. Build deliberate mention network:
   - Guest posts on recognized engineering publications.
   - Podcast/talk appearances with transcript pages.
   - Co-authored posts with companies/teams where work shipped.
6. Strengthen profile consistency across platforms:
   - Unified bio, same role phrasing, same project naming across GitHub/LinkedIn/X/Hashnode.
7. Create externally linkable assets:
   - Public architecture diagrams, benchmark reports, reusable templates.
8. Capture social proof with provenance:
   - Testimonials with full name, role, company, and link where permitted.

## Priority 3 (authority durability)
9. Create an editorial quality standard:
   - Define content update cadence and fact-check workflow.
10. Add "last reviewed" and "reviewed by" fields on technical pages.
11. Create a lightweight media kit page for press/recruiters:
   - Bio, headshot, topic expertise, speaking topics, contact.

---

## Deliverable 3: Trust and Transparency Items

## Must-add trust pages
1. Privacy Policy (`/privacy`): data collection, analytics, retention, contact rights.
2. Terms or Engagement Policy (`/terms` or `/engagement`): scope, communication boundaries, billing/contract expectations.
3. AI Usage and Safety Policy (`/ai-policy`):
   - model limitations
   - hallucination risk disclosure
   - human review expectations
   - healthcare non-medical-advice disclaimer where relevant.
4. Editorial Policy (`/editorial-policy`): authorship, review process, correction policy.

## Trust elements to add on key pages
- "Last updated" timestamp per page.
- "Built by" and "Reviewed by" author box with profile links.
- Contact SLA (for example: response in 24-48h).
- Explicit location and timezone for collaboration clarity.
- Client work disclosure labels (public demo, sanitized demo, private project).

## Security and compliance transparency
- Keep `security.txt` current annually.
- Add a simple vulnerability disclosure page linked from security.txt.
- Publish dependency update cadence and basic security hygiene statement.

---

## Deliverable 4: On-site and Off-site E-E-A-T Checklist

Use this as operational QA before each monthly release.

## On-site checklist

### Experience
- [ ] Each top project has a "Project Outcome Snapshot" with measurable results.
- [ ] At least one incident/failure-and-fix narrative is published.
- [ ] Role ownership is explicit (what you personally built vs team contribution).

### Expertise
- [ ] 3+ deep technical articles published on first-party domain.
- [ ] Every technical claim includes references or implementation evidence.
- [ ] Architecture decision records exist for flagship systems.

### Authority
- [ ] Entity schema is complete and consistent across all major pages.
- [ ] Case study pages link to code, demo, and writeups.
- [ ] Testimonials include identity context and are not anonymous placeholders.

### Trust
- [ ] Privacy, AI policy, and editorial policy pages are live and linked sitewide.
- [ ] Contact details, location, and response expectations are clearly visible.
- [ ] Security contact path is valid (`/.well-known/security.txt` + policy page).
- [ ] All pages show last updated date.

### Technical support for E-E-A-T
- [ ] Canonical tags align with page URLs.
- [ ] Sitemap only includes canonical indexable URLs.
- [ ] Major pages are prerendered or server-rendered for reliable crawlability.

## Off-site checklist

### Authority graph
- [ ] Consistent profile bios across GitHub, LinkedIn, X, and blog.
- [ ] At least 5 quality backlinks from relevant engineering/business sources.
- [ ] Mentions from reputable domains tied to technical expertise.

### Reputation and validation
- [ ] 2+ external guest posts or interviews annually.
- [ ] Public speaking, webinar, or workshop records linked from site.
- [ ] Community contribution trail (OSS PRs/issues/discussions) is visible.

### Trust externally
- [ ] Testimonials/recommendations on third-party platforms (LinkedIn, etc.).
- [ ] Public contact and professional identity details match on all platforms.
- [ ] No conflicting claims about role, years of experience, or project ownership.

---

## 30-60-90 Day E-E-A-T Execution Plan

## First 30 days
- Publish 2 flagship case studies with proof blocks and metrics.
- Launch `/about`, `/privacy`, and `/ai-policy`.
- Add author/review metadata and last-updated stamps sitewide.

## 31-60 days
- Publish 3 technical deep-dives on first-party domain.
- Add decision-record sections to each flagship case study.
- Secure 2-3 external mentions (guest post, interview, or partner mention).

## 61-90 days
- Publish comparison and benchmark content (methodology-first).
- Launch media/speaking page and collect 2+ attributable testimonials.
- Re-audit schema, crawlability, and trust pages for consistency.

---

## Suggested KPI Tracking

- Non-branded impressions for expertise terms (RAG, LangGraph, healthcare AI).
- Click-through and conversion rate on case study pages.
- Number of indexed proof-heavy pages.
- Quality referring domains and mention velocity.
- Assisted conversions where case-study pages appear in journey.

---

## Recommended immediate additions to this repository

1. Add new markdown/content sources for:
   - `about`
   - `privacy`
   - `ai-policy`
   - `editorial-policy`
2. Expand project data model to include proof metrics and artifact links.
3. Add reusable `ProofBlock` component for project and service pages.
4. Add "last updated" metadata in page templates.

These changes directly convert existing credibility into explicit E-E-A-T signals that search systems and human evaluators can trust.
