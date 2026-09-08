// ASCII portrait: image → luminance grid + face mask → colored character runs. Pure functions, no DOM state.
export const RAMP = ' .:-=+*#%@';

/** Sample an image into a cols×rows grid. Returns {lum: number[][] (0..1, contrast-stretched), mask: boolean[][] (face / opaque)}. */
export function analyzeImage(img, cols = 34, maxRows = 30) {
  const rows = Math.max(8, Math.min(maxRows, Math.round(cols * img.height / img.width * 0.6)));
  const S = 4, W = cols * S, H = rows * S;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0, W, H);
  let data; try { data = ctx.getImageData(0, 0, W, H).data; } catch (e) { return null; }   // cross-origin taint
  let hasAlpha = false; for (let i = 3; i < data.length; i += 4) if (data[i] < 128) { hasAlpha = true; break; }
  const lum = [], mask = []; let mn = 1, mx = 0;
  for (let y = 0; y < rows; y++) {
    const lr = [], mr = [];
    for (let x = 0; x < cols; x++) {
      let L = 0, skin = 0, opaque = 0;
      for (let dy = 0; dy < S; dy++) for (let dx = 0; dx < S; dx++) {
        const i = ((y * S + dy) * W + (x * S + dx)) * 4, r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        L += (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; if (a >= 128) opaque++;
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b, cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;   // YCbCr skin test
        if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173 && r > g && r > b) skin++;
      }
      const n = S * S; L /= n; lr.push(L); mn = Math.min(mn, L); mx = Math.max(mx, L);
      mr.push(hasAlpha ? opaque / n > 0.5 : skin / n > 0.35);
    }
    lum.push(lr); mask.push(mr);
  }
  const smooth = hasAlpha ? mask : majority(mask);   // 3×3 majority filter removes skin speckles
  const rng = Math.max(0.05, mx - mn);
  return { lum: lum.map(r => r.map(l => (l - mn) / rng)), mask: smooth };
}

function majority(mask) {
  const rows = mask.length, cols = mask[0].length;
  return mask.map((r, y) => r.map((_, x) => {
    let k = 0, t = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = y + dy, xx = x + dx; if (yy >= 0 && yy < rows && xx >= 0 && xx < cols) { t++; if (mask[yy][xx]) k++; } }
    return k / t >= 0.5;
  }));
}

/** Convert the grid into rows of same-colored runs: [[{text, color}], ...]. `t` is a theme; opts.mode 'face'|'mono'; opts.soften 0..1 trims face highlights. */
export function asciiRows({ lum, mask }, t, { mode = 'face', soften = 0.35 } = {}) {
  return lum.map((row, y) => {
    const runs = []; let cur = null;
    row.forEach((l0, x) => {
      const isFace = mode === 'face' && mask && mask[y][x];
      const l = isFace ? Math.min(l0, 1 - soften * 0.15) : l0;
      const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(l * RAMP.length))];
      const color = mode === 'face'
        ? (isFace ? (l < 0.3 ? t.red : l < 0.6 ? t.orange : l < 0.85 ? t.yellow : t.fg) : (l < 0.55 ? t.dim : t.blue))
        : (l < 0.3 ? t.dim : l < 0.6 ? t.blue : l < 0.85 ? t.cyan : t.fg);
      if (cur && cur.color === color) cur.text += ch; else { cur = { color, text: ch }; runs.push(cur); }
    });
    return runs;
  });
}

