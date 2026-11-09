import { oLoopsCentered, extentX, extentY, inPoly } from './bomber-kit.js';
import HL from '../kernel.js';
/**
 * skyplate: the contact card as one living sheet. The original sky-frame
 * characters and the portrait share one hairline svg — one pointer, one
 * excite array, one breathing wave — so the hand that lights the face lights
 * the border in the same band. The svg stretches (preserveAspectRatio none)
 * and layout() re-centres both plates on resize: the ring hugs the edges at
 * any aspect while every mark, face and frame alike, stays a square pixel.
 */
const { mk, pointer, register, disposer, reducedMotion } = HL;
const r2 = (v) => Math.round(v * 100) / 100;

/* the bomber: a stealth bomber as braille ascii art. Each lit dot becomes one
   mark of the sheet's own cell grid, so the plane reads as made of the same
   squares as the ring and face. Five bombers fly five lanes across the sheet. */
/* the bomber: one 3D B-2 mesh for the whole sheet — planform with the deep
   sawtooth TE, lambda-cranked LE, three-hump spine — projected under a fixed
   sky camera. Every view (banked, rolled, pitched) falls out of one model;
   no hand-drawn orientations. Teeth are exaggerated for dot size. */
const PLANE_CELLS = 15; /* span in sheet cells — the approved size */
const PLANE_DY = 28; /* raise every bomber by 28 viewBox px */
const FLIGHT = 12; /* seconds per crossing — the pace drawn on the flight planner */
/* the three roads, as drawn but spread wider apart: even ~30-cell air between
   the lanes, same bearing, entering the top-right and leaving bottom-left */
const ROADS = [
  [[152, 3], [1, 114]], /* lane 0 — the drawn road */
  [[168, 25], [17, 136]], /* lane +27 — one step right */
  [[184, 47], [33, 158]], /* lane +54 — far right */
  [[136, -19], [-15, 92]], /* lane -27 — one step left */
  [[120, -41], [-31, 70]], /* lane -54 — far left */
];



const SKY = "**%******---*--*-%--**-*---**-*--*-----..----*------------**--*.*-*---*****----*****---*-*-*---*------------**-*--------*--*-**-*-*-**-*%**--*-*-*****-%**|%**%%****--**-***---*-***********-*-----.--------**--------***---------**---***--**---------**----------*--------------*-****-*****--*---***-**--****%***%|-*%*-----*----**-*-*-*-------------**-*-----*----*---------*-------****--*****-********-----------*--*--*----*-----*-***------------*-----*-----------**%*|*%**--**********-%--*----**-*-----*---*--*****----------*--*--**--**---*-.-    ---*--***--**--*--**--*----*******--*---**----*--*----*--%-**--******--****|*****-*****************%**---**--*----****----**-*-.--****----*--**-------       ------**-**-----****---*-**----*-------*--**---*******--***********-*****|*-*--*-%-*--*******--****--*-**-*----**---**---**-----*--------***---**            **---****-------*-----**---*----*---.-*-**------%*--*******--*-*-%--*-*|*---*-**-*----*--**--*-*----*%------**-***----------*---****-**---*--                -------*-****--**----------***-*--.----%-------*--**--**---*-**-*---*|*%-%%--*****---.-----**---------   --.-----*.-- --*-*--*****------                      ----*-**--*----*--- ***-----.--   -------*-**--------*---**-*%%-%%|-****--***--------.----*----***                  -----*----.--                              --.----*-----                  ***----*-------.------**--**-%*|**-*******--*-----     ------                                                                                                ------     ------*********-**|**********--*-----                                                                                                                      --------*******-**|*---****----*-----                                                                                                                      -----**--*%***---*|%*--*****---**----                                                                                                                      ---*-***-*****--*%|**--***--*---*****                                                                                                                      ---***-*--****--**|----*-*-**---.--                                                                                                                          ---****%-*-**.--|***--*--*-----                                                                                                                             ---*-**--****--|-----**-**----                                                                                                                              *****--**-*---|%*--*---***---                                                                                                                              ----*--*-*-**-|%%%*---*%*-*---                                                                                                                            -----***--***%%|*-*-----*------                                                                                                                            ----*-**-**---*|*-**-.**----*----                                                                                                                        ----*-*--**--**-*|***-------**-----                                                                                                                        ------*-------**-|******--*--*-----                                                                                                                        -------**--******|***-*-*-*-----                                                                                                                              -----*-*-*-***|*-*%*-**-*-----                                                                                                                            -----*-**-*%*-*|*--**--**------                                                                                                                            ------*******-*|*---*---*-*-----                                                                                                                          -----------***-*|**-*--**-----*---                                                                                                                        --.------*---***%|%*---..-**-------                                                                                                                        -------**------*%|%***-.--*--*------                                                                                                                      ---------.--.---*%|%**---*--**-------                                                                                                                      ------***--*---**%|***--*-**%-----*.-                                                                                                                      -.*----****----***|*****-----*-----***                                                                                                                    ----*---*-*--***-%*|*-*-*-------.---***                                                                                                                    ---------*----*-*-*|********-*-**---***                                                                                                                    --*---*---*****-*-*|****-*-*-*---*-****                                                                                                                    ****-*---***-%-****|--**--*--*----****                                                                                                                      ******--*--*--**--|****-*-------*-.**                                                                                                                      ----**------*--***|-*-***----*-%----                                                                                                                        ****%-*----****-*|----*-****-***---                                                                                                                        ---***-****-*----|*--**-*%%%%**--                                                                                                                            --**%%%**-**---|*-******%%-*--                                                                                                                              --*-%%*****---|**-*--*-%----                                                                                                                                ----%**--*--*|*----*-%-*--                                                                                                                                  ***-%-*----*|--*-*-***.**                                                                                                                                  ---***-*-**-|*---*-*-***                                                                                                                                    ***-*-*---*|****---***                                                                                                                                      ****--****|*--*-*-***                                                                                                                                      ***-*-**-*|*---**-***                                                                                                                                      ***-**----|--*%%*----                                                                                                                                      ----*%%*--|--****%----                                                                                                                                     ---*-***--|**---*------                                                                                                                                  --.-*-*-****|***-*----*---                                                                                                                                ---*---**-***|--*-*----*---                                                                                                                                --.*------**-|---*----**----                                                                                                                              -----*-----*--|*-----***--***                                                                                                                              -----**--..--*|-*******------                                                                                                                              -------***--**|-*****--**----                                                                                                                              ----%*-.%-**--|-----*--*-----                                                                                                                              ----*---*-**--|****%**-------                                                                                                                              ------*%****%*|****-*%**-****                                                                                                                              ***--****-****|***--*****----                                                                                                                              ----*****--***|*-*-*********                                                                                                                                ****%********|**********---                                                                                                                                ---**********|-***********                                                                                                                                  **.*********|*****------                                                                                                                                    ---*-******|******-***                                                                                                                                      --*-******|**-*******                                                                                                                                      --*****-**|**%*****--                                                                                                                                      **********|--*-*-**---                                                                                                                                    ---******--|*-*********                                                                                                                                    ***---*****|-*****-*****                                                                                                                                  ****---*****|*-***-*******                                                                                                                                ****-----**-*|*%*---*-***---                                                                                                                              ---*****---***|***%*---**-*---                                                                                                                            ---*------*****|**********--*---                                                                                                                          ---*--****-*-***|**-*****--**-*---                                                                                                                        ---*-**-*****---*|*********--**-*---                                                                                                                      ---*-**--****-****|-*******-*---*----                                                                                                                      ----*---*-*******-|%*****----**--*----                                                                                                                    ----*--**----**--**|%****-**-*-*--*****                                                                                                                    *****-**-*-%*-****%|%****--%%%*********                                                                                                                    --*********%--****%|%****-***%*********                                                                                                                    ****-****%***-*****|*****-***-****--.*                                                                                                                      *.---***-**--*****|**%*-*%******-----                                                                                                                      -----**-*****-****|*********-**-*----                                                                                                                      ----****--********|%****--*%*****-**                                                                                                                        **-****%%*--****%|******-*%%*-*-*--                                                                                                                        --*-**%%%*--****%|****--*%--*******                                                                                                                        ----****-%*--***%|%**------***----                                                                                                                          **.-****-----**%|***-----*******                                                                                                                            *******---*****|****---********                                                                                                                            ******%*---****|******-****-...--                                                                                                                          .---****-******|***--%****--**---                                                                                                                        --*-*--****%-****|***--*%-******---                                                                                                                        ---*******%**-***|*********-*%-.**                                                                                                                          ---*************|*--**-**-%****                                                                                                                              ****%***-***-*|-*************                                                                                                                              ************--|*%*********.*                                                                                                                                *.***********|**********-*--                                                                                                                              ***--***-**%**|***%*****-***--                                                                                                                           ---***-***-*****|**************---                                                                                                                        --***************|**-************---                                                                                                                      --****-******-****|****-******--***--                                                                                                                      --***--******-****|***********--***--                                                                                                                      --***--****-******|*****-------******     ------                                                                                                 -.---     --****-----*-**--*|*****-----******** . ---****--                    --.-------                                  ----*--.--                    ---**----..-********-----*****|**-*%%%********.--**---*--*%*---     --.--*--    -.*******-**-.--                        --.-**-*******---   --------     ----**--*--***-.*********%%*%***|*--********-**-**--****-***--------.-**----****--*-*---****---***---                  ---**-----***---*********---***-.- -----****-**----**-******%****--*|***********%.--------*-*--*--%*---***----*-**---***-*-*---*-*******-.-              --****%*-*-*---*-*****---**-*---***----**--*-----*-----*-**-**%*******|*-*%*--****-*----**-----*--*-****--*-----*-**--*%%****-*---*******-**---          ---***********--*-****%%--***-*--**-*-*****-*---------*---******%-**%*-*|**-****%***-**-*****------****--*------***-----**-****---**-****-***-*%*---    --.-**-***-****-**---*%**--------***----*-*--**-*--.----****-***********-**|-*%--*********%**-*********-********---%*-------**-*-*****-****-******-***-.----*-*--*****-*****%****-*****------**---********-**%******-**%-********--%**|%*%%****-***%********-**%**-****%**-*****--------***--*****-*--*****--**-******---**---*-**----%%***--***--*---**********%****-**%**-*******-%**%*****%%*%|*%**%****-****---*--**%****%***********%*%**-*------****%***-***********---****---***********-********-----*******%*************%*%%**--**--*********%**%*|%*%%*%***-**********%*%***********%****%*******-----%*-*%*****-*%******%*%%****%*-%********-***-****%%*----****************%****%**%*%**********---***%%*%";
const FACE = ". =+=@@@@@@%#@@@@@@@@@*@@@@*.=@@@@@@@@@@@@@@@%@@@+:%=..*.           | ==*@@%-+@%@@@@@@@@@#+@@@*@@#@@@@@@@@@@@@@@%@@*@@@=-*-: .::         |*+@@@@@@%+#@@@@@%@*%@@@%%%@@@@@@@@@@@@@@@@@@@@%@@@#+:.  -=          |+@%*#@@@@@@@@@@@@@#@@@@+:@@@@@@@@@@@@@@@@@@@@@@@@@@=    =           |*#@@@@@@@%@@@@@@@@##@@#*%@%#@@@@@@@@@@@@@@@@@@@@@@@.                |@@@@@@@@#+@%@@@@@@@@@@@@+%=*@%%%@@@-+*+==+:-*@@@@@=..               |@@@@@@=-=*#+@@@*@@@@@@@@#:#-=-@*@:..           . . :                |#=@@@@@@-##-=-..+%%=@@@@@+##++%+-:.                 -               |@@@@@@@@@@@@@@=@@@#+@-@@@@@@@#*%=:.=+: --            :              |@@@@@@@@@@@@@@@@@@@@@%@@@@@@@@@@*+*#:...             .:       .   . |@@@@@@%@@@@@@@@@@@@@#@+@@@@@@@@@@@@@%=.               .             |#%@@@@@@@%*@@@@@@@@@%#%=@@@%@@@@@#-@@@+               ..  .  ..  .. |=*@@@@@@@@@@@@@@@@@@@@@*%@@@@%@-.   :@@@@%=-=         +*            |@%##@@@@@@@@@@@@@@@@@@@@@@@*.::.  =**-=.  -%@@@=     @@*  .   .   . |@@@@@@@@@@@@@@@@@@@@@@@@@-      .    :**#@#::-:     @*              |@@@%@@@@@@@@@@@@@@@@@@@@@+          =::-#@@@=:.    .@=:   .  ..  .. |#@@#+@@@@@ #*-**@@@@@@@@@=               **@.        =              | ::#@@@@@--     +@@@@@@@@%            .:::::        :.        .   . |  .+=@%@@+.   +=**@@%@@+@=                           -              | :  *#%@@@.. :   -#@@@@@%:                            :             |    .#@@@@@        +@@@@@                              :  .   .  .. |   .=*#@@*@@.      ..%@@@-                             :            |     . .=-@@@#       .*@@=                    :  :+*=:-.            |           #@@@@*:.-*.                              :               |      .      .=@@::=*..                              =.   .  ..  .. |                +. .:-.                              -              |...  ..  ...  ..=:   --..                      :@@@@....  .  ..  .. |              =+.. ...--:                   .. .:.:::               |...  ..  .==%%=:. .. ..:*:.                       .:- .   .  ..  .. |      -+%%#@@#:. .......-@@+:....                :=::               |.=#%%%%#%%%%%#:..... .. .::-*@@+:..                 : .   .         |%%%%%#@%#%@#%@+ .. ..  .. ..--:-@@%+:...          .-                |%%##%%#@%%@%%@@: .     .. .....:::=@@@@%*-.. .:-+++   .   .   .     |%%%%#%%#@%###%#@.         .. .  .:..=-:@@@@@@@@@@%#-                |#@@@%#%%@@%#%##@@.     ..      ...=**:=@@@@@@@@%@@%%#*-             |%%@@%%@%%@%%%%%#@%:     .     ..-#*+::@@@@@@@@@@#@@%@@%#= .  ..  .  |@@%%@%%%#@@#%%#@#@@%         .-+=:=:=@@@@@@@@@@@@%@%@@@###=         ";
function mount({ stage, svg, read }, value) {
  const bag = disposer(), g = mk("g", {}, svg);
  const gDot = mk("g", {}, g), gLite = mk("g", {}, g);
  /* exact same weights and sizes as the portrait figure */
  const W = (ch) => (ch === "@" ? 3.5 : "%#".includes(ch) ? 3.05 : "*+=<>o&".includes(ch) ? 2.35 : ch === " " ? 0 : 1.5);
  const K = (w) => (w >= 2.7 ? 2 : w >= 1.9 ? 1 : 0); /* bright, mid, dim — the three tones the DOM glyphs had */
  const RING_FILL = [0.6, 0.85, 0.97]; /* the ring's cells: dim, mid, bright */
  const FACE_FILL = [0.29, 0.46, 0.6]; /* the portrait's pitch: the ascii dot look it always had */
  const sq = (x, y, w, h, dy) =>
    "M" + r2(x - w / 2) + " " + r2(y - h / 2 - dy) + "h" + r2(w) + "v" + r2(h) + "h-" + r2(w) + "z";
  const PW = 68, PH = 37, C = 5.15, R = 5.45;
  let MIDR = 116; /* rows of the baked sheet */
  const cells = [], face = [];
  SKY.split("|").forEach((row, r) => {
    for (let c = 0; c < row.length; c++) { const w = W(row[c]); if (w) cells.push([c, r, w]); }
  });
  FACE.split("|").forEach((row, r) => {
    for (let c = 0; c < PW; c++) { const w = W(row[c]); if (w) face.push([c, r, w]); }
  });
  MIDR = SKY.split("|").length;
  const COLS = 154, ROWS = MIDR;
  /* the planes are part of the same sheet: ordinary squares on the same grid,
     hi-tone, drawn on top — nothing lifted out of the person, no holes cut */
  /* the four tone paths; layout() re-draws them for any box */
  const paths = ["dot off", "dot m", "dot"].map((cls) => mk("path", { class: cls }, gDot));
  const lite = mk("path", { class: "dot" }, gLite);
  /* the planes are part of the same sheet: each plane is the cells its art
     outline covers, drawn as ordinary bright squares — the same square, the
     same tone the whole sheet wears — one layer of grid art, nothing stacked
     on top of the person or the border */
  const planeBodyHi = mk("path", { class: "dot" }, gDot);
  const planeTrailMid = mk("path", { class: "dot m" }, gDot); /* hot exhaust vapour */
  const planeTrailLo = mk("path", { class: "dot off" }, gDot); /* fading tail */
  const planeGlow = mk("path", { class: "dot" }, gLite);
  /* the fleet — five B-2s, five characters. One model, one fixed sky camera;
     yaw follows the road, pitch nods, roll banks — or a complete rotation
     event on two of them. Pose table is data, the model does the drawing. */
  const SWAP = { a: 2, b: 4, w0: 0.06, w1: 0.46, bank: 0.34, lead: 0.30 }; /* wide eased window — lane change reads as one smooth gesture */ /* opposite sides cross lanes — an X over the face */
  const FLEET = [
    { lane: 0, sp: 1.00, debut: 8.6, bankAmp: 0.25, bankFreq: 0.7, phase: 0.0, trail: 0 },   /* lane 0 — final, quiet, wing rock */
    { lane: 1, sp: 1.28, debut: 5.0, bankAmp: 0.30, bankFreq: 1.0, phase: 0.7, trail: 4, yawWob: 0.05 }, /* lane 1 — the fast one, nose wanders a touch */
    { lane: 2, sp: 1.05, debut: 0.0, bankAmp: 0.28, bankFreq: 0.9, phase: 1.9, trail: 2, swap: SWAP }, /* lane 2 — outer right; X with lane 4 */
    { lane: 3, sp: 1.10, debut: 3.4, bankAmp: 0.30, bankFreq: 1.1, phase: 3.4, trail: 2 },    /* lane 3 — cruise, proud weave */
    { lane: 4, sp: 1.05, debut: 1.1, bankAmp: 0.28, bankFreq: 0.9, phase: 4.6, trail: 2, swap: SWAP }, /* lane 4 — outer left; X with lane 2 */
  ];
  const trails = FLEET.map(() => []);   /* per-bomber contrail cells { x, y, age, vx, vy, nx, ny, seed } */
  const trailAcc = FLEET.map(() => 0);  /* distance accumulator for spawn pacing */
  const TRAIL_TTL = 3.7;                /* seconds a vapour cell lives before it evaporates */
  /* staggered departure: the outer lanes leave first, the widest-centre lane goes last */
  const DELAY = FLEET.map((B) => B.debut); /* fleet choreography — outer lanes first, centre last, 2.4 s apart */
  const maxDelay = Math.max(...DELAY);
  const CYCLE = FLIGHT + maxDelay; /* one full fleet cycle: the crossing plus the stagger */
  const planeL = ROADS.map(() => new Map());
  let showBombers = false; /* bombers off by default — enabled via the B2 trigger */
  let bomberEpoch = 0; /* restart time of the fleet — reset on re-enable so the crossing starts from the top */ /* per-plane linger for hover, keyed cell -> energy */
  let pts = [], nxC = 0, nyC = 0;
  const VW = 400, VH = 320; /* the viewBox world: marks live here and the svg stretches it to the stage */
  function layout() {
    pts = [];
    /* the face wears a narrower cut: the same ascii grid compressed to 80%
       in width only — the person sits thinner between the wide sky rails,
       while every mark keeps the square-pixel look */
    const FX = 0.8;
    const fs = Math.min(1, VW / (PW * C * FX + 24), VH / (PH * R + 24));
    const fw = PW * C * FX * fs, fh = PH * R * fs;
    const gxs = (VW - fw) / 2, gys = (VH - fh) / 2;
    const inset = 2; /* the frame hugs the outer panel's inner edge: the border is the boundary, not a stamp */
    const nx = (VW - inset * 2) / COLS, ny = (VH - inset * 2) / ROWS;
    nxC = nx; nyC = ny;
    /* every mark fills its cell by tone — text glyphs did, and marks smaller
       than the pitch left air that read as scattered dust */
    const base = ["", "", ""];
    for (const [c, r, w] of cells) {
      const x = inset + (c + 0.5) * nx, y = inset + (r + 0.5) * ny;
      /* the carve: sky yields the rectangle the face owns — a hair off the
         face's edges, never the sheet's own left and right border rails */
      if (x > gxs - 2 && x < gxs + fw + 2 && y > gys - 14 && y < gys + fh + 14) continue;
      /* the ring stays one step dimmer than the face: capped at mid */
      const k = K(Math.min(w, 2.35));
      base[k] += sq(x, y, nx * RING_FILL[k], ny * RING_FILL[k], 0);
      pts.push([x, y, k]);
    }
    for (const [c, r, w] of face) {
      const x = gxs + c * C * FX * fs + (C * FX * fs) / 2, y = gys + r * R * fs + (R * fs) / 2;
      const k = K(w);
      base[k] += sq(x, y, C * FX * fs * FACE_FILL[k], R * fs * FACE_FILL[k], 0);
      pts.push([x, y, k]);
    }
    paths[0].setAttribute("d", base[0]);
    paths[1].setAttribute("d", base[1]);
    paths[2].setAttribute("d", base[2]);
  }
  layout();
  if (stage.ownerDocument.defaultView.ResizeObserver) {
    const ro = new stage.ownerDocument.defaultView.ResizeObserver(layout);
    ro.observe(stage);
    bag.add(() => ro.disconnect());
  }
  /* gesture: phosphor hand + breathing wave, one clock, one sheet — the
     bombers wear the same phosphor: the hand lights them like any mark */
  const excite = new Float32Array(8192);
  let Rr = value, heat = null, alive = 0;
  const say = (on) =>
    (read.textContent = on
      ? "the phosphor hand — " + alive + " of " + pts.length + " marks alive"
      : "the sky frame holds the face — democratizing technology");
  bag.add(pointer(stage, {
    move: (p) => { heat = p; say(p); },
    leave: () => { heat = null; say(null); },
  }));
  bag.add(register(stage, (dt) => {
    const rad = Rr * C; /* the hand's reach, as on the face plate */
    let d = ""; alive = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      let e = excite[i] * Math.exp(-dt * 2.4);
      if (heat) {
        const dd = Math.hypot(p[0] - heat[0], p[1] - heat[1]); /* both in viewBox units */
        if (dd < rad) e = Math.max(e, 1 - dd / rad);
      }
      excite[i] = e;
      const lift = e * 2.8;
      if (lift > 0.14) { d += sq(p[0], p[1], 2.6 + e * 1.1, 2.6 + e * 1.1, lift); alive++; }
    }
    if (!reducedMotion()) {
      const t = showBombers ? performance.now() / 1000 - bomberEpoch : 0;
      const cycloPhase = ((t % CYCLE) + CYCLE) % CYCLE;
      let pbHi = "", pg = "", pTrailMid = "", pTrailLo = "";
      for (let i = 0; i < ROADS.length; i++) {
        if (!showBombers) continue; /* fleet disabled — no bombers on the sheet */
        const B = FLEET[i];
        const localT = cycloPhase - DELAY[i];
        const flightI = FLIGHT / B.sp; /* speed tiers: fast lanes cross sooner */
        if (localT < 0 || localT >= flightI) continue; /* airborne this stretch */
        const uFlight = localT / flightI;
        /* position on the path — the X-swap pair blends toward each other's roads mid-flight */
        const roadPos = (idx, kk) => {
          const r = ROADS[idx];
          return { x: r[0][0] + (r[1][0] - r[0][0]) * kk, y: r[0][1] + (r[1][1] - r[0][1]) * kk };
        };
        const peerLane = () => FLEET.findIndex((f) => f.lane === (B.lane === SWAP.a ? SWAP.b : SWAP.a));
        const posAt = (uu) => {
          const k = -0.02 + uu * 1.08;
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
        const p0 = posAt(Math.max(0, uFlight - 0.012)), p1 = posAt(Math.min(1.0001, uFlight + 0.012));
        const px = 2 + pC.x * nxC, py = 2 + pC.y * nyC - PLANE_DY;
        const dx = ROADS[i][1][0] - ROADS[i][0][0], dy = ROADS[i][1][1] - ROADS[i][0][1];
        const roadLen = Math.hypot(dx, dy);
        /* attitude — yaw from motion direction; bank shears the wings (tips rise/dip), nothing flips the art */
        let yaw = Math.atan2(p1.y - p0.y, p1.x - p0.x) - Math.PI + (B.yawWob ? B.yawWob * Math.sin(2 * Math.PI * (uFlight * 1.7 + B.phase)) : 0);
        if (B.swap) {
          const cfg = B.swap;
          const c = Math.min(1, Math.max(0, (uFlight - cfg.w0) / (cfg.w1 - cfg.w0)));
          const bell = 16 * c * c * (1 - c) * (1 - c);
          const dir = (FLEET[peerLane()].lane < B.lane) ? -1 : 1; /* nose turns toward the destination lane */
          yaw += dir * cfg.lead * bell;
        }
        let roll = B.bankAmp * Math.sin(2 * Math.PI * (uFlight * B.bankFreq + B.phase));
        if (B.swap) {
          const cfg = B.swap;
          const c = Math.min(1, Math.max(0, (uFlight - cfg.w0) / (cfg.w1 - cfg.w0)));
          const bell = 16 * c * c * (1 - c) * (1 - c); /* zero-slope bump — bank eases in, eases out */
          roll += (B.lane === SWAP.a ? 1 : -1) * cfg.bank * bell; /* bank into the lane change */
        }
        const shear = Math.tan(roll); /* inverse shear applied to the y' test axis — wings seesaw */
        const SX = PLANE_CELLS / extentX;
        const sx = SX * nxC, sy = SX * nyC;
        const ca = Math.cos(yaw), sa = Math.sin(yaw);
        const rHalf = Math.hypot(extentX, extentY) / 2 * sx + nxC;
        const c1 = Math.max(0, Math.floor((px - rHalf) / nxC)), c2 = Math.min(COLS - 1, Math.floor((px + rHalf) / nxC));
        const r1 = Math.max(0, Math.floor((py - rHalf) / nyC)), rj = Math.min(ROWS - 1, Math.floor((py + rHalf) / nyC));
        /* contrail — engine vortices spawn a cell every few px of travel, cells evaporate in TRAIL_TTL */
        const trailList = trails[i];
        const spdPx = roadLen * (1.08 / flightI) * nxC;
        if (B.trail > 0) {
          trailAcc[i] += dt * spdPx;
          if (trailAcc[i] >= 7) {
            trailAcc[i] = 0;
            const exits = B.trail === 4
              ? [[0.46 * extentX, -0.30 * extentY], [0.47 * extentX, -0.09 * extentY], [0.47 * extentX, 0.09 * extentY], [0.46 * extentX, 0.30 * extentY]]
              : B.trail === 2
                ? [[0.46 * extentX, -0.34 * extentY], [0.46 * extentX, 0.34 * extentY]]
                : [[0.48 * extentX, 0]];
            const caT = Math.cos(yaw), saT = Math.sin(yaw);
            const dirX = dx / roadLen, dirY = dy / roadLen;
            for (const [ex, ey] of exits) {
              trailList.push({
                x: px + ex * sx * caT - ey * sy * saT,
                y: py + ex * sx * saT + ey * sy * caT,
                age: 0,
                vx: -dirX * 3.1 * nxC / 2.6,
                vy: -dirY * 3.1 * nxC / 2.6,
                nx: -dirY,          /* lateral diffusion axis */
                ny: dirX,
                seed: Math.sin(i * 12.9898 + trailList.length * 78.233 + cycloPhase * 0.01) * 0.9,
              });
            }
          }
          if (trailList.length > 150) trailList.splice(0, trailList.length - 150);
        }
        for (let c = c1; c <= c2; c++) {
          for (let r = r1; r <= rj; r++) {
            const x = 2 + (c + 0.5) * nxC, y = 2 + (r + 0.5) * nyC;
            const dxl = x - px, dyl = y - py;
            const ru = (dxl * ca + dyl * sa) / sx;
            let rv = (dyl * ca - dxl * sa) / sy;
            rv -= shear * ru; /* inverse of the wing seesaw */
            let inside = false;
            for (const lp of oLoopsCentered) if (inPoly(ru, rv, lp)) inside = !inside;
            if (!inside) continue;
            pbHi += sq(x, y, nxC * 0.58, nyC * 0.58, 0); /* the sheet's own dot — same pitch, real air around every cell */
            let e = (planeL[i].get(c + "," + r) || 0) * Math.exp(-dt * 2.4);
            if (heat) {
              const gap = Math.hypot(x - heat[0], y - heat[1]);
              if (gap < rad) e = Math.max(e, 1 - gap / rad);
            }
            if (e > 0.02) planeL[i].set(c + "," + r, e); else planeL[i].delete(c + "," + r);
            const lift = e * 2.8;
            if (lift > 0.14) pg += sq(x, y, 2.6 + e * 1.1, 2.6 + e * 1.1, lift);
          }
        }
      }
      /* evaporate every vapour cell, widest-diffused last */
      for (let i = 0; i < ROADS.length; i++) {
        const tl = trails[i];
        for (let k = tl.length - 1; k >= 0; k--) {
          const cell = tl[k];
          cell.age += dt;
          if (cell.age > TRAIL_TTL) { tl.splice(k, 1); continue; }
          const u = cell.age / TRAIL_TTL; /* 0 fresh .. 1 gone */
          const spread = cell.seed * Math.min(1, cell.age * 0.8);
          const ox = cell.x + cell.vx * cell.age + cell.nx * spread;
          const oy = cell.y + cell.vy * cell.age + cell.ny * spread;
          const w = nxC * (1 - u * 0.78); /* the vapour smears as it thins */
          if (u < 0.42) pTrailMid += sq(ox, oy, w, w, 0);
          else if (u < 0.86) pTrailLo += sq(ox, oy, w, w, 0);
        }
      }
      planeTrailMid.setAttribute("d", pTrailMid);
      planeTrailLo.setAttribute("d", pTrailLo);
      planeBodyHi.setAttribute("d", pbHi); /* the planes' hi cells, the same tone the person wears */
      planeGlow.setAttribute("d", pg); /* the planes' phosphor, riding above the cut like the ring and face */
    }
    lite.setAttribute("d", d); /* one phosphor band: planes and face on it together */
    return true;
  }));
  say(null);
  const setBombers = (on) => {
    const was = showBombers;
    showBombers = !!on;
    if (!was && showBombers) bomberEpoch = performance.now() / 1000;
  };
  return { set: (v) => { Rr = v; }, setBombers, destroy: bag.dispose };
}
export default ({
  name: "skyplate",
  means: "the contact sheet: sky-frame ring and portrait on one plate — one hand, one wave, every mark a square.",
  rules: [1, 3, 4, 7, 10],
  range: [2, 4.5, 9],
  tour: [[170, 120], [230, 165], [255, 210], null],
  mount,
});
