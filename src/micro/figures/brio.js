import HL from '../kernel.js';
/**
 * brio: the medical cross of two capsules from the BRIO mark.
 */
const { mk, rings, poly, disposer } = HL;
function mount({ svg, read }) {
  const bag = disposer(), g = mk("g", {}, svg);
  /* the mark: two capsules crossing, as in the logo */
  const hc = rings(110, 122, 290, 178, 28, 0);
  mk("path", { class: "sil" }, g).setAttribute("d", poly(hc[0].map((q) => [q.u, q.v])));
  const vc = rings(172, 60, 228, 240, 28, 0);
  mk("path", { class: "sil" }, g).setAttribute("d", poly(vc[0].map((q) => [q.u, q.v])));
  read.textContent = "brio";
  return { set: () => {}, destroy: bag.dispose };
}
export default ({
  name: "brio",
  means: "The BRIO mark: two capsules crossing into a medical cross.",
  rules: [1, 3, 4, 7, 10],
  mount,
});
