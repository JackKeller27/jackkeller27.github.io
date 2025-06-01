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
  const activeTextClasses = ['text-blue-600', 'dark:text-blue-400'];
  const defaultTextClasses = ['text-slate-600', 'dark:text-slate-300'];
  const activeBorderClasses = ['border-blue-600', 'dark:border-blue-400']; // For active link
  const transparentBorderClass = 'border-transparent';

  desktopNavLinks.forEach(link => {
    link.classList.remove('active', 'font-semibold', ...activeTextClasses, ...activeBorderClasses);
    link.classList.add(...defaultTextClasses, transparentBorderClass);
    link.removeAttribute('aria-current');
  });

  let elementToStyleActive = null;
  if (navElement && navElement.id === 'nav-contact-anchor') {
    elementToStyleActive = document.getElementById('nav-about');
  } else if (navElement && navElement.id && navElement.id.startsWith('nav-')) {
    elementToStyleActive = navElement;
  }

  if (elementToStyleActive) {
    elementToStyleActive.classList.add('active', 'font-semibold', ...activeTextClasses, ...activeBorderClasses);
    elementToStyleActive.classList.remove(...defaultTextClasses, transparentBorderClass);
    elementToStyleActive.setAttribute('aria-current', 'page');
  }

  const mobileNavLinks = document.querySelectorAll('#mobile-menu .nav-link-mobile');
  const activeMobileClasses = ['bg-blue-100', 'dark:bg-slate-700', 'text-blue-700', 'dark:text-blue-300', 'font-semibold'];

  mobileNavLinks.forEach(link => {
    link.classList.remove(...activeMobileClasses);
    link.removeAttribute('aria-current');

    let linkCorrespondsToSection = false;
    if (link.onclick && link.onclick.toString().includes(`showSection('${sectionId}'`)) {
      // If the link is for the section being shown (e.g. 'About Me' link when 'about' section is shown)
      if (navElement && navElement.id !== 'nav-contact-anchor' && link.id === navElement.id.replace('nav-', 'nav-mobile-')) { // Hypothetical mobile ID match
        linkCorrespondsToSection = true;
      } else if (sectionId === 'about' && link.onclick.toString().includes("showSection('about'")) {
        // This specifically targets the 'About Me' mobile link when section 'about' is shown
        linkCorrespondsToSection = true;
      } else if (link.id === `nav-mobile-${sectionId}`) { // Generic match for other sections
        linkCorrespondsToSection = true;
      }
    }

    if (linkCorrespondsToSection) {
      link.classList.add(...activeMobileClasses);
      link.setAttribute('aria-current', 'page');
    }
  });

  if (isMobile) {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('menu-button');
    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.classList.remove('open');
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

const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');

menuButton.addEventListener('click', () => {
  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
  menuButton.setAttribute('aria-expanded', !isExpanded);
  mobileMenu.classList.toggle('hidden');
  menuButton.classList.toggle('open');
});

// Get current year for copyright in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0); // scroll to top on initial load
  showSection('about', document.getElementById('nav-about'));
});

window.addEventListener('load', function () {
  window.scrollTo(0, 0);
});