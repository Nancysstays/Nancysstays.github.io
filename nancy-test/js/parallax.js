window.addEventListener('scroll', function() {
  const scrollY = window.scrollY;
  const parallaxElement = document.querySelector('.parallax-element');
  parallaxElement.style.transform = 'translateY(' + scrollY * 0.5 + 'px)';
});
