import HL from '../kernel.js';
/**
 * sunmoon: the theme toggle. A sun with slow precessing rays; hovering
 * previews the other side — on light the bite folds it into a crescent with
 * stars waking, on dark it opens back into a full sun. The spring is the
 * bite, in factors: idle it rests (zero redraw), the theme flip wakes it.
 */
const { mk, pointer, register, disposer, spring, stepS } = HL;
const r2 = (v) => Math.round(v * 100) / 100;
function mount({ stage, svg, read }, value) {
  const bag = disposer(), g = mk("g", {}, svg);
  const CX = 200, CY = 158;
  /* the bite is a mask hole - it truly erases the sun and lets the
     shimmering marks of the plate show through instead of covering them */
  const ids = "sunmoon-bite-" + Math.floor(Math.random() * 1e6);
  const defs = mk("defs", {}, svg);
  const mask = mk("mask", { id: ids }, defs);
  mk("rect", { x: "0", y: "0", width: "400", height: "320", fill: "#ffffff" }, mask);
  const bite = mk("circle", { fill: "#000000" }, mask);
  const sun = mk("circle", { cx: CX, cy: CY, r: 63, class: "sil", mask: "url(#" + ids + ")", style: "fill: var(--hl-hi); stroke-width: 2.4" }, g);
  const rays = Array.from({ length: 8 }, () => mk("path", { class: "nf mid" }, g));
  const star = (sx, sy, at, s) => {
    const el = mk("path", { class: "dot", display: "none" }, g);
    return { el, sx, sy, at, s, f: 1 };
  };
  const stars = [star(146, 92, 0.42, 1.35), star(256, 80, 0.62, 1.05), star(224, 48, 0.8, 0.85)];
  const biteS = spring(0, { k: 60, c: 12 });
  let over = false, live = true, sw = Math.PI / 8;
  const target = () => (over ? 1 - value : value); /* hover previews the other side */
  const say = (p) => read.textContent = p ? "flip to the other side — system respects you" : "theme toggle — sun by day, moon by night";
  bag.add(pointer(stage, {
    move: () => { if (!over) { over = true; biteS.t = target(); live = true; } say(1); },
    leave: () => { over = false; biteS.t = target(); live = true; say(0); },
  }));
  bag.add(register(stage, (dt, now) => {
    stepS(biteS, dt);
    const e = Math.max(0, Math.min(1, biteS.x));
    const moving = Math.abs(biteS.v) > 0.0015 || Math.abs(biteS.x - biteS.t) > 0.0015;
    if (!over && !moving) {
      if (!live) return true; /* resting: nothing moves, nothing redraws */
      live = false;           /* one exact final write, then rest */
    } else live = true;
    if (over || moving) sw += dt * 0.32;
    rays.forEach((el, i) => {
      const a = sw + (i * Math.PI) / 4;
      const r1 = 76 + e * 26, len = 36 * (1 - e);
      if (len < 1) { el.setAttribute("display", "none"); return; }
      el.setAttribute("display", "inline");
      el.setAttribute("d", "M" + r2(CX + Math.cos(a) * r1) + " " + r2(CY + Math.sin(a) * r1) + "L" + r2(CX + Math.cos(a) * (r1 + len)) + " " + r2(CY + Math.sin(a) * (r1 + len)));
    });
    stars.forEach((st, i) => {
      const on = e * 1.15 > st.at + i * 0.09;
      st.el.setAttribute("display", on ? "inline" : "none");
      if (!on) return;
      st.f = 0.9 + 0.18 * Math.abs(Math.sin(now * 0.004 + i * 2.2));
      const w = 4 * st.s * st.f, h = 3.3 * st.s * st.f;
      st.el.setAttribute("d", "M" + st.sx + " " + r2(st.sy - h) + "L" + r2(st.sx + w) + " " + st.sy + "L" + st.sx + " " + r2(st.sy + h) + "L" + r2(st.sx - w) + " " + st.sy + "Z");
    });
    bite.setAttribute("cx", r2(CX + 40 + (1 - e) * 9));
    bite.setAttribute("cy", r2(CY - 29 - (1 - e) * 7));
    bite.setAttribute("r", r2(e * 68));
    sun.setAttribute("class", e > 0.85 ? "sil hi" : "sil");
    return true;
  }));
  read.textContent = "theme toggle — sun by day, moon by night";
  return { set: (v) => { value = v; biteS.t = target(); live = true; }, destroy: bag.dispose };
}
export default ({
  name: "sunmoon",
  means: "The theme toggle: a sun with precessing rays that folds to a crescent or opens to a sun as you hover — the preview of the other theme, a click commits.",
  rules: [1, 3, 4, 7, 10],
  range: [0.2, 0.6, 1],
  tour: [[200, 158], [236, 132], [200, 158], null],
  mount,
});
