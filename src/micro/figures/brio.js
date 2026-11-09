import HL from '../kernel.js';
/**
 * brio: the medical cross of two capsules from the BRIO mark, and a loupe
 * that sweeps it, scanning. The pointer quickens the scan and lights the
 * lens. The slider is the scan, in hertz.
 */
const { mk, rings, poly, pointer, register, disposer } = HL;
const r2 = (v) => Math.round(v * 100) / 100;
function mount({ stage, svg, read }, value) {
  const bag = disposer(), g = mk("g", {}, svg);
  /* the mark: two capsules crossing, as in the logo */
  const hc = rings(110, 122, 290, 178, 28, 0);
  mk("path", { class: "sil" }, g).setAttribute("d", poly(hc[0].map((q) => [q.u, q.v])));
  const vc = rings(172, 60, 228, 240, 28, 0);
  mk("path", { class: "sil" }, g).setAttribute("d", poly(vc[0].map((q) => [q.u, q.v])));
  /* the lens sweeping the cross */
  const trail1 = mk("ellipse", { ry: 24, rx: 2.4, class: "nf lo dash" }, g);
  const trail2 = mk("ellipse", { ry: 24, rx: 2.4, class: "nf lo dash" }, g);
  const lens = mk("circle", { r: 24, class: "nf lo" }, g);
  let t = 0, quick = value;
  const say = (p) => read.textContent = p ? "brio health ai — 60-page pdfs in 16 seconds" : "brio — the cross scans for answers";
  bag.add(pointer(stage, {
    move: () => { quick = value * 2.4; lens.setAttribute("class", "nf hi"); say(1); },
    leave: () => { quick = value; lens.setAttribute("class", "nf lo"); say(0); },
  }));
  bag.add(register(stage, (dt) => {
    t += dt * quick;
    const x = 200 + Math.sin(t * 2 * Math.PI * 0.5) * 86;
    lens.setAttribute("cx", r2(x)); lens.setAttribute("cy", 150);
    trail1.setAttribute("cx", r2(x - 15)); trail1.setAttribute("cy", 150);
    trail2.setAttribute("cx", r2(x - 29)); trail2.setAttribute("cy", 150);
    return true;
  }));
  read.textContent = "brio — the cross scans for answers";
  return { set: (v) => { value = v; quick = v; }, destroy: bag.dispose };
}
export default ({
  name: "brio",
  means: "The BRIO mark: two capsules crossing into a medical cross while a lens sweeps it, scanning for answers.",
  rules: [1, 3, 4, 7, 10],
  range: [0.25, 0.6, 1.3],
  tour: [[200, 150], [150, 150], [260, 150], null],
  mount,
});
