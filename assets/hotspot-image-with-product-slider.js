let splide = document.querySelector('.product-cards-slider');

let hotspots = document.querySelectorAll('.hotspot');

hotspots.forEach((hotspot) => {
  hotspot.addEventListener('click', function (e) {
    let i = e.target.dataset.index;

    splide.splide.go(parseInt(i));
  });
  splide.splide.on('move', (newIndex) => {
    removeActiveFromHotspot();

    let hotspot = document.querySelector(`[data-index="${newIndex}"]`);

    hotspot.classList.add('is-active');
  });

  removeActiveFromHotspot();
  e.target.classList.add('is-active');
});

function removeActiveFromHotspot() {
  hotspots.forEach((hotspot) => {
    if (hotspot.classList.contains('is-active')) {
      hotspot.classList.remove('is-active');
    }
  });
}
