import axios from 'axios';

// отвечает за запросы на api
export default class PixabayApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
        this.totalHits = null;
        this.totalPages = null;
        this.endOfHits = false;
    }

    async fetchGalleryCards() {
        const axiosOptions = {
            method: 'get',
            url: 'https://pixabay.com/api/',
            params: {
                key: '30128304-708965977259e04966a50b0c9',
                q: `${this.searchQuery}`,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: `${this.page}`,
                per_page: `${this.per_page}`,
            },
        };
        try {
            const response = await axios(axiosOptions);


            this.incrementPage();
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    incrementPage() {
        this.page += 1;
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