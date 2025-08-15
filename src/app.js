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

// Load remaining content dynamically
function loadRemainingContent() {
    console.log('Loading remaining content...');
    const mainContent = document.getElementById('main-content');
    const footer = document.getElementById('site-footer');

    console.log('Main content element:', mainContent);
    console.log('Footer element:', footer);

    if (mainContent) {
        // Clear any existing content first
        mainContent.innerHTML = '';

        // Add content with proper structure
        const showcaseSection = document.createElement('section');
        showcaseSection.id = 'showcase';
        showcaseSection.innerHTML = `
            <h2 class="section-title-container">
                <svg class="lucide-icon" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                Featured Work
            </h2>
            <div class="project-grid">
                <div class="project-card">
                    <h3 class="project-title">BRIO Health AI</h3>
                    <span class="project-company">Suryavanshi Ventures</span>
                    <p class="project-description">
                        Led backend development for an AI-powered medical search engine, engineering a Retrieval Augmented Generation (RAG) system with
                        LangGraph agents to enhance information access for healthcare professionals.
                    </p>
                    <div class="tech-stack">
                        <span class="tech-tag">LangGraph</span> <span class="tech-tag">RAG</span> <span class="tech-tag">Python</span>
                        <span class="tech-tag">FastAPI</span> <span class="tech-tag">Redis</span> <span class="tech-tag">Poetry</span>
                    </div>
                </div>
                <div class="project-card">
                    <h3 class="project-title">Monefy - Expense Manager</h3>
                    <span class="project-company">Personal Project</span>
                    <p class="project-description">
                        Developed a secure, self-hosted expense management application prioritizing user data privacy. Built solo using modern full-stack
                        technologies with containerized deployment for seamless scaling and maintenance.
                    </p>
                    <div class="tech-stack">
                        <span class="tech-tag">React</span> <span class="tech-tag">Next.js</span> <span class="tech-tag">Node.js</span>
                        <span class="tech-tag">PostgreSQL</span> <span class="tech-tag">Docker</span> <span class="tech-tag">Vercel</span>
                    </div>
                </div>
                <div class="project-card">
                    <h3 class="project-title">Soundrex - Music Player</h3>
                    <span class="project-company">Personal Project</span>
                    <p class="project-description">
                        Created a full-stack YouTube Music frontend with integrated downloader service. Features responsive design with Material UI,
                        Node.js backend for audio streaming, and MongoDB for metadata management.
                    </p>
                    <div class="tech-stack">
                        <span class="tech-tag">React</span> <span class="tech-tag">Material UI</span> <span class="tech-tag">Node.js</span>
                        <span class="tech-tag">MongoDB</span> <span class="tech-tag">YouTube API</span> <span class="tech-tag">Express</span>
                    </div>
                    <div class="project-links">
                        <a href="https://soundrex.vercel.app" target="_blank" rel="noopener noreferrer" class="project-link">Live Demo</a>
                    </div>
                </div>
            </div>
        `;

        const connectSection = document.createElement('section');
        connectSection.id = 'connect';
        connectSection.innerHTML = `
            <h2 class="section-title-container">
                 <svg class="lucide-icon" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                Connect & Skills
            </h2>
            <div class="connect-skills-grid">
                <div class="skills-column">
                    <h3 class="column-title">Core Skills</h3>
                    <ul class="skills-list">
                        <li><span class="skill-bullet">•</span> JavaScript, TypeScript, Go, Python</li>
                        <li><span class="skill-bullet">•</span> React.js, Next.js, Node.js</li>
                        <li><span class="skill-bullet">•</span> PostgreSQL, MongoDB, REST APIs</li>
                        <li><span class="skill-bullet">•</span> HTML5, CSS3, Tailwind CSS</li>
                        <li><span class="skill-bullet">•</span> Docker, Git, CI/CD</li>
                        <li><span class="skill-bullet">•</span> AI/ML Integration</li>
                    </ul>
                </div>
                <div class="education-column">
                    <h3 class="column-title">Education</h3>
                    <div class="education-item" style="margin-bottom: 1rem;">
                        <p class="education-degree">MCA - Master of Computer Applications</p>
                        <p class="education-institution">Rajiv Gandhi Proudyogiki Vishwavidyalaya (Pursuing)</p>
                    </div>
                    <div class="education-item">
                        <p class="education-degree">BCA - Bachelor of Computer Applications</p>
                        <p class="education-institution">Makhanlal Chaturvedi National University</p>
                    </div>
                </div>
                <div class="contact-column">
                    <h3 class="column-title">Get in Touch</h3>
                    <p class="contact-text">
                        Open to new projects and collaborations. Let's build something great together.
                    </p>
                    <p>
                        <a href="mailto:me@sahilchouksey.in" class="contact-email">me@sahilchouksey.in</a>
                    </p>
                    <div class="contact-social-icons">
                        <a href="https://github.com/sahilchouksey" target="_blank" rel="noopener noreferrer">
                            <svg class="lucide-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                        </a>
                        <a href="https://linkedin.com/in/sahilchouksey" target="_blank" rel="noopener noreferrer">
                            <svg class="lucide-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        `;

        mainContent.appendChild(showcaseSection);
        mainContent.appendChild(connectSection);
        mainContent.className = 'main-content';

        // Show the sections after they're loaded
        showcaseSection.style.display = 'block';
        connectSection.style.display = 'block';

        console.log('Content loaded successfully, sections count:', mainContent.children.length);
    } else {
        console.error('Main content element not found!');
    }

    if (footer) {
        footer.innerHTML = `
            <div class="footer-content">
                <p class="footer-text">&copy; <span id="currentYear"></span> Sahil Chouksey. System Online.</p>
            </div>
        `;
        footer.className = 'site-footer';
        console.log('Footer loaded successfully');
    } else {
        console.error('Footer element not found!');
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
    }, 500);    console.log('Background effects added');
    console.log('loadRemainingContent function completed');
}

// Portfolio specific functionality
function initializePortfolio() {
    // Load content and make sections visible
    function ensureContentLoaded() {
        const mainContent = document.getElementById('main-content');
        const showcaseSection = document.getElementById('showcase');
        const connectSection = document.getElementById('connect');

        // Check if sections exist but are hidden or have placeholder content
        const needsLoad = !showcaseSection || !connectSection ||
                         showcaseSection.innerHTML.includes('Loading...') ||
                         connectSection.innerHTML.includes('Loading...');

        if (needsLoad) {
            console.log('Content not loaded, loading now...');
            loadRemainingContent();
            return true;
        } else {
            // Ensure sections are visible
            if (showcaseSection) showcaseSection.style.display = 'block';
            if (connectSection) connectSection.style.display = 'block';
            return false;
        }
    }

    // Try to load content, with fallback
    const loaded = ensureContentLoaded();
    if (loaded) {
        setTimeout(ensureContentLoaded, 250);
    }
}

// Initialize when DOM is ready OR immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
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

    // Particle generation
    const particleContainer = document.getElementById('particle-container');
    if (particleContainer) {
        const numParticles = 20; // Reduced from 40
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
}, 100);
