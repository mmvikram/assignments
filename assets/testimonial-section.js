let images = Array.from(document.querySelectorAll('.testimonial-section__image-wrapper'));
let splide = document.querySelector('.testimonial-section splider-component');

splide.splide.on('move', (newIndex, prevIndex) => {
  images.map((image, index) => {
    let isHidden = image.classList.contains('zero-opacity');
    let isVisible = image.classList.contains('full-opacity');
    if (newIndex === index) {
      if (isHidden) {
        image.classList.remove('zero-opacity');
        image.classList.add('full-opacity');
      }
    } else {
      if (isVisible) {
        image.classList.add('zero-opacity');
        image.classList.remove('full-opacity');
      }
    }
  });
});
