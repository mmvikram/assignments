document.addEventListener('DOMContentLoaded', function () {
  const modalHTML = `
    <div id="modal-container" class="modal quick-look-modal modal--hidden">
      <div class="modal__content">
        <span class="modal__close-btn">&times;</span>
        <div id="modal-body" class="modal__body"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const closeButton = document.querySelector('.modal__close-btn');
  closeButton.addEventListener('click', hideModal);

  window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal-container');
    if (event.target === modal) {
      hideModal();
    }
  });
});

let quickLookButtons = document.querySelectorAll('.quick-look-btn');

quickLookButtons.forEach((button) => {
  button.addEventListener('click', async (e) => {
    let productUrl = e.target.dataset.url;
    e.target.classList.add('loading');
    await extractSection(productUrl);
    e.target.classList.remove('loading');
  });
});

async function extractSection(productUrl) {
  if (productUrl) {
    try {
      let response = await fetch(productUrl);
      let html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const section = doc.querySelector(`[data-section-rendering-url="${productUrl}"]`);

      if (section) {
        document.getElementById('modal-body').innerHTML = section.innerHTML;
        showModal();
      } else {
        console.error('Section not found');
      }
    } catch (error) {
      console.error('Error fetching product page:', error);
    }
  }
}

function showModal() {
  const modal = document.getElementById('modal-container');
  document.body.style.overflow = 'hidden';

  modal.classList.remove('modal--hidden');
  modal.classList.add('modal--visible');
}

function hideModal() {
  const modal = document.getElementById('modal-container');
  modal.classList.remove('modal--visible');
  modal.classList.add('modal--hiding');

  document.body.style.overflow = 'auto';

  modal.addEventListener(
    'animationend',
    () => {
      modal.classList.remove('modal--hiding');
      modal.classList.add('modal--hidden');
    },
    { once: true },
  );
}

document.addEventListener('DOMContentLoaded', () => {
  handleColorVariantHover();
});

function handleColorVariantHover() {
  let colorButtons = document.querySelectorAll('.quick-look-card__variant-picker-variant');

  colorButtons.forEach((button) => {
    button.addEventListener('mouseover', (e) => {
      let quickLookCard = button.closest('.quick-look-card');
      let pictureElement = quickLookCard.querySelector('.showing-image').parentElement;

      let currentCardButtons = quickLookCard.querySelectorAll(
        '.quick-look-card__variant-picker-variant',
      );

      currentCardButtons.forEach((colorButton) => {
        colorButton.classList.remove('selected-outline');
      });
      button.classList.add('selected-outline');

      let imgElement = pictureElement.querySelector('img');
      let sourceElement = pictureElement.querySelector('source');

      let imageUrl = e.target.dataset.imageUrl;
      let imageSrcset = `${imageUrl} 375w, ${imageUrl} 493w`;

      imgElement.src = imageUrl;
      sourceElement.srcset = imageSrcset;
    });
  });
}
