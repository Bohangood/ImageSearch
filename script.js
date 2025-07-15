const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "51262611-6f73fdc02abdf9318271eddeb";
const api_type = "photo";

const input = document.querySelector(".inputSearch");
const form = document.querySelector(".fromSearch");
const gallery = document.querySelector(".main");
const spinner = document.querySelector(".spinner-wrapper");
const btnPrev = document.querySelector(".btnPrevious");
const btnNext = document.querySelector(".btnNext");
const pageNumberEl = document.querySelector(".numberPage");
const favorite = document.querySelector(".btnFavorite");

const modal = document.querySelector(".modal");
const modalImg = document.querySelector(".modal-img");
const modalAuthor = document.querySelector(".modal-author");
const modalTags = document.querySelector(".modal-tags");
const modalLikes = document.querySelector(".modal-likes");
const modalDownloads = document.querySelector(".modal-downloads");
const closeModal = document.querySelector(".close");

let favorites = [];
let currentPage = 1;
let currentQuery = "";
let totalPages = 1;
const perPage = 20;

const loadImages = async (query, page = 1) => {
  spinner.hidden = false;
  try {
    const res = await axios.get(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: query,
        image_type: api_type,
        page: page,
        per_page: perPage,
      },
    });

    const data = res.data;
    totalPages = Math.ceil(data.totalHits / perPage);

    gallery.innerHTML = "";

    data.hits.forEach((foto) => {
      const div = document.createElement("div");
      div.classList.add("image-item");

      const isFavorite = favorites.includes(foto.id);
      const star = isFavorite ? '★' : '☆';
      div.innerHTML = `
      <div class="image-wrapper">
        <a 
          href="${foto.largeImageURL}" 
          data-author="${foto.user}" 
          data-tags="${foto.tags}" 
          data-likes="${foto.likes}" 
          data-downloads="${foto.downloads}">
          <img src="${foto.webformatURL}" alt="${foto.tags}" />
        </a>
        <span class="favorite-icon" data-id="${foto.id}">${star}</span>
        </div>
        `;
      gallery.appendChild(div);
    });

    pageNumberEl.textContent = `Page ${currentPage} of ${totalPages}`;

    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages || totalPages === 0;
  } catch (error) {
    console.error(error);
  } finally {
    spinner.hidden = true;
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  currentQuery = text;
  currentPage = 1;
  loadImages(currentQuery, currentPage);

  input.value = "";
});

btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadImages(currentQuery, currentPage);
  }
});

btnNext.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadImages(currentQuery, currentPage);
  }
});

// Modal open 
gallery.addEventListener("click", (e) => {
  const star = e.target.closest(".favorite-icon");
  if (star){
    const id = Number(star.dataset.id);
    const index = favorites.indexOf(id);

    if (index === -1){
      favorites.push(id)
      star.textContent = "★";
    } else {
      favorites.splice(index, 1);
      star.textContent = "☆"
    }
    return
  }
  e.preventDefault();
  const link = e.target.closest("a");
  if (!link) return;

  modalImg.src = link.href;
  modalImg.alt = link.querySelector("img").alt;
  modalAuthor.textContent = `Author: ${link.dataset.author}`;
  modalTags.textContent = `Tags: ${link.dataset.tags}`;
  modalLikes.textContent = `Likes: ${link.dataset.likes}`;
  modalDownloads.textContent = `Downloads: ${link.dataset.downloads}`;

  modal.hidden = false;
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.hidden = true;
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.hidden = true;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.hidden = true;
  }
});
