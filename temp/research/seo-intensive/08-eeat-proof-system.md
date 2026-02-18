# E-E-A-T Proof System

## Objective
Build a repeatable, defensible E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) operating system that turns claims into verifiable proof across every high-value page type. The goal is to increase ranking trust, reduce quality-risk signals, and improve eligibility for high-intent queries in YMYL and non-YMYL contexts.

---

## 1) Trust Architecture: Core Components

### 1.1 Trust Pages (Site-Level Proof Layer)
Create dedicated pages that concentrate trust signals and link them globally (header/footer + contextual internal links).

**Required trust pages:**
1. **About + Mission + Editorial Standards**
2. **Author Directory** (all contributors, bios, credentials, roles)
3. **Methodology / Research Standards**
4. **Sources & Citations Policy**
5. **Corrections / Updates Log**
6. **Contact + Real-World Presence** (legal entity, business address where relevant)
7. **Privacy / Data Use / Affiliate Disclosure**
8. **Review Process Page** (expert review, medical/legal/financial review if applicable)

**Minimum trust-page attributes:**
- Named accountable owner (person or team)
- Last updated date + update rationale
- Verification artifacts (certifications, memberships, references)
- Outbound links to authoritative standards bodies or primary sources
- Internal links to supporting evidence pages

### 1.2 Proof Modules (Page-Level Reusable Blocks)
Proof modules are composable content blocks inserted into articles, landing pages, product pages, and guides.

**Mandatory proof modules for money pages / YMYL pages:**
- **Author Proof Block**: identity, role, direct experience summary
- **Evidence Block**: primary sources, data snapshots, method notes
- **Review Block**: reviewer name, qualifications, review timestamp
- **Freshness Block**: last audited date + trigger for next review
- **Conflict Disclosure Block**: affiliate/sponsor/conflict statement
- **Claims-to-Sources Block**: each critical claim mapped to citation

**Optional strong modules:**
- Field-test photos/videos with metadata
- Original data appendix
- Decision framework tables
- Risk and limitation section

### 1.3 Project Evidence Frameworks (Content Production SOP)
Every major content asset should have an evidence bundle that can survive external scrutiny.

**Evidence bundle template per page/project:**
1. **Claim Inventory**: all factual or performance claims listed line-by-line
2. **Evidence Matrix**: each claim tied to source type and confidence score
3. **Experience Artifacts**: first-hand usage, tests, screenshots, logs
4. **Expert Validation**: reviewer comments and sign-off state
5. **Change History**: what changed, why, and by whom
6. **Risk Notes**: uncertainty, assumptions, edge cases

### 1.4 Author Transparency Schema (Machine-Readable Trust)
Publish structured data for people, organizations, and reviewed content to reduce ambiguity and improve entity clarity.

**Implement JSON-LD entities:**
- `Person` (author/reviewer): name, role, credentials, sameAs, knowsAbout
- `Organization`: legal name, URL, logo, sameAs, contactPoint
- `Article` / `WebPage`: author, reviewedBy, datePublished, dateModified, citation
- `FAQPage` / `HowTo` where applicable (only when visible and compliant)

**Schema principle:** only mark up what users can visibly verify on-page.

---

## 2) E-E-A-T Scoring Model (Internal QA)
Use an internal scoring model before publishing.

### 2.1 Suggested weighted score (100 points)
- **Experience (25):** first-hand evidence, demos, test logs, practical insights
- **Expertise (25):** qualified authorship, technical accuracy, depth
- **Authoritativeness (20):** citations, entity recognition, references by others
- **Trustworthiness (30):** transparency, disclosures, correction policy, security/legal clarity

### 2.2 Publish gates
- **90–100:** Publish
- **80–89:** Publish with improvement ticket
- **<80:** Do not publish (requires proof gap closure)

---

## 3) Page-Type Implementation Blueprints

### 3.1 Commercial landing pages
- Add reviewer credentials + decision criteria
- Include test methodology for comparisons
- Include limitations and “not for” scenarios
- Add clear monetization disclosure

### 3.2 Informational guides
- Add source hierarchy (primary > secondary > commentary)
- Explicitly timestamp volatile claims/statistics
- Add “how we verified” section

### 3.3 Product/service pages
- Show real customer/use-case evidence (with consent)
- Add clear ownership and support accountability
- Link to SLA/policies/security trust assets

### 3.4 YMYL-sensitive pages
- Mandatory expert review and update cadence
- Legal/medical/financial scope disclaimer
- Strong correction pipeline and visible revision history

---

## 4) Author Transparency System (Human + Structured)

### 4.1 Author profile requirements
Each author profile should include:
- Real name and headshot (where culturally appropriate)
- Current role and domain focus
- Relevant credentials, certifications, or practical experience
- Portfolio of related content
- External identity references (`sameAs` links)
- Contact pathway or editorial contact method

### 4.2 Reviewer model
- Distinguish **author** vs **reviewer** roles
- Store review date, review scope, and review result
- Re-review triggers when laws/guidelines/data change

### 4.3 Transparency UI pattern
- Top-of-page: author + reviewer + last reviewed date
- Mid-page: methodology + source blocks near key claims
- Bottom-of-page: disclosures + corrections + feedback link

---

## 5) Project Evidence Framework: Operational Workflow

### 5.1 Content lifecycle with proof controls
1. **Briefing**: identify query intent and risk class (YMYL / non-YMYL)
2. **Research**: collect primary sources and first-hand evidence
3. **Drafting**: attach claims to sources in-line
4. **Expert Review**: domain reviewer validates critical sections
5. **Publication QA**: run E-E-A-T checklist + schema validation
6. **Post-publish Monitoring**: track engagement, corrections, and freshness
7. **Revalidation**: scheduled audits based on topic volatility

### 5.2 Evidence retention policy
- Store source snapshots and access date
- Keep reviewer approval logs for auditability
- Preserve previous versions for correction traceability

---

## 6) Anti-Spam Safeguards (Mandatory)

### 6.1 Content integrity controls
- Ban mass-produced templated pages without unique evidence
- Ban AI-generated claims without human verification
- Ban fabricated author identities, fake reviewers, fake credentials
- Ban citation padding (irrelevant authority links)
- Ban expired stats without updated context

### 6.2 Automation guardrails
- Require human sign-off for YMYL and transactional pages
- Detect near-duplicate pages and doorway pattern risks
- Enforce minimum unique evidence threshold per page
- Trigger manual review when claim density exceeds citation density

### 6.3 Link and mention hygiene
- No paid/affiliate links without explicit disclosure
- No manipulative outbound linking purely for perceived authority
- Monitor external references for rot and replace broken sources

### 6.4 Trust abuse detection
Set automated alerts for:
- sudden spikes in low-quality page production
- repeated author schema mismatches
- missing reviewer metadata on protected templates
- abnormal correction requests or factual complaint volume

---

## 7) Implementation Checklist

## Phase 1: Foundation (Week 1–2)
- [ ] Create/refresh trust pages (about, methodology, corrections, disclosures)
- [ ] Standardize author profile template and reviewer profile template
- [ ] Define YMYL classification logic and page risk tiers
- [ ] Establish citation policy and source quality rubric
- [ ] Build reusable proof modules in CMS/component library

## Phase 2: Structured Data + Templates (Week 2–4)
- [ ] Implement JSON-LD for `Organization`, `Person`, `Article`/`WebPage`
- [ ] Add `reviewedBy`, `dateModified`, and citation fields where visible
- [ ] Add page-level UI slots for proof modules (top/mid/bottom)
- [ ] Add validation tests for schema consistency and missing required fields

## Phase 3: Workflow + Governance (Week 3–6)
- [ ] Introduce claim inventory and evidence matrix in editorial workflow
- [ ] Add reviewer assignment and approval states in CMS
- [ ] Add correction log automation and public changelog linking
- [ ] Add freshness SLAs by topic type (e.g., 90/180/365-day)

## Phase 4: Monitoring + Enforcement (Week 5–8)
- [ ] Build E-E-A-T internal scoring dashboard
- [ ] Set anti-spam anomaly alerts and escalation playbooks
- [ ] Run monthly trust audit for top traffic and revenue pages
- [ ] Prune or consolidate pages failing quality threshold

---

## 8) Measurement Framework (Trust KPIs)

### Leading indicators
- % pages with complete proof modules
- % pages with verified author + reviewer metadata
- citation quality score (primary-source ratio)
- schema validity pass rate

### Lagging indicators
- growth in impressions/clicks for high-trust query clusters
- stability or gains after core updates
- reduced factual complaint/correction rate
- improved conversion on trust-sensitive landing pages

---

## 9) Reference Page Blueprint (Copy/Paste SOP)
Use this structure for any high-priority page:

1. Title + intent alignment
2. Author/reviewer/freshness line
3. Concise answer summary
4. Main content with claim-source linking
5. Methodology and limitations
6. Disclosure/conflict statement
7. Corrections and feedback entry point
8. Internal links to trust pages + related evidence

---

## 10) Non-Negotiables
- Do not publish unverified high-impact claims.
- Do not hide conflicts, sponsorships, or affiliate incentives.
- Do not represent AI drafting as expert-reviewed content without actual review.
- Do not use schema that is not supported by visible page content.

If this system is implemented consistently, trust signals become cumulative and defensible: each page strengthens the site’s entity reliability, while anti-spam safeguards prevent short-term tactics from eroding long-term ranking trust.
