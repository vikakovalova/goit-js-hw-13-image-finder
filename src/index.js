import './sass/main.scss';
import ImagesApiService from './js/imagesApiService';
import imagesTemplate from './templates/imageCard.hbs'
import LoadMoreBtn from './js/load-more-btn'

const refs = {
    searchForm: document.querySelector('#search-form'),
    input: document.querySelector('#search-form > input'),
    gallery: document.querySelector('.js-gallery'),
    inModalGallery: document.querySelector('.lightbox__content'),
    modal: document.querySelector('.js-lightbox'),
    modalImage: document.querySelector('.lightbox__image'),
    closeBtn: document.querySelector('button[data-action="close-lightbox"]'),
    overlay: document.querySelector('.lightbox__overlay'),
    goTopBtn: document.querySelector('.back_to_top'),
}

const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const imagesApiService = new ImagesApiService();

refs.closeBtn.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

refs.searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.refs.button.addEventListener('click', fetchImagesFn);

function onSubmit (e) {
    e.preventDefault();

    imagesApiService.query = e.currentTarget.elements.query.value;
    if (imagesApiService.query === '') {
        return alert('Nothing to find. Please, write down the word')
    }

    loadMoreBtn.show();
    imagesApiService.resetPage();
    clearGallery();
    fetchImagesFn();
}

function clearGallery() {
    refs.gallery.innerHTML = '';
}

function fetchImagesFn() {
    loadMoreBtn.disable();
    imagesApiService.fetchImages().then(hits => {
        if(!hits.length) {
            refs.input.value = "";
            loadMoreBtn.hide();
            return alert('No images. Please, put another word!')
        }
    appendImagesMarkup(hits);
    loadMoreBtn.enable();
  });
}

function appendImagesMarkup(hits) {
    refs.gallery.insertAdjacentHTML('beforeend', imagesTemplate(hits));
  }


//   ____________________________________________

// модалка

refs.gallery.addEventListener('click', onGalleryItemClick);
refs.closeBtn.addEventListener('click', onModalClose);
refs.overlay.addEventListener('click', onOverlayClick);

function onGalleryItemClick(event) {
    event.preventDefault();
    if (event.target.nodeName !== 'IMG') {
        return;
    }
    originalSizeImageMarkup(event);
    modalOpen();
    onImageSrcAttrChange(event);
}

function originalSizeImageMarkup(event) {
    return event.target.dataset.source;
   
}

function modalOpen() {
    window.addEventListener('keydown', onEscapeKeyPress);
    refs.modal.classList.add('is-open');
}

function onImageSrcAttrChange(event) {
    refs.modalImage.src = event.target.dataset.source;
    refs.modalImage.alt = event.target.alt;
}

function onModalClose() {
    refs.modal.classList.remove('is-open');
    refs.modalImage.src = '';
    window.removeEventListener('keydown', onEscapeKeyPress);
};

function onOverlayClick(event) {
    if (event.currentTarget === event.target) {
        onModalClose();
    }
};

function onEscapeKeyPress(event) {
    if (event.code === "Escape") {
        onModalClose();
    }
}

// _____________________________________
// up btn

window.addEventListener('scroll', trackScroll);
refs.goTopBtn.addEventListener('click', backToTop);

function trackScroll() {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      refs.goTopBtn.classList.add('back_to_top-show');
    }
    if (scrolled < coords) {
      refs.goTopBtn.classList.remove('back_to_top-show');
    }
  }

  function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(backToTop, 0);
    }
  }