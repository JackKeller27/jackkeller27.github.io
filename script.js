document.addEventListener("DOMContentLoaded", () => {
  const stickyHeader = document.querySelector('.sticky-header');
  const stickyFooter = document.querySelector('.sticky-footer');
  const hero = document.querySelector('.hero');
  const sections = document.querySelectorAll('.fade-in');

  window.addEventListener('scroll', () => {
    const heroHeight = hero.offsetHeight;
    if (window.scrollY > heroHeight) {
      stickyHeader.style.display = 'block';
      stickyFooter.style.display = 'block';
    } else {
      stickyHeader.style.display = 'none';
      stickyFooter.style.display = 'none';
    }

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (sectionTop < windowHeight - 100) {
        section.classList.add('visible');
      }
    });
  });
});
