import './sass/main.scss';
import ImagesApiService from './js/apiService';
import articlesTpl from './templates/gallery-list.hbs';
import LoadMoreBtn from './js/load-more-btn';

const refs = {
  searchForm: document.getElementById('search-form'),
  articlesContainer: document.querySelector('.js-articles-container'),
  // loadMoreBtn: document.querySelector('[data-action="load-more"]'),
}
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.query.value;
  if (imagesApiService.query === '') {
    return console.log('error');
  }

  loadMoreBtn.show();
  imagesApiService.resetPage();
  clearArticlesContainer();

  fetchArticles();
}

function fetchArticles() {
  loadMoreBtn.disabled();

  imagesApiService.fetchArticles().then(articles => {
    appendArticlesMarkup(articles);
    loadMoreBtn.enable();
  });
}

function appendArticlesMarkup(articles) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles));
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}

// refs.articlesContainer.scrollIntoView({
//   behavior: 'smooth',
//   block: 'end',
// });