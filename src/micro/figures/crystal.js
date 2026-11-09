import HL from '../kernel.js';
/**
 * crystal: the site's own mark from the contact card — a kite and two
 * flanking facets, drawn in three strokes. At rest it breathes; under the
 * pointer the kite lifts and the facets spread to catch
 * the light. The slider is the spread, in factors.
 */
const { mk, pointer, register, disposer, spring, stepS } = HL;
const r2 = (v) => Math.round(v * 100) / 100;
function mount({ stage, svg, read }, value) {
  const bag = disposer(), g = mk("g", {}, svg);
  /* the art fills the viewBox fully: x spans the box edge-to-edge,
     y spans as deep as the idle sway and hover lift allow without clipping */
  const MX = (x) => (x - 12) * (199 / 88);
  const MY = (y) => (y - 12) * (166 / 88) + 19; /* 19px headroom for lift(16)+sway(3) */
  const kite = [[56, 12], [70, 56], [56, 100], [42, 56]].map(([x, y]) => [MX(x), MY(y)]);
  const triL = [[37, 32], [12, 56], [37, 80]].map(([x, y]) => [MX(x), MY(y)]); /* inner edge pulled toward the kite */
  const triR = [[75, 32], [100, 56], [75, 80]].map(([x, y]) => [MX(x), MY(y)]); /* inner edge pulled toward the kite */
  const lift = spring(0), spread = spring(0);
  const kiteC = mk("path", { class: "sil" }, g);
  const fl = mk("path", { class: "sil" }, g), fr = mk("path", { class: "sil" }, g);
  let over = false;
  const say = (p) => read.textContent = p ? "have a project in mind? — hey@sahilchouksey.in" : "sahil chouksey. — the contact mark";
  bag.add(pointer(stage, {
    move: () => { over = true; lift.t = 16; spread.t = value; say(1); },
    leave: () => { over = false; lift.t = 0; spread.t = 0; say(0); },
  }));
  bag.add(register(stage, (dt, now) => {
    stepS(lift, dt); stepS(spread, dt);
    const bob = over ? 0 : Math.sin(now * 0.0016) * 3;
    const ly = lift.x + bob, sp = spread.x;
    const p = (pt) => r2(pt[0]) + " " + r2(pt[1] - ly);
    kiteC.setAttribute("d", "M" + p(kite[0]) + "L" + p(kite[1]) + "L" + p(kite[2]) + "L" + p(kite[3]) + "Z");
    fl.setAttribute("d", "M" + p([triL[0][0] - sp * 15, triL[0][1]]) + "L" + p([triL[1][0] - sp * 24, triL[1][1]]) + "L" + p([triL[2][0] - sp * 15, triL[2][1]]) + "Z");
    fr.setAttribute("d", "M" + p([triR[0][0] + sp * 15, triR[0][1]]) + "L" + p([triR[1][0] + sp * 24, triR[1][1]]) + "L" + p([triR[2][0] + sp * 15, triR[2][1]]) + "Z");
    return true;
  }));
  read.textContent = "sahil chouksey. — the contact mark";
  return { set: (v) => { value = v; if (over) spread.t = v; }, destroy: bag.dispose };
}
export default ({
  name: "crystal",
  viewBox: "0 0 199 192", /* art fills the box edge-to-edge */
  means: "The contact card's crystal: three facets at rest; under the pointer the kite lifts and catches the light.",
  rules: [1, 3, 4, 7, 10],
  range: [0, 0.45, 1.2],
  tour: [[200, 150], [150, 150], [250, 150], null],
  mount,
});
