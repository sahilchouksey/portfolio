# Portfolio - Performance Optimized

## The 14KB Rule

This portfolio follows the **14KB rule** - fitting critical content within a single TCP round trip for maximum speed.

**Current Performance:**
- Initial HTML: 9.8KB (under 14KB limit ✅)
- Load time: ~200ms (single round trip)
- 78% size reduction from original

## Why 14KB?

TCP slow start begins with ~10 packets × 1460 bytes = **14,600 bytes**. Every KB over this limit adds 200-800ms delay.

```
Round Trip 1: 14KB   (200ms)
Round Trip 2: 28KB   (400ms) +200ms delay
Round Trip 3: 56KB   (600ms) +400ms delay
```

## Optimization Strategy

**Critical CSS:** Inlined for immediate rendering  
**Non-critical CSS:** Async loaded (`style.css`)  
**JavaScript:** Async loaded with progressive enhancement (`app.js`)  
**Content:** Above-the-fold prioritized, rest loaded dynamically

## File Structure

```
index.html (9.8KB) - Critical path
├── Inlined critical CSS
├── Hero section
└── Basic structure

style.css (4.3KB) - Enhanced styles
app.js (24KB) - Interactive features
```

## Performance Results

- **Before:** 45KB → **After:** 9.8KB
- **Load time:** 1200ms → 200ms  
- **Critical path:** Single TCP round trip