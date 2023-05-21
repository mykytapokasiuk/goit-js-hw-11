import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import REFS from './references.js';
import VARS from './variables.js';
import { getImages } from './serverRequest';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  navText: ['〈', '〉'],
  captionDelay: 250,
  overlayOpacity: 0.3,
});

loadMoreBtnHide();

/**
 * Sends a new request to the server, checks what the user entered
 * @function onSubmit
 * @param {Event} event
 */
const onSubmit = event => {
  event.preventDefault();
  const form_element = event.currentTarget;
  const value = form_element.elements.searchQuery.value.trim();
  if (value === '') {
    Notify.failure('The search field cannot be empty, please try again.', {
      width: '260px',
      showOnlyTheLastOne: true,
      position: 'center-center',
      timeout: 2000,
      fontSize: '15px',
      borderRadius: '8px',
      cssAnimationStyle: 'from-top',
    });
    return '';
  } else {
    VARS.search_query = value;
    VARS.page = 0;
    clearGallery();
    fetchHits().finally(() => form_element.reset());
  }
};
/**
 * Processes input data, updates page value
 * @function fetchHits
 */
async function fetchHits() {
  VARS.page += 1;
  try {
    const markup = await getHitsMarkup();
    updateGaleryList(markup);
    lightbox.refresh();
  } catch (error) {
    onError(error);
  }
}
/**
 * Processes server response, creates and returns markup
 * @function getHitsMarkup
 */
async function getHitsMarkup() {
  try {
    const response = await getImages(VARS.search_query);
    checkResponse(response);
    return response.hits.reduce(
      (markup, hit) => createGalleryElement(hit) + markup,
      ''
    );
  } catch (error) {
    onError(error);
  }
}
/**
 * Checks server response, shows messages, hides/shows loadmore button
 *@function checkResponse
 * @param {object} response
 */
function checkResponse(response) {
  if (response.totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        width: '260px',
        showOnlyTheLastOne: true,
        position: 'center-center',
        timeout: 2000,
        fontSize: '15px',
        borderRadius: '8px',
        cssAnimationStyle: 'from-top',
      }
    );
    clearGallery();
    return '';
  } else if (response.totalHits >= 1 && response.totalHits < 40) {
    loadMoreBtnHide();
    Notify.success(`Hooray! We found ${response.totalHits} images!`, {
      width: '260px',
      showOnlyTheLastOne: true,
      position: 'center-center',
      timeout: 2000,
      fontSize: '15px',
      borderRadius: '8px',
      cssAnimationStyle: 'from-top',
    });
  } else if (response.totalHits / 40 <= VARS.page) {
    loadMoreBtnHide();
    Notify.failure(
      `We're sorry, but you've reached the end of search results.`,
      {
        width: '260px',
        showOnlyTheLastOne: true,
        position: 'center-center',
        timeout: 2000,
        fontSize: '15px',
        borderRadius: '8px',
        cssAnimationStyle: 'from-top',
      }
    );
  } else {
    loadMoreBtnShow();
    Notify.success(`Hooray! We found ${response.totalHits} images!`, {
      width: '260px',
      showOnlyTheLastOne: true,
      position: 'center-center',
      timeout: 2000,
      fontSize: '15px',
      borderRadius: '8px',
      cssAnimationStyle: 'from-top',
    });
  }
}
/**
 * Reports an error
 * @function onError
 * @param {Error} error
 */
function onError(error) {
  Notify.failure(`${error.message}`, {
    width: '260px',
    showOnlyTheLastOne: true,
    position: 'center-center',
    timeout: 2000,
    fontSize: '15px',
    borderRadius: '8px',
    cssAnimationStyle: 'from-top',
  });
}
/**
 * Creates markup for one gallery item
 * @function
 * @param {object} galleryItem
 * @returns {string} String with markup
 */
function createGalleryElement(galleryItem) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = galleryItem;
  return `
  <div class="photo-card">
    <a class="gallery__link" href="${largeImageURL}" >
      <img class="gallery__image" src="${webformatURL}" alt="${tags}"  loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b>
        <span>${views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <span>${downloads}</span>
      </p>
    </div>
  </div>
  `;
}
/**
 * Updates gallery
 * @function updateGaleryList
 * @param {string} markup
 */
function updateGaleryList(markup) {
  REFS.gallery_element.insertAdjacentHTML('beforeend', markup);
}
/**
 * Clears gallery, hides loadmore button
 * @function clearGallery
 */
function clearGallery() {
  REFS.gallery_element.innerHTML = '';
  VARS.page = 0;
  loadMoreBtnHide();
}
/**
 * Hide loadmore button
 * @function loadMoreBtnHide
 */
function loadMoreBtnHide() {
  REFS.loadmore_btn.classList.add('btn-hide');
}
/**
 * Show loadmore button
 * @function loadMoreBtnShow
 */
function loadMoreBtnShow() {
  REFS.loadmore_btn.classList.remove('btn-hide');
}

export default {
  onSubmit,
  fetchHits,
};
