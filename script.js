document.addEventListener("DOMContentLoaded", () => {
  const stickyHeader = document.querySelector(".sticky-header");
  const stickyFooter = document.querySelector(".sticky-footer");
  const hero = document.querySelector(".hero");
  const sections = document.querySelectorAll("section:not(.hero)");

  // 1) Temporarily show them so we can measure height
  stickyHeader.style.display = "block";
  stickyFooter.style.display = "block";

  const headerHeight = stickyHeader.offsetHeight;
  const footerHeight = stickyFooter.offsetHeight;

  // 2) Hide them again initially (we’ll show/hide on scroll)
  stickyHeader.style.display = "none";
  stickyFooter.style.display = "none";

  // 3) Compute how tall each section needs to be so content "sits between" header & footer:
  const availableHeight = window.innerHeight - headerHeight - footerHeight;

  sections.forEach((sec) => {
    // a) Make sure the section’s content area is at least that tall:
    sec.style.minHeight = `${availableHeight}px`;
    // b) Add top‐padding equal to header height, and bottom‐padding equal to footer height,
    //    so that if your actual text/content is shorter, it still “sits” in the visible zone.
    sec.style.paddingTop = `${headerHeight}px`;
    sec.style.paddingBottom = `${footerHeight}px`;
  });

  // 4) Listen for scroll to fade in sections / toggle sticky header + footer
  window.addEventListener("scroll", () => {
    const heroHeight = hero.offsetHeight;

    // Show the sticky header & footer once we've scrolled past the hero:
    if (window.scrollY > heroHeight) {
      stickyHeader.style.display = "block";
      stickyFooter.style.display = "block";
    } else {
      stickyHeader.style.display = "none";
      stickyFooter.style.display = "none";
    }

    // Fade‐in logic (unchanged)
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (sectionTop < windowHeight - 100) {
        section.classList.add("visible");
      }
    });
  });

  // 5) If the user resizes the window, recompute availableHeight for each section:
  window.addEventListener("resize", () => {
    const newHeroHeight = hero.offsetHeight;
    const newHeaderHeight = stickyHeader.offsetHeight;
    const newFooterHeight = stickyFooter.offsetHeight;
    const newAvailable = window.innerHeight - newHeaderHeight - newFooterHeight;

    sections.forEach((sec) => {
      sec.style.minHeight = `${newAvailable}px`;
      sec.style.paddingTop = `${newHeaderHeight}px`;
      sec.style.paddingBottom = `${newFooterHeight}px`;
    });
  });
});
