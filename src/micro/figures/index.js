/**
 * The micro-figures usable inside the site. Customs are the skill's figures
 * (an object with .mount({ stage, svg, read }, value)); package engines ride
 * the same contract through a small wrapper, so <MicroFigure> stays uniform.
 */
import crystal from "./crystal.js";
import doct from "./doct.js";
import brio from "./brio.js";
import portrait from "./portrait.js";
import soundrex from "./soundrex.js";
import globe from "./globe.js";
import sunmoon from "./sunmoon.js";
import skyplate from "./skyplate.js";
import cake from "./cake.js";
import { vault } from "../vendor/hairline.js";

const wrap = (engine) => {
  let live = null;
  return {
    name: engine.name || "engine",
    mount: (m) => {
      try { live = engine(m.stage, { intensity: 0.5, theme: "auto" }); } catch (e) { console.error("[micro]", engine.name || "engine", e); }
      return {
        destroy: () => {
          try { live?.destroy?.(); } catch { /* engines clean themselves */ }
          if (m.stage) m.stage.innerHTML = "";
        },
      };
    },
  };
};

export default { crystal, doct, brio, portrait, globe, sunmoon, skyplate, cake, monefy: wrap(vault), soundrex };
