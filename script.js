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
stickyHeader.innerHTML = '<h1>Jack R. Keller</h1>';
document.body.appendChild(stickyHeader);

const stickyFooter = document.createElement('footer');
stickyFooter.className = 'sticky-footer';
stickyFooter.innerHTML = '<p>Jack R. Keller</p>';
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