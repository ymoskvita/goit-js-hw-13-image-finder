import './sass/main.scss';
import ImagesApiService from './js/apiService';
import articlesTpl from './templates/gallery-list.hbs';
import LoadMoreBtn from './js/load-more-btn';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.getElementById('search-form'),
  articlesContainer: document.querySelector('.js-articles-container'),
  anchor: document.querySelector('.anchor'),
}
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const imagesApiService = new ImagesApiService();
// const observer = new IntersectionObserver(observerHandler, { threshold: 1, });

refs.searchForm.addEventListener('submit', onSearch);
refs.articlesContainer.addEventListener('click', onImgClick);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

// observer.observe(refs.anchor);

// function observerHandler(entry, observer) {
//   console.log(imagesApiService.page);
//   if (imagesApiService.page >= 2) {
//     // if (!entry.isIntersecting) return;
//     fetchArticles();
//   }
//   // observer.unobserve(refs.anchor);
// }

function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.query.value.trim();
  if (!imagesApiService.query) {
    return Notiflix.Notify.warning('Empty request');
  }

  loadMoreBtn.show();
  imagesApiService.resetPage();
  clearArticlesContainer();

  fetchArticles();
}

function onLoadMore() {
  fetchArticles();


}

function fetchArticles() {
  loadMoreBtn.disabled();

  imagesApiService.fetchArticles().then(articles => {
   appendArticlesMarkup(articles);
    loadMoreBtn.enable();
    refs.anchor.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
  })
}

function appendArticlesMarkup(articles) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles));
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}

function onImgClick(e) {
  e.preventDefault();

  const largeImage = e.target.dataset.source;

  const instance = basicLightbox.create(`<img src="${largeImage}">`)

  instance.show()
}
