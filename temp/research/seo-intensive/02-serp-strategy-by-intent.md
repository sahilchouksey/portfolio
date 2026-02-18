# Master SERP Strategy by Query Intent

Date: 2026-02-17  
Scope: `sahilchouksey.in` AI engineering services SEO  
Inputs synthesized from prior findings in `temp/research/seo-delegations/*`

---

## 1) Strategic Frame

- Head terms are aggregator-heavy, so this strategy prioritizes long-tail and intent-specific pages where a personal proof-led portfolio can win.
- Local + niche solution intent (Jabalpur, Madhya Pradesh, RAG, LangGraph, healthcare AI) is the fastest path to rankings and qualified leads.
- Every query class maps to one dominant page type, one snippet objective, and one primary conversion action.
- Canonical architecture rule: one primary URL per intent-location pair, with supporting content feeding it through internal links.

---

## 2) Query Class Strategy Matrix

| Query Class | Core user intent | Priority keyword examples | Primary page type | SERP objective | Primary CTA |
|---|---|---|---|---|---|
| Service intent | Evaluate implementation partner for a specific AI solution | `rag developer india`, `langgraph developer india`, `healthcare ai developer india` | Service pages (`/services/*`) | Win transactional clicks with clear deliverables and trust | Discuss scope / request proposal |
| Hiring intent | Hire an AI engineer (individual) in India/remote | `hire ai engineer india`, `freelance ai engineer india`, `ai consultant india for startups` | Hire landing pages (`/hire-ai-engineer-india`, `/ai-engineer-india`) | Compete against agencies with transparent process and proof | Book discovery call |
| Proof intent | Validate real execution quality before contacting | `ai engineer portfolio india`, `rag developer india case study`, `vertex ai medical search engine developer` | Case studies and project detail pages | Earn high-credibility clicks via measurable outcomes | View project proof -> contact |
| Local intent | Find a nearby or region-relevant AI engineer | `ai engineer in jabalpur`, `hire ai engineer in madhya pradesh`, `freelance ai engineer in jabalpur` | Geo landing pages (`/ai-engineer-jabalpur`, `/ai-engineer-madhya-pradesh`) | Own thin local SERPs with hyper-relevant copy and local trust signals | Contact for local/regional engagement |

---

## 3) Snippet Strategy by Query Class

## Service intent snippets

- Snippet angle: capability + outcome + speed.
- Must show concrete deliverables (for example: retrieval architecture, evaluation framework, deployment support).
- Include one quantified proof signal in first 155 characters where possible.
- Add FAQ blocks for cost, timeline, and stack to improve PAA alignment.

Example meta description pattern:
`Build production-grade {Service} with a proof-led AI engineer in India. {Outcome metric} across {domain/use case}. Fast scoping, clear milestones.`

## Hiring intent snippets

- Snippet angle: role-fit + hiring clarity + engagement model.
- Differentiate from talent marketplaces with first-person ownership and delivery process.
- Address objections directly: timelines, communication cadence, handoff/support.
- Include lightweight pricing language (bands or model), not vague sales copy.

Example meta description pattern:
`Hire a freelance AI engineer in India for RAG, agentic workflows, and LLM products. Clear scope, weekly delivery cadence, and measurable outcomes.`

## Proof intent snippets

- Snippet angle: evidence first (metrics, constraints, architecture decisions).
- Use case-study framing in title/meta and reinforce implementation ownership.
- Include stack terms naturally (LangGraph, Vertex AI, RAG) for relevance matching.
- Surface artifact availability (demo, repo, technical writeup) where possible.

Example meta description pattern:
`See how {Project} improved {metric} using {stack}. Full case study with architecture, trade-offs, and deployment lessons from a production build.`

## Local intent snippets

- Snippet angle: location relevance + delivery scope + trust.
- Include location in title, description, and H1 naturally (no stuffing).
- Clarify remote-first plus local availability model where true.
- Add localized FAQ language (response times, collaboration model, business context).

Example meta description pattern:
`AI Engineer in {City}, {State} for startups and SMEs. Build RAG and AI automation systems with clear milestones, local context, and fast response.`

---

## 4) Title and Meta Formula Library

Use these as repeatable templates. Keep each URL unique.

## A) Service intent formulas

- Title formula 1: `{{Service Keyword}} | {{Primary Outcome}} | Sahil Chouksey`
- Title formula 2: `{{Service Keyword}} in India | {{Deliverable}} | Sahil Chouksey`
- Meta formula: `Production {{service type}} for {{ICP}}. I build {{key deliverables}} with {{stack}} and focus on {{metric outcome}}. {{CTA phrase}}.`

Examples:
- `RAG Developer India | Reliable Retrieval Systems | Sahil Chouksey`
- `LangGraph Developer India | Agentic Workflow Delivery | Sahil Chouksey`

## B) Hiring intent formulas

- Title formula 1: `Hire AI Engineer India | Freelance AI Delivery | Sahil Chouksey`
- Title formula 2: `AI Engineer in India for Startups | Build Faster | Sahil Chouksey`
- Meta formula: `Hire a freelance AI engineer in India for {{solution set}}. Transparent scope, weekly updates, and production-focused delivery. {{Primary CTA}}.`

## C) Proof intent formulas

- Title formula 1: `{{Project Name}} Case Study | {{Primary Metric Result}} | Sahil Chouksey`
- Title formula 2: `AI Engineer Portfolio India | {{Project/Domain Proof}} | Sahil Chouksey`
- Meta formula: `Case study: {{problem}} -> {{result}} using {{stack}}. Includes architecture decisions, constraints, and measurable outcomes.`

## D) Local intent formulas

- Title formula 1: `AI Engineer in {{City}} | {{Service Focus}} | Sahil Chouksey`
- Title formula 2: `AI Engineer in {{State}} | RAG and Agentic AI | Sahil Chouksey`
- Meta formula: `AI engineer in {{city/state}} helping {{local ICP}} build {{solutions}}. {{proof snippet}}. {{local engagement CTA}}.`

## Field constraints

- Title length target: 50-65 characters.
- Meta description target: 135-160 characters.
- Front-load the primary query term in title and H1.
- One primary keyword per URL; use semantic variants in body copy.

---

## 5) Cannibalization Controls (Mandatory Operating Rules)

## URL-intent ownership map

- `/hire-ai-engineer-india` owns: `hire ai engineer india`, `freelance ai engineer india`.
- `/ai-engineer-india` owns: `ai engineer in india`, broader personal service positioning.
- `/services/rag-development` owns: `rag developer india`, RAG service variants.
- `/services/langgraph-agentic-ai` owns: `langgraph developer india`, agentic workflow service variants.
- `/services/healthcare-ai` owns: `healthcare ai developer india`.
- `/ai-engineer-jabalpur` owns: city-local variants.
- `/ai-engineer-madhya-pradesh` owns: state-local variants.
- `/projects/*` owns proof and case-study query family.

## Content overlap thresholds

- Do not create both location and hire pages for the same geo-intent unless intent is materially different and copy overlap is below 60%.
- Keep minimum unique copy across sibling geo pages at 40%+.
- If two pages converge on the same keyword set for 6-8 weeks, consolidate and 301 the weaker page.

## Metadata de-duplication rules

- No duplicate title prefixes across pages in the same class.
- Every page must have a unique H1, title, and meta anchored to its owned keyword.
- Case-study pages must not reuse service-page title patterns.

## Internal linking controls

- Informational and proof pages link upward to exactly one owning money page for that keyword class.
- Use consistent preferred anchor for the owning page (for example, `rag developer india` -> `/services/rag-development`).
- Avoid cross-linking two competing money pages with the same exact anchor text.

## Indexation and canonical controls

- One canonical URL per intent-location combination.
- Draft new pages as `noindex` until they pass uniqueness, proof, and internal-link checks.
- Include only canonical, index-ready pages in sitemap.

---

## 6) Featured Snippet and PAA Playbook

Use structured answer blocks to increase extraction odds.

- Service intent: add concise definition and process lists (what it is, when to use, expected timeline).
- Hiring intent: add "how to hire" checklists and comparison tables (freelancer vs agency vs in-house).
- Proof intent: add outcome summary blocks with `Problem -> Approach -> Result` format.
- Local intent: add "service availability" and "typical engagement" Q/A blocks with localized phrasing.

Formatting rules:
- Place direct answer paragraphs (40-60 words) under question-style H2/H3 headings.
- Use ordered lists for process/steps and short tables for comparisons.
- Keep FAQ answers substantive (2-4 sentences minimum) and aligned with visible page content.

---

## 7) CTR Optimization Tests by Intent Class

Run one test at a time per class, 21-28 days per variant.

- Service intent: test `Outcome-led` vs `Deliverable-led` title patterns.
- Hiring intent: test `Hire` keyword first vs `AI Engineer in India` keyword first.
- Proof intent: test `Metric-first` vs `Case study` title framing.
- Local intent: test `City, State` in title vs city-only for CTR and rank movement.

Primary KPI set:
- Impressions, CTR, and average position by query class.
- Assisted conversions from class landing pages.
- Cannibalization signal: multiple URLs switching rank for one target query.

---

## 8) Execution Sequence (90 Days)

1. Publish/upgrade class owners first: hire page, 3 service pages, 2 local pages, 2 proof pages.
2. Add intent-matched FAQ blocks and schema to each owner page.
3. Publish supporting informational content that funnels into owners.
4. Review Search Console every 2 weeks for intent drift and cannibalization.
5. Consolidate underperforming overlaps before expanding page count.

---

## 9) Governance Checklist (Before Any New SEO Page Goes Live)

- Query class assigned (service, hiring, proof, local).
- Single owner URL identified for primary keyword.
- Title/meta follow class formula and are unique.
- Snippet copy includes one trust/proof signal.
- Internal links point to owner URL using non-conflicting anchors.
- Canonical, indexation status, and sitemap inclusion validated.

This checklist is required to prevent drift into thin content and query cannibalization.
