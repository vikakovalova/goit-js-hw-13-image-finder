const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '24120700-4c7ceb470883237a24132b2b5';
const PER_PAGE = '12';

export default class ImagesApiService{
    constructor() {
    this.searchQuery = '';
    this.page = 1;
    }
    fetchImages() {
        const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=${PER_PAGE}&key=${API_KEY}`;

        return fetch(url)
            .then(response => response.json())
                .then(({hits}) => {
                    this.incrementPage();
                    return hits;
            })
    }
    
    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery
    }

    set query(newSearchQuery) {
        this.searchQuery = newSearchQuery;
    }
};