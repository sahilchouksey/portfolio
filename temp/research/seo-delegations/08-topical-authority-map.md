# Topical Authority Map - Portfolio Blog

Date: 2026-02-16  
Repository: `/Volumes/T7/Developer/fun/portfolio`

## Goal
Build topical authority that compounds rankings and leads for these demand themes:
- AI engineering
- Agentic systems
- RAG
- Healthcare AI
- Backend performance

This map is designed for the current portfolio reality (strong project proof, limited crawlable blog footprint) and prioritizes fastest organic ROI first.

---

## 1) Pillar-Cluster Map

### Pillar A: AI Engineering for Production
**Primary search intent:** commercial + evaluative (hire/implementation)

| Cluster | Target search intent | Suggested URL slug | Primary CTA target |
|---|---|---|---|
| AI engineer playbooks | how to ship AI features in production | `/blog/ai-engineering-playbook-production` | `/hire-ai-engineer-india` |
| Build vs buy for AI teams | startup decision framework | `/blog/build-vs-buy-ai-engineering` | `/ai-engineer-india` |
| AI architecture patterns | reference architectures | `/blog/ai-system-architecture-patterns` | `/services/langgraph-agentic-ai` |
| AI reliability engineering | evaluation/monitoring/guardrails | `/blog/llm-reliability-checklist` | `/services/rag-development` |
| Cost/perf optimization | token, latency, infra tradeoffs | `/blog/llm-cost-performance-optimization` | `/contact` |

**Pillar page:** `/blog/ai-engineering-guide`  
**Supporting proof pages:** BRIO + Doct project pages/case studies

---

### Pillar B: Agentic Systems (LangGraph + Multi-Agent)
**Primary search intent:** technical deep-dive + solution selection

| Cluster | Target search intent | Suggested URL slug | Primary CTA target |
|---|---|---|---|
| Agentic architecture | single-agent vs multi-agent | `/blog/single-vs-multi-agent-systems` | `/services/langgraph-agentic-ai` |
| LangGraph implementation | orchestration best practices | `/blog/langgraph-production-patterns` | `/services/langgraph-agentic-ai` |
| Agent memory/planning | long-horizon workflows | `/blog/agent-memory-planning-strategies` | `/services/rag-development` |
| Tool use and safety | tool-calling, policy boundaries | `/blog/agent-tooling-guardrails` | `/services/healthcare-ai` |
| Agent evaluation | quality and failure analysis | `/blog/evaluating-agentic-systems` | `/projects/brio-health-ai` |

**Pillar page:** `/blog/agentic-systems-guide`

---

### Pillar C: RAG Engineering
**Primary search intent:** implementation + debugging

| Cluster | Target search intent | Suggested URL slug | Primary CTA target |
|---|---|---|---|
| RAG architecture | baseline to production RAG | `/blog/rag-architecture-guide` | `/services/rag-development` |
| Chunking/retrieval strategy | retrieval quality optimization | `/blog/rag-chunking-retrieval-strategies` | `/services/rag-development` |
| Embedding/vector DB tradeoffs | platform selection | `/blog/vector-db-selection-for-rag` | `/ai-engineer-india` |
| RAG eval framework | hallucination + grounding metrics | `/blog/rag-evaluation-framework` | `/projects/brio-health-ai` |
| RAG ops at scale | latency/cost/relevance balancing | `/blog/scaling-rag-systems` | `/contact` |

**Pillar page:** `/blog/rag-engineering-guide`

---

### Pillar D: Healthcare AI Engineering
**Primary search intent:** domain trust + compliance-aware implementation

| Cluster | Target search intent | Suggested URL slug | Primary CTA target |
|---|---|---|---|
| Healthcare AI use cases | practical implementation paths | `/blog/healthcare-ai-use-cases-that-ship` | `/services/healthcare-ai` |
| HIPAA/GDPR architecture | compliant system design | `/blog/hipaa-architecture-for-ai-apps` | `/services/healthcare-ai` |
| Clinical search + summarization | medical retrieval systems | `/blog/medical-rag-system-design` | `/projects/brio-health-ai` |
| Human-in-the-loop safety | review workflows for clinicians | `/blog/hitl-patterns-healthcare-ai` | `/services/healthcare-ai` |
| Auditability/governance | traceability and model decisions | `/blog/healthcare-ai-audit-logging` | `/contact` |

**Pillar page:** `/blog/healthcare-ai-engineering-guide`

---

### Pillar E: Backend Performance for AI Products
**Primary search intent:** performance engineering + infra decisions

| Cluster | Target search intent | Suggested URL slug | Primary CTA target |
|---|---|---|---|
| API latency engineering | sub-100ms backend patterns | `/blog/api-latency-optimization-playbook` | `/projects/doct-app` |
| Caching for AI workloads | Redis/multi-layer cache strategy | `/blog/caching-patterns-for-ai-backends` | `/services/rag-development` |
| Queue/async architecture | throughput and reliability | `/blog/async-architecture-for-ai-pipelines` | `/ai-engineer-india` |
| DB performance tuning | Postgres/Mongo production tuning | `/blog/database-optimization-ai-products` | `/contact` |
| Observability/SLOs | performance monitoring strategy | `/blog/slo-observability-ai-backends` | `/services/langgraph-agentic-ai` |

**Pillar page:** `/blog/backend-performance-for-ai-guide`

---

## 2) Internal-Link Architecture

## Core model
Use a **hub-and-spoke + bridge** structure:
- Each pillar page links to all its cluster posts.
- Each cluster post links back to its pillar (first half of article).
- Cross-link related clusters across adjacent pillars (Agentic <-> RAG, Healthcare AI <-> RAG, Backend perf <-> AI engineering).
- Every post links to:
  - 1 relevant service/commercial page
  - 1 proof page (project/case study)
  - 1 conversion endpoint (`/contact` or hire page)

## Link depth targets
- Homepage -> pillar pages: 1 click
- Pillar -> cluster posts: 1 click
- Cluster -> service page: <= 2 clicks from homepage

## Suggested architecture graph
- `/` -> `/blog` -> all 5 pillar pages
- Each pillar page -> 5 cluster posts (minimum)
- Each cluster post ->
  - same pillar page
  - 2 sibling posts in same pillar
  - 1 cross-pillar post
  - 1 service page
  - 1 project proof page
  - 1 CTA page

## Anchor text rules
- 70% descriptive partial-match anchors (natural language)
- 20% exact topical anchors (for priority terms)
- 10% branded/generic anchors
- Avoid repeating the same exact anchor to the same destination in every post.

## Recommended bridge links (high-value)
- `agent evaluation` posts -> `rag evaluation framework`
- `medical rag` posts -> `hipaa architecture` posts
- `api latency` posts -> `scaling rag systems`
- `llm cost optimization` posts -> `backend performance` pillar

---

## 3) Publishing Order for Fastest ROI

Order is based on: (a) commercial intent, (b) ranking feasibility, (c) ability to reuse existing project proof quickly.

## Phase 1 (Weeks 1-2): fastest wins
1. `/blog/rag-engineering-guide` (pillar)
2. `/blog/rag-architecture-guide`
3. `/blog/rag-evaluation-framework`
4. `/blog/medical-rag-system-design`
5. `/blog/langgraph-production-patterns`

**Why first:** RAG + LangGraph + healthcare proof aligns with strongest existing portfolio evidence and high buyer intent.

## Phase 2 (Weeks 3-4): convert technical authority into leads
6. `/blog/agentic-systems-guide` (pillar)
7. `/blog/single-vs-multi-agent-systems`
8. `/blog/evaluating-agentic-systems`
9. `/blog/healthcare-ai-engineering-guide` (pillar)
10. `/blog/hipaa-architecture-for-ai-apps`

**Why second:** deepens authority in decision-stage topics where agencies are generic and personal proof can outperform.

## Phase 3 (Weeks 5-6): broaden surface area and capture comparative intent
11. `/blog/ai-engineering-guide` (pillar)
12. `/blog/build-vs-buy-ai-engineering`
13. `/blog/llm-reliability-checklist`
14. `/blog/backend-performance-for-ai-guide` (pillar)
15. `/blog/api-latency-optimization-playbook`

**Why third:** expands into broad engineering terms once initial authority signals are established.

## Cadence recommendation
- Publish 2 posts/week minimum.
- Start with 1 pillar + 3 supporting clusters before opening the next pillar.
- Refresh internal links weekly as new posts go live.

---

## 4) Topic Coverage Gaps

## Critical gaps (currently limiting authority growth)
1. **On-domain blog depth gap:** current blog discovery is tied to external Hashnode fetch; limited indexable first-party topic depth.
2. **No crawlable pillar pages:** key themes (agentic, RAG, healthcare AI, backend perf) are not mapped to dedicated hub URLs.
3. **Weak comparison content:** missing high-intent "X vs Y" and "build vs buy" articles.
4. **Limited evaluation content:** few posts around metrics, failure modes, and reliability (high-value for serious buyers).
5. **Insufficient backend-performance narratives for AI workloads:** latency/caching/observability expertise is present in projects but not packaged as SEO content.

## Medium-priority gaps
6. **Healthcare compliance depth:** no dedicated content ladder from HIPAA basics to architecture implementation.
7. **Case-study decomposition:** project outcomes are present, but missing standalone engineering breakdowns linked to service intent.
8. **Cross-pillar bridges:** topics are strong individually but not yet interlinked as a coherent topical graph.

## Gap-to-content mapping
- Gap: RAG quality concerns -> publish `rag-evaluation-framework`
- Gap: Agent reliability concerns -> publish `evaluating-agentic-systems`
- Gap: Healthcare trust concerns -> publish `hipaa-architecture-for-ai-apps`
- Gap: Performance proof concerns -> publish `api-latency-optimization-playbook`
- Gap: Buying decision friction -> publish `build-vs-buy-ai-engineering`

---

## Execution Notes (for this repo)
- Prioritize publishing crawlable first-party blog URLs before scaling volume.
- Connect every post to existing service/location intent pages (`/ai-engineer-india`, `/ai-engineer-madhya-pradesh`, `/ai-engineer-jabalpur`, `/services/*`).
- Use consistent schema on posts (`Article`/`BlogPosting`) and hub pages (`CollectionPage`/`ItemList`) once URLs exist.
- Ensure each new post includes at least one internal link to a project proof page and one commercial CTA destination.

## Minimal success KPIs (first 60 days)
- 20+ indexed first-party topical URLs (pillars + clusters)
- Topical impression growth in RAG/agentic/healthcare query classes
- Organic sessions landing on non-homepage content
- Assisted conversions from blog -> service/hire/contact pages
