// console.log('base js')

var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = "${{amount}}";

Shopify.formatMoney = function(cents, format) {

  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);


  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == 0 || number == null) { return 0; }

    if(precision == 2){
      number = (number/100.0).toFixed(precision).replace('.', decimal);
      
      var parts   = number.split(decimal);
      var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var cents   = parts[1] ? (decimal + parts[1]) : '';
      
      return dollars + cents;
      
    }
    else{
      
      number = number.toString();
      var dollars = number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      
      return dollars;
    }

    
    // return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      if (typeof cents == 'string') { 
        cents = cents.replace('.','');
      }
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      if (typeof cents == 'string') { 
        cents = cents.split('.')[0];
      }
      value = formatWithDelimiters((cents / 100), 0);
      break;
    case 'amount_with_comma_separator':
      if (typeof cents == 'string') { 
        cents = cents.replace('.','');
      }
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      if (typeof cents == 'string') { 
        cents = cents.split('.')[0];
      }
      value = formatWithDelimiters((cents / 100), 0, '.', ',');
      break;
    case 'amount_no_decimals_with_space_separator':
      if (typeof cents == 'string') { 
        cents = cents.split('.')[0];
      }
      value = formatWithDelimiters((cents / 100), 0, '.', ' ');
      break;
    case 'amount_with_apostrophe_separator':
      if (typeof cents == 'string') { 
        cents = cents.replace('.','');
      }
      value = formatWithDelimiters(cents, 2, '\'', '.');
      break;
    case 'amount_with_space_separator':
      if (typeof cents == 'string') { 
        cents = cents.replace('.','');
      }
      value = formatWithDelimiters(cents, 2, ' ', ',');
      break;
    case 'amount_with_period_and_space_separator':
      if (typeof cents == 'string') { 
        cents = cents.replace('.','');
      }
      value = formatWithDelimiters(cents, 2, ' ');
      break;
  }


  return formatString.replace(placeholderRegex, value);
};


// Lazyloading image
function lazyloading(imageContainer){
    var img = imageContainer.querySelector('.lazy-loading-image--main');
    img.setAttribute('aria-hidden', false);
    
    function loaded() {
        imageContainer.classList.add("lazy-loaded-image");
    }
    
    if(img){
        if (img.complete) {
            loaded();
        } else {
            img.addEventListener("load", loaded);
        }
    }
}

var lazyloadingimages = document.querySelectorAll('.lazy-loading-image')
lazyloadingimages.forEach(imageContainer => {
    lazyloading(imageContainer);

})



// document.addEventListener("DOMContentLoaded", function() {
// console.log("dom loaded");
// });


// Animation
const options = {
    rootMargin: '-10px'
};

const callback = (entries) => {
    // console.log("entries", entries);

    entries.forEach(entry => {
        // console.log("entry", entry, entry.boundingClientRect.top);

        var element = entry.target
        
        if(entry.boundingClientRect.top < 0){
            // element.classList.remove("has-animation")
            element.classList.add("has-animation-in-viewport")
            animationObserver.unobserve(element)
        }

        if(entry.isIntersecting){
            element.classList.add("has-animation-in-viewport")
            animationObserver.unobserve(element)
        }

    })

} 

const animationObserver = new IntersectionObserver(callback, options)

var animationElements = document.querySelectorAll('.has-animation');

animationElements.forEach(element => {
    
    animationObserver.observe(element);
})




// Animation 
// const Obs = new IntersectionObserver((entries, animationObserver) => {
//     entries.forEach(entry => {
//         entry.isIntersecting ? entry.target.classList.add("has-animation-in-viewport") : ''


//         // animationObserver.unobserve(entry);
//     });
// });

// var animationSections = document.querySelectorAll('.has-animation');

// animationSections.forEach( animationSection => {
//     var options = {}; // animationSection.dataset.animationOptions;

//     Obs.observe(animationSection, options);
// })

// $('.has-animation').each(function () {
//     var $this = $(this);
//     var el = $this[0];

//     var elOptions = $this.data('animation-options') || {};

//     Obs.observe(el, elOptions);
// });


// Back to top
var backToTop = document.querySelector('.back-to-top')
if( backToTop ){
    window.addEventListener('scroll', () => {
        var documentHeight = document.body.offsetHeight;
        if( documentHeight > 2000 && (this.scrollY > 2000) ){
            backToTop.classList.add('active');
        }
        else{
            backToTop.classList.remove('active');
        }
    })

    backToTop.addEventListener('click', function(){
        window.scrollTo(0, 0);
    })
}

var floatingHeader = document.querySelector('.has-floating-header')
if( floatingHeader ){

    var firstElement = document.querySelector('.main >.shopify-section:first-of-type>.section-slideshow, .main >.shopify-section:first-of-type>.section-image-banner, .main >.shopify-section:first-of-type>.section-image-slideshow, .main >.shopify-section:first-of-type>.section-newsletter, .main >.shopify-section:first-of-type>.section-collection-banner.has-background, .main >.shopify-section:first-of-type>.main-page-header.has-background, .main >.shopify-section:first-of-type>.section-article.has-background');

    var floatingLogo = document.querySelector('.floating-logo');

    var headerColorScheme = '';
    var floatingHeaderColorScheme = floatingHeader.dataset.floatingColorScheme

    if(firstElement){
        var firstElementHeight = firstElement.offsetHeight;

        floatingHeader.classList.forEach(className => {
            if(className.includes('scheme')){
                headerColorScheme = className
            }
        })
        floatingHeader.classList.remove(headerColorScheme);
        floatingHeader.classList.add(floatingHeaderColorScheme);
        if(floatingLogo){
            floatingLogo.classList.add('active');
        }
    }

    window.addEventListener('scroll', () => {
        
        if(firstElement){

            if( this.scrollY < firstElementHeight ){
                floatingHeader.classList.add(floatingHeaderColorScheme);
                floatingHeader.classList.remove(headerColorScheme);
                if(floatingLogo){
                    floatingLogo.classList.add('active');
                }
            }
            else{
                floatingHeader.classList.remove(floatingHeaderColorScheme);
                floatingHeader.classList.add(headerColorScheme);
                if(floatingLogo){
                    floatingLogo.classList.remove('active');
                }
            }
        }
    })
}






var productListItemTops = document.querySelectorAll('.product__top')
productListItemTops.forEach(productListItemTop => {
    productListItemTop.classList.remove("not-loaded");
})


// Product quantity picker
class ProductQuantityPicker extends HTMLElement{
    constructor(){
        super();

        var productQualityPickerSpan = this.querySelectorAll('span');

        for(let qualityCounter of productQualityPickerSpan){
            qualityCounter.addEventListener('click', (event) => this.onClick(event, qualityCounter))
            qualityCounter.addEventListener('keypress', (event) => this.onClick(event, qualityCounter))
            
        }

    }

    onClick = (event, qualityCounter) => {

        var isKeypressValid = event.type == 'keypress' && event.key === 'Enter'

        if( !(event.type == 'click' || isKeypressValid) ){
            return false;
        }

        var qtyInput = this.querySelector('input:not([disabled])');
        if(!qtyInput){
            return false
        }

        var qtyInputValue = qtyInput.value //qtyInput.getAttribute('value');
        var qtyInputMin = parseInt(qtyInput.getAttribute('min'));
        var qtyInputMax = parseInt(qtyInput.getAttribute('max'));

        if( qualityCounter.classList.contains('qty-minus') ){
            if( isNaN(qtyInputMin) || qtyInputMin < qtyInputValue ){
                qtyInputValue--
            }
        }
        if( qualityCounter.classList.contains('qty-plus') ){
            if( isNaN(qtyInputMax) || qtyInputMax > qtyInputValue ){
                qtyInputValue++
            }
        }

        qtyInput.value = qtyInputValue;
        qtyInput.dispatchEvent(new Event('change', { bubbles: true }));


        // console.log("quantity", qtyInput.getAttribute('value'), qtyInputValue)
    }
}

customElements.define( 'product-quantity-picker', ProductQuantityPicker );


// // Megamenu animation
// var megamenuElements = document.querySelectorAll('.has-megamenu');

// megamenuElements.forEach(megamenuElement => {
//         console.log("megamenuElement", megamenuElement);

//     var megamenuItemsAnimation = megamenuElement.querySelectorAll('.has-animation');

//     megamenuElement.addEventListener('mouseover', (e) => {
//         setTimeout(function(){
//             megamenuItemsAnimation.forEach(megamenuItem => {
//                 megamenuItem.classList.add(megamenuItem.dataset.animation);
//             })
//         }, 300);
//     })

//     megamenuElement.addEventListener('mouseleave', (e) => {
//         megamenuItemsAnimation.forEach(megamenuItem => {
//             megamenuItem.classList.remove(megamenuItem.dataset.animation);
//         })
//     })
// })


// Search Dropdown
class SearchDropdown extends HTMLElement {
    constructor() {
        super();

        this.dropdownToggle = this.querySelector('.search-dropdown-header-form'); // this.querySelector('.search-dropdown-toggle');
        this.dropdownContents = this.querySelector('.search-dropdown-container');
        this.searchField = this.querySelector('input[type="search"]');
        this.dropdownClose = this.querySelector('.search-dropdown-close');
        // console.log("search dropdown called");

        this.searchField.addEventListener('click', (e) => {
            e.preventDefault();

            this.onClick(e)
        });

        this.dropdownClose.addEventListener('click', () => this.close())
        // this.dropdownToggle.addEventListener('click', () => { this.searchField.focus() });

        document.addEventListener('click', (event) => {
            if (event.target !== this && !this.contains(event.target)) {
                this.close()
            }
        })
    }

    onClick(e) {
        // e.stopPropagation();

        // console.log("dropdown", e.target)

        if( !this.classList.contains('active') ){
            this.open();

            setTimeout(() => {
                this.searchField.focus()
            }, 100);
        }
        // else{
        //     this.close();
        // }
    }

    open() {
        this.classList.add('active');
    }

    close() {
        this.classList.remove('active');
    }
}

customElements.define('search-dropdown', SearchDropdown);


// Slideshow
const slideshowElements = document.querySelectorAll('.section-slideshow.has-carousel');

slideshowElements.forEach((carouselElement) => {
    let carouselOptions = null;
    let carouseProgressBar = null;

    if (carouselElement.dataset.options) {
        carouselOptions = JSON.parse(carouselElement.dataset.options);
    }

    carouselOptions['classes'] = {
        // Add classes for arrows.
        arrows: 'splide__arrows',
        arrow : 'splide__arrow',
        prev  : 'splide__arrow--prev',
        next  : 'splide__arrow--next',

        // // Add classes for pagination.
        // pagination: 'splide__pagination your-class-pagination', // container
        // page      : 'splide__pagination__page your-class-page', // each button
    };


    
    const splide = new Splide(carouselElement, carouselOptions);


    splide.on( 'mounted', function () {

        var carouselArrows = carouselElement.querySelector('.splide__arrows');
        var carouselPagination = carouselElement.querySelector('.splide__pagination');
        
        var carouselElementSlides = carouselElement.querySelectorAll('.section-slideshow-slide');
        carouselElementSlides.forEach((slide, index) => {
            
            if(index == 0){
                slide.classList.forEach(className => {
                    if(className.includes('scheme')){

                        if(carouselArrows){
                            carouselArrows.classList.add(className)
                        }
                        if(carouselPagination){
                            carouselPagination.classList.add(className)
                        }
                    }
                })
            }
        })


        let activeIndex = splide.index;
        let activeSlide = splide.Components.Elements.slides[activeIndex];

        let activeSlideVideo = activeSlide.querySelector('video');

        if(activeSlideVideo){

            splide.Components.Autoplay.pause(); // Pause autoplay
            // console.log("slide paused", splide.Components.Controller.getNext())
            const nextIndex = splide.Components.Controller.getNext();

            activeSlideVideo.currentTime = 0; // Set the time to start from the beginning
            activeSlideVideo.play(); // Play the video

            activeSlideVideo.addEventListener("timeupdate", function () {

                if (activeSlideVideo.currentTime >= activeSlideVideo.duration - 0.5) { 
                    // console.log("moving to destination slide")
                    splide.Components.Controller.go(nextIndex);
                    splide.Components.Autoplay.play(); // Play autoplay
                    // console.log("slide play")
                }
            });
        }

    } );

    var imageContainer = carouselElement.querySelector('.lazy-loading-image');

    if(imageContainer){
        var img = imageContainer.querySelector('.lazy-loading-image--main');
    }
    else{
        splide.mount();
    }

    function loaded() {
        if(imageContainer){
            imageContainer.classList.add("lazy-loaded-image");
        }

        splide.mount();

    }
    
    if(imageContainer){
        if (img.complete) {
            loaded();
        } else {
            img.addEventListener("load", loaded);
        }
    }


    splide.on( 'active', function (Slide) {

        var activeCarouselElement = Slide.slide

        var carouselArrows = carouselElement.querySelector('.splide__arrows');
        var carouselPagination = carouselElement.querySelector('.splide__pagination');

        if(carouselArrows){
            carouselArrows.classList.forEach(className => {
                if (className.startsWith('scheme')) {
                    carouselArrows.classList.remove(className);
                }
            })
        }

        if(carouselPagination){
            carouselPagination.classList.forEach(className => {
                if (className.startsWith('scheme')) {
                    carouselPagination.classList.remove(className);
                }
            })
        }

        activeCarouselElement.classList.forEach(className => {
            if(className.includes('scheme')){

                if(carouselArrows){
                    carouselArrows.classList.add(className)
                }
                if(carouselPagination){
                    carouselPagination.classList.add(className)
                }
            }
        })

    } );



    splide.on( 'moved', function (newIndex, prevIndex, destIndex) {
        // console.log("slide is moved", newIndex, prevIndex, destIndex)

        let activeIndex = splide.index;
        let activeSlide = splide.Components.Elements.slides[activeIndex];

        let activeSlideVideo = activeSlide.querySelector('video');

        if(activeSlideVideo){

            splide.Components.Autoplay.pause(); // Pause autoplay
            // console.log("slide paused", splide.Components.Controller.getNext())
            const nextIndex = splide.Components.Controller.getNext();

            activeSlideVideo.currentTime = 0; // Set the time to start from the beginning
            activeSlideVideo.play(); // Play the video

            activeSlideVideo.addEventListener("timeupdate", function () {

                if (activeSlideVideo.currentTime >= activeSlideVideo.duration - 0.5) { 
                    // console.log("moving to destination slide")
                    splide.Components.Controller.go(nextIndex);
                    splide.Components.Autoplay.play(); // Play autoplay
                    // console.log("slide play")
                }
            });
        }
        
    });

    
    var slideVideos = carouselElement.querySelectorAll('video');
    slideVideos.forEach(slideVideo => {
        var slideVideoControls = slideVideo.closest('.section-slideshow-slide').querySelector('.section-slideshow-slide-video-controls');
        slideVideoControls.addEventListener('click', function(){
            console.log("video controls clicked");
            if(slideVideo.paused){
                slideVideoControls.classList.remove('video-paused');
                slideVideo.play();
            }
            else{
                slideVideoControls.classList.add('video-paused');
                slideVideo.pause();
            }
        })
    })

    
});


// Carousel
const carouselElements = document.querySelectorAll('.has-carousel:not(.section-slideshow)');

carouselElements.forEach(carouselElement => {
    // if (carouselElement.classList.contains('splide') && !carouselElement.classList.contains('product-gallery-images')) {
        // console.log("carousel element", carouselElement);
        let carouselOptions = {};
        let carouseProgressBar = null;
        
        if (carouselElement.dataset.options) {
            carouselOptions = JSON.parse(carouselElement.dataset.options);
        }

        if(carouselElement.dataset.progressBar){
            carouseProgressBar = JSON.parse(carouselElement.dataset.progressBar)
        }


        // console.log("carousle options", carouselOptions);

        // console.log("progress bar option", carouseProgressBar)

        if(carouselElement.classList.contains('section-featured-products-list') || carouselElement.classList.contains('section-featured-products-tabs-products-list') || carouselElement.classList.contains('section-handpicked-products-list') || carouselElement.classList.contains('section-featured-collections-list') || carouselElement.classList.contains('section-image-cards-carousel-cards')){
            if(carouselElement.classList.contains('has-carousel-columns-offset')){
                carouselOptions['autoWidth'] = true
            }
        }

        carouselOptions['classes'] = {
            // Add classes for arrows.
            arrows: 'splide__arrows',
            arrow : 'splide__arrow',
            prev  : 'splide__arrow--prev',
            next  : 'splide__arrow--next',
    
            // // Add classes for pagination.
            // pagination: 'splide__pagination your-class-pagination', // container
            // page      : 'splide__pagination__page your-class-page', // each button
        };
        // console.log("carouselElement", carouselElement)
        const splide = new Splide(carouselElement, carouselOptions);

        var imageContainer = carouselElement.querySelector('.lazy-loading-image');

        if(imageContainer){
            var img = imageContainer.querySelector('.lazy-loading-image--main');
        }
        else{
            splide.mount();
        }

        function loaded() {
            if(imageContainer){
                imageContainer.classList.add("lazy-loaded-image");
            }

            splide.mount();

        }
        
        if(imageContainer){
            if (img.complete) {
                loaded();
            } else {
                img.addEventListener("load", loaded);
            }
        }

        splide.on( 'mounted', function () {
            carouselArrowCorrection(carouselElement)
        } );

        var splideBar = splide.root.querySelector( '.splide__progress-bar' );

        if( splideBar ){
            // Updates the bar width whenever the carousel moves:
            splide.on( 'mounted move', function () {
                var end  = splide.Components.Controller.getEnd() + 1;
                var rate = Math.min( ( splide.index + 1 ) / end, 1 );
                splideBar.style.width = String( 100 * rate ) + '%';
            } );
        }

        if( carouselElement.classList.contains('section-image-with-text-slider-content') ){
            splide.on( 'moved', function (newIndex, prevIndex, destIndex) {
                // console.log('newIndex', newIndex, prevIndex, destIndex);
                var textSliderPagination = carouselElement.querySelector('.section-image-with-text-slider-pagination')
                if(textSliderPagination){
                    var textSliderPaginationCurrent = textSliderPagination.querySelector('.section-image-with-text-slider-pagination-current')
                
                    textSliderPaginationCurrent.innerHTML = newIndex + 1;
                }
            } );
        }

        // splide.mount();
    // }
});

function carouselArrowCorrection(list){

    var listItem = list.querySelector('li');
    if(listItem){

        var listItemImage = listItem.querySelector('.lazy-loading-image--main')

        function imageLoaded(img) {
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            const containerWidth = listItem.clientWidth; // Get container width
            const aspectRatio = width / height; // Original aspect ratio

            const calculatedHeight = Math.round(containerWidth / aspectRatio);

            // console.log("product carousel arrow correction called", img.offsetHeight, img.height, height, calculatedHeight);

            list.style.setProperty('--carousel-image-height', (calculatedHeight / 2) + 'px');
        }
      
        if(listItemImage){
            if (listItemImage.complete && listItemImage.naturalHeight > 0) {
                imageLoaded(listItemImage);
            } else {
                listItemImage.onload = imageLoaded(listItemImage);
            }
        }


            // console.log("list item", listItem, listItemImage);

        // console.log("product carousel arrow correction called", list, listItem.clientWidth, listItemImage.offsetHeight);

        // if( listItemImage.complete && listItemImage.naturalHeight > 0 ){
        //     // console.log("list item", listItemImage.offsetHeight);

        //     list.style.setProperty('--carousel-image-height', (listItemImage.offsetHeight / 2) + 'px');
        // }
    }
}


// window.onload = function(){

// }

// window.onresize = function(){

//     var productsLists = document.querySelectorAll('.section-featured-products-list');
//     var productsTabsLists = document.querySelectorAll('.section-featured-products-tabs-products-list');
//     var productsHandpickedLists = document.querySelectorAll('.section-handpicked-products-list');
//     var collectionsLists = document.querySelectorAll('.section-featured-collections-list');

//     [...productsLists, ...productsTabsLists, ...productsHandpickedLists, ...collectionsLists].forEach(list => {
//         if( list.classList.contains('has-carousel') ){
//             carouselArrowCorrection(list);
//         }
//     })
// }




// Popup modal
class PopupModal extends HTMLElement{
    constructor(){
        super();

        this.cookieOnloadNature = this.dataset.popupOnload || 'notification';
        this.isDisableScroll = false;

        this.popupCloseButton = this.querySelector('.popup-modal__close');
        this.popupOverlay = this.querySelector('.popup-modal__overlay');


        if( this.cookieOnloadNature == 'verification' ){
            this.isDisableScroll = true;
        }

        if(this.popupCloseButton){
            this.popupCloseButton.addEventListener('click', () => {
                this.onClose();
            })
        }

        if(this.popupOverlay && this.cookieOnloadNature == 'notification'){
            this.popupOverlay.addEventListener('click', () => {
                this.onClose();
            })
        }


        if( this.dataset.popupType == 'onload' ){
            this.handleOnLoadPopup();

            this.sectionPopupClose = this.querySelector('.section-popup-button-close');

            if( this.sectionPopupClose ){
                this.sectionPopupClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    this.onClose();
                })
            }
            
        }



    }
    disableScroll = () => {
        if(!Shopify.designMode){
        // if(!this.classList.contains('inactive')){
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        // }
        }
    }

    enableScroll = () => {
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('height');
    }

    onClose = () => {
        // this.remove();
        this.classList.add('inactive');
        this.classList.remove('quickview-modal');
        
        this.querySelector('.popup-modal__content').innerHTML = '';

        this.enableScroll();
    }


    handleOnLoadPopup = () => {
        // console.log("its newsletter popup");

        this.style.display = null;

        var expireOn = parseInt(this.dataset.popupExpiry);
        var delay = this.dataset.popupDelay;
        var cookieName = this.dataset.popupCookieName;
        var frequency = 1;
        

        if( this.cookieOnloadNature == 'verification' ){
            var confirmBtn = this.querySelector('.confirm-button');

            if( confirmBtn ){
                confirmBtn.addEventListener('click', () => {

                    Cookies.set(cookieName, true, { expires: expireOn, path: '/' });

                    this.onClose();
                
                })
            }
                
            if (Cookies.get(cookieName)) {
                this.onClose();
            }
            else {
                window.onload = setTimeout( () => {
                    this.classList.remove('inactive');

                    if(this.isDisableScroll){
                        this.disableScroll();
                    }
                }, delay )
            }
        }
        else if (this.cookieOnloadNature == 'notification'){

            var visits = 0;
            if( Cookies.get(cookieName) ){
                visits = Cookies.get(cookieName);
            }
            visits++;

            Cookies.set(cookieName, visits, { expires: expireOn, path: '/' });

            if (Cookies.get(cookieName) > frequency) {

                this.onClose();
            }
            else {
                window.onload = setTimeout( () => {
                    this.classList.remove('inactive');
                    
                    if(this.isDisableScroll){
                        this.disableScroll();
                    }
                }, delay )
            }
        }


    }
}

customElements.define('popup-modal', PopupModal)




// Quickview
document.addEventListener('click', (e) => {
    if( e.target.closest('.product-quickview') ){
        var productQuickview = e.target.closest('.product-quickview'); 

        var handle = productQuickview.dataset.handle


        productQuickview.classList.add('loading');


        var popupModal = document.querySelector('.popup-modal-quickview');

        if( !popupModal ){
            var quickviewModalString = `<popup-modal class="popup-modal popup-modal-quickview">
            <div class="popup-modal__overlay"></div>
            <div class="popup-modal__inner">
                <div class="popup-modal__content quickview-popup-model__content">
                </div>
                <button class="popup-modal__close">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1.11092" y1="0.610962" x2="8.88909" y2="8.38914" stroke="currentColor" stroke-linecap="round"/>
                        <line x1="1.11096" y1="8.38915" x2="8.88914" y2="0.610971" stroke="currentColor" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            </popup-modal>
                          `
            var quickviewModal = new DOMParser().parseFromString(quickviewModalString, 'text/html').querySelector('popup-modal')

            document.body.append(quickviewModal);
        }
        else{
            popupModal.classList.remove('inactive');
            popupModal.classList.remove('section-popup');
            popupModal.classList.add('quickview-modal');
        }



        fetch(`${window.Shopify.routes.root}products/${handle}?view=quickview`)
        // fetch(`${window.Shopify.routes.root}products/${handle}?view=quickview&section_id=quickview`)
            .then((response) => {
                // console.log("res", response)
                if (!response.ok) {
                    var error = new Error(response.status);
                    throw error;
                }

                return response.text();
            })
            .then((res) => {
                // console.log("res", res);

                // Recentlyviewed products cookie 
                setRecentlyViewedProducts(productQuickview.dataset.productId);

                productQuickview.classList.remove('loading');

                // var html = new DOMParser().parseFromString(res, 'text/html').querySelector('.shopify-section');
                var html = new DOMParser().parseFromString(res, 'text/html').querySelector('.main-product');
                
                // console.log("html", html)


                html.classList.add('quickview-product')
                html.classList.remove('main-product');


                var productInfoButtons = html.querySelectorAll('.product-info-popup__button');
                for( let productInfoButton of productInfoButtons ){
                    productInfoButton.setAttribute('target', '_blank');
                }

                var popupModalContent = document.querySelector('.quickview-popup-model__content');
                popupModalContent.innerHTML = '';
                popupModalContent.append(html);
                console.log("after change")


                const resultsLazyloadImages = popupModalContent.querySelectorAll('.lazy-loading-image');

                resultsLazyloadImages.forEach(imageContainer => {
                    lazyloading(imageContainer);
                })

                if (window.Shopify && Shopify.PaymentButton) {
                    Shopify.PaymentButton.init();
                }
                
                var quickviewPopup = document.querySelector('body .popup-modal-quickview');
                quickviewPopup.querySelector('a[href]').focus();
                var popupClose = quickviewPopup.querySelector('.popup-modal__close');
                if( popupClose ){
                    popupClose.addEventListener('keyup', (event) => {
                        // e.preventDefault();
                        if (event.key === 'Enter') {
                            productQuickview.closest('.product').querySelector('a[href]').focus();
                        }

                    })
                }


                document.addEventListener('keyup', (event) => {
                    if(event.key === 'Escape'){

                        quickviewPopup.classList.add('inactive');
                        quickviewPopup.classList.remove('quickview-modal');
                        
                        quickviewPopup.querySelector('.popup-modal__content').innerHTML = '';

                        productQuickview.closest('.product').querySelector('a[href]').focus();
                    }
                })

            })
            .catch((error) => {
                throw error;
            });

    }
})

// Product swatch hover image
document.addEventListener('mousemove', (e) => {
    if( e.target.classList.contains('product-swatches-swatch') ){
        var productSwatch = e.target; 

        var productSwatchVariantId = productSwatch.dataset.variantId

        // console.log("product swatch", productSwatch);
        var productImageElement = productSwatch.closest('.product').querySelector('.product__image');

        var swatchVariantImages = productImageElement.querySelectorAll('.product-swatches-variant-images-variant-image')
        swatchVariantImages.forEach(swatchVariantImage => {
            if(swatchVariantImage.dataset.variantId == productSwatchVariantId){
                swatchVariantImage.classList.add('active')
            }
            else{
                swatchVariantImage.classList.remove('active')
            }
        })
    }
    else{
        var swatchVariantImages = document.querySelectorAll('.product-swatches-variant-images-variant-image')
        swatchVariantImages.forEach(swatchVariantImage => {
            swatchVariantImage.classList.remove('active')
        })
    }
})


// Shoppable Pins 
class ShoppablePins extends HTMLElement {
    constructor(){
        super();


        this.product = this.querySelector('.section-image-banner-with-pins-pins-list-item-product');

        var pin = this.querySelector('.section-image-banner-with-pins-pins-list-item-pin');
        
        pin.addEventListener('click', (event) => {
            // var this = pin.parentNode
            // console.log("pin parent", this);
            // console.log("pin clicked", this.classList.contains('active'));
            this.classList.contains('active') ? this.close() : this.open(event)
        })
    
    
        document.addEventListener('click', (event) => {

            if (event.target !== this && !this.contains(event.target)) {
                this.close()
            }
        })
    }


    // open() {
    //     this.product.style.display = 'block';

    //     setTimeout(() => {
    //         this.classList.add('active')
    //     }, 50);
    // }
    // close() {
    //     this.classList.remove('active')

    //     setTimeout(() => {
    //         this.product.style.display = 'none';
    //     }, 300);
    // }

    open(event) {

        if(window.innerWidth < 600){
            this.product.style.setProperty('--pin-offset-top', Math.ceil(this.getBoundingClientRect().top) + 'px');

            window.addEventListener('scroll', () => {
                this.product.style.setProperty('--pin-offset-top', Math.ceil(this.getBoundingClientRect().top) + 'px');
            })
        }

        this.product.style.display = 'flex';

        var panelHeight = this.product.offsetHeight;
        var panelWidth = this.product.offsetWidth;
        var x = event.clientX, 
        y = event.clientY;

        
        if( (window.innerHeight - y) > panelHeight ){
            this.product.classList.add('place-below');
        }
        else if( y > panelHeight ){
            this.product.classList.add('place-above');
        }
        else{
            this.product.classList.add('place-center');
        }


        if(window.innerWidth >= 600){
            if( (window.innerWidth - x) > panelWidth ){
                this.product.classList.add('place-right');
            }
            else if( y > panelWidth ){
                this.product.classList.add('place-left');
            }
            else{
                this.product.classList.add('place-center');
            }
        }

        setTimeout(() => {
            this.classList.add('active')
        }, 50);
        // this.classList.add('active');

    }

    close() {
        this.classList.remove('active');


        setTimeout(() => {
            this.product.classList.remove('place-above', 'place-below', 'place-center', 'place-left', 'place-right');
            this.product.style.display = 'none';
        }, 300);
    }

}
customElements.define('shoppable-pin', ShoppablePins)



function AjaxProductUpdate(product, data){

    var cartCountElements = document.querySelectorAll('.cart-count');
    var cartDrawerSelector = '.cart-drawer-inner';

    // Count update
    for(let cart_count of cartCountElements){
        var totalCount = parseInt(data['quantity']);
        
        if(cart_count.textContent){
            totalCount = parseInt(cart_count.textContent) + parseInt(data['quantity'])
        }
        
        cart_count.textContent = totalCount
        // cart_count.textContent = product.item_count
    }

    // Drawer update
    var cartDrawer = product.sections['cart-drawer'];
    var cartDrawerInnerDOM = new DOMParser().parseFromString(cartDrawer, 'text/html').querySelector(cartDrawerSelector);

    var cartDrawerInner = document.querySelector('.cart-drawer-inner');
    if( cartDrawerInner ){
        cartDrawerInner.replaceWith(cartDrawerInnerDOM);
    }



    // console.log("form data", data);

    var cartProductUpsellSelector = '.cart-product-upsell';
    var cartProductUpsell = document.querySelector(cartProductUpsellSelector);

    
    if(cartProductUpsell){
        // event.preventDefault();

        var cartUpsellItemId = cartProductUpsell.dataset.itemId
        var cartUpsellItemQty = parseInt(cartProductUpsell.querySelector('input[type="number"]').value)
        
        var itemQty = parseInt(data.quantity)

        var updates = {
            [cartUpsellItemId]: cartUpsellItemQty + itemQty
        }
        
        ChangeCartJson(updates);
    }
}


// Product add to cart Ajax
document.body.addEventListener('click', event => {

    let productAddToCartSelector = '.product-add-to-cart';
    let productAddToCart = event.target.closest(productAddToCartSelector);

    if( productAddToCart && !productAddToCart.hasAttribute('disabled') ){
        event.preventDefault();

        let cartDrawerSelector = 'cart-drawer';
        // let addToCartForm = event.target.closest('form[action$="/cart/add"]');
        let addToCartForm = event.target.closest('.product-options-form');

        let formData = new FormData(addToCartForm);
        let data = Object.fromEntries(formData.entries());

        // data['sections'] = [
        //     cartDrawerSelector
        // ];
        formData.append(
            'sections',
            cartDrawerSelector
        );

        let productSummary = productAddToCart.closest('.product-summary');
        if( productSummary ){
            let productSummaryTitle = productSummary.querySelector('.product-summary__title');
            let productSummaryAction = productSummary.querySelector('.product-summary__action');
            let productQty = productSummary.querySelector('input[name="quantity"]');

            if( (parseInt(data['quantity']) > parseInt(productQty.getAttribute('max'))) && productAddToCart.hasAttribute('disabled') ){

                let productSelect = addToCartForm.querySelector('select');
                
                if( productSummaryAction.firstElementChild.classList.contains('error') ){
                    let errorParagraph = productSummaryAction.firstElementChild;
                    errorParagraph.innerHTML = productAddToCart.dataset.textQtyError.replace('%qty', productQty.getAttribute('max') + ' ' + productSummaryTitle.innerText + ' - ' + productSelect.options[productSelect.selectedIndex].textContent.trim());
                }
                else{
                    let errorParagraph = document.createElement('p');
                    errorParagraph.classList.add('error');
                    errorParagraph.innerHTML = productAddToCart.dataset.textQtyError.replace('%qty', productQty.getAttribute('max') + ' ' + productSummaryTitle.innerText + ' - ' + productSelect.options[productSelect.selectedIndex].textContent.trim());
                    productSummaryAction.prepend( errorParagraph )
                }

                return false;
            }

            // console.log("data", data);

            // Recipient Form 
            var recipientForm = productSummary.querySelector('.recipient-form');
            if( recipientForm ){
                var recipientFormErrors = recipientForm.querySelector('.recipient-form-errors');
                var isRecipientFormEnabled = productSummary.querySelector('.recipient-form-toggle input:checked') ? true : false;
                var recipientFormInputs = recipientForm.querySelectorAll('.recipient-form-fields--field');

                // console.log("checked togggle", isRecipientFormEnabled);

                if( isRecipientFormEnabled ){
                    var errors = [];
                    recipientFormInputs.forEach(formInput => {
                        // console.log("form input", formInput);
                        if( formInput.classList.contains('required') ) {
                            // console.log("form input", formInput);

                            if( formInput.getAttribute('type') == 'email' ){
                                var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                var formInputValue = formInput.value;
                                // console.log( "Email validation", pattern.test(formInputValue) );

                                if( !pattern.test(formInputValue) ){
                                    errors.push('Enter a valid email address');

                                }
                            }
                        }
                        if( formInput.getAttribute('type') == 'date' ){
                            // console.log("difference", new Date().toString(), new Date(Date.parse(formInput.value)))
                            
                            var timeDiff = new Date(Date.parse(formInput.value)).getTime() - new Date().getTime();
                            var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                            if( daysDiff < 0 || daysDiff > 90 ){
                                errors.push('Enter a valid date (not longer than 90 days from now)');
                            }
                            
                        }
                    });
                    // console.log("errors", errors);
                    if( errors.length > 0 ){
                        var errorElements = errors.map(function(element) {
                            return `<li>${element}</li>`;
                        });

                        recipientFormErrors.innerHTML = errorElements.join("");

                        return false;

                    }
                }
            }
        }


        fetch(`${window.Shopify.routes.root}cart/add`, {
            method: 'POST',
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/javascript' },
            // body: JSON.stringify(data)
            body: formData
        })
        .then(response => {
            // console.log("response errors", response.text());
            
            return response.json();
        })
        .then(res => {
            // console.log("res", res);
            if (res.status == 422) {
                if( productSummary ){
                    let productSummaryAction = productSummary.querySelector('.product-summary__action');

                    if( productSummaryAction.firstElementChild.classList.contains('error') ){
                        let errorParagraph = productSummaryAction.firstElementChild;
                        errorParagraph.innerHTML = res.description;
                    }
                    else{
                        let errorParagraph = document.createElement('p');
                        errorParagraph.classList.add('error');
                        errorParagraph.innerHTML = res.description;
                        productSummaryAction.prepend( errorParagraph )
                    }
                }

                return false;
            }


            AjaxProductUpdate(res, data);

            let cartDrawer = document.querySelector('cart-drawer');
            if( cartDrawer ){

                // // Drawer show
                // cartDrawer.setAttribute('aria-hidden', 'false');
                // cartDrawer.classList.add('active');

                // setTimeout(() => {
                //     cartDrawer.querySelector('a[href]').focus();
                // }, 100)

                document.querySelector('.section-header-cart-drawer-toggle').click();

                // Drawer images lazyload
                const resultsLazyloadImages = cartDrawer.querySelectorAll('.lazy-loading-image');
                resultsLazyloadImages.forEach(imageContainer => {
                    lazyloading(imageContainer);
                })

            }


            // Popup (Quickview) hide
            let popupModal = document.querySelector('popup-modal');
            if( popupModal ){
                popupModal.classList.add('inactive');
                popupModal.querySelector('.popup-modal__content').innerHTML = '';
            }

        })
        .catch((error) => {
            console.error(error);
        });


    }

});

class ProductVariantsSelectors extends HTMLElement{
    constructor(){
        super();

        const url = window.location.search;
        const urlParams = new URLSearchParams(url);
        const currentVariant = urlParams.get('variant');


        this.productVariantSelectors = this.querySelectorAll('select');

        this.productVariantSelectors.forEach(variant => { 

            if( currentVariant && currentVariant != '' ){
                const variantId = variant.options[variant.selectedIndex].value;

                if( variantId == currentVariant ){

                    this.onVariantChange(variant);
                }
            }
            
            variant.addEventListener('change', (event) => {
                this.onVariantChange(variant);
            })
        })
        
    }

    onVariantChange = (productVariantSelector) => {
        
        const variantId = productVariantSelector.options[productVariantSelector.selectedIndex].value;
        const summarySelector = '.product'

        // console.log("variant change triggered", variantId);


        var productAddtocartElement = productVariantSelector.closest(summarySelector).querySelector('.product-add-to-cart');
        var productQtyElement = productVariantSelector.closest(summarySelector).querySelector('.product-inventory-qty');
        var productPriceElement = productVariantSelector.closest(summarySelector).querySelector('.product-price')

        if( variantId == 'none' ){

            productAddtocartHtml = '<span>' + productAddtocartElement.dataset.textUnavailable + '</span>'
            productAddtocartElement.disabled = true

            productAddtocartElement.innerHTML = productAddtocartHtml;
            productQtyElement.innerHTML = '';
            if(productPriceElement){
                productPriceElement.classList.add('hide');
            }
            // productQtyElement.classList.add('hide');

            return false;
        }
        else{
            // productQtyElement.classList.remove('hide');
            if(productPriceElement){
                productPriceElement.classList.remove('hide');
            }
        }

        
        // fetch(`${window.Shopify.routes.root}variants/${variantId}?section_id=product-variant-image`)
        // .then(response => response.text())
        // .then(res => {
        //     console.log("res", res)
        // })
        // .catch(error => {
        //     console.error(error);
        // })


        fetch(`/variants/${variantId}.json`)
        .then(response => response.json())
        .then(res => {
            // console.log("res", res)
            const productVariant = res.product_variant
            
            const comparePriceValue = productVariant.compare_at_price;
            const priceValue = productVariant.price;
            const unitPriceValue = productVariant.unit_price;

            const comparePrice = Shopify.formatMoney(comparePriceValue, moneyFormat);
            const price = Shopify.formatMoney(priceValue, moneyFormat);
            const unitPrice = Shopify.formatMoney(unitPriceValue, moneyFormat);
            

            var productPriceElement = productVariantSelector.closest(summarySelector).querySelector('.product-price')
            var priceElement = productVariantSelector.closest(summarySelector).querySelector('.product-price [data-price]');
            var comparePriceElement = productVariantSelector.closest(summarySelector).querySelector('.product-price [data-price-compare]');
            var unitPriceWrapperElement = productVariantSelector.closest(summarySelector).querySelector('.product-price-unit')
            
            var saleBadgeElement = productVariantSelector.closest(summarySelector).querySelector('.product-sale-badge');

            if(productPriceElement){
                var productPriceText = productPriceElement.dataset.textSale
            }

            // Change price
            priceElement.innerHTML = price;

            if( comparePriceValue ){

                // Add Sale badge if not exist
                if( !saleBadgeElement ){
                    var newSaleBadgeElement = document.createElement('span');
                    newSaleBadgeElement.classList.add('product-sale-badge');
                    newSaleBadgeElement.innerHTML = productPriceText

                    if(productPriceElement){
                        productPriceElement.prepend(newSaleBadgeElement)
                    }
                }

                // Change compare price
                if( comparePriceElement ){
                    comparePriceElement.innerHTML = comparePrice;
                }
                else{
                    productPriceElement.innerHTML = productPriceElement.innerHTML + '<span data-price-compare>' + comparePrice + '</span>'
                }
            }
            else{
                // Remove sale badge if exist
                if( saleBadgeElement ){
                    saleBadgeElement.remove();
                }

                // Remove compare price
                if( comparePriceElement ){
                    comparePriceElement.innerHTML = '';
                }
            }


            // Change unit price
            if( unitPriceValue ){

                const refValue = productVariant.unit_price_measurement.reference_value
                const refUnit = productVariant.unit_price_measurement.reference_unit

                var unitPriceSelector = 'data-price-unit-price';
                var unitBaseSelector = 'data-price-unit-base';

                var unitPriceElement = productVariantSelector.closest(summarySelector).querySelector('[' + unitPriceSelector + ']');
                var unitBaseElement = productVariantSelector.closest(summarySelector).querySelector('[' + unitBaseSelector + ']');

                // newSaleBadgeElement.innerHTML = productPriceText
                // productPriceElement.prepend(newSaleBadgeElement)

                if( unitPriceWrapperElement ){

                    unitPriceElement.innerHTML = unitPrice

                    // Change unit ref
                    unitBaseElement.innerHTML = ( refValue > 1 ) ? refValue + refUnit : refUnit
                }
                else{
                    var newUnitPriceWrapperElement = document.createElement('span');
                    var newUnitPriceElement = document.createElement('span');
                    var newUnitBaseElement = document.createElement('span');

                    newUnitPriceElement.setAttribute(unitPriceSelector, '')
                    newUnitBaseElement.setAttribute(unitBaseSelector, '')

                    newUnitPriceElement.innerHTML = unitPrice

                    // Change unit ref
                    newUnitBaseElement.innerHTML = ( refValue > 1 ) ? refValue + refUnit : refUnit

                    newUnitPriceWrapperElement.classList.add('product-price-unit');
                    newUnitPriceWrapperElement.append(newUnitPriceElement);
                    newUnitPriceWrapperElement.append('/');
                    newUnitPriceWrapperElement.append(newUnitBaseElement);

                    if(productPriceElement){
                        productPriceElement.append(newUnitPriceWrapperElement)
                    }

                }
            }
            else{
                // Remove unit price wrapper
                if( unitPriceWrapperElement ){
                    unitPriceWrapperElement.remove();
                }
            }

            const variantEvent = new CustomEvent('shopifyProductVariantFetched', {
                detail: {
                    variant: productVariant

                }
            });

            // Dispatch the event on the document
            document.dispatchEvent(variantEvent);

        })
        .catch(e => {
            console.error(e);
        });


        // var selectedIndex = productVariantSelector.selectedIndex;
        // var variantId = productVariantSelector[selectedIndex].getAttribute('value');

        var select = productVariantSelector.closest(summarySelector).querySelector('.product-variants-selector > select');
        var productQtyInput = productVariantSelector.closest(summarySelector).querySelector('.product-quantity-picker-input');
        var productQtyElement = productVariantSelector.closest(summarySelector).querySelector('.product-inventory-qty');
        var productAddtocartElement = productVariantSelector.closest(summarySelector).querySelector('.product-add-to-cart');
        var moneyFormat = document.body.dataset.moneyFormat;

        var productStockHtml = '';
        var productAddtocartHtml = '';

        var productStockQty = parseInt(select[select.selectedIndex].dataset.inventoryQuantity)
        var productStockManagement = select[select.selectedIndex].dataset.inventoryManagement
        var productStockPolicy = select[select.selectedIndex].dataset.inventoryPolicy
        var productAvailable = select[select.selectedIndex].dataset.available
        





        if( productStockQty != 0 && productStockManagement != '' ){
            productQtyInput.setAttribute('max', productStockQty );
        }
        else if( productStockManagement == '' ){
            productQtyInput.removeAttribute('max');
        }
        
        if(productQtyElement){
            if( productStockQty != 0 ){
                var lowStockThreshold = parseInt(productQtyElement.dataset.lowStockThreshold);

                if( lowStockThreshold >= productStockQty ){
                    productStockHtml = '<p class="low">' + productQtyElement.dataset.textLowStock.replace('%s', productStockQty) + '</p>'
                }
                else if (productStockManagement != '' && productStockPolicy != 'continue'){
                    productStockHtml = '<p class="normal">' + productQtyElement.dataset.textInStock.replace('%s', productStockQty) + '</p>'
                }
                else{
                    productStockHtml = '<p class="normal">' + productQtyElement.dataset.textInStockNoTrack + '</p>'
                }

            }
            else if( productStockQty == 0 && productStockManagement == '' ){
                productStockHtml = '<p class="normal">' + productQtyElement.dataset.textInStockNoTrack + '</p>'
            }
            else{
                productStockHtml = '<p class="sold">' + productQtyElement.dataset.textSold.replace('%s', productStockQty) + '</p>'
            }

            productQtyElement.innerHTML = productStockHtml
        }
        
        // if( productStockQty != 0 || productStockManagement == '' || productStockPolicy == 'continue' ){
        if( productAvailable == 'true' ){
            productAddtocartHtml = '<span data-text="' + productAddtocartElement.dataset.textAddToCart + '"><span>' + productAddtocartElement.dataset.textAddToCart + '</span></span>';
            productAddtocartElement.disabled = false
        }
        else{
            productAddtocartHtml = '<span data-text="' + productAddtocartElement.dataset.textSoldOut + '"><span>' + productAddtocartElement.dataset.textSoldOut + '</span></span>';
            productAddtocartElement.disabled = true
        }
        // console.log("stock html", productStockHtml, "add to cart html", productAddtocartHtml);

        productAddtocartElement.innerHTML = productAddtocartHtml




        // Changing image
        var productThumbails = productVariantSelector.closest(summarySelector).querySelectorAll('.product-image-has-variant-ids')

        for (let thumbnail of productThumbails){
            const imageVariantIds = thumbnail.dataset.variantIds
            // console.log("image variant ids", imageVariantIds);

            thumbnail.classList.remove('active');

            if( imageVariantIds.includes(variantId) ){
                // console.log("missing")
                thumbnail.dispatchEvent(new Event('click'));

                thumbnail.classList.add('active')
            }
        }

    }
}
customElements.define('product-variants-selector', ProductVariantsSelectors)

// var productVariantSelectors = document.querySelectorAll('.product-variants-selector > select')
// if( productVariantSelectors ){
//     productVariantSelectors.forEach(variant => { 
//         variant.addEventListener('change', (event) => {
//             onVariantChange(variant);
//         })
//     })
// }

var productSwatchesSwatchElements = document.querySelectorAll('.product-swatches-swatch');
productSwatchesSwatchElements.forEach(productSwatchesSwatchElement => {

    productSwatchesSwatchElement.addEventListener('click', () => {
        var variantId = productSwatchesSwatchElement.dataset.variantId;


        // fetch(`/variants/${variantId}.json`)
        // .then(response => response.json())
        // .then(res => {
        //     console.log("res", res)

        //     // const productVariant = res.product_variant
        //     // console.log("product variant", productVariant, productVariant.image);

        // })
        // .catch(e => {
        //     console.error(e);
        // });
        

    })

})


// Collection links tab
document.addEventListener('mouseover', function(event){

    var collectionDetailsListItemsSelector = '.section-collections-links-details-list-item';
    var collectionDetailsListItem = event.target.closest(collectionDetailsListItemsSelector);

    if(collectionDetailsListItem){

        var collectionLinksContentSelector = '.section-collections-links-content';
        var collectionLinksContent = event.target.closest(collectionLinksContentSelector);

        var collectionImagesListItems = collectionLinksContent.querySelectorAll('.section-collections-links-images-list-item');
        var collectionDetailsListItems = collectionLinksContent.querySelectorAll('.section-collections-links-details-list-item');
        
        if(collectionDetailsListItems){
            [...collectionImagesListItems, ...collectionDetailsListItems].forEach(listItem => {
                listItem.classList.remove('active');
            })

            collectionDetailsListItem.classList.add('active');

            var newIndex = 0
            collectionDetailsListItems.forEach((detail, index) => {
                if(detail.classList.contains('active')){
                    newIndex = index;
                }
            })

            collectionImagesListItems[newIndex].classList.add('active'); 
        }
    }
})


// Before/After image
class BeforeAfter extends HTMLElement{
    constructor(){
        super();

        this.beforeAfterHandle = this.querySelector('.before-after-handler');
        this.beforeAfterHandleButton = this.querySelector('.before-after-handler-button');

        this.mouseOnClickElement = false;

        
        this.addEventListener('mousedown', (e) => { e.preventDefault(); })
        // this.addEventListener('touchstart', (e) => { e.preventDefault(); })

        this.beforeAfterHandleButton.addEventListener('mousedown', () => { this.mouseOnClickElement = true; })
        this.beforeAfterHandleButton.addEventListener('touchstart', () => { this.mouseOnClickElement = true; })

        document.addEventListener('mouseup', () => { this.mouseOnClickElement = false; })
        document.addEventListener('touchend', () => { this.mouseOnClickElement = false; })


        this.addEventListener('mousemove', (event) => this.onMouseMove(event));
        this.addEventListener('touchmove', (event) => this.onMouseMove(event));

    }

    onMouseMove = (event) =>  {

        var type = event.type;
        var pageX = event.pageX;

        if (type === "touchmove") {
            // console.log("event", event, this.getBoundingClientRect());
            var touch = event.touches[0] || event.changedTouches[0];

            pageX = touch.pageX;
            
        }

        var offsetWidth = this.getBoundingClientRect().width;
        var offsetLeft = this.getBoundingClientRect().left;

        if(this.mouseOnClickElement){

            var offsetX = (((pageX - offsetLeft) * 100) / (offsetWidth)).toFixed(2)
            if(offsetX < 100 && offsetX > 0){
                this.style.setProperty('--handler-offset', offsetX + '%');
            }
        }
    }
}
customElements.define('before-after', BeforeAfter);



// Video player controls
var videoPlay = document.querySelectorAll('.video-play');

videoPlay.forEach(button => {
    button.addEventListener('click', () => {
        var player = button.closest('.video-player');

        if(player){
            var playerVideo = player.querySelector('video');
            var playerIframe = player.querySelector('iframe');

            if( playerVideo ){
                playerVideo.currentTime = 0

                if(playerVideo.paused){
                    playerVideo.play();
                    player.classList.add('playing')
                }
                else{
                    playerVideo.pause();
                    player.classList.remove('playing')
                }
            }

            if( playerIframe ){
                var playerSrc = playerIframe.getAttribute('src');
                if(playerSrc.includes('?autoplay=1&muted=1')){
                    playerSrc = playerSrc.replace('?autoplay=1&muted=1', '');
                    player.classList.remove('playing');
                }
                else{
                    playerSrc = playerSrc + '?autoplay=1&muted=1';
                    player.classList.add('playing');
                }

                playerIframe.setAttribute('src', playerSrc)
            }

        }

    })
})


var videoPlayers = document.querySelectorAll('.video-player');
videoPlayers.forEach(videoPlayer => {

        var video = videoPlayer.querySelector('video');
        var playerIframe = videoPlayer.querySelector('iframe');

        if(video){
            if(video.autoplay){
        
                // videoPlay.click();
                video.play();
                videoPlayer.classList.add('playing')
                    
            }
        }
        // else if(playerIframe){
        //     var playerSrc = playerIframe.getAttribute('src');
        //     // if(!playerSrc.includes('?autoplay=1&muted=1')){
        //     //     playerSrc = playerSrc + '?autoplay=1&muted=1';
        //     //     videoPlayer.classList.add('playing');
                
        //     //     playerIframe.setAttribute('src', playerSrc)
        //     // }

        // }

    // if( videoPlayer.classList.contains('has-internal-video') ){
    //     var video = videoPlayer.querySelector('video');
    //     var videoPlay = videoPlayer.querySelector('.video-play');

    //     if(video){
    //         if(video.autoplay){
        
    //             // videoPlay.click();
    //             video.play();
    //             videoPlayer.classList.add('playing')
                    
    //         }
    //     }
    // }
    // if( videoPlayer.classList.contains('has-external-video') ){
    //     var playerIframe = videoPlayer.querySelector('iframe');

    //     if(playerIframe){
    //         var playerSrc = playerIframe.getAttribute('src');
    //         // if(!playerSrc.includes('?autoplay=1&muted=1')){
    //         //     playerSrc = playerSrc + '?autoplay=1&muted=1';
    //         //     videoPlayer.classList.add('playing');
                
    //         //     playerIframe.setAttribute('src', playerSrc)
    //         // }

    //     }
    // }
})


// Collapsible row
class CollapsibleRow extends HTMLElement{
    constructor(){
        super();

        this.detectDefaultTab();

        this.querySelector('.collapsible-row__title').addEventListener('click', () => {
            this.onClick();
        })

        
    }

    detectDefaultTab = () => {
        if( this.classList.contains('active_by_default') ){
            var collapsibleContent = this.querySelector('.collapsible-row__content');
            var collapsibleContentHeight = collapsibleContent.offsetHeight;
            collapsibleContent.style.height = collapsibleContentHeight + 'px';
            this.classList.remove('active_by_default');
        }   
    }

    onClick = () => {

        // var productCollapsibleRow = event.target.closest('collapsible-row');
        var productCollapsibleRow = this.closest('collapsible-row');
        var collapsibleContent = productCollapsibleRow.querySelector('.collapsible-row__content');
        var collapsibleContentHeight = collapsibleContent.offsetHeight;

        if( productCollapsibleRow.classList.contains('active') ){
            collapsibleContent.style.removeProperty('height');
            setTimeout(function(){
                productCollapsibleRow.classList.remove('active');
            }, 200)
        }
        else{
            productCollapsibleRow.classList.add('active');
            setTimeout(function(){
                collapsibleContent.style.height = collapsibleContentHeight + 'px';
            }, 10)
        }
    }

}
customElements.define('collapsible-row', CollapsibleRow)


class ProductsTabs extends HTMLElement {

    constructor() {
        super();

        this.productsTabsList = this.querySelectorAll( '.section-featured-products-tabs-header__list li' );
        this.productsTabsContent = this.querySelectorAll( '.section-featured-products-tabs-products-list' );

        this.productsTabsButton = this.querySelector('.section-featured-products-tabs-header__button');


        var defaultDataCollectionLink = this.productsTabsList[0].dataset.collectionButtonLink;
        
        if(defaultDataCollectionLink && this.productsTabsList[0].classList.contains('active')){        
            this.productsTabsButton.setAttribute('href', "https://" + Shopify.shop + defaultDataCollectionLink);
        }

        for (let tab of this.productsTabsList) {

            var dataCollectionLink = tab.dataset.collectionButtonLink;
            
            if(dataCollectionLink && tab.classList.contains('active')){
                this.productsTabsButton.setAttribute('href', "https://" + Shopify.shop + dataCollectionLink);
            }

            tab.addEventListener('click', (event) => {
                this.onClick(tab);
            })
        }
        
        // this.prepareButtonLinks();

    }

    // prepareButtonLinks = () => {

    //     for (let tab of this.productsTabsList) {
    //         tab.addEventListener('click', (event) => {
    //             this.onClick(tab);
    //         })
    //     }
    // }

    onClick(tab) {
        // console.log("target", tab);
        var dataCollection = tab.dataset.collection;
        var dataCollectionLink = tab.dataset.collectionButtonLink;

        for (let title of this.productsTabsList) {
            title.dataset.collection == dataCollection ? title.classList.add("active") : title.classList.remove("active");

            if(dataCollectionLink && (title.dataset.collectionButtonLink == dataCollectionLink)){
                this.productsTabsButton.setAttribute('href', "https://" + Shopify.shop + dataCollectionLink);
            }
        }

        for (let collection of this.productsTabsContent) {
            collection.dataset.collection == dataCollection ? collection.classList.add("active") : collection.classList.remove("active");
        }
    }


}

customElements.define('products-tab', ProductsTabs)


class imageCardsSlider extends HTMLElement{
    constructor(){
        super();

    
        var cardsMainCarousels = this.querySelectorAll('.cards-main-carousel');
        var cardsSecondaryCarousels = this.querySelector('.cards-secondary-carousel-list');
        var paginationCurrent = this.querySelector('.cards-pagination-current');

        cardsMainCarousels.forEach(cardsMainCarousel => {


            var carouselList = cardsMainCarousel.querySelector('.cards-main-carousel-list');
            var carouselListItems = carouselList.querySelectorAll('.cards-main-carousel-list-item');
            var carouselListItemImages = carouselList.querySelectorAll('.cards-main-carousel-list-item img');
            
            
            var carouselNavigationBtns = cardsMainCarousel.querySelectorAll('.cards-main-carousel-navigation > button');
            var carouselNavigationNext = cardsMainCarousel.querySelector('.cards-main-carousel-navigation > .next');

            carouselListItems[0].classList.add('active');
            carouselListItems[1].classList.add('next-card');
            carouselListItems[(carouselListItems.length - 1)].classList.add('prev-card');



            var secondaryListItems = cardsSecondaryCarousels.querySelectorAll('li'); 
            secondaryListItems[0].classList.add('prev-card');

            if( secondaryListItems.length >= 2 ){
                secondaryListItems[1].classList.add('active');
            }
            if( secondaryListItems.length >= 3 ){
                secondaryListItems[2].classList.add('next-card');
            }


            carouselListItems.forEach(item => {
              var itemLink = item.querySelector('a');
              if(itemLink){
                if(!item.classList.contains('active')){
                    itemLink.tabIndex = '-1'
                }
                else{
                    itemLink.tabIndex = false
                }
              }
            })

            carouselNavigationBtns.forEach(direction => {
                
                direction.addEventListener('click', (e) => {
                    e.preventDefault();

                    // carouselNavigationBtns.forEach(direction => {
                    //     direction.disabled = true;
                    // })

                    let carouselItemsLength = carouselListItems.length;
                    let itemIndex = 0;
                    let newItemIndex = 0;

                    carouselListItems.forEach((item, index) => {
                        item.classList.remove('prev-card');
                        item.classList.remove('next-card');
                        item.classList.remove('previously-active');

                        if( item.classList.contains('active') ){
                            itemIndex = index
                            item.classList.remove('active');
                            item.classList.add('previously-active');
                        }
                    })

                    if( direction.classList.contains('prev') ){
                        if( itemIndex == 0 ){
                            newItemIndex = carouselItemsLength - 1;
                        }
                        else{
                            newItemIndex = itemIndex - 1;
                        }
                    }
                    else{
                        if( carouselItemsLength == (itemIndex + 1) ){
                            newItemIndex = 0;
                        }
                        else{
                            newItemIndex = itemIndex + 1;
                        }                
                    }

                    if( newItemIndex == (carouselItemsLength - 1) ){
                        carouselListItems[0].classList.add('next-card');
                        carouselListItems[newItemIndex - 1].classList.add('prev-card');
                    }
                    else if( newItemIndex == 0 ){
                        carouselListItems[carouselItemsLength - 1].classList.add('prev-card');
                        carouselListItems[newItemIndex + 1].classList.add('next-card');
                    }
                    else{
                        carouselListItems[newItemIndex - 1].classList.add('prev-card');
                        carouselListItems[newItemIndex + 1].classList.add('next-card');
                    }

                    carouselListItems[newItemIndex].classList.add('active');

                    if(paginationCurrent){
                        paginationCurrent.innerHTML = ( newItemIndex <= (carouselItemsLength - 1) ) ? newItemIndex + 1 : 1
                    }

                    carouselListItems.forEach(item => {
                        var itemLink = item.querySelector('a');
                        if(itemLink){
                            if(!item.classList.contains('active')){
                                itemLink.tabIndex = '-1'
                            }
                            else{
                                itemLink.tabIndex = false
                            }
                        }
                    })



                    secondaryListItems.forEach((item, index) => {
                        item.classList.remove('prev-card');
                        item.classList.remove('next-card');
                        item.classList.remove('previously-active');

                        if( item.classList.contains('active') ){
                            item.classList.remove('active');
                            item.classList.add('previously-active');
                        }
                    })

                    var newSecondaryItemIndex = newItemIndex + 1;

                    if( newItemIndex == (carouselItemsLength - 1) ){
                        newSecondaryItemIndex = 0
                    }

                    if( newSecondaryItemIndex == (carouselItemsLength - 1) ){
                        secondaryListItems[0].classList.add('next-card');
                        secondaryListItems[newSecondaryItemIndex - 1].classList.add('prev-card');
                    }
                    else if( newSecondaryItemIndex == 0 ){
                        secondaryListItems[carouselItemsLength - 1].classList.add('prev-card');
                        secondaryListItems[newSecondaryItemIndex + 1].classList.add('next-card');
                    }
                    else{
                        secondaryListItems[newSecondaryItemIndex - 1].classList.add('prev-card');
                        secondaryListItems[newSecondaryItemIndex + 1].classList.add('next-card');
                    }

                    secondaryListItems[newSecondaryItemIndex].classList.add('active');


                    
                    setTimeout(() => {
                        carouselListItems.forEach((item, index) => {
                            item.classList.remove('previously-active');
                        });

                        secondaryListItems.forEach((item, index) => {
                            item.classList.remove('previously-active');
                        });

                        // carouselNavigationBtns.forEach(direction => {
                        //     direction.disabled = false;
                        // })

                    }, 1000);
                    

                })


            })


            secondaryListItems.forEach((item) => {
                item.addEventListener('click', () => {
                    carouselNavigationNext.click();
                })
            })

        })
    }
}

customElements.define('image-cards-slider', imageCardsSlider);

class imageSlideshow extends HTMLElement{
    constructor(){
        super();

            
        var cardsMainCarousels = this.querySelectorAll('.image-slideshow-main-carousel');
        var cardsSecondaryCarousels = this.querySelector('.image-slideshow-secondary-carousel-list');
        var paginationCurrent = this.querySelector('.image-slideshow-pagination-current');

        cardsMainCarousels.forEach(cardsMainCarousel => {


            var carouselList = cardsMainCarousel.querySelector('.image-slideshow-main-carousel-list');
            var carouselListItems = carouselList.querySelectorAll('.image-slideshow-main-carousel-list-item');
            var carouselListItemImages = carouselList.querySelectorAll('.image-slideshow-main-carousel-list-item img');
            var carouselListItemButtons = carouselList.querySelectorAll('.image-slideshow-main-carousel-list-item a');
            

            if(carouselListItems.length <= 1){
              return false;
            }
            
            var carouselNavigationBtns = this.querySelectorAll('.image-slideshow-navigation > button');
            var carouselNavigationNext = this.querySelector('.image-slideshow-navigation > .next');

            carouselListItems[0].classList.add('active');
            carouselListItems[1].classList.add('next-card');
            carouselListItems[(carouselListItems.length - 1)].classList.add('prev-card');


            var secondaryListItems = cardsSecondaryCarousels.querySelectorAll('li'); 
            secondaryListItems[0].classList.add('active');
            secondaryListItems[1].classList.add('next-card');
            secondaryListItems[(carouselListItems.length - 1)].classList.add('prev-card');


            carouselListItems.forEach(item => {
              var itemLink = item.querySelector('a');
              if(itemLink){
                if(!item.classList.contains('active')){
                    itemLink.tabIndex = '-1'
                }
                else{
                    itemLink.tabIndex = false
                }
              }
            })


            carouselNavigationBtns.forEach(direction => {
                
                direction.addEventListener('click', (e) => {


                    // carouselNavigationBtns.forEach(direction => {
                    //     direction.disabled = true;
                    // })

                    let carouselItemsLength = carouselListItems.length;
                    let itemIndex = 0;
                    let newItemIndex = 0;

                    carouselListItems.forEach((item, index) => {
                        item.classList.remove('prev-card');
                        item.classList.remove('next-card');
                        item.classList.remove('previously-active');

                        if( item.classList.contains('active') ){
                            itemIndex = index
                            item.classList.remove('active');
                            item.classList.add('previously-active');
                        }
                    })

                    if( direction.classList.contains('prev') ){
                        if( itemIndex == 0 ){
                            newItemIndex = carouselItemsLength - 1;
                        }
                        else{
                            newItemIndex = itemIndex - 1;
                        }
                    }
                    else{
                        if( carouselItemsLength == (itemIndex + 1) ){
                            newItemIndex = 0;
                        }
                        else{
                            newItemIndex = itemIndex + 1;
                        }                
                    }

                    if( newItemIndex == (carouselItemsLength - 1) ){
                        carouselListItems[0].classList.add('next-card');
                        carouselListItems[newItemIndex - 1].classList.add('prev-card');
                    }
                    else if( newItemIndex == 0 ){
                        carouselListItems[carouselItemsLength - 1].classList.add('prev-card');
                        carouselListItems[newItemIndex + 1].classList.add('next-card');
                    }
                    else{
                        carouselListItems[newItemIndex - 1].classList.add('prev-card');
                        carouselListItems[newItemIndex + 1].classList.add('next-card');
                    }

                    carouselListItems[newItemIndex].classList.add('active');

                    paginationCurrent.innerHTML = ( newItemIndex <= (carouselItemsLength - 1) ) ? newItemIndex + 1 : 1

                    carouselListItems.forEach(item => {
                        var itemLink = item.querySelector('a');
                        if(itemLink){
                            if(!item.classList.contains('active')){
                                itemLink.tabIndex = '-1'
                            }
                            else{
                                itemLink.tabIndex = false
                            }
                        }
                    })



                    secondaryListItems.forEach((item, index) => {
                        item.classList.remove('prev-card');
                        item.classList.remove('next-card');
                        item.classList.remove('previously-active');

                        if( item.classList.contains('active') ){
                            item.classList.remove('active');
                            item.classList.add('previously-active');
                        }
                    })

                    // var newSecondaryItemIndex = newItemIndex + 1;

                    // if( newItemIndex == (carouselItemsLength - 1) ){
                    //     newSecondaryItemIndex = 0
                    // }
                    var newSecondaryItemIndex = newItemIndex;

                    if( newSecondaryItemIndex == (carouselItemsLength - 1) ){
                        secondaryListItems[0].classList.add('next-card');
                        secondaryListItems[newSecondaryItemIndex - 1].classList.add('prev-card');
                    }
                    else if( newSecondaryItemIndex == 0 ){
                        secondaryListItems[carouselItemsLength - 1].classList.add('prev-card');
                        secondaryListItems[newSecondaryItemIndex + 1].classList.add('next-card');
                    }
                    else{
                        secondaryListItems[newSecondaryItemIndex - 1].classList.add('prev-card');
                        secondaryListItems[newSecondaryItemIndex + 1].classList.add('next-card');
                    }

                    secondaryListItems[newSecondaryItemIndex].classList.add('active');

                    
                    setTimeout(() => {
                        carouselListItems.forEach((item, index) => {
                            item.classList.remove('previously-active');
                        });

                        secondaryListItems.forEach((item, index) => {
                            item.classList.remove('previously-active');
                        });

                        // carouselNavigationBtns.forEach(direction => {
                        //     direction.disabled = false;
                        // })

                    }, 1000);
                    

                })

            })

        })
    }
}

customElements.define('image-slideshow', imageSlideshow);


class countdown extends HTMLElement {
    constructor(){
        super();


        var countdownTimeZone = this.dataset.countdownTimezone
        var countdownEndDate = this.dataset.countdownEnddate

        var currentDate = new Date(); // Create a new Date object with the current date and time

        if( this.dataset.countdownTimezone != '' ){
            var timezoneOffset = this.dataset.countdownTimezone * 60;
            currentDate = new Date(new Date().getTime() + timezoneOffset * 600); // Apply the offset
        }

        // console.log("date", new Date().getTime(), new Date(new Date().getTime()), this.dataset.countdownTimezone, new Date(new Date().getTime() + (timezoneOffset * 6000)));

        this.startdate = currentDate,
        this.enddate = new Date(this.dataset.countdownEnddate);


        // console.log("date", this.startdate, this.enddate);

        if (this.enddate > this.startdate) {
            var countdownExpireMessage = this.querySelector('.countdown-message');
            if(countdownExpireMessage){
                countdownExpireMessage.remove();
            }

            this.updateCountdown();
            var timeinterval = setInterval(this.updateCountdown, 1000);

        }
        else{
            this.querySelector('.countdown-holder').remove();

            if(countdownExpireMessage){
                this.querySelector('.countdown-message').classList.remove('hide');
            }
        }

    }


    getTimeRemaining = () => {

        var currentDate = new Date(); 

        if( this.dataset.countdownTimezone != '' ){
            var timezoneOffset = this.dataset.countdownTimezone * 60;
            currentDate = new Date(new Date().getTime() + timezoneOffset * 600); // Apply the offset
        }

        var t = Date.parse(this.enddate) - Date.parse(currentDate),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            days = Math.floor(t / (1000 * 60 * 60 * 24));

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
    
    updateCountdown = () => {
        var t = this.getTimeRemaining();

        this.querySelector('.days').innerHTML = t.days;
        this.querySelector('.hours').innerHTML = ('0' + t.hours).slice(-2)
        this.querySelector('.minutes').innerHTML = ('0' + t.minutes).slice(-2)
        this.querySelector('.seconds').innerHTML = ('0' + t.seconds).slice(-2)

        if (t.total <= 0) {
            clearInterval(timeinterval);
        }
    }
        
}
customElements.define('countdown-timer', countdown);


// Image banner with products
document.addEventListener('click', (event) => {

    var bannerProductsSelector = '.section-image-banner-products'

    var bannerProducts = event.target.closest(bannerProductsSelector);
    if(bannerProducts){
        var bannerProductsToggle = bannerProducts.querySelector('.section-image-banner-products-toggle');
        var bannerProductsToggleContent = bannerProducts.querySelector('.section-image-banner-products-toggle-content');
        var bannerProductsToggleContentClose = bannerProducts.querySelector('.section-image-banner-products-toggle-content-header__close');

        if (event.target == bannerProductsToggle || bannerProductsToggle.contains(event.target)) {
            bannerProductsToggleContent.classList.add('active');
        }

        if (event.target == bannerProductsToggleContentClose || bannerProductsToggleContentClose.contains(event.target)) {
            bannerProductsToggleContent.classList.remove('active');
        }

        if (event.target !== bannerProductsToggleContent && !bannerProductsToggleContent.contains(event.target) && !bannerProductsToggle.contains(event.target) && bannerProducts.contains(event.target)) {
            bannerProductsToggleContent.classList.remove('active');
        }
    }
})



class ImagePins extends HTMLElement{
    constructor(){
        super();

        

    // var pinsProductsSections = document.querySelectorAll('.section-image-pins');

    // pinsProductsSections.forEach((pinsProductsSection) => {

        // var pinsProductsSection = this;

        this.pinsProductsList = this.querySelector('.section-image-pins-products-list');

        this.pinsPagination = this.querySelectorAll('.section-image-pins-products-pagination');
        this.pinsPaginationButtons = this.querySelectorAll('.section-image-pins-products-pagination > button');
        this.pins = this.querySelectorAll('.section-image-pins-list-item');

        
        // console.log("this.pinsProductsList", this.pinsProductsList)
    
        this.products = this.pinsProductsList.querySelectorAll('.product');
        // var productHeight = this.products[0].clientHeight;

        // console.log("this.products", this.products)
        var img = this.products[0].querySelector('.lazy-loading-image--main');
    
        this.imageLoaded = (product_img) => {
            const width = product_img.naturalWidth;
            const height = product_img.naturalHeight;

            const containerWidth = this.products[0].clientWidth; // Get container width
            const aspectRatio = width / height; // Original aspect ratio

            const calculatedHeight = Math.round(containerWidth / aspectRatio);

           this.pinsRendering(calculatedHeight)
        }
      
        if(img){
            if (img.complete && img.naturalHeight > 0) {
                this.imageLoaded(img);
            } else {
                img.onload = () => this.imageLoaded(img);
            }
        }


    // })



    }



    pinsRendering = (height) => {
    //   console.log("client height", product.clientHeight);

        // var productHeight = height;

        
        // this.products.forEach(product => {
        //     console.log("client height", product.clientHeight)
        // })
        // console.log("products", this.products.length);

        var productFirst = this.products[0].cloneNode(true);
        var productLast = this.products[this.products.length - 1].cloneNode(true);

        // console.log("product first", productFirst, "product last", productLast, productHeight);

        this.pinsProductsList.prepend(productLast)
        this.pinsProductsList.append(productFirst);
        


        const pinsProductsListLazyloadImages = this.pinsProductsList.querySelectorAll('.lazy-loading-image');

        pinsProductsListLazyloadImages.forEach(imageContainer => {
            lazyloading(imageContainer);
        })

        var dataTransformY = 0
        this.products.forEach((product, index) => {
            if(index == 0){
                product.classList.add('active');
            }

            var productHeight =  height + product.querySelector('.product__bottom').offsetHeight

            console.log('height', product.querySelector('.product__bottom').offsetHeight, productHeight);

            product.dataset.dataTransformY = dataTransformY;
            dataTransformY = dataTransformY + productHeight;
        })



        // console.log("products", this.pinsProductsList);

        var transformY = 0;
        var currentIndex = 0;

        this.pinsPaginationButtons.forEach(function(button){
            if(currentIndex == 0){
                if(button.classList.contains('prev')){
                    // button.classList.add('disabled');
                    button.disabled = true
                }
            }
            
        })

        this.pinsPaginationButtons.forEach((button) => {
            button.addEventListener('click', () => {
                var beforeClickIndex = 0;
                this.products.forEach((product, index) => {
                    if( product.classList.contains('active') ){
                        beforeClickIndex = index;
                        product.classList.remove('active');
                    }

                })

                if(button.classList.contains('prev')){
                    currentIndex = beforeClickIndex - 1

                }
                else if(button.classList.contains('next')){
                    currentIndex = beforeClickIndex + 1

                }

                this.products[currentIndex].classList.add('active');


                this.pinsPaginationButtons.forEach(function(button){
                    button.disabled = false;
                })
                if(currentIndex == 0 || (currentIndex == (this.products.length - 1))){
                    button.disabled = true;
                }


                this.pins.forEach(pin => {
                    pin.classList.remove('active');
                });

                this.pins[currentIndex].classList.add('active');


                transformY = this.products[currentIndex].dataset.dataTransformY;
                this.pinsProductsList.style.transform = 'translateY('+ ((parseInt(transformY)) * -1) +'px)';
                // this.pinsProductsList.style.transform = 'translateY('+ ((parseInt(transformY) + parseInt(productHeight)) * -1) +'px)';

            })
        })

        this.pins.forEach(pin => {
            // var currentIndex = 0;
            // console.log("current index", currentIndex);


            this.products[currentIndex].classList.add('active');
            this.pins[currentIndex].classList.add('active');

            transformY = this.products[currentIndex].dataset.dataTransformY;
            this.pinsProductsList.style.transform = 'translateY('+ ((parseInt(transformY)) * -1) +'px)';
            // this.pinsProductsList.style.transform = 'translateY('+ ((parseInt(transformY) + parseInt(productHeight)) * -1) +'px)';
            
            pin.addEventListener('click', () => {
                var pinChoice = pin.dataset.pinIndex;
                currentIndex = pinChoice - 1;

                this.products.forEach((product) => {
                    product.classList.remove('active');
                })

                this.pins.forEach((pin) => {
                    pin.classList.remove('active');
                })

                pin.classList.add('active');
                this.products[currentIndex].classList.add('active');

                transformY = this.products[currentIndex].dataset.dataTransformY;
                this.pinsProductsList.style.transform = 'translateY('+ ((parseInt(transformY)) * -1) +'px)';
                // this.pinsProductsList.style.transform = 'translateY('+ ((parseInt(transformY) + parseInt(productHeight)) * -1) +'px)';
            })

        })
        
    }
} 
customElements.define('image-pins', ImagePins);


function setRecentlyViewedProducts(productId){

    var productId = parseInt(productId) || Shopify.product_id;
    var expireOn = Shopify.recentlyviewed_cookie_expiration || 30;

    // console.log("productId", productId, Shopify.product_id, Shopify.recentlyviewed_cookie_name);

    if(productId){

        // Cookies.get('recentlyviewed')
        var viewedProducts = [];
        var cookie = Cookies.get(Shopify.recentlyviewed_cookie_name);
        if (cookie) {
            viewedProducts = JSON.parse(cookie);

        }
        // console.log("viewedProducts", viewedProducts)

        var index = viewedProducts.indexOf(productId);
        if (index > -1) {
            viewedProducts.splice(index, 1);
        }
        viewedProducts.unshift(productId);
        viewedProducts = viewedProducts.slice(0, 10);
        Cookies.set(Shopify.recentlyviewed_cookie_name, JSON.stringify(viewedProducts), { expires: expireOn, path: '/' });
    }
}

setRecentlyViewedProducts();

class RecentlyViewedProducts extends HTMLElement{
    constructor(){
        super();
        
        this.recentProductsListElement = this.querySelector('.section-recently-viewed-products-list');
        this.recentProductsListSectionId = this.recentProductsListElement.dataset.sectionId;
        this.recentProductsListTotalCount = parseInt(this.recentProductsListElement.dataset.totalCount);

        this.recentProductsIds = this.getRecentlyViewedProducts();

        // console.log("this.recentProductsIds", this.recentProductsIds)

        this.fetchProducts();
        
    }

    getRecentlyViewedProducts = () => {

        var viewedProducts = [];

        // console.log("cookie name", Shopify.recentlyviewed_cookie_name);
        var cookie = Cookies.get(Shopify.recentlyviewed_cookie_name);

        if (cookie) {
            viewedProducts = JSON.parse(cookie);
        }

        if(this.recentProductsListTotalCount){
            viewedProducts = viewedProducts.slice(0, this.recentProductsListTotalCount)
        }

        return viewedProducts;

    }


    renderRecentlyViewedProductsCarousel = (carouselElement) => {
        let carouselOptions = {};
        let carouseProgressBar = null;
        
        if (carouselElement.dataset.options) {
            carouselOptions = JSON.parse(carouselElement.dataset.options);
        }

        if(carouselElement.dataset.progressBar){
            carouseProgressBar = JSON.parse(carouselElement.dataset.progressBar)
        }

        if(carouselElement.classList.contains('has-carousel-columns-offset')){
            carouselOptions['autoWidth'] = true
        }

        carouselOptions['classes'] = {
            // Add classes for arrows.
            arrows: 'splide__arrows',
            arrow : 'splide__arrow',
            prev  : 'splide__arrow--prev',
            next  : 'splide__arrow--next',
    
            // // Add classes for pagination.
            // pagination: 'splide__pagination your-class-pagination', // container
            // page      : 'splide__pagination__page your-class-page', // each button
        };
        // console.log("carouselElement", carouselElement)
        const splide = new Splide(carouselElement, carouselOptions);

        var imageContainer = carouselElement.querySelector('.lazy-loading-image');

        if(imageContainer){
            var img = imageContainer.querySelector('.lazy-loading-image--main');
        }
        else{
            splide.mount();
        }

        function loaded() {
            if(imageContainer){
                imageContainer.classList.add("lazy-loaded-image");
            }

            splide.mount();

        }
        
        if(imageContainer){
            if (img.complete) {
                loaded();
            } else {
                img.addEventListener("load", loaded);
            }
        }

        var splideBar = splide.root.querySelector( '.splide__progress-bar' );

        if( splideBar ){
            // Updates the bar width whenever the carousel moves:
            splide.on( 'mounted move', function () {
                var end  = splide.Components.Controller.getEnd() + 1;
                var rate = Math.min( ( splide.index + 1 ) / end, 1 );
                splideBar.style.width = String( 100 * rate ) + '%';
            } );
        }

        return carouselElement;
    }

    fetchProducts = () => {

        // Construct the URL for the Section Rendering API
        var params = '';


        this.recentProductsIds.forEach((productId, index) => {
            params += '(id:' + productId + ')';
            if(index < (this.recentProductsIds.length - 1)){
                params += ' OR ';
            }
        })
        // console.log("param", `/search?section_id=${this.recentProductsListSectionId}&type=product&q=${params}`);
        fetch(`/search?section_id=${this.recentProductsListSectionId}&type=product&q=${params}`)
        .then(res => res.text())
        .then(res => {
            // console.log(res)

            var productsListContainer =  new DOMParser().parseFromString(res, 'text/html').querySelector('.section-recently-viewed-products-list');

            const resultsLazyloadImages = productsListContainer.querySelectorAll('.lazy-loading-image');

            resultsLazyloadImages.forEach(imageContainer => {
                lazyloading(imageContainer);
            })

            var carouselElement = productsListContainer;

            if(carouselElement.classList.contains('has-carousel')){

                carouselElement = this.renderRecentlyViewedProductsCarousel(carouselElement);

            }

            this.recentProductsListElement.replaceWith(carouselElement);
        })
    }
}
customElements.define('recently-viewed-products', RecentlyViewedProducts);





// window.onload = function(){


//     var productsLists = document.querySelectorAll('.section-featured-products-list');
//     var productsTabsLists = document.querySelectorAll('.section-featured-products-tabs-products-list');
//     var productsHandpickedLists = document.querySelectorAll('.section-handpicked-products-list');
//     var collectionsLists = document.querySelectorAll('.section-featured-collections-list');

//     [...productsLists, ...productsTabsLists, ...productsHandpickedLists, ...collectionsLists].forEach(list => {
//         if( list.classList.contains('has-carousel') ){
//             // console.log("It's triggered");
//             carouselArrowCorrection(list);
//         }
//     })



// }
