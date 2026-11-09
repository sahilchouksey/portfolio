import HL from '../kernel.js';
/**
 * portrait: Sahil's ASCII portrait rebuilt as a plate of glyph marks. At rest a
 * wave of light breathes down the glyphs. The pointer is a hand of phosphor:
 * marks under it lift and turn bright, and the light lingers, then fades. The
 * slider is the reach, in cells.
 */
const { mk, pointer, register, disposer, reducedMotion } = HL;
const ART = ". =+=@@@@@@%#@@@@@@@@@*@@@@*.=@@@@@@@@@@@@@@@%@@@+:%=..*.           | ==*@@%-+@%@@@@@@@@@#+@@@*@@#@@@@@@@@@@@@@@%@@*@@@=-*-: .::         |*+@@@@@@%+#@@@@@%@*%@@@%%%@@@@@@@@@@@@@@@@@@@@%@@@#+:.  -=          |+@%*#@@@@@@@@@@@@@#@@@@+:@@@@@@@@@@@@@@@@@@@@@@@@@@=    =           |*#@@@@@@@%@@@@@@@@##@@#*%@%#@@@@@@@@@@@@@@@@@@@@@@@.                |@@@@@@@@#+@%@@@@@@@@@@@@+%=*@%%%@@@-+*+==+:-*@@@@@=..               |@@@@@@=-=*#+@@@*@@@@@@@@#:#-=-@*@:..           . . :                |#=@@@@@@-##-=-..+%%=@@@@@+##++%+-:.                 -               |@@@@@@@@@@@@@@=@@@#+@-@@@@@@@#*%=:.=+: --            :              |@@@@@@@@@@@@@@@@@@@@@%@@@@@@@@@@*+*#:...             .:       .   . |@@@@@@%@@@@@@@@@@@@@#@+@@@@@@@@@@@@@%=.               .             |#%@@@@@@@%*@@@@@@@@@%#%=@@@%@@@@@#-@@@+               ..  .  ..  .. |=*@@@@@@@@@@@@@@@@@@@@@*%@@@@%@-.   :@@@@%=-=         +*            |@%##@@@@@@@@@@@@@@@@@@@@@@@*.::.  =**-=.  -%@@@=     @@*  .   .   . |@@@@@@@@@@@@@@@@@@@@@@@@@-      .    :**#@#::-:     @*              |@@@%@@@@@@@@@@@@@@@@@@@@@+          =::-#@@@=:.    .@=:   .  ..  .. |#@@#+@@@@@ #*-**@@@@@@@@@=               **@.        =              | ::#@@@@@--     +@@@@@@@@%            .:::::        :.        .   . |  .+=@%@@+.   +=**@@%@@+@=                           -              | :  *#%@@@.. :   -#@@@@@%:                            :             |    .#@@@@@        +@@@@@                              :  .   .  .. |   .=*#@@*@@.      ..%@@@-                             :            |     . .=-@@@#       .*@@=                    :  :+*=:-.            |           #@@@@*:.-*.                              :               |      .      .=@@::=*..                              =.   .  ..  .. |                +. .:-.                              -              |...  ..  ...  ..=:   --..                      :@@@@....  .  ..  .. |              =+.. ...--:                   .. .:.:::               |...  ..  .==%%=:. .. ..:*:.                       .:- .   .  ..  .. |      -+%%#@@#:. .......-@@+:....                :=::               |.=#%%%%#%%%%%#:..... .. .::-*@@+:..                 : .   .         |%%%%%#@%#%@#%@+ .. ..  .. ..--:-@@%+:...          .-                |%%##%%#@%%@%%@@: .     .. .....:::=@@@@%*-.. .:-+++   .   .   .     |%%%%#%%#@%###%#@.         .. .  .:..=-:@@@@@@@@@@%#-                |#@@@%#%%@@%#%##@@.     ..      ...=**:=@@@@@@@@%@@%%#*-             |%%@@%%@%%@%%%%%#@%:     .     ..-#*+::@@@@@@@@@@#@@%@@%#= .  ..  .  |@@%%@%%%#@@#%%#@#@@%         .-+=:=:=@@@@@@@@@@@@%@%@@@###=         ";
const ARTW = 68;
const ARTH = 37;
const r2 = (v) => Math.round(v * 100) / 100;

/* the bomber: a stealth bomber as braille ascii art. Each lit dot becomes one
   glyph square of the persona's own grid, so the plane reads as made of the
   same cells as the face. Five bombers fly five lanes across the sheet. */
/* the bomber: the original braille stealth-bomber art as a 2.5D flat mesh —
   the exact beak/hump/sawtooth loops textured by the plate's own dots, at any
   bank angle. One model for every pose; the whole fleet flies from this. */
import { oLoopsCentered, extentX, extentY, inPoly } from './bomber-kit.js';
const PLANE_CELLS = 9; /* span in plate cells — below this the silhouette stops reading */
const PLANE_DY = 28; /* raise every bomber by 28 viewBox px */
const FLIGHT = 12; /* seconds per crossing — the pace drawn on the flight planner */
/* the five roads, from the planner's drawing, scaled to this plate (col,row) */
const ROADS = [
  [[67, 1], [0, 36]], /* lane 0 — the drawn road */
  [[74, 8], [8, 43]], /* lane +12 */
  [[81, 15], [15, 50]], /* lane +24 */
  [[60, -6], [-7, 29]], /* lane -12 */
  [[53, -13], [-14, 22]], /* lane -24 */
];



function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = 5.15, R = 5.45, OX = (400 - ARTW * C) / 2, OY = (320 - ARTH * R) / 2 + 12;
  const g = mk("g", {}, svg);
  const gDot = mk("g", {}, g), gLite = mk("g", {}, g);
  /* the glyph marks: squares sized by character weight, three tones */
  const W = (ch) => ch === "@" ? 3.5 : "%#".includes(ch) ? 3.05 : "*+=<>o&".includes(ch) ? 2.35 : ch === " " ? 0 : 1.5;
  const K = (w) => w >= 1.9 ? 1 : 0;
  const pts = [], cls = [];
  ART.split("|").forEach((row, r) => {
    for (let c = 0; c < ARTW; c++) {
      const w = W(row[c]);
      if (!w) continue;
      pts.push([OX + c * C + C / 2, OY + r * R + R / 2]);
      cls.push(K(w));
    }
  });
  const sq = (x, y, w, dy) => "M" + r2(x - w / 2) + " " + r2(y - w / 2 - dy) + "h" + r2(w) + "v" + r2(w) + "h-" + r2(w) + "z";
  const SZ = [1.5, 2.35, 3.05], base = ["", "", ""];
  pts.forEach((p, i) => { base[cls[i]] += sq(p[0], p[1], SZ[cls[i]], 0); });
  const mOff = mk("path", { class: "dot off" }, gDot);
  const mMid = mk("path", { class: "dot m" }, gDot);
  const mHi = mk("path", { class: "dot" }, gDot);
  mOff.setAttribute("d", base[0]);
  mMid.setAttribute("d", base[1]);
  mHi.setAttribute("d", base[2]);
  const lite = mk("path", { class: "dot" }, gLite);
  /* the planes are part of the same sheet: ordinary squares on the same grid,
     drawn on top — nothing lifted out of the face, no holes cut */
  /* the planes are part of the same sheet: each plane is the cells its art
     outline covers, drawn as ordinary squares — same tone, same size, same
     hover — nothing stacked on top of the face, nothing lifted above it:
     one layer of grid art */
  const planeBodyMid = mk("path", { class: "dot" }, gDot); /* the planes: the bright cells of the sheet, same tone, same grid */
  const planeTrailMid = mk("path", { class: "dot m" }, gDot); /* hot exhaust vapour */
  const planeTrailLo = mk("path", { class: "dot off" }, gDot); /* fading tail */
  const planeGlow = mk("path", { class: "dot" }, gLite);
  const SWAP = { a: 2, b: 4, w0: 0.06, w1: 0.46, bank: 0.34, lead: 0 }; /* position drifts lanes; nose stays on-road */ /* wide eased window — lane change as one gesture */
  const FLEET = [
    { lane: 0, sp: 1.00, debut: 8.6, bankAmp: 0.22, bankFreq: 0.7, phase: 0.0, trail: 2, swing: { spinFrom: 0.28, window: 0.44, boost: 1.8 } }, /* lane 0 — the center bomber: one full swing (longitudinal roll) mid-sheet, boosted tail */
    { lane: 1, sp: 1.28, debut: 5.0, bankAmp: 0.28, bankFreq: 1.0, phase: 0.7, trail: 4,  },
    { lane: 2, sp: 1.05, debut: 0.0, bankAmp: 0.24, bankFreq: 0.9, phase: 1.9, trail: 2, swap: SWAP },
    { lane: 3, sp: 1.10, debut: 3.4, bankAmp: 0.26, bankFreq: 1.1, phase: 3.4, trail: 2 },
    { lane: 4, sp: 1.05, debut: 1.1, bankAmp: 0.24, bankFreq: 0.9, phase: 4.6, trail: 2, swap: SWAP },
  ];
  const DELAY = FLEET.map((B) => B.debut); /* debuts: outer lanes first, centre last */
  const maxDelay = Math.max(...DELAY);
  const CYCLE = FLIGHT + maxDelay; /* one full fleet cycle: the crossing plus the stagger */
  const barrelState = FLEET.map(() => ({ prevU: 0, poseK: -0.02 })); /* centerEvent lanes — accumulated post-boost road progress */
  const trails = FLEET.map(() => []);
  const trailAcc = FLEET.map(() => 0);
  const TRAIL_TTL = 3.7;
  const planeL = ROADS.map(() => new Map());
  let showBombers = false; /* bombers off by default — enabled via the B2 trigger */
  let bomberEpoch = 0; /* restart time of the fleet — reset on re-enable so the crossing starts from the top */ /* per-plane linger for hover, keyed cell -> energy */
  /* gesture state: excite array + trail — one phosphor system for the face
     and the bombers alike: the hand lights the planes exactly as it lights
     the marks, with linger and fade */
  const n = pts.length, excite = new Float32Array(n);
  let Rr = value, heat = null;
  let alive = 0;
  const say = (p) => read.textContent = p ? "the phosphor hand — " + alive + " of " + n + " glyphs alive" : "sahil chouksey — democratizing technology";
  bag.add(pointer(stage, {
    move: (p) => { heat = p; say(p); },
    leave: () => { heat = null; say(null); },
  }));
  bag.add(register(stage, (dt) => {
    const rad = Rr * C;
    let d = ""; alive = 0;
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      let e = excite[i] * Math.exp(-dt * 2.4);
      if (heat) {
        const dd = Math.hypot(p[0] - heat[0], p[1] - heat[1]);
        if (dd < rad) e = Math.max(e, 1 - dd / rad);
      }
      excite[i] = e;
      const lift = e * 2.8;
      if (lift > 0.14) { d += sq(p[0], p[1], 2.6 + e * 1.1, lift); alive++; }
    }
    if (!reducedMotion()) {
      const t = showBombers ? performance.now() / 1000 - bomberEpoch : 0;
      const cycloPhase = ((t % CYCLE) + CYCLE) % CYCLE;
      let pbMid = "", pg = "", pTrailMid = "", pTrailLo = "";
      for (let i = 0; i < ROADS.length; i++) {
        if (!showBombers) continue; /* fleet disabled — no bombers on the plate */
        const B = FLEET[i];
        const localT = cycloPhase - DELAY[i];
        const flightI = FLIGHT / B.sp;
        if (localT < 0 || localT >= flightI) continue; /* airborne only on its own crossing */
        const uFlight = localT / flightI;
        /* the swing — the center bomber rolls over its own nose–tail axis as it
           crosses the heart of the sheet, one full eased rotation, wings to the
           dirt and back; the moment it levels out its acceleration kicks in */
        let swingPhase = 0;
        if (B.swing) {
          const t = (uFlight - B.swing.spinFrom) / B.swing.window;
          if (t > 0 && t < 1) {
            const e = t * t * t * (t * (t * 6 - 15) + 10); /* smootherstep — zero angular velocity at both ends */
            swingPhase = e * Math.PI * 2; /* one full 360° over the flight axis — ends level, facing the road */
          }
        }
        const st = barrelState[i];
        if (uFlight < st.prevU) { st.prevU = 0; st.poseK = -0.02; } /* cycle wrapped — plane reborn at the entry edge */
        const swingEnd = B.swing ? B.swing.spinFrom + B.swing.window : 1e9;
        st.poseK += dt * (1.08 / flightI) * (B.swing && uFlight >= swingEnd ? B.swing.boost : 1); /* the moment it levels, the acceleration kicks in */
        st.prevU = uFlight;
        if (B.swing && st.poseK >= 1.08) continue; /* boosted lane exits early — cycle complete */
        const roadPos = (idx, kk) => {
          const r = ROADS[idx];
          return { x: r[0][0] + (r[1][0] - r[0][0]) * kk, y: r[0][1] + (r[1][1] - r[0][1]) * kk };
        };
        const peerLane = () => FLEET.findIndex((f) => f.lane === (B.lane === SWAP.a ? SWAP.b : SWAP.a));
        const posAt = (uu) => {
          const k = B.swing ? st.poseK : -0.02 + uu * 1.08;
          const self = roadPos(i, k);
          if (!B.swap) return self;
          const cfg = B.swap;
          const pi = peerLane();
          const pp = roadPos(pi, k);
          const c = Math.min(1, Math.max(0, (uu - cfg.w0) / (cfg.w1 - cfg.w0)));
          const w = c * c * c * (c * (c * 6 - 15) + 10); /* smootherstep — zero velocity at both ends */
          return { x: self.x + (pp.x - self.x) * w, y: self.y + (pp.y - self.y) * w };
        };
        const pC = posAt(uFlight);
        const p0 = B.swing ? roadPos(i, st.poseK - 0.012) : posAt(Math.max(0, uFlight - 0.012));
        const p1 = B.swing ? roadPos(i, st.poseK + 0.012) : posAt(Math.min(1.0001, uFlight + 0.012));
        const px = OX + pC.x * C, py = OY + pC.y * R - PLANE_DY;
        const dx = ROADS[i][1][0] - ROADS[i][0][0], dy = ROADS[i][1][1] - ROADS[i][0][1];
        const roadLen = Math.hypot(dx, dy);
        const baseYaw = Math.atan2(p1.y - p0.y, p1.x - p0.x) - Math.PI + (B.yawWob ? B.yawWob * Math.sin(2 * Math.PI * (uFlight * 1.7 + B.phase)) : 0);
        let roll = B.bankAmp * Math.sin(2 * Math.PI * (uFlight * B.bankFreq + B.phase));
        let yawFinal = baseYaw; /* the swing is a roll around the flight axis — the heading never turns */
        if (B.swap) {
          const cfg = B.swap;
          const c = Math.min(1, Math.max(0, (uFlight - cfg.w0) / (cfg.w1 - cfg.w0)));
          const bell = 16 * c * c * (1 - c) * (1 - c);
          roll += (B.lane === SWAP.a ? 1 : -1) * cfg.bank * bell; /* bank into the lane change */
          const dir = (FLEET[peerLane()].lane < B.lane) ? -1 : 1;  /* nose turns toward the destination lane */
          yawFinal += dir * cfg.lead * bell; /* nose leads the slide across */
        }
        const shear = Math.tan(roll); /* inverse of the wing seesaw */
        const SX = PLANE_CELLS / extentX;
        const sx = SX * C, sy = SX * R;
        const rollC = Math.cos(swingPhase);
        const syR = sy * Math.max(0.02, Math.abs(rollC)); /* the wing-span axis squashes through the roll — edge-on at 90° and 270° */
        const mir = rollC < 0 ? -1 : 1; /* belly-up half of the roll — art mirrors over */
        const ca = Math.cos(yawFinal), sa = Math.sin(yawFinal);
        const rHalf = (Math.hypot(extentX, extentY) / 2) * sx + C;
        const c1 = Math.max(0, Math.floor((px - rHalf - OX) / C)), c2 = Math.min(ARTW - 1, Math.floor((px + rHalf - OX) / C));
        const r1 = Math.max(0, Math.floor((py - rHalf - OY) / R)), rj = Math.min(ARTH - 1, Math.floor((py + rHalf - OY) / R));
        /* contrail — engine vortices, cells evaporate */
        const trailList = trails[i];
        const spdPx = roadLen * (1.08 / flightI) * C;
        /* contrails only once the swing is complete — the boost kicks in and the exhaust lights up */
        if (B.trail > 0 && (!B.swing || uFlight >= swingEnd)) {
          trailAcc[i] += dt * spdPx;
          if (trailAcc[i] >= 7) {
            trailAcc[i] = 0;
            const exits = B.trail === 4
              ? [[0.46 * extentX, -0.30 * extentY], [0.47 * extentX, -0.09 * extentY], [0.47 * extentX, 0.09 * extentY], [0.46 * extentX, 0.30 * extentY]]
              : B.trail === 2
                ? [[0.46 * extentX, -0.34 * extentY], [0.46 * extentX, 0.34 * extentY]]
                : [[0.48 * extentX, 0]];
            const caT = Math.cos(yawFinal), saT = Math.sin(yawFinal);
            const dirX = dx / roadLen, dirY = dy / roadLen;
            for (const [ex, ey] of exits) {
              trailList.push({
                x: px + ex * sx * caT - ey * sy * saT,
                y: py + ex * sx * saT + ey * sy * caT,
                age: 0,
                vx: -dirX * 1.9,
                vy: -dirY * 1.9,
                nx: -dirY,
                ny: dirX,
                seed: Math.sin(i * 12.9898 + trailList.length * 78.233 + cycloPhase * 0.01) * 0.9,
              });
            }
          }
          if (trailList.length > 150) trailList.splice(0, trailList.length - 150);
        }
        const linger = planeL[i];
        for (let c = c1; c <= c2; c++) {
          for (let r = r1; r <= rj; r++) {
            const x = OX + c * C + C / 2, y = OY + r * R + R / 2;
            const dx2 = x - px, dy2 = y - py;
            const ru = (dx2 * ca + dy2 * sa) / sx;
            let rv = (dy2 * ca - dx2 * sa) / syR;
            rv -= shear * ru;
            rv *= mir; /* belly-up half */
            let inside = false;
            for (const lp of oLoopsCentered) if (inPoly(ru, rv, lp)) inside = !inside;
            if (!inside) continue;
            pbMid += sq(x, y, 3.05, 0); /* the plate's own bright glyph — same grid, same size */
            let e = (linger.get(c + "," + r) || 0) * Math.exp(-dt * 2.4);
            if (heat) {
              const gap = Math.hypot(x - heat[0], y - heat[1]);
              if (gap < rad) e = Math.max(e, 1 - gap / rad);
            }
            if (e > 0.02) linger.set(c + "," + r, e); else linger.delete(c + "," + r);
            const lift = e * 2.8;
            if (lift > 0.14) pg += sq(x, y, 2.6 + e * 1.1, lift);
          }
        }
      }
      for (let i = 0; i < ROADS.length; i++) {
        const tl = trails[i];
        for (let k = tl.length - 1; k >= 0; k--) {
          const cell = tl[k];
          cell.age += dt;
          if (cell.age > TRAIL_TTL) { tl.splice(k, 1); continue; }
          const u = cell.age / TRAIL_TTL;
          const spread = cell.seed * Math.min(1, cell.age * 0.8);
          const ox = cell.x + cell.vx * cell.age + cell.nx * spread;
          const oy = cell.y + cell.vy * cell.age + cell.ny * spread;
          const w = C * (1 - u * 0.78);
          if (u < 0.42) pTrailMid += sq(ox, oy, w, 0);
          else if (u < 0.86) pTrailLo += sq(ox, oy, w, 0);
        }
      }
      planeTrailMid.setAttribute("d", pTrailMid);
      planeTrailLo.setAttribute("d", pTrailLo);
      planeBodyMid.setAttribute("d", pbMid); /* the planes' bright cells, the same tone the face wears */
      planeGlow.setAttribute("d", pg); /* the planes' phosphor, riding above the cut like the face */
    }
    lite.setAttribute("d", d); /* one phosphor band: face and planes on it together */
    if (heat) say(heat);
    return true;
  }));
  read.textContent = "sahil chouksey — democratizing technology";
  const setBombers = (on) => {
    const was = showBombers;
    showBombers = !!on;
    if (!was && showBombers) bomberEpoch = performance.now() / 1000;
  };
  return { set: (v) => { Rr = v; }, setBombers, destroy: bag.dispose };
}
export default ({
  name: "portrait",
  means: "Sahil's ascii portrait as a glyph plate under a phosphor hand: the pointer lights and lifts the face, and the light lingers.",
  rules: [1, 3, 4, 7, 10],
  range: [2, 4.5, 9],
  tour: [[170, 120], [230, 165], [255, 210], null],
  mount,
});
