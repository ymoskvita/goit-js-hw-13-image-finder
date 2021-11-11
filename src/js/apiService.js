const URL = 'https://pixabay.com/api/';
const apiKey = '24148386-011d38fdfa24550f9a52c4ec8';
export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchArticles() {
    try {
      const response = await fetch(`${URL}?key=${apiKey}&q=${this.searchQuery}&page=${this.page}&per_page=12&image_type=photo&pretty=true`);
      const data = await response.json();
      this.page += 1;
      return data.hits;
    }
    catch (error) {
      return Notiflix.Notify.warning('error');
    }
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}