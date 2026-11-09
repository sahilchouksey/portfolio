/**
 * bomber-kit: the ORIGINAL braille stealth-bomber art, promoted to a 2.5D
 * model for the dot-matrix sheet. The loops traced from the art are the only
 * silhouette — beak, hump, wing, sawtooth and beavertail at any scale.
 * No 3D extrusion: every view is the real art, rotated in-plane and sheared
 * for banking. Flat as a stealth wing is flat.
 */
const BOMBER_ART = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⢻⡟⢷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡿⠁⢸⡇⠈⢿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣶⣤⣼⣧⣤⣶⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀
⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀
⠀⢰⣿⣿⣿⣿⣿⠟⠻⣿⣿⣿⠟⠹⣿⣿⠏⠻⣿⣿⣿⠟⠻⣿⣿⣿⣿⣿⡆⠀
⠀⠀⠙⢿⣿⡿⠃⠀⠀⠈⠛⠁⠀⠀⢹⡏⠀⠀⠈⠛⠁⠀⠀⠘⢿⣿⡿⠋⠀⠀
⠀⠀⠀⠀⠙⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;
const SUB = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [0, 3], [1, 3]];
export const boffs = [];
let artCols = 0, artRows = 0;
BOMBER_ART.split("\n").forEach((row, r) => {
  if (row.trim() === "") return;
  for (let c = 0; c < row.length; c++) {
    const code = row.charCodeAt(c) - 0x2800;
    if (!(code >= 1 && code <= 255)) continue;
    for (let b = 0; b < 8; b++) if (code & (1 << b)) {
      const dc = c * 2 + SUB[b][0], dr = r * 4 + SUB[b][1];
      boffs.push([dc, dr]);
      if (dc + 1 > artCols) artCols = dc + 1;
    }
  }
  if ((r + 1) * 4 > artRows) artRows = (r + 1) * 4;
});
/* nose-up art, rotated 90° counterclockwise so the beak points left, as the
   sheet's RUNS fire from top-right toward bottom-left */
boffs.splice(0, boffs.length, ...boffs.map((p) => [p[1], artCols - 1 - p[0]]));
const artT = artCols; artCols = artRows; artRows = artT;
export const extentX = artCols, extentY = artRows;

/* the planes were drawn nose-LEFT in the sheet; the sheet renders y down.
   Preserve that orientation everywhere: rotate the art so the beak points +y
   (down-sheet) once here; all transforms after this see a nose-down art */
const dotSet = new Set(boffs.map(([x, y]) => x + "," + y));
const hasDot = (x, y) => dotSet.has(x + "," + y);
const oEdges = [];
for (const [x, y] of boffs) {
  if (!hasDot(x, y - 1)) oEdges.push([[x, y], [x + 1, y]]);
  if (!hasDot(x, y + 1)) oEdges.push([[x + 1, y + 1], [x, y + 1]]);
  if (!hasDot(x - 1, y)) oEdges.push([[x, y + 1], [x, y]]);
  if (!hasDot(x + 1, y)) oEdges.push([[x + 1, y], [x + 1, y + 1]]);
}
const edgeStart = new Map();
for (const e of oEdges) {
  const k = e[0][0] + "," + e[0][1];
  let arr = edgeStart.get(k);
  if (!arr) { arr = []; edgeStart.set(k, arr); }
  arr.push(e);
}
const unusedEdges = new Set(oEdges);
const oLoops = [];
const dirAng = (e) => Math.atan2(e[1][1] - e[0][1], e[1][0] - e[0][0]);
for (const e0 of oEdges) {
  if (!unusedEdges.has(e0)) continue;
  const pts = [e0[0]];
  unusedEdges.delete(e0);
  let cur = e0, prevAng = dirAng(e0);
  for (;;) {
    pts.push(cur[1]);
    const k = cur[1][0] + "," + cur[1][1];
    const cands = (edgeStart.get(k) || []).filter((e) => unusedEdges.has(e));
    if (!cands.length) {
      if (k === pts[0][0] + "," + pts[0][1]) oLoops.push(pts); else throw new Error("bomber outline broken");
      break;
    }
    let pick = cands[0];
    if (cands.length > 1) {
      let bestScore = Infinity;
      for (const c of cands) {
        const score = ((dirAng(c) - prevAng) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (score < bestScore) { bestScore = score; pick = c; }
      }
    }
    unusedEdges.delete(pick);
    cur = pick;
    prevAng = dirAng(pick);
  }
}
const oCx = (extentX - 1) / 2, oCy = (extentY - 1) / 2;
export const oLoopsCentered = oLoops.map((l) => l.map(([x, y]) => [x - oCx, y - oCy]));
export const boffsCentered = boffs.map(([x, y]) => [x - oCx, y - oCy]);

/* even-odd fill over the traced loops — the art IS this test */
export const inPoly = (x, y, poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
