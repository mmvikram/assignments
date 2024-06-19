let isFirstRender = true;
let splideInstance;
let fetchedPhotos = [];
const apiKey = "RRDIfMOVxNG6CdIJQXCXzatWlt6BsJiSp7fXdBasAf97RuixEHuse9Cj";
const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");
const photoContainer = document.getElementById("photoContainer");
const similarResultsSection = document.querySelector(
  ".similar-results-section"
);
const favSection = document.querySelector(".fav-section");
let localPhotos = JSON.parse(localStorage.getItem("wishlist")) || [];

const initialElement = (message) => `
    <div class="info" style=" ${
      localPhotos.length === 0 ? "height:500px;" : ""
    }">
    <p>${message}</p>
    <div class="tag-container">
      <button class="tag" onclick='searchImages("4k")'>
        4k
      </button> 
      <button class="tag" onclick='searchImages("nature")'>
        system
      </button> 
      <button class="tag" onclick='searchImages("laptop")'>
        laptop
      </button> 
      <button class="tag" onclick='searchImages("models")'>
        models
      </button>  
      <button class="tag" onclick='searchImages("portrait")'>
        portrait
      </button>
    </div>
    </div>`;

let card = (photo, isFavorite) => `
<div class="photo-card-image-wrapper isolate">
  <img class="photo-card-image" src="${photo.src.medium}" alt="${photo.alt}" />
</div>
<div class="photo-card-details">
  <h3>${photo.alt.slice(0, 20) + (photo.alt?.length > 15 ? "..." : "")}</h3>
  <p>${photo.photographer}</p>
</div>
<div class="wishlist-icon ${!!isFavorite ? "highlight" : ""}" data-photo-id='${
  photo.id
}' onclick="toggleWishlist('${photo.id}')">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.17157 1.48283C2.73367 -0.0381606 5.26633 -0.0381606 6.82842 1.48283L7.99999 2.62357L9.17157 1.48283C10.7337 -0.0381606 13.2663 -0.0381606 14.8284 1.48283C16.3905 3.00382 16.3905 5.46983 14.8284 6.99082L7.99999 13.6395L1.17157 6.99082C-0.390524 5.46983 -0.390524 3.00382 1.17157 1.48283Z" fill="currentColor"/>
</svg>
</div>`;

document.addEventListener("DOMContentLoaded", () => {
  const lastQuery = localStorage.getItem("lastQuery");
  if (lastQuery) {
    searchBar.value = lastQuery;
    searchImages(lastQuery);
  } else {
    photoContainer.innerHTML = initialElement("No images found, Start search");
  }
  showFavs();
  updateWishlistIcons();
  isFirstRender = false;
});

function handleKeyPress() {
  const query = searchBar.value.trim();
  if (query) {
    localStorage.setItem("lastQuery", query);
    searchImages(query);
  }
}
searchBar.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleKeyPress();
  }
});

searchButton.addEventListener("click", handleKeyPress);

async function searchImages(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query
  )}&per_page=10&page=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    fetchedPhotos = data.photos;
    displayPhotos(data.photos);
  } catch (error) {
    photoContainer.innerHTML = initialElement("Error occurred");
    console.error("Error fetching images:", error);
  }
}

const SPLIDE_OPTIONS = {
  // type: "loop",
  perPage: 4,
  perMove: 1,
  gap: "1rem",
  pagination: false,
  classes: {
    arrows: "splide__arrows",
    arrow: "splide__arrow arrows",
    prev: "splide__arrow--prev move-arrow-left ",
    next: "splide__arrow--next move-arrow-right",
    pagination: "hidden",
  },
  breakpoints: {
    1200: {
      perPage: 3,
    },
    768: {
      perPage: 2,
    },
    480: {
      perPage: 1,
    },
  },
};
function showFavs() {
  let photos = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (fetchedPhotos.length === 0 && isFirstRender && photos.length === 0) {
    return;
  }
  favSection.innerHTML = "";

  if (photos.length === 0) {
    favSection.innerHTML = `
    
    <h2>Favorites List</h2>
    <p class="no-favs">No favorites</p>
    `;
    return;
  }
  let slides = "";
  photos.forEach((photo) => {
    slides += `
<li class="splide__slide photo-card">
  ${card(photo, true)}                
</li>
`;
  });

  let favCarousel = `    
    <h2>Favorites List</h2>
    <div class="splide" id="favCarousel">
      <div class="splide__track">
        <ul class="splide__list" id="splideList">${slides}</ul>
      </div>
    </div>`;

  favSection.innerHTML = favCarousel;

  if (splideInstance) {
    splideInstance.destroy();
  }

  splideInstance = new Splide("#favCarousel", {
    ...SPLIDE_OPTIONS,
    perPage: photos.length <= 4 ? photos.length : 4,
  }).mount();
}

function displayPhotos(photos) {
  similarResultsSection.innerHTML = "";
  if (!photos || photos.length === 0) {
    photoContainer.innerHTML = initialElement("Not Found, try another");
    return;
  }

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let favorited = wishlist.map(({ id }) => id);

  if (photos.length > 0) {
    const firstPhoto = photos[0];
    photoContainer.innerHTML = `
            <div class="photo">
            <div class="image-wrapper">
                <img src="${firstPhoto.src.large}" alt="${firstPhoto.alt}" />
            </div>
                <div class="photo-details">
                    <h3>${firstPhoto.alt}</h3>
                    <p>${firstPhoto.photographer}</p>
                    <a class="button button__red" href="${firstPhoto.photographer_url}" target="_blank">View Profile</a>
                </div>
            </div>
        `;

    let slides = "";
    for (let i = 1; i < photos.length; i++) {
      const photo = photos[i];

      slides += `
                <li class="splide__slide photo-card">
                ${card(photo, favorited.includes(photo.id))}
                </li>
            `;
    }

    let similarCarousel = `    
    <h2>Similar Results</h2>
    <div class="splide" id="similarCarousel">
      <div class="splide__track">
        <ul class="splide__list" id="splideList">${slides}</ul>
      </div>
    </div>`;

    similarResultsSection.innerHTML = similarCarousel;

    let splide = new Splide("#similarCarousel", SPLIDE_OPTIONS);
    splide.mount();
  }
}

function toggleWishlist(photoId) {
  const photo = fetchedPhotos.find((photo) => photo.id == photoId);
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const photoExists = wishlist.find((item) => item.id == photoId);

  if (photoExists) {
    wishlist = wishlist.filter((item) => item.id != photoId);
  } else {
    wishlist.push(photo);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  showFavs();
  updateWishlistIcons();
}

function updateWishlistIcons() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  document.querySelectorAll(".wishlist-icon").forEach((icon) => {
    const photoId = icon.getAttribute("data-photo-id");
    if (wishlist.find((item) => item.id == photoId)) {
      icon.classList.add("highlight");
    } else {
      if (icon.classList.contains("highlight")) {
        icon.classList.remove("highlight");
      }
    }
  });
}
