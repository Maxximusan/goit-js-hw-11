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
let pages = 0;
let WON = 0


// рендерит массив (дата-параметр) картинок согласно разметки 
function onMarcupGallery(data) {
    const markup = data.hits.map(data => markupGalleryCard(data)).join('');
    refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    pages += 1

};

// функция клика по форме
function onSearch(event) {
    event.preventDefault();
    refs.galleryContainer.innerHTML = '';
    pixabayApiService.query = event.currentTarget.elements.searchQuery.value.trim();
    pixabayApiService.resetPage();
    // pages = 1

    if (pixabayApiService.query === '') {
        Notiflix.Notify.warning('Please, fill the main field');
        return;
    }
    pixabayApiService.fetchGalleryCards()
        .then(data => {
            refs.galleryContainer.innerHTML = '';
            refs.loadMoreBtn.classList.remove('is-hidden');


            // pages = Math.ceil(pixabayApiService.page * data.hits.length);
            data.totalPages = Math.ceil(data.totalHits / data.hits.length)
            WON = data.totalPages

            console.log(data.totalHits)
            console.log(data.hits.length)
            console.log(data.totalPages)
            console.log(data.per_page)
            console.log(pages)
            console.log(WON)

            if (!data.totalHits) {
                Notiflix.Notify.warning(
                    `Sorry, there are no images matching your search query. Please try again.`,
                );
                refs.loadMoreBtn.classList.add('is-hidden');
                return;
            }
            onMarcupGallery(data);
            // let perPage = data.per_page;
            // perPage += data.hits.length
            // pages += data.totalPages
            // console.log(pages)




            if (data.totalHits > 1) {
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images !!!`);
                refs.loadMoreBtn.classList.remove('is-hidden');
                // lightbox.refresh();
            }


            // if (pages === data.totalPages) {
            //     refs.loadMoreBtn.classList.add('is-hidden');
            //     pixabayApiService.incrementPage();

            //     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            // };


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

    await pixabayApiService.fetchGalleryCards().then(onScrollmake);


    // pixabayApiService.incrementPage();
    // pages += 1
    if (pages === WON) {
        refs.loadMoreBtn.classList.add('is-hidden');
        pixabayApiService.incrementPage();

        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    };

    // console.log(pixabayApiService.page)
    console.log(pages)

};



//скролл для дальнейшего открытия картинок
function onScrollmake(data) {
    onMarcupGallery(data);
    lightbox.refresh();
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });


}