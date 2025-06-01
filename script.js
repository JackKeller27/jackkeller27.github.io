// --- Global State and Navigation Functions ---
window.isSimulationPageActive = false; // Tracks if the "About Me" page (simulation page) is active

function showSection(sectionId, navElement, isMobile = false) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Desktop Nav Link Styling
  const desktopNavLinks = document.querySelectorAll('header nav.hidden.md\\:flex > a.nav-link');
  const activeTextClasses = ['text-blue-600', 'dark:text-blue-400'];
  const activeBorderClasses = ['border-blue-600', 'dark:border-blue-400'];
  const initialTextClasses = ['text-gray-700', 'dark:text-slate-400'];
  const transparentBorderClass = 'border-transparent';

  desktopNavLinks.forEach(link => {
    link.classList.remove('active', 'font-semibold', ...activeTextClasses, ...activeBorderClasses);
    link.classList.add(...initialTextClasses, transparentBorderClass);
    link.removeAttribute('aria-current');
  });

  let elementToStyleActive = null;
  if (navElement && navElement.id === 'nav-contact-anchor') {
    elementToStyleActive = document.getElementById('nav-about');
  } else if (navElement && navElement.id && navElement.id.startsWith('nav-')) {
    elementToStyleActive = navElement;
  }

  if (elementToStyleActive) {
    elementToStyleActive.classList.remove(...initialTextClasses, transparentBorderClass);
    elementToStyleActive.classList.add('active', 'font-semibold', ...activeTextClasses, ...activeBorderClasses);
    elementToStyleActive.setAttribute('aria-current', 'page');
  }

  // Mobile Nav Link Styling
  const mobileNavLinks = document.querySelectorAll('#mobile-menu .nav-link-mobile');
  const activeMobileClasses = ['bg-blue-100', 'text-blue-700', 'font-semibold'];
  const defaultMobileTextClasses = ['text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-100'];

  mobileNavLinks.forEach(link => {
    link.classList.remove(...activeMobileClasses);
    link.classList.add(...defaultMobileTextClasses);
    link.removeAttribute('aria-current');

    let linkCorrespondsToSection = false;
    if (navElement && navElement.id.startsWith('nav-')) {
      if (link.id === navElement.id.replace('nav-', 'nav-mobile-')) {
        linkCorrespondsToSection = true;
      } else if (navElement.id === 'nav-about' && sectionId === 'about' && link.id === 'nav-mobile-about') {
        linkCorrespondsToSection = true;
      }
    } else if (link.id === `nav-mobile-${sectionId}`) {
      linkCorrespondsToSection = true;
    }

    if (linkCorrespondsToSection) {
      link.classList.remove(...defaultMobileTextClasses);
      link.classList.add(...activeMobileClasses);
      link.setAttribute('aria-current', 'page');
    }
  });

  if (isMobile) {
    const mobileMenuUI = document.getElementById('mobile-menu');
    const menuButtonUI = document.getElementById('menu-button');
    if (mobileMenuUI && !mobileMenuUI.classList.contains('hidden')) {
      mobileMenuUI.classList.add('hidden');
      if (menuButtonUI) {
        menuButtonUI.setAttribute('aria-expanded', 'false');
        menuButtonUI.classList.remove('open');
      }
    }
  }

  // Control simulation based on active section
  if (sectionId === 'about') {
    window.isSimulationPageActive = true;
    if (typeof window.startSimulation === 'function') {
      window.startSimulation();
    }
  } else {
    window.isSimulationPageActive = false;
    if (typeof window.stopSimulationAndClearCanvas === 'function') {
      window.stopSimulationAndClearCanvas();
    }
  }
}

function navigateToContactInfo(clickedNavElement, isMobile = false) {
  const aboutNavElement = document.getElementById('nav-about');
  showSection('about', aboutNavElement, isMobile);

  const contactInfoHeading = document.getElementById('contact-info-heading');
  if (contactInfoHeading) {
    setTimeout(() => {
      contactInfoHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// --- Single DOMContentLoaded Listener for all setup ---
document.addEventListener('DOMContentLoaded', () => {
  // General UI Setup
  const menuButtonElem = document.getElementById('menu-button');
  const mobileMenuElem = document.getElementById('mobile-menu');
  if (menuButtonElem && mobileMenuElem) {
    menuButtonElem.addEventListener('click', () => {
      const isExpanded = menuButtonElem.getAttribute('aria-expanded') === 'true' || false;
      menuButtonElem.setAttribute('aria-expanded', !isExpanded);
      mobileMenuElem.classList.toggle('hidden');
      menuButtonElem.classList.toggle('open');
    });
  }

  const currentYearElem = document.getElementById('currentYear');
  if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
  }

  // ========= WOLF-SHEEP-GRASS PREDATOR-PREY SIMULATION (CONDITIONAL FULL BACKGROUND) ========= //
  const canvas = document.getElementById('ecosystemCanvas');
  if (!canvas) {
    console.error("Ecosystem canvas not found! Simulation will not run.");
  }

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let simulationIsCurrentlyRunning = true;
    let simulationStepCounter = 0; // For alternating turns

    let params = {
      initialSheep: 80,
      initialWolves: 50,
      sheepReproduceRate: 0.05,
      wolfReproduceRate: 0.03,
      wolfEnergyFromSheep: 20,
      wolfEnergyLossPerTick: 0.5, // Applied on wolf's turn
      maxWolfEnergy: 100,
      wolfReproduceMinEnergy: 60,
      sheepMaxEnergy: 30,
      sheepEnergyFromGrass: 6,
      sheepEnergyLossPerTick: 0.3, // Applied on sheep's turn
      sheepReproduceMinEnergy: 20,
      grassRegrowthTicks: 25, // Ticks for grass to regrow (e.g. 25 * 750ms / 1000s = ~18s)
      gridCellSize: 12,
      simulationTickMs: 750,
    };

    let gridWidth, gridHeight;
    let agents = [];
    let isActiveCellGrid;
    let grassGrid;
    let simulationLogicTimer; // Renamed for clarity, for setInterval of updateSimulationStep
    let animationFrameId;

    const sliders = {
      initialSheep: document.getElementById('initialSheep'),
      initialWolves: document.getElementById('initialWolves'),
    };
    const valueSpans = {
      initialSheep: document.getElementById('initialSheepValue'),
      initialWolves: document.getElementById('initialWolvesValue'),
    };
    const restartButton = document.getElementById('restartSimulation');
    const pauseResumeButton = document.getElementById('stopSimulation'); // Renamed for clarity

    function updateSliderValuesFromParams() {
      if (sliders.initialSheep && valueSpans.initialSheep) {
        sliders.initialSheep.value = params.initialSheep;
        valueSpans.initialSheep.textContent = params.initialSheep;
      }
      if (sliders.initialWolves && valueSpans.initialWolves) {
        sliders.initialWolves.value = params.initialWolves;
        valueSpans.initialWolves.textContent = params.initialWolves;
      }
    }

    function setupSliderListeners() {
      if (sliders.initialSheep) {
        sliders.initialSheep.addEventListener('input', (e) => {
          params.initialSheep = parseFloat(e.target.value);
          if (valueSpans.initialSheep) valueSpans.initialSheep.textContent = params.initialSheep;
        });
      }
      if (sliders.initialWolves) {
        sliders.initialWolves.addEventListener('input', (e) => {
          params.initialWolves = parseFloat(e.target.value);
          if (valueSpans.initialWolves) valueSpans.initialWolves.textContent = params.initialWolves;
        });
      }

      if (restartButton) {
        restartButton.addEventListener('click', () => {
          if (typeof window.startSimulation === 'function') {
            window.startSimulation();
          }
        });
      }
      if (pauseResumeButton) {
        pauseResumeButton.addEventListener('click', () => {
          if (!window.isSimulationPageActive) return;

          simulationIsCurrentlyRunning = !simulationIsCurrentlyRunning;
          if (simulationIsCurrentlyRunning) {
            if (simulationLogicTimer) clearInterval(simulationLogicTimer);
            simulationLogicTimer = setInterval(updateSimulationStep, params.simulationTickMs);
            // User will manage button text in HTML/CSS
          } else {
            if (simulationLogicTimer) clearInterval(simulationLogicTimer);
            // User will manage button text in HTML/CSS
          }
        });
      }
    }

    function initializeGridAndGrass() {
      isActiveCellGrid = Array(gridWidth).fill(null).map(() => Array(gridHeight).fill(true));
      grassGrid = Array(gridWidth).fill(null).map(() =>
        Array(gridHeight).fill(null).map(() => ({ hasGrass: true, regrowthTimer: 0 }))
      );
    }

    function spawnAgent(AgentType) {
      let x = Math.floor(Math.random() * gridWidth);
      let y = Math.floor(Math.random() * gridHeight);
      return new AgentType(x, y);
    }

    class Agent {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = Math.random().toString(36).substring(2, 11);
      }

      _findValidMoveSpot(preferredCondition = (nx, ny) => true) {
        const currentX = this.x;
        const currentY = this.y;
        let bestSpot = { x: currentX, y: currentY, preferred: false };
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
        for (let i = directions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        directions.unshift([0, 0]);

        for (const [dx, dy] of directions) {
          const nextX = (currentX + dx + gridWidth) % gridWidth;
          const nextY = (currentY + dy + gridHeight) % gridHeight;
          if (preferredCondition(nextX, nextY)) { return { x: nextX, y: nextY }; }
          if (dx !== 0 || dy !== 0) {
            if (!bestSpot.preferred) { bestSpot = { x: nextX, y: nextY, preferred: false }; }
          }
        }
        if (preferredCondition(currentX, currentY) && (bestSpot.x === currentX && bestSpot.y === currentY)) {
          return { x: currentX, y: currentY };
        }
        return bestSpot;
      }
    }
    class Sheep extends Agent {
      constructor(x, y) {
        super(x, y);
        this.type = 'sheep';
        this.color = '#A0AEC0';
        this.energy = params.sheepMaxEnergy / 1.5 + Math.random() * (params.sheepMaxEnergy / 3);
      }

      moveAndEat() {
        const preferredCellCondition = (nx, ny) => grassGrid[nx][ny].hasGrass;
        const nextPos = this._findValidMoveSpot(preferredCellCondition);
        this.x = nextPos.x; this.y = nextPos.y;

        if (grassGrid && grassGrid[this.x] && grassGrid[this.x][this.y] && grassGrid[this.x][this.y].hasGrass) {
          grassGrid[this.x][this.y].hasGrass = false;
          grassGrid[this.x][this.y].regrowthTimer = 0;
          this.energy += params.sheepEnergyFromGrass;
          if (this.energy > params.sheepMaxEnergy) this.energy = params.sheepMaxEnergy;
        }
      }

      update() { // This is the sheep's action for its turn
        this.moveAndEat();
        this.energy -= params.sheepEnergyLossPerTick;
        if (this.energy <= 0) {
          agents = agents.filter(agent => agent.id !== this.id); return;
        }
        if (this.energy >= params.sheepReproduceMinEnergy && Math.random() < params.sheepReproduceRate) {
          this.energy *= 0.5;
          const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1], [0, 0]];
          for (let i = directions.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[directions[i], directions[j]] = [directions[j], directions[i]]; }
          for (const [dx, dy] of directions) {
            const nx = (this.x + dx + gridWidth) % gridWidth;
            const ny = (this.y + dy + gridHeight) % gridHeight;
            agents.push(new Sheep(nx, ny)); return;
          }
        }
      }
    }
    class Wolf extends Agent {
      constructor(x, y) {
        super(x, y);
        this.type = 'wolf';
        this.color = '#E53E3E';
        this.energy = params.maxWolfEnergy / 1.5 + Math.random() * (params.maxWolfEnergy / 3);
      }

      // New method for wolves to hunt adjacent sheep
      huntAdjacentSheep() {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]; // 8 directions
        for (let i = directions.length - 1; i > 0; i--) { // Shuffle for randomness if multiple sheep
          const j = Math.floor(Math.random() * (i + 1));
          [directions[i], directions[j]] = [directions[j], directions[i]];
        }

        for (const [dx, dy] of directions) {
          const checkX = (this.x + dx + gridWidth) % gridWidth;
          const checkY = (this.y + dy + gridHeight) % gridHeight;

          const sheepInCell = agents.find(agent =>
            agent.type === 'sheep' && agent.x === checkX && agent.y === checkY
          );

          if (sheepInCell) {
            this.x = checkX; // Move to sheep's cell
            this.y = checkY;
            agents = agents.filter(agent => agent.id !== sheepInCell.id); // Eat sheep
            this.energy += params.wolfEnergyFromSheep;
            if (this.energy > params.maxWolfEnergy) this.energy = params.maxWolfEnergy;
            return true; // Hunt successful
          }
        }
        return false; // No adjacent sheep found
      }

      randomMove() { // Renamed original move for clarity
        const nextPos = this._findValidMoveSpot();
        this.x = nextPos.x; this.y = nextPos.y;
      }

      update() { // This is the wolf's action for its turn
        let hunted = this.huntAdjacentSheep(); // Try to hunt first
        if (!hunted) {
          this.randomMove(); // If no hunt, then move randomly
        }

        this.energy -= params.wolfEnergyLossPerTick;

        if (this.energy >= params.wolfReproduceMinEnergy && Math.random() < params.wolfReproduceRate) {
          this.energy *= 0.6;
          const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1], [0, 0]];
          for (let i = directions.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[directions[i], directions[j]] = [directions[j], directions[i]]; }
          for (const [dx, dy] of directions) {
            const nx = (this.x + dx + gridWidth) % gridWidth;
            const ny = (this.y + dy + gridHeight) % gridHeight;
            agents.push(new Wolf(nx, ny)); break;
          }
        }
        if (this.energy <= 0) agents = agents.filter(a => a.id !== this.id);
      }
    }

    window.setupSimulation = function () {
      if (!window.isSimulationPageActive) {
        if (typeof window.stopSimulationAndClearCanvas === 'function') window.stopSimulationAndClearCanvas();
        return;
      }

      simulationIsCurrentlyRunning = true;
      simulationStepCounter = 0; // Reset step counter

      if (simulationLogicTimer) clearInterval(simulationLogicTimer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = null;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gridWidth = Math.floor(canvas.width / params.gridCellSize);
      gridHeight = Math.floor(canvas.height / params.gridCellSize);

      initializeGridAndGrass();

      agents = [];
      for (let i = 0; i < params.initialSheep; i++) {
        const sheep = spawnAgent(Sheep);
        if (sheep) agents.push(sheep);
      }
      for (let i = 0; i < params.initialWolves; i++) {
        const wolf = spawnAgent(Wolf);
        if (wolf) agents.push(wolf);
      }

      simulationLogicTimer = setInterval(updateSimulationStep, params.simulationTickMs);
      animateCanvas();
    }

    window.startSimulation = function () {
      window.isSimulationPageActive = true;
      simulationIsCurrentlyRunning = true;
      canvas.style.display = 'block';
      window.setupSimulation();
    };

    window.stopSimulationAndClearCanvas = function () {
      simulationIsCurrentlyRunning = false;
      if (simulationLogicTimer) clearInterval(simulationLogicTimer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      agents = [];

      if (canvas && ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    function updateSimulationStep() {
      if (!window.isSimulationPageActive || !simulationIsCurrentlyRunning) return;

      simulationStepCounter++; // Increment step counter

      // Grass regrowth happens every tick
      if (grassGrid && isActiveCellGrid) {
        for (let x = 0; x < gridWidth; x++) {
          for (let y = 0; y < gridHeight; y++) {
            if (isActiveCellGrid[x] && isActiveCellGrid[x][y] &&
              grassGrid[x] && grassGrid[x][y] && !grassGrid[x][y].hasGrass) {
              grassGrid[x][y].regrowthTimer++;
              if (grassGrid[x][y].regrowthTimer >= params.grassRegrowthTicks) {
                grassGrid[x][y].hasGrass = true;
                grassGrid[x][y].regrowthTimer = 0;
              }
            }
          }
        }
      }

      const currentAgents = [...agents];
      currentAgents.forEach(agent => {
        if (!agents.find(a => a.id === agent.id)) return; // Agent might have died

        // Sheep act on even steps, Wolves on odd steps
        if (agent.type === 'sheep' && simulationStepCounter % 2 === 0) {
          agent.update();
        } else if (agent.type === 'wolf' && simulationStepCounter % 2 !== 0) {
          agent.update();
        }
      });
    }

    function animateCanvas() {
      if (!window.isSimulationPageActive) {
        if (ctx && canvas) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grassColor = '#68D391';
      const bareColor = '#D2B48C';

      if (isActiveCellGrid && grassGrid) {
        for (let x = 0; x < gridWidth; x++) {
          for (let y = 0; y < gridHeight; y++) {
            if (grassGrid[x] && grassGrid[x][y]) {
              ctx.fillStyle = grassGrid[x][y].hasGrass ? grassColor : bareColor;
              ctx.fillRect(x * params.gridCellSize, y * params.gridCellSize, params.gridCellSize, params.gridCellSize);
            }
          }
        }
      }

      agents.forEach(agent => {
        ctx.fillStyle = agent.color;
        const drawSize = params.gridCellSize * 0.7;
        const offset = (params.gridCellSize - drawSize) / 2;
        ctx.fillRect(
          agent.x * params.gridCellSize + offset,
          agent.y * params.gridCellSize + offset,
          drawSize,
          drawSize
        );
      });
      animationFrameId = requestAnimationFrame(animateCanvas);
    }

    updateSliderValuesFromParams();
    setupSliderListeners();

    window.addEventListener('resize', () => {
      if (window.isSimulationPageActive && typeof window.startSimulation === 'function') {
        window.startSimulation();
      } else if (typeof window.stopSimulationAndClearCanvas === 'function') {
        window.stopSimulationAndClearCanvas();
      }
    });

  }

  window.scrollTo(0, 0);
  const initialNavElement = document.getElementById('nav-about');
  const activeSection = document.querySelector('.content-section.active');
  let initialSectionId = 'about';
  if (activeSection) {
    initialSectionId = activeSection.id;
  }
  showSection(initialSectionId, document.getElementById(`nav-${initialSectionId}`) || initialNavElement);

});

window.addEventListener('load', function () {
  window.scrollTo(0, 0);
});
