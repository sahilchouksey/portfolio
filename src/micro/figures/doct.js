import HL from '../kernel.js';
/**
 * doct: the records clipboard. A sheet of hairline rows; an ECG line draws
 * itself across, beat after beat, a dot pulsing at the spike. The pointer
 * sets the heart rate. The slider is the rate, in hertz.
 */
const { mk, rings, poly, pointer, register, disposer } = HL;
const r2 = (v) => Math.round(v * 100) / 100;
function mount({ stage, svg, read }, value) {
  const bag = disposer(), g = mk("g", {}, svg);
  const br = rings(146, 64, 254, 252, 10, 2);
  mk("path", { class: "sil" }, g).setAttribute("d", poly(br[0].map((q) => [q.u, q.v])));
  mk("path", { class: "nf lo" }, g).setAttribute("d", poly(br[1].map((q) => [q.u, q.v])));
  const clip = rings(182, 52, 218, 76, 6, 0);
  mk("path", { class: "sil" }, g).setAttribute("d", poly(clip[0].map((q) => [q.u, q.v])));
  mk("path", { class: "nf lo dash" }, g)
    .setAttribute("d", "M162 98h76M162 114h60M162 130h70");
  const pts = [[152, 178], [196, 178], [204, 178], [211, 148], [219, 208], [226, 178], [248, 178]];
  const ecg = mk("path", { class: "nf mid" }, g);
  let over = false, rate = value, t = 0;
  const say = (p) => read.textContent = p ? "doct app — records, 4× faster" : "doct app — encrypted records, every beat";
  bag.add(pointer(stage, {
    move: () => { over = true; rate = value * 2.4; say(1); },
    leave: () => { over = false; rate = value; say(0); },
  }));
  bag.add(register(stage, (dt) => {
    t += dt * rate;
    const k = (t % 1);
    let d = "M" + pts[0][0] + " " + pts[0][1], draw = "";
    for (let i = 1; i < pts.length; i++) {
      const f = Math.min(1, k * (pts.length - 1) - (i - 1));
      if (f <= 0) break;
      const a = pts[i - 1], b = pts[i];
      draw = "L" + r2(a[0] + (b[0] - a[0]) * f) + " " + r2(a[1] + (b[1] - a[1]) * f);
      if (f >= 1) d += draw; else { d += draw; break; }
    }
    ecg.setAttribute("d", d);
    return true;
  }));
  read.textContent = "doct app — encrypted records, every beat";
  return { set: (v) => { value = v; if (!over) rate = v; }, destroy: bag.dispose };
}
export default ({
  name: "doct",
  means: "The records clipboard with an ECG that draws itself, beat after beat; the pointer sets the heart rate.",
  rules: [1, 3, 4, 7, 10],
  range: [0.3, 0.8, 1.8],
  tour: [[200, 110], [211, 150], [230, 200], null],
  mount,
});
