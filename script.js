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