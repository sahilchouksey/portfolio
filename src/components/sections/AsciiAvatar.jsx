import React, { useEffect, useRef } from 'react';

const AsciiAvatar = ({ animationType = 'fadeInUp', delay = 200, threshold = 0.15 }) => {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const speedMultiplier = 4; // Fixed speed at 4x

  const asciiArtContent = `
. =+=@@@@@@%#@@@@@@@@@*@@@@*.=@@@@@@@@@@@@@@@%@@@+:%=..*.           
 ==*@@%-+@%@@@@@@@@@#+@@@*@@#@@@@@@@@@@@@@@%@@*@@@=-*-: .::         
*+@@@@@@%+#@@@@@%@*%@@@%%%@@@@@@@@@@@@@@@@@@@@%@@@#+:.  -=          
+@%*#@@@@@@@@@@@@@#@@@@+:@@@@@@@@@@@@@@@@@@@@@@@@@@=    =           
*#@@@@@@@%@@@@@@@@##@@#*%@%#@@@@@@@@@@@@@@@@@@@@@@@.                
@@@@@@@@#+@%@@@@@@@@@@@@+%=*@%%%@@@-+*+==+:-*@@@@@=..               
@@@@@@=-=*#+@@@*@@@@@@@@#:#-=-@*@:..           . . :                
#=@@@@@@-##-=-..+%%=@@@@@+##++%+-:.                 -               
@@@@@@@@@@@@@@=@@@#+@-@@@@@@@#*%=:.=+: --            :              
@@@@@@@@@@@@@@@@@@@@@%@@@@@@@@@@*+*#:...             .:       .   . 
@@@@@@%@@@@@@@@@@@@@#@+@@@@@@@@@@@@@%=.               .             
#%@@@@@@@%*@@@@@@@@@%#%=@@@%@@@@@#-@@@+               ..  .  ..  .. 
=*@@@@@@@@@@@@@@@@@@@@@*%@@@@%@-.   :@@@@%=-=         +*            
@%##@@@@@@@@@@@@@@@@@@@@@@@*.::.  =**-=.  -%@@@=     @@*  .   .   . 
@@@@@@@@@@@@@@@@@@@@@@@@@-      .    :**#@#::-:     @*             
@@@%@@@@@@@@@@@@@@@@@@@@@+          =::-#@@@=:.    .@=:   .  ..  .. 
#@@#+@@@@@ #*-**@@@@@@@@@=               **@.        =              
 ::#@@@@@--     +@@@@@@@@%            .:::::        :.        .   . 
  .+=@%@@+.   +=**@@%@@+@=                           -              
 :  *#%@@@.. :   -#@@@@@%:                            :             
    .#@@@@@        +@@@@@                              :  .   .  .. 
   .=*#@@*@@.      ..%@@@-                             :            
     . .=-@@@#       .*@@=                    :  :+*=:-.            
           #@@@@*:.-*.                              :               
      .      .=@@::=*..                              =.   .  ..  .. 
                +. .:-.                              -              
...  ..  ...  ..=:   --..                      :@@@@....  .  ..  .. 
              =+.. ...--:                   .. .:.:::               
...  ..  .==%%=:. .. ..:*:.                       .:- .   .  ..  .. 
      -+%%#@@#:. .......-@@+:....                :=::               
.=#%%%%#%%%%%#:..... .. .::-*@@+:..                 : .   .         
%%%%%#@%#%@#%@+ .. ..  .. ..--:-@@%+:...          .-                
%%##%%#@%%@%%@@: .     .. .....:::=@@@@%*-.. .:-+++   .   .   .     
%%%%#%%#@%###%#@.         .. .  .:..=-:@@@@@@@@@@%#-                
#@@@%#%%@@%#%##@@.     ..      ...=**:=@@@@@@@@%@@%%#*-             
%%@@%%@%%@%%%%%#@%:     .     ..-#*+::@@@@@@@@@@#@@%@@%#= .  ..  .  
@@%%@%%%#@@#%%#@#@@%         .-+=:=:=@@@@@@@@@@@@%@%@@@###=         
`;

  useEffect(() => {
    if (!containerRef.current) return;

    const NOISE_CHARS = [".", "`", "'", " ", "~", ","];
    const TENDRIL_CHARS = ["*", "+", "o", "·", "❖", "◊", "◈", "⧫"];
    const AWAKENING_FLICKER_CHARS = ["%", "&", "#", "?", "!", "▓", "▒", "█", "░", "▐"];

    // Matrix Rain System Constants
    const MATRIX_CHARS = ["ア", "カ", "サ", "タ", "ナ", "ハ", "マ", "ヤ", "ラ", "ワ", "ガ", "ザ", "ダ", "バ", "パ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const RAIN_INITIAL_DENSITY = 0.7; // % of columns with active rain (higher for cluster targeting)
    const RAIN_SPEED_FAST = 1; // frames per drop movement
    const RAIN_DROP_STEP = 2; // pixels to move per update (faster rain)
    const RAIN_FORMATION_REVEAL_CHANCE = 0.95; // chance rain reveals a symbol when passing through (higher for efficiency)
    const RAIN_TRAIL_LENGTH = 3; // shorter trail for faster movement
    const MIN_RAIN_DROP_LIFE = 20; // minimum frames a rain drop lives
    const MAX_RAIN_DROP_LIFE = 50; // maximum frames a rain drop lives
    const RAIN_COMPLETION_THRESHOLD = 0.80; // 80% = rain phase complete
    const METAMORPHOSIS_CYCLES = {
      ".": [".", ":", "o", "O", "◯", "●", "○", "o", ":"],
      "-": ["-", "/", "|", "\\", "—", "═", "─"],
      "+": ["+", "x", "*", "X", "✦", "✧", "⊕"],
      "=": ["=", "≈", "≡", "≈", "▬", "═"],
      ":": [":", ";", "∴", ";", "⁝", "⁚"],
      ">": [">", "}", ")", "]", "⟩", "❯"],
      "<": ["<", "{", "(", "[", "⟨", "❮"],
    };

    const BASE_REVEAL_THRESHOLD = 2;
    const NUM_TENDRILS = 3;
    const TENDRIL_STEP_INTERVAL = 60;
    const TENDRIL_LIFE_MAX = 120;
    const CHAR_AWAKEN_FLICKER_DURATION = 80;
    const POST_REVEAL_UPDATE_INTERVAL = 150;
    const METAMORPHOSIS_CHANCE = 0.008;
    const RESPIRATION_WAVE_SPEED = 0.025;
    const RIPPLE_CHANCE = 0.015;
    const RIPPLE_DURATION = 1000;
    const LINE_STAGGER_DELAY = 80;

    let charGrid = [];
    let isFullyRevealed = false;
    let tendrils = [];
    let ripples = [];
    let originalArtLines = [];
    let artDimensions = { width: 0, height: 0 };
    let lastUpdateTime = 0;
    let respirationOffset = 0;
    let revealStartTime = 0;

    // Matrix Rain System Variables
    let rainDrops = [];
    let rainFrameCounter = 0;
    let formationProgress = 0; // 0 to 1, tracking symbol formation progress
    let isRainPhase = true; // true during rain formation, false after completion
    let columnWeights = []; // Weight map for cluster-based targeting

    const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Calculate column weights based on symbol density (cluster detection)
    function calculateColumnWeights() {
      columnWeights = [];
      if (artDimensions.width === 0) return;

      for (let x = 0; x < artDimensions.width; x++) {
        let symbolCount = 0;
        for (let y = 0; y < artDimensions.height; y++) {
          const char = originalArtLines[y]?.[x];
          if (char && char !== " ") {
            symbolCount++;
          }
        }
        // Weight = symbol density in this column (0 to 1)
        columnWeights[x] = symbolCount / artDimensions.height;
      }

      // Normalize weights so they sum to 1 (for weighted random selection)
      const totalWeight = columnWeights.reduce((sum, w) => sum + w, 0);
      if (totalWeight > 0) {
        columnWeights = columnWeights.map(w => w / totalWeight);
      }
    }

    // Weighted random column selection - prefers columns with more symbols
    function getWeightedRandomColumn() {
      const random = Math.random();
      let cumulative = 0;

      for (let x = 0; x < columnWeights.length; x++) {
        cumulative += columnWeights[x];
        if (random <= cumulative) {
          return x;
        }
      }
      // Fallback to last column
      return columnWeights.length - 1;
    }

    function initializeRainDrops() {
      rainDrops = [];
      if (artDimensions.width === 0) return;

      // Calculate column weights for cluster targeting
      calculateColumnWeights();

      const numColumns = Math.floor(artDimensions.width * RAIN_INITIAL_DENSITY);

      // Create rain drops targeting high-density columns
      for (let i = 0; i < numColumns; i++) {
        const column = getWeightedRandomColumn();

        // Add 2-3 rain drops per selected column at different heights
        const dropsPerColumn = getRandomInt(2, 3);
        for (let j = 0; j < dropsPerColumn; j++) {
          rainDrops.push({
            x: column,
            y: -getRandomInt(1 + j * 4, 6 + j * 4), // Stagger starting heights
            char: getRandomChar(MATRIX_CHARS),
            life: getRandomInt(MIN_RAIN_DROP_LIFE, MAX_RAIN_DROP_LIFE),
            trail: []
          });
        }
      }
    }

    function updateRainSystem() {
      if (!isRainPhase) return;

      rainFrameCounter++;

      // Keep rain speed constant at fast speed throughout
      const currentRainSpeed = RAIN_SPEED_FAST;

      // Only move rain drops on appropriate frames
      if (rainFrameCounter % currentRainSpeed !== 0) return;

      // Clear previous rain drop markers
      for (let y = 0; y < artDimensions.height; y++) {
        for (let x = 0; x < artDimensions.width; x++) {
          const cell = charGrid[y]?.[x];
          if (cell) {
            cell.isRainDrop = false;
            cell.rainIntensity = Math.max(0, cell.rainIntensity - 0.15); // Faster fade for snappier look
          }
        }
      }

      // Update rain drops - move faster (RAIN_DROP_STEP positions per frame)
      rainDrops = rainDrops.map(drop => {
        // Add current position to trail
        if (drop.y >= 0) {
          drop.trail.push({ x: drop.x, y: drop.y });
          if (drop.trail.length > RAIN_TRAIL_LENGTH) {
            drop.trail.shift();
          }
        }

        // Move rain drop down by RAIN_DROP_STEP (faster movement)
        // Check and reveal any cells we pass through
        for (let step = 1; step <= RAIN_DROP_STEP; step++) {
          const checkY = drop.y + step;
          if (checkY >= 0 && checkY < artDimensions.height && drop.x < artDimensions.width) {
            const cell = charGrid[checkY]?.[drop.x];
            if (cell && cell.original !== " " && !cell.revealed && Math.random() < RAIN_FORMATION_REVEAL_CHANCE) {
              cell.revealed = true;
              cell.rainRevealedByCyan = true;
              cell.display = cell.original;
            }
          }
        }

        drop.y += RAIN_DROP_STEP;
        drop.life--;

        // Change character occasionally for Matrix effect
        if (Math.random() < 0.15) {
          drop.char = getRandomChar(MATRIX_CHARS);
        }

        return drop;
      }).filter(drop => {
        // Remove rain drops that are off screen or dead
        return drop.life > 0 && drop.y < artDimensions.height + RAIN_TRAIL_LENGTH;
      });

      // Mark current rain drop positions
      for (const drop of rainDrops) {
        if (drop.y >= 0 && drop.y < artDimensions.height && drop.x < artDimensions.width) {
          const cell = charGrid[drop.y]?.[drop.x];
          if (cell) {
            cell.isRainDrop = true;
            cell.rainIntensity = 1.0;

            // Rain reveals symbols when at this position
            if (cell.original !== " " && !cell.revealed && Math.random() < RAIN_FORMATION_REVEAL_CHANCE) {
              cell.revealed = true;
              cell.rainRevealedByCyan = true;
              cell.display = cell.original;
            }
          }
        }

        // Apply trail effect
        drop.trail.forEach((pos, index) => {
          if (pos.y >= 0 && pos.y < artDimensions.height && pos.x < artDimensions.width) {
            const cell = charGrid[pos.y]?.[pos.x];
            if (cell) {
              const intensity = (drop.trail.length - index) / drop.trail.length * 0.5;
              cell.rainIntensity = Math.max(cell.rainIntensity, intensity);
            }
          }
        });
      }

      // Add new rain drops using weighted column selection (cluster targeting)
      const newDropChance = formationProgress < 0.6 ? 0.6 : 0.3; // Higher spawn rate early
      const maxDrops = artDimensions.width * RAIN_INITIAL_DENSITY * (formationProgress < 0.6 ? 3.5 : 2.0);

      if (Math.random() < newDropChance && rainDrops.length < maxDrops) {
        // Use weighted selection to target columns with more symbols
        const column = getWeightedRandomColumn();
        rainDrops.push({
          x: column,
          y: -getRandomInt(1, 3), // Start closer to top for faster entry
          char: getRandomChar(MATRIX_CHARS),
          life: getRandomInt(MIN_RAIN_DROP_LIFE, MAX_RAIN_DROP_LIFE),
          trail: []
        });
      }
    }

    function initializeArt() {
      originalArtLines = asciiArtContent.split("\n");

      while (originalArtLines.length > 0 && originalArtLines[0].trim() === "") {
        originalArtLines.shift();
      }
      while (originalArtLines.length > 0 && originalArtLines[originalArtLines.length - 1].trim() === "") {
        originalArtLines.pop();
      }

      artDimensions.height = originalArtLines.length;

      artDimensions.width = artDimensions.height > 0 ? Math.max(...originalArtLines.map(l => l.length)) : 0;
      originalArtLines = originalArtLines.map(line => line.padEnd(artDimensions.width, ' '));

      charGrid = Array(artDimensions.height).fill(null).map((_, y) =>
        Array(artDimensions.width).fill(null).map((__, x) => {
          const originalChar = originalArtLines[y]?.[x] || " ";
          return {
            original: originalChar,
            display: originalChar === " " ? " " : " ", // Start with invisible symbols during rain phase
            revealed: false,
            revealScore: 0,
            isFlickering: false,
            metaCycleIndex: 0,
            metaActive: !!METAMORPHOSIS_CYCLES[originalChar],
            lineIndex: y,
            revealTime: 0,
            // Rain system properties
            rainIntensity: 0, // 0 to 1, how much rain affects this cell
            isRainDrop: false, // true if this cell currently contains a rain drop
            rainTrail: [], // array of recent rain positions for trail effect
            rainRevealedByCyan: false, // true if revealed by rain (cyan color)
          };
        })
      );

      revealStartTime = performance.now();

      // Initialize rain drops for Matrix rain phase
      initializeRainDrops();

      renderArt();

      // Don't create tendrils initially - wait for rain phase to complete
      if (artDimensions.width > 0 && tendrils.length === 0 && !isFullyRevealed && !isRainPhase) {
        for (let i = 0; i < NUM_TENDRILS; i++) {
          tendrils.push(createTendril(i));
        }
      }
    }

    function createTendril(id) {
      const { width, height } = artDimensions;
      if (width === 0 || height === 0) return { id, x: 0, y: 0, dx: 0, dy: 0, life: 0, char: "" };

      let x, y, dx, dy;
      const side = Math.floor(Math.random() * 4);

      switch (side) {
        case 0:
          x = getRandomInt(0, width - 1);
          y = 0;
          dx = getRandomInt(-1, 1);
          dy = 1;
          break;
        case 1:
          x = width - 1;
          y = getRandomInt(0, height - 1);
          dx = -1;
          dy = getRandomInt(-1, 1);
          break;
        case 2:
          x = getRandomInt(0, width - 1);
          y = height - 1;
          dx = getRandomInt(-1, 1);
          dy = -1;
          break;
        case 3:
          x = 0;
          y = getRandomInt(0, height - 1);
          dx = 1;
          dy = getRandomInt(-1, 1);
          break;
      }

      if (dx === 0 && dy === 0) dy = 1;

      return {
        id,
        x: Math.max(0, Math.min(x, width - 1)),
        y: Math.max(0, Math.min(y, height - 1)),
        dx, dy,
        life: getRandomInt(TENDRIL_LIFE_MAX * 0.8, TENDRIL_LIFE_MAX),
        char: getRandomChar(TENDRIL_CHARS),
        trail: [],
      };
    }

    function animate(timestamp) {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (!lastUpdateTime) lastUpdateTime = timestamp;
      const deltaTime = timestamp - lastUpdateTime;

      const interval = isFullyRevealed ? POST_REVEAL_UPDATE_INTERVAL / speedMultiplier : TENDRIL_STEP_INTERVAL / speedMultiplier;
      if (deltaTime < interval) return;
      lastUpdateTime = timestamp;

      if (document.hidden) return;
      if (charGrid.length === 0 || charGrid[0].length === 0) return;

      // Update rain system if in rain phase
      if (isRainPhase) {
        updateRainSystem();
      }

      let allRevealedCheck = true;

      // Only run tendril animation after rain phase is complete
      if (!isFullyRevealed && !isRainPhase) {
        tendrils = tendrils.map(t => {
          let { x, y, dx, dy, life, char, trail } = t;
          const nextX = x + dx;
          const nextY = y + dy;
          life--;

          if (nextX < 0 || nextX >= artDimensions.width ||
            nextY < 0 || nextY >= artDimensions.height ||
            Math.random() < 0.1) {

            const angles = [0, 45, 90, 135, 180, 225, 270, 315];
            const angle = angles[Math.floor(Math.random() * angles.length)];
            const rad = (angle * Math.PI) / 180;
            dx = Math.round(Math.cos(rad));
            dy = Math.round(Math.sin(rad));

            x = Math.max(0, Math.min(x, artDimensions.width - 1));
            y = Math.max(0, Math.min(y, artDimensions.height - 1));
          } else {
            x = nextX;
            y = nextY;
          }

          trail.push({ x: x, y: y });
          if (trail.length > 2) trail.shift();

          if (y >= 0 && y < artDimensions.height && x >= 0 && x < artDimensions.width) {
            const cell = charGrid[y]?.[x];
            if (cell && cell.original !== " " && !cell.revealed) {
              const timeSinceStart = timestamp - revealStartTime;
              const lineDelay = cell.lineIndex * LINE_STAGGER_DELAY;

              if (timeSinceStart > lineDelay) {
                cell.revealScore = Math.min(cell.revealScore + 1, BASE_REVEAL_THRESHOLD + 2);
                if (!cell.isFlickering) cell.display = char;

                if (cell.revealScore >= BASE_REVEAL_THRESHOLD && !cell.isFlickering && !cell.revealed) {
                  cell.isFlickering = true;
                  cell.display = getRandomChar(AWAKENING_FLICKER_CHARS);
                  cell.revealTime = timestamp;

                  setTimeout(() => {
                    const currentCell = charGrid[y]?.[x];
                    if (currentCell) {
                      currentCell.revealed = true;
                      currentCell.display = currentCell.original;
                      currentCell.isFlickering = false;
                    }
                  }, CHAR_AWAKEN_FLICKER_DURATION);
                }
              }
            }

            trail.forEach((pos, index) => {
              const trailCell = charGrid[pos.y]?.[pos.x];
              if (trailCell && trailCell.original !== " " && !trailCell.revealed && !trailCell.isFlickering) {
                const intensity = (trail.length - index) / trail.length;
                if (Math.random() < intensity * 0.2) {
                  trailCell.display = getRandomChar(TENDRIL_CHARS);
                }
              }
            });
          }

          return { ...t, x, y, dx, dy, life, char, trail };
        }).filter(t => t.life > 0);

        while (tendrils.length < NUM_TENDRILS && artDimensions.width > 0) {
          tendrils.push(createTendril(Date.now() + Math.random()));
        }

        for (const row of charGrid) {
          for (const cell of row) {
            if (cell.original !== " " && !cell.revealed) {
              allRevealedCheck = false;
              break;
            }
          }
          if (!allRevealedCheck) break;
        }

        if (allRevealedCheck && charGrid.length > 0 && charGrid[0].length > 0) {
          isFullyRevealed = true;
          tendrils = [];
        }
      }

      // Calculate formation progress during rain phase
      if (isRainPhase) {
        let totalSymbols = 0;
        let revealedSymbols = 0;

        for (const row of charGrid) {
          for (const cell of row) {
            if (cell.original !== " ") {
              totalSymbols++;
              if (cell.revealed) {
                revealedSymbols++;
              }
            }
          }
        }

        formationProgress = totalSymbols > 0 ? revealedSymbols / totalSymbols : 0;

        // Transition from rain phase to tendril phase at 80% completion
        if (formationProgress >= RAIN_COMPLETION_THRESHOLD) {
          isRainPhase = false;
          rainDrops = []; // Clear rain drops

          // Initialize tendrils for remaining symbols
          if (artDimensions.width > 0 && tendrils.length === 0 && !isFullyRevealed) {
            for (let i = 0; i < NUM_TENDRILS; i++) {
              tendrils.push(createTendril(i));
            }
          }
        }
      } else if (!isRainPhase) {
        // Only run dynamic animations after rain phase is complete
        respirationOffset += RESPIRATION_WAVE_SPEED * speedMultiplier;

        if (Math.random() < RIPPLE_CHANCE * speedMultiplier && ripples.length < 2) {
          ripples.push({
            id: Date.now(),
            x: getRandomInt(0, artDimensions.width - 1),
            y: getRandomInt(0, artDimensions.height - 1),
            startTime: timestamp,
            maxRadius: Math.max(artDimensions.width, artDimensions.height) / 3,
            strength: Math.random() * 0.4 + 0.6,
          });
        }

        ripples = ripples.filter(r => timestamp - r.startTime < RIPPLE_DURATION);

        for (let y = 0; y < artDimensions.height; y++) {
          for (let x = 0; x < artDimensions.width; x++) {
            const cell = charGrid[y]?.[x];
            if (!cell || cell.original === " ") continue;
            let displayChar = cell.original;

            if (cell.metaActive && Math.random() < METAMORPHOSIS_CHANCE) {
              const cycle = METAMORPHOSIS_CYCLES[cell.original];
              cell.metaCycleIndex = (cell.metaCycleIndex + 1) % cycle.length;
            }
            if (cell.metaActive) {
              displayChar = METAMORPHOSIS_CYCLES[cell.original][cell.metaCycleIndex];
            }

            const respValue = Math.sin(respirationOffset + y * 0.15 + x * 0.08);
            if (respValue > 0.7) {
              const cycle = METAMORPHOSIS_CYCLES[displayChar] || METAMORPHOSIS_CYCLES[cell.original];
              if (cycle) displayChar = cycle[Math.min(1, cycle.length - 1)];
            }

            for (const ripple of ripples) {
              const dist = Math.sqrt(Math.pow(x - ripple.x, 2) + Math.pow(y - ripple.y, 2));
              const rippleProgress = (timestamp - ripple.startTime) / RIPPLE_DURATION;
              const currentRippleRadius = rippleProgress * ripple.maxRadius;
              const rippleWidth = 2.5 * ripple.strength;

              if (dist > currentRippleRadius - rippleWidth && dist < currentRippleRadius + rippleWidth) {
                const rippleIntensity = 1 - Math.abs(dist - currentRippleRadius) / rippleWidth;
                if (rippleIntensity > 0.3) {
                  const effectChars = TENDRIL_CHARS.concat(AWAKENING_FLICKER_CHARS);
                  displayChar = getRandomChar(effectChars);
                }
                break;
              }
            }

            cell.display = displayChar;
          }
        }
      }
      renderArt();
    }

    function renderArt() {
      if (containerRef.current && charGrid.length > 0) {
        // Always use textContent to preserve monospace structure
        const textContent = charGrid.map((row, y) =>
          row.map((cell, x) => {
            let char = cell.display;

            // During rain phase, only show rain drops if the cell is not revealed
            // Once revealed, keep the original character constant to prevent bobbling
            if (isRainPhase && cell.isRainDrop && !cell.revealed) {
              const rainDrop = rainDrops.find(drop => drop.x === x && drop.y === y);
              if (rainDrop) {
                char = rainDrop.char;
              }
            }

            return char;
          }).join("")
        ).join("\n");

        containerRef.current.textContent = textContent;

        // Apply CSS classes to the container based on animation state
        const preElement = containerRef.current;

        // Reset classes
        preElement.className = '';

        // Add state-based classes
        if (isRainPhase) {
          preElement.classList.add('matrix-rain-active');
        }

        if (formationProgress > 0.5) {
          preElement.classList.add('formation-progress');
        }

        if (isFullyRevealed) {
          preElement.classList.add('fully-revealed');
        }
      }
    }

    initializeArt();
    if (charGrid.length > 0 && artDimensions.width > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="ascii-avatar-container">
      <div className="ascii-container">
        <pre ref={containerRef}></pre>
      </div>
    </div>
  );
};

export default AsciiAvatar;
