const sections = document.querySelectorAll('.section');
const numSections = sections.length;

window.addEventListener('scroll', () => {
  // Prevent default scroll behavior
  // Calculate how far we've scrolled as a fraction of total scrollable distance
  const scrollY = window.scrollY;
  const windowH = window.innerHeight;
  const totalHeight = windowH * (numSections - 1);
  
  // Cap scrollY
  const cappedScroll = Math.min(Math.max(scrollY, 0), totalHeight);
  const rawIndex = cappedScroll / windowH;
  const baseIndex = Math.floor(rawIndex);
  const frac = rawIndex - baseIndex;

  sections.forEach((sec, idx) => {
    if (idx === baseIndex) {
      sec.style.opacity = 1 - frac;
    } else if (idx === baseIndex + 1) {
      sec.style.opacity = frac;
    } else {
      sec.style.opacity = '0';
    }
  });
});

// Initial setup: position each section one after another vertically
sections.forEach((sec, idx) => {
  sec.style.top = `${idx * 100}vh`;
});

// Show sticky header/footer once past first section
const stickyHeader = document.createElement('header');
stickyHeader.className = 'sticky-header';
// stickyHeader.innerHTML = '<p>Jack Keller</p>';
// document.body.appendChild(stickyHeader);

const stickyFooter = document.createElement('footer');
stickyFooter.className = 'sticky-footer';
stickyFooter.innerHTML = '<p>Contact me: <a href="https://www.linkedin.com/in/jack-robert-keller/">LinkedIn</a> | <a href="mailto:jackrobert0627@outlook.com">jackrobert0627@outlook.com</a> | <a href="https://github.com/JackKeller27">GitHub <img src="github_icon.png" alt="GitHub" style="vertical-align:middle; height:1em; margin-left:4px; position:relative; top:-2px;"></a></p>' +
        '<p><a href="Jack-Keller-Resume.pdf" download>Download My Resume</a></p>';
document.body.appendChild(stickyFooter);

const mainFooter = document.querySelector('.main-footer');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 0) {
    stickyHeader.style.display = 'block';
    stickyFooter.style.display = 'block';
    mainFooter.style.display = 'block';
  } else {
    stickyHeader.style.display = 'none';
    stickyFooter.style.display = 'none';
    mainFooter.style.display = 'none';
  }
});

// Initial page render
window.addEventListener("load", () => {
  window.dispatchEvent(new Event("scroll"));
});

// Project carousel logic
// --------------- CAROUSEL SLIDE LOGIC ---------------

// We will maintain one “current index” per carousel. If you have multiple carousels on the page,
// you can expand this to keep separate indices. For now, we know there is only one #projects carousel.

let projectIndex = 0;  // which “.project” is currently visible (0-based)
const track = document.querySelector('#projects .carousel-track');
const projectItems = document.querySelectorAll('#projects .carousel-track .project');

// number of projects
const numProjects = projectItems.length;

// On page load, ensure the first slide has the “active” class (if not already set in HTML)
projectItems.forEach((item, idx) => {
  item.classList.toggle('active', idx === projectIndex);
});

// Function to move to next/previous project slide
function moveSlide(direction) {
  // direction is +1 (next) or -1 (prev)
  projectIndex = projectIndex + direction;

  // wrap around if out of bounds
  if (projectIndex < 0) {
    projectIndex = numProjects - 1;
  } else if (projectIndex > numProjects - 1) {
    projectIndex = 0;
  }

  // update “active” class for styling, if any
  projectItems.forEach((item, idx) => {
    item.classList.toggle('active', idx === projectIndex);
  });

  // slide the track by changing its transform
  const offset = -projectIndex * 100; // 100% of track width per slide
  track.style.transform = `translateX(${offset}%)`;
}

// Expose moveSlide globally so the onclick handlers in HTML still work
window.moveSlide = moveSlide;
