# Keyword Opportunity Model - AI Engineer Positioning (India / MP / Jabalpur)

Date: 2026-02-17  
Scope: Personal portfolio lead generation for AI engineering services

## Inputs Used
- Existing strategy docs in `/Volumes/T7/Developer/fun/portfolio/temp/research/seo-delegations` (clusters, local SEO, SERP gap, topical map, 90-day calendar).
- CTR benchmark references:
  - Backlinko study update (Apr 2025): position #1 average organic CTR ~27.6%.
  - Advanced Web Ranking CTR tool (Dec 2025): monthly CTR curves vary by SERP features and intent.
  - First Page Sage (May 2025): higher CTR curve on "clean" SERPs; useful as upside scenario.
- Conversion benchmark calibration:
  - Unbounce benchmark (2024): median LP CVR 6.6% across industries (used as upper bound; portfolio model uses conservative rates below this).

## What Is "Deeper" in This Model
- Moves from keyword list -> quantified opportunity by rank, intent, and expected portfolio conversion fit.
- Separates volume opportunity from difficulty and fit (so we prioritize realistic leads, not vanity traffic).
- Uses scenario ranges (base and upside) instead of single-point assumptions.

## Modeling Assumptions
### 1) CTR curve used for forecasting (blended base case)
This curve blends Backlinko + AWR behavior for mixed SERPs (ads, PAA, local packs, snippets):

| Rank | Expected CTR (Base) |
|---|---:|
| 1 | 28.0% |
| 2 | 16.0% |
| 3 | 10.0% |
| 4 | 7.0% |
| 5 | 5.2% |
| 6 | 4.0% |
| 7 | 3.1% |
| 8 | 2.3% |
| 9 | 1.8% |
| 10 | 1.4% |

Notes:
- On local-pack-heavy SERPs, effective CTR to organic listings can be 15-35% lower.
- On clean long-tail SERPs, rank-1 CTR can exceed this base curve.

### 2) Conversion rates by intent (portfolio-specific)
Inquiry conversion rate (organic session -> contact action) used in model:

| Intent Type | Modeled CVR | Why |
|---|---:|---|
| Transactional (hire/freelance now) | 4.2%-5.0% | Strong intent + direct service-page fit |
| Commercial investigation | 2.6%-3.4% | Evaluating options before outreach |
| Proof/portfolio intent | 2.0%-2.8% | Mid-late funnel; trust validation behavior |
| Informational | 0.9%-1.8% | Top-funnel, lower immediate lead probability |

### 3) Core formulas
- Monthly Clicks at rank r = `MSV x CTR(r)`
- Monthly Leads at rank r = `Monthly Clicks x Intent CVR`
- Lead Efficiency Index = `Monthly Leads@Rank3 / Difficulty`

Difficulty scale: 1 (easy) to 5 (hard).

## High-ROI Keyword Opportunity Table (Base Scenario)

| Keyword | Geo | Intent | Modeled MSV | Difficulty | Best Page Type | Conversion Fit (1-5) | Leads/mo @ Rank 3 | Leads/mo @ Rank 1 | Lead Efficiency Index |
|---|---|---|---:|---:|---|---:|---:|---:|---:|
| ai engineer in india | India | Commercial investigation | 700 | 5.0 | Core geo landing page | 4.0 | 1.96 | 5.49 | 0.39 |
| hire ai engineer india | India | Transactional | 300 | 4.0 | Hire/service page | 5.0 | 1.26 | 3.53 | 0.32 |
| freelance ai engineer india | India | Transactional | 250 | 4.0 | Hire/service page | 5.0 | 1.05 | 2.94 | 0.26 |
| rag developer india | India | Transactional niche | 200 | 3.0 | Service page (RAG) | 5.0 | 0.80 | 2.24 | 0.27 |
| langgraph developer india | India | Transactional niche | 90 | 2.0 | Service page (agentic AI) | 5.0 | 0.41 | 1.13 | 0.21 |
| healthcare ai developer india | India | Commercial + proof | 120 | 3.0 | Service + case-study cluster | 4.5 | 0.41 | 1.14 | 0.14 |
| ai engineer portfolio india | India | Proof intent | 110 | 2.0 | Portfolio proof hub | 4.0 | 0.26 | 0.73 | 0.13 |
| cost to hire ai engineer in india | India | Informational -> commercial | 150 | 3.0 | Guide article + CTA | 3.0 | 0.27 | 0.76 | 0.09 |
| ai engineer in madhya pradesh | MP | Local transactional | 70 | 2.0 | Geo landing page | 5.0 | 0.28 | 0.78 | 0.14 |
| hire ai engineer in madhya pradesh | MP | Local transactional | 40 | 2.0 | Geo hire page/section | 5.0 | 0.18 | 0.50 | 0.09 |
| freelance ai engineer in madhya pradesh | MP | Local transactional | 35 | 1.8 | Geo landing page | 5.0 | 0.16 | 0.44 | 0.09 |
| ai engineer in jabalpur | Jabalpur | Hyperlocal transactional | 45 | 1.5 | Geo landing page | 5.0 | 0.19 | 0.53 | 0.13 |
| hire ai engineer in jabalpur | Jabalpur | Hyperlocal transactional | 25 | 1.5 | Geo hire section + CTA | 5.0 | 0.12 | 0.34 | 0.08 |
| freelance ai engineer in jabalpur | Jabalpur | Hyperlocal transactional | 20 | 1.2 | Geo landing page | 5.0 | 0.10 | 0.27 | 0.08 |
| rag chatbot developer jabalpur | Jabalpur | Hyperlocal niche transactional | 10 | 1.0 | Geo + RAG service bridge | 5.0 | 0.05 | 0.13 | 0.05 |

## Priority Tiers (ROI + Attainability)
### Tier 1 (highest immediate ROI)
1. `hire ai engineer india`
2. `rag developer india`
3. `ai engineer in jabalpur`
4. `ai engineer in madhya pradesh`
5. `langgraph developer india`

Why these first:
- Strong conversion fit to a personal portfolio offer.
- Better effort-adjusted lead yield vs broad head terms.
- Existing project proof (RAG/agentic/healthcare) supports trust and ranking intent.

### Tier 2 (mid-term compounding)
1. `freelance ai engineer india`
2. `healthcare ai developer india`
3. `ai engineer portfolio india`
4. `hire ai engineer in madhya pradesh`
5. `hire ai engineer in jabalpur`

### Tier 3 (authority assist; indirect ROI)
1. `cost to hire ai engineer in india`
2. Hyperlocal long-tail variants with very low volume but high relevance.

## Intent -> Page -> Conversion Fit Model

| Intent | Recommended Page Pattern | Primary CTA | Conversion Fit | Notes |
|---|---|---|---|---|
| Transactional (hire/freelance) | Dedicated location/service pages (`/ai-engineer-*`, `/services/*`) | "Discuss your AI project" + email + SLA | Very high | Put proof and engagement model above fold |
| Commercial investigation | Comparison/guides + service links | Short qualification form or email CTA | High | Add pricing ranges and timeline clarity |
| Proof intent | Case studies/project breakdowns | "See similar build plan" CTA | High | Show architecture + metrics + role ownership |
| Informational | How-to and cost guides | Soft CTA to service page | Medium-low | Use internal linking to transactional pages |

## 90-Day Traffic and Lead Potential (Base Case)
Assuming Tier 1 + Tier 2 pages reach average rank ~3-5 in 90 days for long-tail/local terms:

- Forecasted incremental organic clicks/month: ~140-260
- Forecasted qualified inquiries/month: ~4.0-8.5
- Most likely lead sources in first 90 days:
  - `hire ai engineer india`
  - `rag developer india`
  - `ai engineer in jabalpur`
  - `ai engineer in madhya pradesh`

Upside case (if 2-3 target terms reach ranks 1-2):
- Incremental inquiries/month can move to ~9-14 without expanding page count.

## Execution Guidance from the Model
1. Build and interlink only 3 geo pages first: India, MP, Jabalpur.
2. Add 2 high-intent service pages first: RAG and LangGraph/agentic AI.
3. Add proof-led case study expansion for healthcare AI to improve CVR on all commercial pages.
4. Publish one cost/comparison guide to capture informational demand and route to hire pages.
5. Measure every 14 days in GSC: impressions, CTR by query class, and inquiry conversion by landing page.

## Risk and Validation Notes
- MSV values above are modeled planning ranges for prioritization, not tool-export absolutes.
- Validate and recalibrate monthly using Search Console (query impressions + actual page CTR + actual CVR).
- If transactional pages underperform CVR (<2%), optimize offer clarity, social proof density, and CTA placement before adding new keywords.

## Final Recommendation
For this portfolio, the highest ROI path is not broad "AI engineer India" domination first; it is **transactional niche + local intent ownership** with proof-heavy pages. Use head terms for authority, but optimize roadmap around keywords that produce inquiries at rank 3-5 within 90 days.