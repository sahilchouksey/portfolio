// ASCII Art Animation and Portfolio JavaScript
const asciiArtContent = `
               .
              .=.    .
       ..     :+-    :-
      .=.     -+=.   :+:
      -+:    .=++:   :+=:
     :++:    :+++=.  :++=.
    .=++:   .=++++:  :+++=.
    -+++-   .=++++:  :++++-
   .=+++-   .-+++=.  .+++=.
    -+++-    -+++-.  .=++:
    .-++-    :+++:   .=+=.
     .=+=.   .=+=.   .==.
      :==.   .=+-    .=:
       :=.   .-+:     :
        .     -=.
              ::
`;const animatedAsciiArtContainer = document.getElementById('animatedAsciiArtContainer');
if (animatedAsciiArtContainer) {
    const NOISE_CHARS = [".", "`", "'", " ", "~", ","];
    const TENDRIL_CHARS = ["*", "+", "o", "·", "❖", "◊", "◈", "⧫"];
    const AWAKENING_FLICKER_CHARS = ["%", "&", "#", "?", "!", "▓", "▒", "█", "░", "▐"];
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
    const NUM_TENDRILS = 4; // Reduced from 8
    const TENDRIL_STEP_INTERVAL = 50; // Increased from 35
    const TENDRIL_LIFE_MAX = 150; // Reduced from 200
    const CHAR_AWAKEN_FLICKER_DURATION = 80; // Reduced from 120
    const POST_REVEAL_UPDATE_INTERVAL = 120; // Increased from 80
    const METAMORPHOSIS_CHANCE = 0.008; // Reduced from 0.012
    const RESPIRATION_WAVE_SPEED = 0.025; // Reduced from 0.038
    const RIPPLE_CHANCE = 0.02; // Reduced from 0.035
    const RIPPLE_DURATION = 1000; // Reduced from 1500
    const LINE_STAGGER_DELAY = 100; // Reduced from 150

    let charGrid = [];
    let isFullyRevealed = false;
    let tendrils = [];
    let ripples = [];
    let originalArtLines = [];
    let artDimensions = { width: 0, height: 0 };
    let animationFrameId;
    let lastUpdateTime = 0;
    let respirationOffset = 0;
    let revealStartTime = 0;

    const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    function initializeArt() {
        originalArtLines = asciiArtContent.trim().split("\n");

        // Remove leading and trailing empty lines
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
                    display: originalChar === " " ? " " : getRandomChar(NOISE_CHARS),
                    revealed: false,
                    revealScore: 0,
                    isFlickering: false,
                    metaCycleIndex: 0,
                    metaActive: !!METAMORPHOSIS_CYCLES[originalChar],
                    lineIndex: y,
                    revealTime: 0,
                };
            })
        );

        revealStartTime = performance.now();
        renderArt();

        if (artDimensions.width > 0 && tendrils.length === 0 && !isFullyRevealed) {
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

        switch(side) {
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
        animationFrameId = requestAnimationFrame(animate);
        if (!lastUpdateTime) lastUpdateTime = timestamp;
        const deltaTime = timestamp - lastUpdateTime;

        const interval = isFullyRevealed ? POST_REVEAL_UPDATE_INTERVAL : TENDRIL_STEP_INTERVAL;
        if (deltaTime < interval) return;
        lastUpdateTime = timestamp;

        // Throttle animation when page is not visible
        if (document.hidden) return;

        if (charGrid.length === 0 || charGrid[0].length === 0) return;

        let allRevealedCheck = true;

        if (!isFullyRevealed) {
            tendrils = tendrils.map(t => {
                let { x, y, dx, dy, life, char, trail } = t;
                const nextX = x + dx;
                const nextY = y + dy;
                life--;

                if (nextX < 0 || nextX >= artDimensions.width ||
                    nextY < 0 || nextY >= artDimensions.height ||
                    Math.random() < 0.12) {

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
                if (trail.length > 3) trail.shift();

                if (y >= 0 && y < artDimensions.height && x >= 0 && x < artDimensions.width) {
                    const cell = charGrid[y]?.[x];
                    if (cell && cell.original !== " " && !cell.revealed) {
                        const timeSinceStart = timestamp - revealStartTime;
                        const lineDelay = cell.lineIndex * LINE_STAGGER_DELAY;

                        if (timeSinceStart > lineDelay) {
                            cell.revealScore = Math.min(cell.revealScore + 1, BASE_REVEAL_THRESHOLD + 3);
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
                            if (Math.random() < intensity * 0.3) {
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
        } else {
            respirationOffset += RESPIRATION_WAVE_SPEED;

            if (Math.random() < RIPPLE_CHANCE && ripples.length < 3) {
                ripples.push({
                    id: Date.now(),
                    x: getRandomInt(0, artDimensions.width - 1),
                    y: getRandomInt(0, artDimensions.height - 1),
                    startTime: timestamp,
                    maxRadius: Math.max(artDimensions.width, artDimensions.height) / (Math.random() * 1.5 + 2),
                    strength: Math.random() * 0.5 + 0.7,
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

                    const respValue = Math.sin(respirationOffset + y * 0.18 + x * 0.08);
                    if (respValue > 0.75) {
                        const cycle = METAMORPHOSIS_CYCLES[displayChar] || METAMORPHOSIS_CYCLES[cell.original];
                        if (cycle) displayChar = cycle[Math.min(1, cycle.length - 1)];
                    }

                    for (const ripple of ripples) {
                        const dist = Math.sqrt(Math.pow(x - ripple.x, 2) + Math.pow(y - ripple.y, 2));
                        const rippleProgress = (timestamp - ripple.startTime) / RIPPLE_DURATION;
                        const currentRippleRadius = rippleProgress * ripple.maxRadius;
                        const rippleWidth = 2.8 * ripple.strength;

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
        if (animatedAsciiArtContainer && charGrid.length > 0) {
            const rendered = charGrid.map(row =>
                row.map(cell => cell.display).join("")
            ).join("\n");
            animatedAsciiArtContainer.textContent = rendered;
        }
    }

    initializeArt();

    // IMMEDIATE FIX: Force correct positioning of first character
    if (charGrid.length > 0 && charGrid[0] && charGrid[0].length > 15) {
        // Move the dot from position 0 to position 15 (centered)
        if (charGrid[0][0] && charGrid[0][0].original === '.') {
            charGrid[0][0].original = ' ';
            charGrid[0][0].display = ' ';
        }
        // Clear position 26 if it exists
        if (charGrid[0][26]) {
            charGrid[0][26].original = ' ';
            charGrid[0][26].display = ' ';
        }
        // Set the correct centered position
        charGrid[0][15] = {
            original: '.',
            display: '.',
            revealed: true,
            revealScore: 0,
            isFlickering: false,
            metaCycleIndex: 0,
            metaActive: true,
            lineIndex: 0,
            revealTime: 0,
        };
        // Force immediate render
        renderArt();
    }

    if (charGrid.length > 0 && artDimensions.width > 0) {
        animationFrameId = requestAnimationFrame(animate);
    }
}

// Set current year
setTimeout(() => {
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear().toString();
    }

    // Active nav scrolling
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('section[id]');

    function changeNavActiveState() {
        let currentSectionId = 'hero';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSectionId = section.id;
            }
        });

        if (window.scrollY < sections[0].offsetTop - 80) {
             currentSectionId = 'hero';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    if (sections.length > 0 && navLinks.length > 0) {
        changeNavActiveState();
        window.addEventListener('scroll', changeNavActiveState);
    }

    // Add background effects with delay to improve initial load
    setTimeout(() => {
        const bgOverlay = document.createElement('div');
        bgOverlay.className = 'fixed-background-overlay';
        bgOverlay.innerHTML = '<div class="bg-grid-pattern-container"><div class="bg-grid-pattern"></div></div>';
        document.body.insertBefore(bgOverlay, document.body.firstChild);

        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-effects-container';
        particleContainer.id = 'particle-container';
        document.body.insertBefore(particleContainer, document.body.firstChild);

        // Particle generation
        if (particleContainer) {
            const numParticles = 20;
            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const size = Math.random() * 2.5 + 1;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDuration = `${Math.random() * 25 + 20}s`;
                particle.style.animationDelay = `${Math.random() * -20}s`;
                particleContainer.appendChild(particle);
            }
        }
    }, 500);
}, 100);
