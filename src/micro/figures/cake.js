import HL from '../kernel.js';
/**
 * cake: the birthday candle you can play with. Click the age to blow it out —
 * smoke curls up and dies — click again to relight. The flame is pinned at
 * the wick and loose only at the tip, breathing on one slow sine; its body
 * follows whichever side of the age your pointer is on. Springs gate all.
 */
const { mk, pointer, register, disposer, spring, stepS, rings, poly, open, reducedMotion } = HL;
const r2 = (v) => Math.round(v * 100) / 100;
const DIG = {
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
};
function mount({ stage, svg, read }) {
  const bag = disposer(), g = mk("g", {}, svg);
  const CX = 200, CY = 258, YB = CY - 216; /* the wick top, where the flame is pinned */
  /* the plate: two tiers, deckled crumbs, a ground line */
  const t1 = rings(CX - 160, CY - 58, CX + 160, CY + 56, 16, 0)[0].map((q) => [q.u, q.v]);
  const t2 = rings(CX - 108, CY - 128, CX + 108, CY - 56, 13, 0)[0].map((q) => [q.u, q.v]);
  mk("path", { class: "dot off tier-b" }, g).setAttribute("d", poly(t1));
  mk("path", { class: "nf tier-b" }, g).setAttribute("d", poly(t1));
  mk("path", { class: "tier-t" }, g).setAttribute("d", poly(t2));
  let crum = ""; for (let i = 0; i < 11; i++) { const x = CX - 105 + i * 21, y = CY + 34 - (i % 2) * 5; crum += "M" + r2(x) + " " + r2(y) + "h3v3h-3z"; }
  mk("path", { class: "dot m crumbs" }, g).setAttribute("d", crum);
  mk("path", { class: "nf lo" }, g).setAttribute("d", open([[CX - 182, CY + 80], [CX + 182, CY + 80]]));
  /* the age in candles: a dot-matrix 23 on the cake's face */
  let d23 = ""; let dx = CX - 27, dy = CY - 4;
  for (const ch of "23") {
    const m = DIG[ch];
    for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (m[r][c] === "1") d23 += "M" + r2(dx + c * 4.4) + " " + r2(dy + r * 4.4) + "h3v3h-3z";
    dx += 34;
  }
  mk("path", { class: "dot m digits" }, g).setAttribute("d", d23);
  /* the candle and its wick */
  mk("path", { class: "nf candle" }, g).setAttribute("d", open([[CX - 8, CY - 128], [CX - 8, CY - 214], [CX + 8, CY - 214], [CX + 8, CY - 128], [CX - 8, CY - 128]]));
  /* the burn: three alpha teardrops — ember coat, amber body, white-hot
     core — inside ONE feTurbulence-displaced group, a soft halo bleeding
     into the plate and a thin blue sliver at the wick; the ramp lives in
     the gradients, the shimmer in the one filter */
  const defs = mk("defs", {}, svg);
  const ramp = (id, stops) => {
    const gr = mk("radialGradient", { id, cx: "50%", cy: "70%", r: "75%" }, defs);
    for (const [o, c, op] of stops) {
      const attrs = { offset: o, "stop-color": c };
      if (op != null) attrs["stop-opacity"] = op;
      mk("stop", attrs, gr);
    }
  };
  ramp("cakeFlameOuter", [[0, "#F79A2E"], [0.45, "#F4631E", 0.9], [1, "#F4631E", 0]]);
  ramp("cakeFlameMid", [[0, "#FFE9A8"], [0.35, "#FFD977"], [0.75, "#FF9A2E", 0.85], [1, "#FF9A2E", 0]]);
  ramp("cakeFlameCore", [[0, "#FFFDF0"], [0.5, "#FFFDF0"], [0.8, "#FDF4CC", 0.9], [1, "#FDF4CC", 0]]);
  const wickBlue = mk("radialGradient", { id: "cakeWickBlue", cx: "50%", cy: "50%", r: "50%" }, defs);
  [["0", "#6E6EA6", null], ["0.55", "#4A4C76", 0.95], ["1", "#4A4C76", 0]].forEach(
    ([o, c, op]) => {
      const attrs = { offset: o, "stop-color": c };
      if (op != null) attrs["stop-opacity"] = op;
      mk("stop", attrs, wickBlue);
    },
  );
  const haloGrad = mk("radialGradient", { id: "cakeHalo", cx: "50%", cy: "50%", r: "50%" }, defs);
  [["0", "#FFA03C", 0.32], ["0.55", "#FF8A2A", 0.12], ["1", "#FF8A2A", 0]].forEach(
    ([o, c, op]) => mk("stop", { offset: o, "stop-color": c, "stop-opacity": op }, haloGrad),
  );
  const turbFilter = mk("filter", { id: "cakeFlameTurb", x: "-25%", y: "-25%", width: "150%", height: "150%", "color-interpolation-filters": "sRGB" }, defs);
  const turb = mk("feTurbulence", { id: "cakeTurb", type: "fractalNoise", baseFrequency: "0.068 0.030", numOctaves: 2, seed: 7, result: "n" }, turbFilter);
  const dispMap = mk("feDisplacementMap", { id: "cakeDisp", in: "SourceGraphic", in2: "n", scale: 6.5, xChannelSelector: "R", yChannelSelector: "G" }, turbFilter);
  const blurOuter = mk("filter", { id: "cakeBlurOuter", x: "-40%", y: "-40%", width: "180%", height: "180%" }, defs);
  mk("feGaussianBlur", { stdDeviation: 5 }, blurOuter);
  const blurCore = mk("filter", { id: "cakeBlurCore", x: "-40%", y: "-40%", width: "180%", height: "180%" }, defs);
  mk("feGaussianBlur", { stdDeviation: 1.1 }, blurCore);
  /* halo sits outside the displaced group — a plain gradient, no filter */
  const halo = mk("ellipse", { class: "cake-halo", cx: CX, cy: YB - 40, rx: 30, ry: 56, display: "none" }, g);
  /* ONE group gets the displacement; the paths inside stay crisp-composited */
  const flameG = mk("g", { class: "cake-flame", display: "none", filter: "url(#cakeFlameTurb)" }, g);
  const flameOuter = mk("path", { class: "cake-flame-outer", filter: "url(#cakeBlurOuter)" }, flameG);
  const flameMid = mk("path", { class: "cake-flame-mid" }, flameG);
  const flameCore = mk("path", { class: "cake-flame-core", filter: "url(#cakeBlurCore)" }, flameG);
  const wick = mk("ellipse", { class: "cake-wick-blue", cx: CX, cy: YB - 2, rx: 6.5, ry: 3.2 }, flameG);
  const smoke = Array.from({ length: 3 }, () => mk("path", { class: "nf lo dash", display: "none" }, g));
  /* the classic candle tongue: two cubics, round belly, one tapered tip that
     sways — nothing can kink between the anchors */
  const teardrop = (sway, h, w) => {
    const tipX = CX + sway;
    return "M" + CX + " " + YB +
      "C" + r2(CX + w) + " " + YB + " " + r2(CX + w * 0.78) + " " + r2(YB - h * 0.58) + " " + r2(tipX) + " " + r2(YB - h) +
      "C" + r2(CX - w * 0.78) + " " + r2(YB - h * 0.58) + " " + r2(CX - w) + " " + YB + " " + CX + " " + YB + "Z";
  };
  const curls = (cx, cy, amp, now) => {
    let d = "";
    for (let k = 0; k < 3; k++) {
      const pts = [];
      for (let s = 0; s <= 8; s++) {
        const y = cy - s * 10 - k * 4;
        const x = cx + Math.sin(now * 0.0018 + s * 0.55 + k * 2.1) * amp * (0.4 + s * 0.1);
        pts.push([x + (k - 1) * 7, y]);
      }
      d += open(pts);
    }
    return d;
  };
  /* springs: the flame, its lean, the smoke's twist */
  const lit = spring(0, { k: 52, c: 9 }), leanS = spring(0, { k: 46, c: 10 });
  const smk = spring(0, { k: 20, c: 5.5 });
  let over = false, leanT = 0;
  const say = (t) => { read.textContent = t == null ? "" : t; };
  bag.add(pointer(stage, {
    move: (p) => { over = true; leanT = Math.max(-1, Math.min(1, (p[0] - CX) / 150)); say("may 18, 2003 — the flame follows your side"); },
    leave: () => { over = false; leanT = 0; say(null); },
  }));
  bag.add(register(stage, (dt, now) => {
    stepS(lit, dt); stepS(leanS, dt); stepS(smk, dt);
    leanS.t = leanT;
    const e = lit.x, m = smk.x, ln = leanS.x;
    if (!over && e < 0.004 && m < 0.03 && Math.abs(ln) < 0.004) return true; /* resting */
    const t = now * 0.001;
    /* one slow breath: a quiet sway and a quiet stretch, nothing more */
    const sway = (Math.sin(t * 1.6) * 3 + ln * 34) * e;
    const h = (80 + Math.sin(t * 2.2 + 3) * 4.5) * e;
    const w = 20 * e;
    const lit1 = e > 0.05;
    const vis = lit1 ? "inline" : "none";
    flameG.setAttribute("display", vis);
    halo.setAttribute("display", vis);
    if (lit1) {
      flameOuter.setAttribute("d", teardrop(sway, h, w * 1.15));
      flameMid.setAttribute("d", teardrop(sway, h * 0.8, w));
      flameCore.setAttribute("d", teardrop(sway * 0.8, h * 0.55, w * 0.55));
      flameG.setAttribute("opacity", r2(Math.min(1, 0.15 + 0.85 * e)));
      halo.setAttribute("cx", r2(CX + sway * 0.55));
      halo.setAttribute("cy", r2(YB - h * 0.52));
      halo.setAttribute("rx", r2(30 + 6 * e));
      halo.setAttribute("ry", r2(Math.max(20, h * 0.62 + 6)));
      const we = Math.min(1, e * 1.15);
      wick.setAttribute("rx", r2(6.5 * we));
      wick.setAttribute("ry", r2(3.2 * we));
      const reduced = reducedMotion();
      if (reduced) {
        dispMap.setAttribute("scale", "0"); /* honour prefers-reduced-motion: static rim */
      } else {
        /* breathing anisotropic noise + an ~8 Hz re-seed: the rim shears, the interior holds */
        const fY = 0.030 + Math.sin(t * 3.1) * 0.007;
        const fX = 0.068 + Math.sin(t * 2.3 + 1.7) * 0.011;
        turb.setAttribute("baseFrequency", fX.toFixed(4) + " " + fY.toFixed(4));
        turb.setAttribute("seed", String(Math.floor(t * 8) % 251)); /* prime, to avoid lock */
        dispMap.setAttribute("scale", r2(6.5 + Math.sin(t * 9.7) * 2.0 + Math.abs(ln) * 4));
      }
    }
    const tipX = CX + sway, tipY = YB - h;
    smoke.forEach((sp, i) => {
      const fade = m * (1 - i * 0.22);
      sp.setAttribute("display", fade > 0.14 ? "inline" : "none");
      if (fade > 0.14) sp.setAttribute("d", curls(tipX, tipY - 8, m * 8, now));
    });
    return true;
  }));
  say(null);
  return {
    set: (v, blow = false) => {
      if (blow && v < 0.5 && lit.x > 0.6) smk.t = 0.9;   /* the blow-out moment: smoke curls and dies */
      else if (v >= 0.5) smk.t = 0;                      /* relight: no smoke over a lit flame */
      lit.t = v;
      say(v > 0.5 ? "may 18, 2003 — the candle day" : null);
    },
    lean: (x) => { leanT = Math.max(-1, Math.min(1, x)); },
    destroy: bag.dispose,
  };
}
export default ({ name: "cake", viewBox: "24 -62 352 436", mount });
