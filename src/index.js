import markupGalleryCard from './js/markupGalleryCard';
import PixabayApiService from './js/ApiServicePixabay'
import { lightbox } from './js/Lightbox-Gallery'

import Notiflix from 'notiflix';


const refs = {
    searchForm: document.querySelector('.search-form'),
    galleryContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};


refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const pixabayApiService = new PixabayApiService();

// функция клика по форме
function onSearch(event) {
    event.preventDefault();
    refs.galleryContainer.innerHTML = '';
    pixabayApiService.query = event.currentTarget.elements.searchQuery.value.trim();
    pixabayApiService.resetPage();
    if (pixabayApiService.query === '') {
        Notiflix.Notify.warning('Please, fill the main field');
        return;
    }
    pixabayApiService.fetchGalleryCards()
        .then(data => {
            refs.galleryContainer.innerHTML = '';
            refs.loadMoreBtn.classList.remove('is-hidden');
            if (!data.hits.length) {
                Notiflix.Notify.warning(
                    `Sorry, there are no images matching your search query. Please try again.`,
                );
                refs.loadMoreBtn.classList.add('is-hidden');
                return;
            }
            onMarcupGallery(data);
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images !!!`);
            lightbox.refresh();

            // Бесконечный скролл 
            // const options = {
            //     rootMargin: '50px',
            //     root: null,
            //     threshold: 0.3
            // };
            // const observer = new IntersectionObserver(onLoadMore, options);
            // observer.observe(refs.loadMoreBtn);
        });

}


// кнопка добавляет картинки 
async function onLoadMore() {

    pixabayApiService.fetchGalleryCards().then(onScrollmake);
};

// рендерит массив (дата-параметр) картинок согласно разметки 
function onMarcupGallery(data) {
    const markup = data.hits.map(data => markupGalleryCard(data)).join('');
    refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
};

//скролл для дальнейшего открытия картинок *более 40 шт)
function onScrollmake(data) {
    onMarcupGallery(data);
    lightbox.refresh();
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
    if (data.hits.length < 40 && data.hits.length > 0) {
        refs.loadMoreBtn.classList.add('is-hidden');
        pixabayApiService.incrementPage();
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }


}