function showSection(sectionId, navElement, isMobile = false) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Scroll to top when a new section is shown
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const desktopNavLinks = document.querySelectorAll('header nav.hidden.md\\:flex > a.nav-link');
  // Define Tailwind classes for active state (blue text and border)
  const activeTextClasses = ['text-blue-600', 'dark:text-blue-400'];
  const activeBorderClasses = ['border-blue-600', 'dark:border-blue-400'];
  // Define initial/default text classes (gray text, from your HTML)
  const initialTextClasses = ['text-gray-700', 'dark:text-slate-400'];
  const transparentBorderClass = 'border-transparent';

  desktopNavLinks.forEach(link => {
    link.classList.remove('active', 'font-semibold');
    // Remove active (blue) classes
    link.classList.remove(...activeTextClasses);
    link.classList.remove(...activeBorderClasses);
    // Add back initial/default (gray) text classes and transparent border
    link.classList.add(...initialTextClasses);
    link.classList.add(transparentBorderClass);
    link.removeAttribute('aria-current');
  });

  let elementToStyleActive = null;
  // Special handling for 'Contact' link to keep 'About Me' highlighted
  if (navElement && navElement.id === 'nav-contact-anchor') {
    elementToStyleActive = document.getElementById('nav-about');
  } else if (navElement && navElement.id && navElement.id.startsWith('nav-')) {
    elementToStyleActive = navElement;
  }

  if (elementToStyleActive) {
    // Remove initial/default (gray) text classes and transparent border
    elementToStyleActive.classList.remove(...initialTextClasses);
    elementToStyleActive.classList.remove(transparentBorderClass);
    // Add active state classes (blue text, blue border, bold font)
    elementToStyleActive.classList.add('active', 'font-semibold');
    elementToStyleActive.classList.add(...activeTextClasses);
    elementToStyleActive.classList.add(...activeBorderClasses);
    elementToStyleActive.setAttribute('aria-current', 'page');
  }

  const mobileNavLinks = document.querySelectorAll('#mobile-menu .nav-link-mobile');
  // Active mobile classes for light theme
  const activeMobileClasses = ['bg-blue-100', 'text-blue-700', 'font-semibold'];
  // Default mobile text classes for light theme (matching the updated HTML)
  const defaultMobileTextClasses = ['text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-100'];

  mobileNavLinks.forEach(link => {
    link.classList.remove(...activeMobileClasses);
    // Ensure default classes are there if not active
    link.classList.add(...defaultMobileTextClasses);
    link.removeAttribute('aria-current');


    let linkCorrespondsToSection = false;
    // Determine if this mobile link corresponds to the section being shown or the navElement being activated
    if (navElement && navElement.id.startsWith('nav-')) {
      // For direct section links (About, Experience, Projects)
      if (link.id === navElement.id.replace('nav-', 'nav-mobile-')) {
        linkCorrespondsToSection = true;
      }
      // For the 'Contact' link, 'nav-about' is passed as navElement, so 'nav-mobile-about' should be active
      else if (navElement.id === 'nav-about' && sectionId === 'about' && link.id === 'nav-mobile-about') {
        linkCorrespondsToSection = true;
      }
    } else if (link.id === `nav-mobile-${sectionId}`) { // Fallback if navElement is not a standard nav link
      linkCorrespondsToSection = true;
    }


    if (linkCorrespondsToSection) {
      link.classList.remove(...defaultMobileTextClasses); // remove default before adding active
      link.classList.add(...activeMobileClasses);
      link.setAttribute('aria-current', 'page');
    }
  });

  if (isMobile) {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('menu-button');
    // Check if mobileMenu exists before trying to access its classList
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.classList.remove('open'); // For hamburger icon animation, if implemented
    }
  }
}

function navigateToContactInfo(clickedNavElement, isMobile = false) {
  const aboutNavElement = document.getElementById('nav-about'); // Contact link activates 'About' section and 'About Me' nav link
  showSection('about', aboutNavElement, isMobile);

  // After 'about' section is shown (and potentially mobile menu closed), scroll to contact info
  const contactInfoHeading = document.getElementById('contact-info-heading');
  if (contactInfoHeading) {
    setTimeout(() => { // Timeout to ensure DOM updates and smooth scroll works reliably
      contactInfoHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100); // Small delay
  }
}

const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu'); // This will now find the element

menuButton.addEventListener('click', () => {
  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
  menuButton.setAttribute('aria-expanded', !isExpanded);
  if (mobileMenu) { // Check if mobileMenu element exists
    mobileMenu.classList.toggle('hidden');
  }
  menuButton.classList.toggle('open'); // For hamburger icon animation
});

// Get current year for copyright in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Set initial state on page load
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0); // scroll to top on initial load
  // Show 'about' section and highlight 'About Me' nav link by default
  const initialNavElement = document.getElementById('nav-about');
  if (initialNavElement) {
    showSection('about', initialNavElement);
  }
});

// Fallback scroll to top on load, though DOMContentLoaded should usually suffice
window.addEventListener('load', function () {
  window.scrollTo(0, 0);
});


// // ========= WOLF-SHEEP-GRASS PREDATOR-PREY SIMULATION (Displays in background) ========= //

// document.addEventListener('DOMContentLoaded', () => {
//     const canvas = document.getElementById('ecosystemCanvas');
//     if (!canvas) {
//         console.error("Ecosystem canvas not found!");
//         return;
//     }
//     const ctx = canvas.getContext('2d');

//     // --- Simulation Parameters (with default values) ---
//     let params = {
//         initialSheep: 50,
//         initialWolves: 20,
//         sheepReproduceRate: 0.03,    // Lowered, as energy is now a factor
//         wolfReproduceRate: 0.03,
//         wolfEnergyFromSheep: 25,   // Slightly increased
//         wolfEnergyLossPerTick: 0.4, // Slightly decreased
//         maxWolfEnergy: 100,
//         wolfReproduceMinEnergy: 60,
        
//         // New Sheep & Grass Params
//         sheepMaxEnergy: 30,
//         sheepEnergyFromGrass: 6,
//         sheepEnergyLossPerTick: 0.3, // Energy loss for sheep by moving/existing
//         sheepReproduceMinEnergy: 20,
//         grassRegrowthTicks: 25,      // How many ticks for grass to regrow (25 * 0.75s = ~18s)

//         gridCellSize: 12,
//         simulationTickMs: 750,
//     };

//     let gridWidth, gridHeight;
//     let agents = [];
//     let isActiveCell; 
//     let grassGrid; // To store { hasGrass: boolean, regrowthTimer: int }
//     let simulationTimer;
//     let animationFrameId;

//     // --- UI Elements ---
//     // (Slider setup code remains the same as your previous version)
//     const sliders = { /* ... your slider elements ... */ };
//     const valueSpans = { /* ... your value span elements ... */ };
//     const restartButton = document.getElementById('restartSimulation');
//     // Ensure your slider setup functions (updateSliderValuesFromParams, setupSliderListeners)
//     // correctly map to the params object if you add new sliders later.
//     // For now, new params (sheep energy, grass) are not on sliders.

//     function updateSliderValuesFromParams() {
//         for (const key in sliders) {
//             if (sliders[key]) {
//                 let paramKey = key;
//                 if (key === "wolfEnergyGain") paramKey = "wolfEnergyFromSheep";
//                 else if (key === "wolfEnergyLoss") paramKey = "wolfEnergyLossPerTick";
                
//                 if (params[paramKey] !== undefined) {
//                     sliders[key].value = params[paramKey];
//                     const val = parseFloat(params[paramKey]);
//                     const span = valueSpans[key];
//                     if (span) span.textContent = val.toFixed(val < 1 ? 3 : (val < 10 && val !== Math.floor(val) ? 1 : 0));
//                 }
//             }
//         }
//     }
    
//     function setupSliderListeners() {
//         for (const key in sliders) {
//             if (sliders[key]) {
//                 sliders[key].addEventListener('input', (e) => {
//                     const value = parseFloat(e.target.value);
//                     let paramKey = key;
//                     if (key === "wolfEnergyGain") paramKey = "wolfEnergyFromSheep";
//                     else if (key === "wolfEnergyLoss") paramKey = "wolfEnergyLossPerTick";
//                     else paramKey = key; // Handles initialSheep, initialWolves, sheepReproduceRate, wolfReproduceRate
                    
//                     params[paramKey] = value;
//                     const span = valueSpans[key];
//                     if(span) span.textContent = value.toFixed(value < 1 ? 3 : (value < 10 && value !== Math.floor(value) ? 1 : 0) );
//                 });
//             }
//         }
//         if (restartButton) {
//             restartButton.addEventListener('click', setupSimulation);
//         }
//     }


//     // --- Grid Activity Logic ---
//     function initializeActiveCellGridAndGrass() {
//         isActiveCell = Array(gridWidth).fill(null).map(() => Array(gridHeight).fill(true));
//         grassGrid = Array(gridWidth).fill(null).map(() => 
//             Array(gridHeight).fill(null).map(() => ({ hasGrass: true, regrowthTimer: 0 }))
//         );

//         const elementsToExclude = [
//             document.getElementById('simulation-controls'),
//             document.querySelector('header'),
//             document.querySelector('main.container'),
//             document.querySelector('footer')
//         ];

//         elementsToExclude.forEach(element => {
//             if (element) {
//                 const rect = element.getBoundingClientRect();
//                 const buffer = params.gridCellSize / 2;
//                 const startX = Math.max(0, Math.floor((rect.left - buffer) / params.gridCellSize));
//                 const endX = Math.min(gridWidth - 1, Math.ceil((rect.right + buffer) / params.gridCellSize));
//                 const startY = Math.max(0, Math.floor((rect.top - buffer) / params.gridCellSize));
//                 const endY = Math.min(gridHeight - 1, Math.ceil((rect.bottom + buffer) / params.gridCellSize));

//                 for (let gx = startX; gx < endX; gx++) {
//                     for (let gy = startY; gy < endY; gy++) {
//                         if (gx >= 0 && gx < gridWidth && gy >= 0 && gy < gridHeight) {
//                             isActiveCell[gx][gy] = false;
//                             grassGrid[gx][gy].hasGrass = false; // No grass under content elements
//                         }
//                     }
//                 }
//             }
//         });
//         // Ensure all other initially active cells start with grass
//         for (let x = 0; x < gridWidth; x++) {
//             for (let y = 0; y < gridHeight; y++) {
//                 if (isActiveCell[x][y]) { // Only active cells can have grass initially
//                     grassGrid[x][y] = { hasGrass: true, regrowthTimer: 0 };
//                 } else { // Ensure inactive cells are marked as no grass
//                      grassGrid[x][y] = { hasGrass: false, regrowthTimer: params.grassRegrowthTicks +1 }; // effectively no regrowth
//                 }
//             }
//         }
//     }
    
//     function spawnAgentInActiveCell(AgentType) {
//         let x, y, attempts = 0;
//         const maxAttempts = gridWidth * gridHeight / 2; 
//         do {
//             x = Math.floor(Math.random() * gridWidth);
//             y = Math.floor(Math.random() * gridHeight);
//             attempts++;
//             if (attempts > maxAttempts) return null; 
//         } while (!isActiveCell || !isActiveCell[x] || !isActiveCell[x][y]);
//         return new AgentType(x, y);
//     }

//     // --- Agent Classes ---
//     class Agent {
//         constructor(x, y) {
//             this.x = x;
//             this.y = y;
//             this.id = Math.random().toString(36).substring(2, 11);
//         }

//         // General move: tries to find an active adjacent cell
//         _findValidMoveSpot(preferredCondition = (nx, ny) => true) {
//             const currentX = this.x;
//             const currentY = this.y;
//             let bestSpot = { x: currentX, y: currentY, preferred: false }; // Default to staying put

//             const directions = [ [-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1] ];
//             for (let i = directions.length - 1; i > 0; i--) { // Shuffle
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [directions[i], directions[j]] = [directions[j], directions[i]];
//             }
//             directions.unshift([0,0]); // Prioritize checking preferred in current spot, then moving

//             for (const [dx, dy] of directions) {
//                 const nextX = (currentX + dx + gridWidth) % gridWidth;
//                 const nextY = (currentY + dy + gridHeight) % gridHeight;

//                 if (isActiveCell && isActiveCell[nextX] && isActiveCell[nextX][nextY]) {
//                     if (preferredCondition(nextX, nextY)) { // Found a preferred spot
//                         return { x: nextX, y: nextY };
//                     }
//                     if (dx === 0 && dy === 0) continue; // Don't select current spot as non-preferred if preferred check failed for it
//                     if (!bestSpot.preferred) { // If current best is just staying put, take any valid move
//                         bestSpot = { x: nextX, y: nextY, preferred: false };
//                     }
//                 }
//             }
//              // If preferredCondition was true for current cell and no other preferred cell was found
//             if (preferredCondition(currentX, currentY) && !(bestSpot.x === currentX && bestSpot.y === currentY && !bestSpot.preferred)) {
//                  return { x: currentX, y: currentY }; // Stay put if current is preferred and no better option
//             }
//             return bestSpot; // Returns best found (could be current if no other valid or better)
//         }
//     }

//     class Sheep extends Agent {
//         constructor(x, y) {
//             super(x, y);
//             this.type = 'sheep';
//             this.color = '#A0AEC0'; // Tailwind gray-400 (Lighter than wolves)
//             this.energy = params.sheepMaxEnergy / 1.5 + Math.random() * (params.sheepMaxEnergy / 3);
//         }

//         moveAndEat() {
//             // Preferred: move to an active cell with grass
//             const preferredCellCondition = (nx, ny) => grassGrid[nx][ny].hasGrass;
//             const nextPos = this._findValidMoveSpot(preferredCellCondition);
            
//             this.x = nextPos.x;
//             this.y = nextPos.y;

//             // Eat if on grass
//             if (grassGrid[this.x][this.y].hasGrass) {
//                 grassGrid[this.x][this.y].hasGrass = false;
//                 grassGrid[this.x][this.y].regrowthTimer = 0;
//                 this.energy += params.sheepEnergyFromGrass;
//                 if (this.energy > params.sheepMaxEnergy) this.energy = params.sheepMaxEnergy;
//             }
//         }

//         update() {
//             this.moveAndEat();
//             this.energy -= params.sheepEnergyLossPerTick;

//             if (this.energy <= 0) {
//                 agents = agents.filter(agent => agent.id !== this.id); // Sheep dies
//                 return;
//             }

//             if (this.energy >= params.sheepReproduceMinEnergy && Math.random() < params.sheepReproduceRate) {
//                 this.energy *= 0.5; // Cost to reproduce
//                 const directions = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1],[0,0]];
//                 for (let i = directions.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [directions[i], directions[j]] = [directions[j], directions[i]];}
                
//                 for (const [dx, dy] of directions) {
//                     const nx = (this.x + dx + gridWidth) % gridWidth;
//                     const ny = (this.y + dy + gridHeight) % gridHeight;
//                     if (isActiveCell && isActiveCell[nx] && isActiveCell[nx][ny]) {
//                         agents.push(new Sheep(nx, ny));
//                         return; 
//                     }
//                 }
//             }
//         }
//     }

//     class Wolf extends Agent {
//         constructor(x, y) {
//             super(x, y);
//             this.type = 'wolf';
//             this.color = '#E53E3E'; // Tailwind red-600 (Distinct wolf color)
//             this.energy = params.maxWolfEnergy / 1.5 + Math.random() * (params.maxWolfEnergy / 3);
//         }
        
//         move() { // Wolves just move randomly to any active cell for now
//             const nextPos = this._findValidMoveSpot(); // No specific preference other than active
//             this.x = nextPos.x;
//             this.y = nextPos.y;
//         }

//         update() {
//             this.move();
//             this.energy -= params.wolfEnergyLossPerTick;

//             const sheepInCell = agents.filter(agent => 
//                 agent.type === 'sheep' && agent.x === this.x && agent.y === this.y
//             );
            
//             if (sheepInCell.length > 0) {
//                 const eatenSheep = sheepInCell[Math.floor(Math.random() * sheepInCell.length)];
//                 agents = agents.filter(agent => agent.id !== eatenSheep.id);
//                 this.energy += params.wolfEnergyFromSheep;
//                 if (this.energy > params.maxWolfEnergy) this.energy = params.maxWolfEnergy;
//             }

//             if (this.energy >= params.wolfReproduceMinEnergy && Math.random() < params.wolfReproduceRate) {
//                 this.energy *= 0.6; 
//                 const directions = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1],[0,0]];
//                  for (let i = directions.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [directions[i], directions[j]] = [directions[j], directions[i]];}
//                 for (const [dx, dy] of directions) {
//                     const nx = (this.x + dx + gridWidth) % gridWidth;
//                     const ny = (this.y + dy + gridHeight) % gridHeight;
//                     if (isActiveCell && isActiveCell[nx] && isActiveCell[nx][ny]) {
//                         agents.push(new Wolf(nx, ny));
//                         break; 
//                     }
//                 }
//             }

//             if (this.energy <= 0) {
//                 agents = agents.filter(agent => agent.id !== this.id);
//             }
//         }
//     }

//     // --- Simulation Setup & Loop ---
//     function setupSimulation() {
//         if (simulationTimer) clearInterval(simulationTimer);
//         if (animationFrameId) cancelAnimationFrame(animationFrameId);

//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//         gridWidth = Math.floor(canvas.width / params.gridCellSize);
//         gridHeight = Math.floor(canvas.height / params.gridCellSize);
        
//         initializeActiveCellGridAndGrass(); 
        
//         agents = [];
//         for (let i = 0; i < params.initialSheep; i++) {
//             const sheep = spawnAgentInActiveCell(Sheep);
//             if (sheep) agents.push(sheep);
//         }
//         for (let i = 0; i < params.initialWolves; i++) {
//             const wolf = spawnAgentInActiveCell(Wolf);
//             if (wolf) agents.push(wolf);
//         }
        
//         simulationTimer = setInterval(updateSimulationStep, params.simulationTickMs);
//         animateCanvas();
//     }

//     function updateSimulationStep() {
//         // 1. Grass regrowth
//         if (grassGrid) { // Make sure grassGrid is initialized
//             for (let x = 0; x < gridWidth; x++) {
//                 for (let y = 0; y < gridHeight; y++) {
//                     if (isActiveCell[x][y] && !grassGrid[x][y].hasGrass) {
//                         grassGrid[x][y].regrowthTimer++;
//                         if (grassGrid[x][y].regrowthTimer >= params.grassRegrowthTicks) {
//                             grassGrid[x][y].hasGrass = true;
//                             grassGrid[x][y].regrowthTimer = 0;
//                         }
//                     }
//                 }
//             }
//         }

//         // 2. Agent actions
//         const currentAgents = [...agents];
//         currentAgents.forEach(agent => {
//             if (!agents.find(a => a.id === agent.id)) return;
//             // Sheep update now includes move, eat, energy, death, reproduce
//             // Wolf update includes move, energy, hunt, reproduce, death
//             agent.update(); 
//         });
//     }
    
//     function animateCanvas() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         // 1. Draw grass/bare ground for active cells
//         const grassColor = '#68D391'; // A pleasant green
//         const bareColor = '#D2B48C';  // Tan / light brown for bare ground

//         if (isActiveCell && grassGrid) { // Ensure they are initialized
//             for (let x = 0; x < gridWidth; x++) {
//                 for (let y = 0; y < gridHeight; y++) {
//                     if (isActiveCell[x][y]) {
//                         ctx.fillStyle = grassGrid[x][y].hasGrass ? grassColor : bareColor;
//                         ctx.fillRect(x * params.gridCellSize, y * params.gridCellSize, params.gridCellSize, params.gridCellSize);
//                     }
//                 }
//             }
//         }

//         // 2. Draw agents
//         agents.forEach(agent => {
//             // Agent color is defined in their class
//             ctx.fillStyle = agent.color;
//             // Draw agents slightly smaller than cell for visual separation
//             const drawSize = params.gridCellSize * 0.7; 
//             const offset = (params.gridCellSize - drawSize) / 2;
//             ctx.fillRect(
//                 agent.x * params.gridCellSize + offset,
//                 agent.y * params.gridCellSize + offset,
//                 drawSize,
//                 drawSize
//             );
//         });
//         animationFrameId = requestAnimationFrame(animateCanvas);
//     }

//     // Initial setup
//     updateSliderValuesFromParams();
//     setupSliderListeners();
//     setupSimulation();

//     window.addEventListener('resize', () => {
//         setupSimulation(); 
//     });
// });

// // ========= END WOLF-SHEEP-GRASS SIMULATION ========= //