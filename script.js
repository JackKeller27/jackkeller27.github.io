let currentIndex = 0;

function moveSlide(direction) {
  const track = document.querySelector('.carousel-track');
  const projects = document.querySelectorAll('.project');
  currentIndex = (currentIndex + direction + projects.length) % projects.length;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}