# Last Todo Update - Reverted Inline SVG + White-Background Education Logos

Date: 2026-02-16

## Final approach applied (as requested)

1. Removed inline React SVG rendering for education logos.
   - Reverted `src/components/sections/EducationCard.jsx` back to plain `<img src="...">` rendering.
   - Removed `InlineSvgLogo` logic and `inlineSvg` prop usage.

2. Updated education entries to use public SVG assets directly (no inline mode).
   - `src/components/sections/TechStackSection.jsx`
   - RGPV: `/images/rgpv-logo.svg`
   - Makhanlal: `/images/makhanlal-logo.svg`

3. Set education logo area to a fixed light background and stretch logo to fill area.
   - `src/components/sections/Timeline.css`
   - `.education-logo-container { background-color: #ffffff; padding: 0; }`
   - `.education-logo { width: 100%; height: 100%; object-fit: cover; display: block; }`
   - `.education-logo-placeholder { background-color: #ffffff; }`

4. Converted Makhanlal black layers to pitch white directly inside SVG.
   - `public/images/makhanlal-logo.svg`
   - Replaced the two non-blue layers from variable/black to `#FFFFFF`
   - Verified fill counts:
     - `46 x #0093DC`
     - `2 x #FFFFFF`

## Theme/card appearance safeguard status

- Light-theme project card hover line behavior was restricted to clickable cards only.
- Dark-mode card appearance regression guard remains in place by scoping broad style overrides to light-mode media query.

## Verification checklist

- Confirm both education logos look clean on white logo panel in dark and light themes.
- Confirm no inline SVG behavior remains for education logos.
- Confirm hero/section cards preserve expected dark-mode visual appearance.
