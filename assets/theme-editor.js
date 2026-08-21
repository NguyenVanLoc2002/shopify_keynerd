

// Shopify editor functions on selecting any section
document.addEventListener('shopify:section:select', (event) => {
    const shopifyData = JSON.parse(event.target.dataset.shopifyEditorSection);

    let popupElementSectionIds = [];

    document.querySelectorAll('.shopify-section-group-overlay-group').forEach(overlayBlock => {
        const shopifyOverlayBlockData = JSON.parse(overlayBlock.dataset.shopifyEditorSection);
        // console.log("json", shopifyOverlayBlockData);
        
        if( shopifyOverlayBlockData.type == 'popup' || shopifyOverlayBlockData.type == 'age-verification-popup' ){
            popupElementSectionIds.push({ 'type': shopifyOverlayBlockData.type, 'id': shopifyOverlayBlockData.id });
        }
    })
    
    popupElementSectionIds.map(({ type, id }) => {
        
        if( shopifyData.type == type ){
            var popup = document.getElementById('shopify-section-' + id);
            if( popup ){
                popup.classList.remove('designMode-inactive');
            }
        }
        else{
            var popup = document.getElementById('shopify-section-' + id);
            if( popup ){
                popup.classList.add('designMode-inactive');
            }
        }
    })


})

function themeEditorLazyloading(imageContainer){
    var img = imageContainer.querySelector('.lazy-loading-image--main');
    img.setAttribute('aria-hidden', false);
    
    function loaded() {
        imageContainer.classList.add("lazy-loaded-image");
    }
    
    if (img.complete) {
        loaded();
    } else {
        img.addEventListener("load", loaded);
    }
}

// Shopify editor functions after re-rendering
document.addEventListener('shopify:section:load', (event) => {
    // console.log("reloaded");

    const sectionId = event.detail.sectionId;

    // console.log("section id", event, sectionId)

    // Animation
    var section = event.target;
    // console.log('section', section);
    var sectionChildElement = section.querySelector('div, products-tab, image-pins, recently-viewed-products, location-map');

    // console.log("sectionChildElement", sectionChildElement)
    if(sectionChildElement.classList.contains('has-animation')){
        sectionChildElement.classList.add('has-animation-in-viewport')
    }
    

    const themeEditorLazyloadImages = document.querySelectorAll('.lazy-loading-image:not(.lazy-loaded-image)');

    themeEditorLazyloadImages.forEach(imageContainer => {
        // console.log("lazyloading")
        themeEditorLazyloading(imageContainer);
    })

    

    // Slideshow
    const slideshowElements = document.querySelectorAll('.section-slideshow.has-carousel');

    slideshowElements.forEach(carouselElement => {
        // if (carouselElement.classList.contains('splide') && !carouselElement.classList.contains('product-gallery-images')) {
            // console.log("carousel element", carouselElement);
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

            // splide.mount();
        // }
    });


    // Carousel
    const carouselElements = document.querySelectorAll('.has-carousel:not(.section-slideshow)');

    carouselElements.forEach(carouselElement => {
        let carouselOptions = {};
        let carouseProgressBar = null;
        
        if (carouselElement.dataset.options) {
            carouselOptions = JSON.parse(carouselElement.dataset.options);
        }

        if(carouselElement.dataset.progressBar){
            carouseProgressBar = JSON.parse(carouselElement.dataset.progressBar)
        }

        if(carouselElement.classList.contains('section-featured-products-list') || carouselElement.classList.contains('section-featured-products-tabs-products-list') || carouselElement.classList.contains('section-handpicked-products-list') || carouselElement.classList.contains('section-featured-collections-list')){
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
        
        const splide = new Splide(carouselElement, {
            destroy: true
        });

        const newSplide = new Splide(carouselElement, carouselOptions);

        splide.mount();

        newSplide.mount();

        var newSplideBar = splide.root.querySelector( '.splide__progress-bar' );

        if( newSplideBar ){
            // Updates the bar width whenever the carousel moves:
            newSplide.on( 'mounted move', function () {
                var end  = newSplide.Components.Controller.getEnd() + 1;
                var rate = Math.min( ( newSplide.index + 1 ) / end, 1 );
                newSplideBar.style.width = String( 100 * rate ) + '%';
            } );
        }

        if( carouselElement.classList.contains('section-image-with-text-slider-content') ){
            newSplide.on( 'moved', function (newIndex, prevIndex, destIndex) {
                // console.log('newIndex', newIndex, prevIndex, destIndex);
                var textSliderPagination = carouselElement.querySelector('.section-image-with-text-slider-pagination')
                if(textSliderPagination){
                    var textSliderPaginationCurrent = textSliderPagination.querySelector('.section-image-with-text-slider-pagination-current')
                
                    textSliderPaginationCurrent.innerHTML = newIndex + 1;
                }
            } );
        }
    });

    // Product gallery

    var productGalleryImagesList = document.querySelectorAll(productGalleryImagesSelector);

    productGalleryImagesList.forEach(productGalleryImages => {
        
        if( productGalleryImages.querySelectorAll('a').length > 1 ){

            productGalleryImages.querySelectorAll('a').forEach(image => {
                image.addEventListener('click', function(e){
                    e.preventDefault();
                })
            })


            let productGalleryOptions = {};
            
            if (productGalleryImages.dataset.options) {
                productGalleryOptions = JSON.parse(productGalleryImages.dataset.options);
            }

            productGalleryOptions['classes'] = {
                // Add classes for arrows.
                arrows: 'splide__arrows',
                arrow : 'splide__arrow',
                prev  : 'splide__arrow--prev',
                next  : 'splide__arrow--next'
            };


            var main = new Splide(productGalleryImages, productGalleryOptions);
        

            var productGalleryThumbnails = productGalleryImages.closest('.product-gallery').querySelector(productGalleryThumbnailsSelector);

            if( productGalleryThumbnails ){

                productGalleryThumbnails.querySelectorAll('a').forEach(thumb => {
                    thumb.addEventListener('click', function(e){
                        e.preventDefault();
                    })
                })
                

                let productThumbnailsOptions = {};
                let productGalleryThumbnailsSize = productGalleryThumbnails.querySelectorAll('.splide__slide').length; 
                
                if (productGalleryThumbnails.dataset.options) {
                    productThumbnailsOptions = JSON.parse(productGalleryThumbnails.dataset.options);
                }

                productThumbnailsOptions['classes'] = {
                    // Add classes for arrows.
                    arrows: 'splide__arrows',
                    arrow : 'splide__arrow',
                    prev  : 'splide__arrow--prev',
                    next  : 'splide__arrow--next'
                };

                productThumbnailsOptions['slideFocus'] = true;
                productThumbnailsOptions['pagination'] = false;
                productThumbnailsOptions['direction'] = 'ttb';
                productThumbnailsOptions['height'] = '430px';
                productThumbnailsOptions['perPage'] = 1;
                productThumbnailsOptions['perMove'] = 1;
                // productThumbnailsOptions['isNavigation'] = true;
                productThumbnailsOptions['dragMinThreshold'] = {
                    mouse: 4,
                    touch: 10,
                };
                productThumbnailsOptions['breakpoints'] = {
                    768: {
                        direction: 'ltr',
                        height: 'auto'
                    },
                };

                if( productGalleryThumbnailsSize < 4 ){
                    productThumbnailsOptions['height'] = 'auto';
                }
                
                var thumbnails = new Splide(productGalleryThumbnails, productThumbnailsOptions);
            }

            thumbnails.mount();
            main.sync( thumbnails );
            main.mount();

            main.on( 'inactive', function (slideComponent) {
                
                var slide = slideComponent.slide;

                var slideVideo = slide.querySelector('video');
                var slideIframe = slide.querySelector('iframe');
                if( slideVideo ){
                    slideVideo.pause();
                }

                if( slideIframe ){
                    // Pausing Youtube video
                    slideIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')

                    // Pausing Vimeo video
                    slideIframe.contentWindow.postMessage('{"method":"pause"}', '*');
                }

            } );

            productGalleryThumbnails.querySelectorAll('li').forEach((thumb) => {

                thumb.addEventListener('click', function(){

                    var thumbnailIndex = parseInt(thumb.dataset.thumbnailIndex);

                    if(thumbnailIndex){
                        main.go(thumbnailIndex - 1);
                    }
                })
                thumb.addEventListener('keyup', function(event){

                    if (event.key === 'Enter') {
                        thumb.click();
                    }
                })
            })
        }
    });
    

})