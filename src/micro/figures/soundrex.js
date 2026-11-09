import HL from '../kernel.js';
/**
 * soundrex: the now-playing mark, cranked up — a mirrored spectrum
 * waveform slamming through the disc (the SoundCloud cut) over a hot
 * baseline. Search any song, album or artist; unlimited, free, ad-free.
 * The pointer quickens the tempo; the slider is the energy, in factors.
 */
const { mk, pointer, register, disposer } = HL;
const r2 = (v) => Math.round(v * 100) / 100;
function mount({ stage, svg, read }, value) {
  const bag = disposer(), g = mk("g", {}, svg);
  /* the record */
  mk("circle", { cx: 200, cy: 158, r: 92, class: "sil nf" }, g); /* outline only — never a filled slab */
  mk("circle", { cx: 200, cy: 158, r: 74, class: "nf lo" }, g);
  mk("circle", { cx: 200, cy: 158, r: 20, class: "nf lo" }, g);
  /* the waveform — mirrored bars slamming above and below a hot baseline */
  const BARS = 44;
  const step = 5.35;
  const x0 = 200 - ((BARS - 1) / 2) * step;
  const bars = [];
  for (let i = 0; i < BARS; i++) {
    bars.push(mk("line", { x1: r2(x0 + i * step), y1: 158, x2: r2(x0 + i * step), y2: 158, class: "nf mid" }, g));
  }
  /* the baseline — permanent, bright, the floor the track hits */
  mk("line", { x1: 104, y1: 158, x2: 296, y2: 158, class: "nf hi" }, g);
  let rate = value * 1.4, t = 0;
  const say = (p) => read.textContent = p ? "soundrex — unlimited songs. zero ads." : "soundrex — search any song, album or artist";
  bag.add(pointer(stage, {
    move: () => { rate = value * 3.2; say(1); },
    leave: () => { rate = value * 1.4; say(0); },
  }));
  bag.add(register(stage, (dt) => {
    t += dt * rate;
    for (let i = 0; i < BARS; i++) {
      /* pseudo-noise: three detuned sines, scrolled fast — hard peaks, no two alike */
      const n = Math.sin(i * 0.61 - t * 9.1) * 0.55 + Math.sin(i * 1.37 - t * 14.7 + 1.9) * 0.3 + Math.sin(i * 2.29 - t * 21.3 + 4.4) * 0.15;
      /* slight taper at the outer edges, fuller middle — cocky core */
      const edge = Math.pow(Math.sin(Math.PI * (i / (BARS - 1))), 0.42);
      const h = Math.abs(n) * 46 * edge + 2.4;
      const half = Math.max(1.6, h);
      bars[i].setAttribute("y1", r2(158 - half));
      bars[i].setAttribute("y2", r2(158 + half));
      bars[i].setAttribute("x1", r2(x0 + i * step));
      bars[i].setAttribute("x2", r2(x0 + i * step));
    }
    return true;
  }));
  read.textContent = "soundrex — search any song, album or artist";
  return { set: (v) => { value = v; rate = v * 1.4; }, destroy: bag.dispose };
}
export default ({
  name: "soundrex",
  means: "The now-playing mark, cranked up: a mirrored spectrum waveform slamming through the disc over a hot baseline — unlimited songs, zero ads.",
  rules: [1, 3, 4, 7, 10],
  range: [0.4, 1.15, 2.1],
  tour: [[200, 150], [150, 160], [250, 160], null],
  mount,
});
