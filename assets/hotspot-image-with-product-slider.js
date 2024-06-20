let splide = document.querySelector('.product-cards-slider');

let hotspots = document.querySelectorAll('.hotspot');

hotspots.forEach((hotspot) => {
  // To add is-active class to hotspot
  hotspot.addEventListener('click', function (e) {
    removeActiveClassFromHotspot();

    let i = e.target.dataset.index;
    splide.splide.go(parseInt(i));
    e.target.classList.add('is-active');
  });

  // To sync arrow buttons with hotspot
  splide.splide.on('move', (newIndex) => {
    removeActiveClassFromHotspot();

    let currentHotspot = document.querySelector(`[data-index="${newIndex}"]`);
    currentHotspot.classList.add('is-active');
  });
});

function removeActiveClassFromHotspot() {
  hotspots.forEach((hotspot) => {
    if (hotspot.classList.contains('is-active')) {
      hotspot.classList.remove('is-active');
    }
  });
}
