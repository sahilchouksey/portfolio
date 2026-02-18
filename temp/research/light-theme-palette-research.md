# Light Theme Research (Synced)

Date: 2026-02-16
Project: /Volumes/T7/Developer/fun/portfolio
Scope: Light theme planning while preserving dark theme behavior.

## 1) Current Color System Inventory

### Most active files for color usage
1. `public/original-styles.css`
2. `src/components/sections/Timeline.css`
3. `src/animations.css`
4. `src/components/sections/AIWorkflowDiagram.jsx`
5. `src/App.jsx`
6. `src/components/sections/FooterSection.jsx`

### Dominant dark-theme values in use
- Core neutrals: `#131315`, `#1a1a1c`, `#222`, `#333`, `#000`
- Core text: `#fff`, `#ffffff`, `white`
- Muted ladder: `#888`, `#8a8a93`, `#999`, `#666`, `#555`, `#444`, `#aaa`, `#ddd`, `#ccc`
- Accent family: `#22d3ee`, `#06b6d4`, and multiple `rgba(34,211,238,x)` variants
- Border/overlay family:
  - `rgba(255,255,255,0.05/0.08/0.1/0.2...)`
  - `rgba(0,0,0,0.1/0.2/0.3/0.9)`

## 2) Candidate Light Palettes Researched

### Candidate A (Recommended): Radix Slate + Cyan
References:
- https://unpkg.com/@radix-ui/colors@latest/slate.css
- https://unpkg.com/@radix-ui/colors@latest/cyan.css

Why selected:
- Best visual compatibility with existing dark style
- Strong neutral ramps + practical accent behavior
- Clean dark/light parity for future tokenization

### Candidate B: Tailwind Slate + Cyan
Reference:
- https://tailwindcss.com/docs/customizing-colors

### Candidate C: Material 3 role-based light palette (teal/cyan seed)
Reference:
- https://m3.material.io/styles/color/roles

## 3) Recommended Light Tokens (Draft)

- `--bg-base: #fcfcfd`
- `--bg-subtle: #f9f9fb`
- `--surface: #f0f0f3`
- `--surface-elevated: #ffffff`
- `--text-primary: #1c2024`
- `--text-secondary: #60646c`
- `--text-muted: #8b8d98`
- `--text-inverse: #ffffff`
- `--border-subtle: #e0e1e6`
- `--border-default: #d9d9e0`
- `--border-strong: #b9bbc6`
- `--accent-primary: #00a2c7`
- `--accent-hover: #0797b9`
- `--accent-soft-bg: #def7f9`
- `--success: #12a594`
- `--warning: #f59e0b`
- `--error: #e11d48`
- `--info: #00a2c7`

## 4) Migration Risks Identified

1. Mixed CSS layers (`original-styles.css`, `animations.css`, `Timeline.css`) can conflict.
2. Inline JSX color styles bypass theme tokens.
3. Existing cyan text values may fail contrast on light backgrounds if unchanged.
4. White-alpha overlays must invert to dark-alpha overlays in light mode.
5. Some logos/cards are dark-context dependent and need per-component checks.

## 5) Decision Path

- Keep dark theme as existing default behavior for dark users.
- Add light values via token overrides under `@media (prefers-color-scheme: light)`.
- Migrate component-by-component after color replacement map is approved.
