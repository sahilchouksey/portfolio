# Theme Migration Plan (Synced)

Date: 2026-02-16

## Phase 1
1. ✅ Research current color usage + external palette references
2. ⏳ Define exact dark -> light replacement map (next)
3. ⏳ Create shared token strategy + prefers-color-scheme behavior

## Phase 2 (10 delegated component passes)
4. Navigation
5. HeroCard
6. ContactCard
7. TimezoneCard
8. DescriptionCard
9. TechStack/Experience (Timeline)
10. ProjectSection
11. BlogSection
12. FooterSection
13. Shared/global styles (`animations.css` + base utilities)

## Phase 3
14. Integration QA (contrast, responsive, regressions)
15. Final polish (remove hardcoded literals, normalize token usage)

## Rule
- All future research outputs must be synced to `temp/research/`.
