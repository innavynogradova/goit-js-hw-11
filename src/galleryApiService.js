import axios from "axios";
import { Notify } from "notiflix";


const API_KEY = '6120145-45c9d9fcf452f40cf8679a3e8';
const PER_PAGE = 40;
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class GalleryApiService {
    costructor() {
        this.searchQuery = '';
        this.page = '';
        this.totalHits = '';
        this.pageTotal = '';
    }

    setOptions() {
        const param = new URLSearchParams({
            key: `${API_KEY}`,
            q: `${this.searchQuery}`,
            page: `${this.page}`,
            per_page: `${PER_PAGE}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        });
        return param;
    }

    async fetchGallery() {
        try {
            const options = this.setOptions();
            const response = await axios.get(`?${options}`);
            const data = await response.data;
            
            this.totalHits = data.totalHits;
            this.pageTotal = Math.ceil(this.totalHits / PER_PAGE);
            console.log("how many pages", this.pageTotal);

            if (data.total === 0) {
                throw new Error('Sorry, there are no images matching your search query. Please try again.');
            }
        
            return data;

        } catch (error) {
            console.log(error);
            Notify.failure(error.message);
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
