import './sass/main.scss';
import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import ImagesApiService from './js/apiService';
import articlesTpl from './templates/gallery-list.hbs';
import LoadMoreBtn from './js/load-more-btn';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const refs = {
  searchForm: document.getElementById('search-form'),
  articlesContainer: document.querySelector('.js-articles-container'),
  anchor: document.querySelector('.anchor'),
}
// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });
const imagesApiService = new ImagesApiService();
const observer = new IntersectionObserver(observerHandler, { threshold: 1, });

refs.searchForm.addEventListener('submit', onSearch);
refs.articlesContainer.addEventListener('click', onImgClick);
// loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

observer.observe(refs.anchor);

function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.query.value.trim();
  if (imagesApiService.query === '') {
    return onFetchError(info, 'Enter text');
  }

  // loadMoreBtn.show();
  imagesApiService.resetPage();
  clearArticlesContainer();

  fetchArticles();
}

function observerHandler() {
  if (imagesApiService.query === '') return;
  fetchArticles();
}

// function onLoadMore() {
//   fetchArticles();
// }

function fetchArticles() {
  // loadMoreBtn.disabled();

  imagesApiService.fetchArticles().then(articles => {
    appendArticlesMarkup(articles);
    // loadMoreBtn.enable();
  });
}

function appendArticlesMarkup(articles) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles));
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}

function onFetchError(typeInfo, text) {
  typeInfo({
    text: `${text}`,
    delay: 1000,
    closerHover: true,
    animation: 'fade',
    animateSpeed: 'normal',
    color: 'red',
  });
}

function onImgClick(e) {
  e.preventDefault();

  const largeImage = e.target.dataset.source;

  const instance = basicLightbox.create(`<img src="${largeImage}">`)

  instance.show()
}