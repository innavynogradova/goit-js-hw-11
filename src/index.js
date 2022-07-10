
import { buildPhotoListMarkup } from "./buildPhotoListMarkup";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix";
import GalleryApiService from "./galleryApiService";
import LoadMoreBtn from "./load-more-button";

const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector(".search-input"),
    searchBtn: document.querySelector(".search-btn"),
    gallery: document.querySelector(".gallery"),
    loadmoreBtn: document.querySelector(".load-more")
}

let lightbox;
const galleryApiService = new GalleryApiService();
const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more',
});

refs.form.addEventListener('submit', onInput);
refs.loadmoreBtn.addEventListener('click', onLoadMoreBtn);

function onInput(event) {
    event.preventDefault();
    loadMoreBtn.hide();
    galleryApiService.query = event.currentTarget.elements.searchQuery.value;
    
    if (galleryApiService.query === '') {
        loadMoreBtn.hide();
        Notify.failure('Your search query is empty. Please try again.');
        return
    }
    clearGallery();
    galleryApiService.resetPage();
    // loadMoreBtn.disable();
    galleryApiService.fetchGallery()
        .then(({hits, totalHits}) => {
            Notify.success(`Hooray! We found ${totalHits} images.`);
            refs.gallery.insertAdjacentHTML('beforeend', buildPhotoListMarkup(hits));
            loadMoreBtn.show();
            loadMoreBtn.enable();
            endNotification();
            galleryApiService.incrementPage();
            return lightbox = new SimpleLightbox('.gallery a', {
                captionsData: 'alt',
                captionDelay: '250ms',
            });
        })
        .catch(error => console.log("no markup"));   
}

function onLoadMoreBtn(event) {
    event.preventDefault();
    loadMoreBtn.hide();

    galleryApiService.fetchGallery()
        .then(({hits}) => {
            refs.gallery.insertAdjacentHTML('beforeend', buildPhotoListMarkup(hits));
            loadMoreBtn.enable();
            loadMoreBtn.show();
            endNotification();
            galleryApiService.incrementPage();
            return lightbox = new SimpleLightbox('.gallery a', {
                captionsData: 'alt',
                captionDelay: '250ms',
            });
        })
        .catch(error => {
            console.log("no markup");
            loadMoreBtn.hide();
        });

        lightbox.refresh();
}

function clearGallery() {
    refs.gallery.innerHTML = '';
}

function endNotification() {
    if (galleryApiService.page === galleryApiService.pageTotal) {
        loadMoreBtn.hide();
        return Notify.warning("We're sorry, but you've reached the end of search results.");
    }
}








