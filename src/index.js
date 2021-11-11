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

refs.searchForm.addEventListener('submit', onSearch);
refs.articlesContainer.addEventListener('click', onImgClick);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.query.value.trim();
  if (!imagesApiService.query) {
    return Notiflix.Notify.warning('Empty request');
  }

  loadMoreBtn.show();
  imagesApiService.resetPage();
  clearArticlesContainer();

  loadMoreBtn.disabled();

  imagesApiService.fetchArticles().then(articles => {
    appendArticlesMarkup(articles);
    loadMoreBtn.enable();
    if (!articles.length) {
      loadMoreBtn.hide();
      return Notiflix.Notify.warning('No matches found');
    }
  })
}

function onLoadMore() {
loadMoreBtn.disabled();

  imagesApiService.fetchArticles().then(articles => {
   appendArticlesMarkup(articles);
    loadMoreBtn.enable();

    if (!articles.length) {
      loadMoreBtn.hide();
      return Notiflix.Notify.warning('Pictures are over');
    }

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
