
// Photoswipe & Gallery
var productGalleryImagesSelector = '.product-gallery-images';
var productGalleryThumbnailsSelector = '.product-gallery-thumbnails';

// Photoswipe
var lightbox = new PhotoSwipeLightbox({
    gallery: '.product-gallery-images.has-lightbox', //productGalleryImagesSelector,
    children: 'a',
    // dynamic import is not supported in UMD version
    pswpModule: PhotoSwipe 
});

lightbox.init();


// Product Gallery 
var productGalleryImagesList = document.querySelectorAll(productGalleryImagesSelector);

productGalleryImagesList.forEach(productGalleryImages => {
    
    // if( productGalleryImages.querySelectorAll('a').length > 1 ){
    if( productGalleryImages.classList.contains('splide') ){

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

            // console.log("productGalleryThumbnails", productGalleryThumbnails, productThumbnailsOptions);
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


class ProductGallery extends HTMLElement{
    constructor(){
        super();

        this.productGalleryImagesListItems = this.querySelectorAll('.product-gallery-images:not(.splide) .product-gallery-images-image');
        
        for( let item of this.productGalleryImagesListItems ){
            item.addEventListener('click', function(e){
                e.preventDefault();

                // It will scroll the image to display in the viewport.
                item.scrollIntoView({ behavior: "smooth" });
            })
        }
        
    }
}
customElements.define('product-gallery', ProductGallery)


// Product Rich media
class ProductRichMedia extends HTMLElement{
    constructor(){
        super();

        this.mediaPreview = this.querySelector('.product-rich-media-preview');
        this.mediaContent = this.querySelector('.product-rich-media-content');
        this.video = this.querySelector('video');
        this.modelViewer = this.querySelector('model-viewer');
        this.xrButton = this.querySelector('.product-xr-button');

        this.mediaPreview.addEventListener('click', () => {
            this.onClick();
        })

        if(this.xrButton){
            this.xrButton.addEventListener('click', () => {
                this.xrButtonClick();
            })
        }


        // this.modelViewer.addEventListener('click', (e) => {
        //     // var modelViewer = e.target.closest('model-viewer')
        //     // Shopify.loadFeatures(
        //     //     [
        //     //         {
        //     //             name: 'model-viewer-ui',
        //     //             version: '1.0',
        //     //             onLoad: (errors) => this.initiateModelViewerUI(errors, modelViewer)
        //     //         }
        //     //     ]
        //     // )
        // })

    }

    onClick = () => {

        this.classList.add('active');

        // this.mediaContent.dispatchEvent(new Event('click'));

        if( this.video ){
            this.video.play();
        }

        if( this.modelViewer ){

            this.loadModelInteraction();
        }

    }

    xrButtonClick = () => {
        console.log("clicked xr")


        Shopify.loadFeatures(
            [
                {
                    name: 'shopify-xr',
                    version: '1.0',
                    onLoad: (errors) => this.setupShopifyXR(errors),
                }
            ]
        )
    }

    loadModelInteraction = () => {

        Shopify.loadFeatures(
            [
                {
                    name: 'model-viewer-ui',
                    version: '1.0',
                    onLoad: (errors) => this.initiateModelViewerUI(errors)
                }
            ]
        )
    }

    initiateModelViewerUI = (errors) => {
        if (errors){
            return false
        }

        this.modelViewerUI = new Shopify.ModelViewerUI(this.querySelector('model-viewer'))
    }

    setupShopifyXR = (errors) => {
        if (errors) {
            return false
        }


        if (!window.ShopifyXR) {
            document.addEventListener('shopify_xr_initialized', () =>
            this.setupShopifyXR()
            );
            return;
        }

        const modelJSON = this.xrButton.dataset.shopifyModel3dContent
    
        // console.log(this.xrButton.dataset.shopifyModel3dContent)
        // document.querySelectorAll('[id^="ProductJSON-"]').forEach((modelJSON) => {
            window.ShopifyXR.addModels(JSON.parse(modelJSON));
        //   modelJSON.remove();
        // });
        window.ShopifyXR.setupXRElements();
      }


}
customElements.define('product-rich-media', ProductRichMedia)


// Collapsible row
class productCollapsibleRow extends HTMLElement{
    constructor(){
        super();

        this.detectDefaultTab();

        this.querySelector('.product-collapsible-row__title').addEventListener('click', (event) => {
            this.onClick(event);
        })
        
    }

    detectDefaultTab = () => {
        if( this.classList.contains('active_by_default') ){
            var collapsibleContent = this.querySelector('.product-collapsible-row__content');
            var collapsibleContentHeight = collapsibleContent.offsetHeight;
            collapsibleContent.style.height = collapsibleContentHeight + 'px';
            this.classList.remove('active_by_default');
        }   
    }

    onClick = (event) => {

        var productCollapsibleRow = this.closest('product-collapsible-row');
        var collapsibleContent = productCollapsibleRow.querySelector('.product-collapsible-row__content');
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
customElements.define('product-collapsible-row', productCollapsibleRow)



// Information popup
class ProductInfoPopup extends HTMLElement{
    constructor(){
        super();

        this.productInfoButtons = this.querySelectorAll('.product-info-popup__button');




        for(let productInfoButton of this.productInfoButtons){
            productInfoButton.addEventListener('click', (event) => {
                if( !event.target.closest('popup-modal')){
                    this.onClick(event, productInfoButton);
                }
            })
        }
    }

    onClose = () => {
        var popupModal = document.querySelector('.popup-modal');

        if(popupModal.classList.contains('product-info-popup-modal')) {
            popupModal.classList.remove('product-info-popup-modal');
        }

        popupModal.querySelector('.popup-modal__content').innerHTML = '';
    }
    

    onClick = (event, infoButton) => {
        event.preventDefault();

        var pageHandle = event.target.dataset.pageHandle; 


        this.classList.add('loading');


        var popupModal = document.querySelector('.popup-modal');

        if( !popupModal ){
            var quickviewModalString = `<popup-modal class="popup-modal product-info-popup-modal">
            <div class="popup-modal__overlay"></div>
            <div class="popup-modal__inner">
                <div class="popup-modal__content">
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
            if(!popupModal.classList.contains('product-info-popup-modal')) {
                popupModal.classList.add('product-info-popup-modal');
            }

            popupModal.classList.remove('inactive');
        }

        if( !pageHandle ){

            var emptyText = infoButton.dataset.emptyText;

            if( emptyText ){

                var infoButtonWrap = document.createElement('div');
                infoButtonWrap.classList.add('page-description');
                infoButtonWrap.innerHTML = emptyText;

                var popupModalContent = document.querySelector('.popup-modal__content');
                popupModalContent.append(infoButtonWrap);
            }

            return false
        }

        // fetch(`${window.Shopify.routes.root}pages/${pageHandle}?section_id=popup-modal`)
        fetch(`${window.Shopify.routes.root}pages/${pageHandle}`)
            .then((response) => {
                // console.log("res", response)
                if (!response.ok) {
                    var error = new Error(response.status);
                    throw error;
                }

                return response.text();
            })
            .then((res)=>{ 

                // console.log("res", res)
                var html = new DOMParser().parseFromString(res, 'text/html');
                var content = html.querySelector('.section-main-page-content');
                // console.log("html", content);

                var popupModalContent = document.querySelector('.popup-modal__content');
                popupModalContent.append(content);



                this.popupCloseButton = document.querySelector('.popup-modal__close');
                this.popupOverlay = document.querySelector('.popup-modal__overlay');

                
                this.popupCloseButton.addEventListener('click', () => {
                    this.onClose();
                })

                this.popupOverlay.addEventListener('click', () => {
                    this.onClose();
                })

            })

    }


}
customElements.define('product-info-popup', ProductInfoPopup);


// Share product
class ProductShareIcons extends HTMLElement{
    constructor(){
        super();

        // Copy Share Link
        this.copyShareLink();

        // Share icons
        this.shareIcons();

    }

    copyShareLink = () => {
        var shareCopyLink = this.querySelector('.product-share-copy-link > a');

        shareCopyLink.addEventListener('click', (event) => {
            event.preventDefault();
    
            navigator.clipboard.writeText(shareCopyLink.getAttribute('href')).then(()=>{ 
                shareCopyLink.parentElement.classList.add('copied')
    
                setTimeout(function(){
                    shareCopyLink.parentElement.classList.remove('copied')
                }, 3000)
            });
    
        })
    }

    shareIcons = () => {
        var shareIcons = this.querySelectorAll('.product-share-icon > a');

        for(let icon of shareIcons){
            icon.addEventListener('click', (event) => {
                event.preventDefault();

                var url = icon.getAttribute('href');
                window.open(url, 'popUpWindow', 'height=700, width=800, left=10, top=10, resizable=yes, scrollbars=yes, toolbar=yes, menubar=no, location=no, directories=no, status=yes');

            })
        }
    }

}
customElements.define('product-share-icons', ProductShareIcons)
// var shareCopyLink = document.querySelectorAll('.product-share-copy-link > a');

// for(let link of shareCopyLink){
//     link.addEventListener('click', (event) => {
//         event.preventDefault();

//         navigator.clipboard.writeText(link.getAttribute('href')).then(()=>{ 
//             link.parentElement.classList.add('copied')

//             setTimeout(function(){
//                 link.parentElement.classList.remove('copied')
//             }, 3000)
//         });

//     })
// }

// var shareIcon = document.querySelectorAll('.product-share-icon > a');
// for(let icon of shareIcon){
//     icon.addEventListener('click', (event) => {
//         event.preventDefault();

//         var url = icon.getAttribute('href');
//         window.open(url, 'popUpWindow', 'height=700, width=800, left=10, top=10, resizable=yes, scrollbars=yes, toolbar=yes, menubar=no, location=no, directories=no, status=yes');

//     })
// }


// Product recommendation
class ProductRecommendations extends HTMLElement{
    constructor(){
        super();

        var splideArrows = this.querySelector('.splide__arrows');
        var splideProgress = this.querySelector('.splide__progress');
        
        var productId = this.dataset.productId
        var intent = this.dataset.intent
        var limit = this.dataset.limit

        // var sectionId = this.dataset.sectionId;
        var columnsCount = parseInt(this.dataset.columnsCount);
        var carousel = this.dataset.carousel === 'true';
        var columnsOffset = this.dataset.columnsOffset === 'true';
        var carouselOptions = JSON.parse(this.dataset.options);

        // if( sectionId.length == 0 ){
        //     sectionId = 'product-recommendations'
        // }

        fetch(window.Shopify.routes.root + `recommendations/products?product_id=${productId}&section_id=product-recommendations&limit=${limit}&intent=${intent}`)
            .then(response => response.text())
            .then((text) => {
                // console.log("res", text)

                var html = new DOMParser().parseFromString(text, 'text/html').querySelector('.shopify-section');
                // console.log("res dom", html)


                var productsList = html.querySelector('ul');
                var products = html.querySelectorAll('.product');

                if( products.length > columnsCount && carousel ){

                    var productsListWrap = document.createElement('div');

                    for (const className of productsList.classList) {
                        productsListWrap.classList.add(className)

                    }

                    for (const product of products){
                        product.classList.add('splide__slide')
                    }

                    productsListWrap.classList.add('has-carousel');
                    productsListWrap.classList.add('splide');


                    var splideTrack = document.createElement('div');

                    splideTrack.classList.add('splide__track');


                    productsList.classList.add('splide__list');
                    productsList.classList.remove('product-recommendations-list');


                    splideTrack.appendChild(productsList);

                    productsListWrap.appendChild(splideTrack);
                    productsListWrap.appendChild(splideArrows);

                    if(splideProgress){
                        productsListWrap.appendChild(splideProgress);
                    }
                    
                    // console.log("products list wrap", productsListWrap);
                    // carouselOptions = {};


                    if(columnsOffset){
                        productsListWrap.classList.add('has-carousel-columns-offset');

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
                    
                    const splide = new Splide(productsListWrap, carouselOptions);

                    var splideBar = splide.root.querySelector( '.splide__progress-bar' );

                    if( splideBar ){
                        // Updates the bar width whenever the carousel moves:
                        splide.on( 'mounted move', function () {
                            var end  = splide.Components.Controller.getEnd() + 1;
                            var rate = Math.min( ( splide.index + 1 ) / end, 1 );
                            splideBar.style.width = String( 100 * rate ) + '%';
                        } );
                    }

                    splide.mount();
                    
                    this.appendChild(productsListWrap)

                }
                else{

                    const html = document.createElement('div');
                    html.innerHTML = text;
                    const recommendations = html.querySelector('.shopify-section');
                    
                    if( recommendations ){
                        this.innerHTML = recommendations.innerHTML;
                    }

                }

                const productsLazyloadImages = this.querySelectorAll('.lazy-loading-image');

                productsLazyloadImages.forEach(imageContainer => {
                    lazyloading(imageContainer);
                })

            });
    }
}

customElements.define('product-recommendations', ProductRecommendations)



// Recipient Form
class RecipientForm extends HTMLElement{
    constructor(){
        super();

        this.recipientToggle = this.querySelector('.recipient-form-toggle');

        this.recipientToggle.addEventListener('click', (e) => {
            e.preventDefault();
            //.dispatchEvent('click');

            this.onClick();
        })
   
    // let productAddToCartSelector = '.product-add-to-cart';
    // let productAddToCart = event.target.closest(productAddToCartSelector);

    // if( productAddToCart && !productAddToCart.hasAttribute('disabled') ){
    //     event.preventDefault();

    // }

        // this.productForm = document.querySelector('.product-options-form');

        // var productAddToCart = this.productForm.closest(productAddToCartSelector)
     
        // if( productAddToCart ){
        //     productAddToCart.addEventListener('click', (e) => {
        //         // e.preventDefault();
        //         console.log("i reached submit")

        //         this.onSubmit();
        //     })
        // }
        
    }


    onClick = () => {

        var recipientForm = this.closest('.recipient-form');
        var recipientFormToggleInput = this.recipientToggle.querySelector('input');
        var recipientFormFields = recipientForm.querySelector('.recipient-form-fields');
        var recipientFormFieldsHeight = recipientFormFields.offsetHeight;

        // console.log("checked", this.querySelector('input').getAttribute('checked'));

        // this.querySelector('input').setAttribute('checked', !this.querySelector('input').getAttribute('checked'));

        if( recipientFormToggleInput.getAttribute('checked') ){
            recipientFormToggleInput.removeAttribute('checked')
        }
        else{
            recipientFormToggleInput.setAttribute('checked', true)
        }

        if( recipientForm.classList.contains('active') ){
            recipientFormFields.style.removeProperty('height');
            setTimeout(function(){
                recipientForm.classList.remove('active');
            }, 200)
        }
        else{
            recipientForm.classList.add('active');
            setTimeout(function(){
                recipientFormFields.style.height = recipientFormFieldsHeight + 'px';
            }, 10)
        }
    }

    onSubmit = () => {

        console.log("I run this before submit");

        this.productForm.submit();

    }
    
}
customElements.define('recipient-form', RecipientForm)

// Sticky add to cart 

class StickyBar extends HTMLElement{
    constructor(){
        super();

        this.select = document.querySelector('.product-variants-selector-select');

        this.stickyAddtocart = document.querySelector('.product-sticky-bar-add-to-cart');

        this.stickyAddtocart.addEventListener('click', function(){
            document.querySelector('#AddToCart').click();
        })


        if(this.select){
            this.select.addEventListener('change', () => {

                this.onVariantChange();
            })
        }

        window.addEventListener('scroll', () => {

            var productAddtocart = this.closest('.product').querySelector('.product-add-to-cart');
            var footer = document.querySelector('.section-footer');
            var windowInnerHeight = window.innerHeight;

            var addtocartOffsetTop = productAddtocart.getBoundingClientRect().top;
            var footerOffsetTop = footer.getBoundingClientRect().top;

            // console.log("footer offset", addtocartOffsetTop, footerOffsetTop, windowInnerHeight)

            if( addtocartOffsetTop < 0 && footerOffsetTop > windowInnerHeight ){
                this.classList.add('active');
            }
            else{
                this.classList.remove('active');
            }
        })
        

    }

    onVariantChange = () =>{
        const variantId = this.select.options[this.select.selectedIndex].value;
        const productSelector = '.product'

        // console.log("variant change triggered", variantId);

        if(variantId == 'none'){
            this.classList.add('has-no-variant');
        }
        else{
            this.classList.remove('has-no-variant');
        }


        var productAddtocartElement = this.select.closest(productSelector).querySelector('.product-add-to-cart');
        var productPriceElement = this.select.closest(productSelector).querySelector('.product-price');
        var productThumbnailElements = this.select.closest(productSelector).querySelectorAll('.product-gallery-thumbnails-thumbnail');


        var stickyProductPrice = this.select.closest(productSelector).querySelector('.product-sticky-bar-product-price')
        var stickyProductChosenVariant = this.select.closest(productSelector).querySelector('.product-sticky-bar-chosen-variant')
        var stickyProductAddtocart = this.select.closest(productSelector).querySelector('.product-sticky-bar-add-to-cart')
        var stickyProductThumbnail = this.select.closest(productSelector).querySelector('.product-sticky-bar-product-thumbnail')

        if(variantId == 'none'){
            stickyProductPrice.innerHTML = ''
        }

        stickyProductChosenVariant.innerHTML = this.select.options[this.select.selectedIndex].innerHTML


        // Changing image
        for (let thumbnail of productThumbnailElements){
            const imageVariantIds = thumbnail.dataset.variantIds
            // console.log("image variant ids", imageVariantIds);
            if( imageVariantIds.includes(variantId) ){
                // console.log("missing")
                stickyProductThumbnail.innerHTML = thumbnail.innerHTML;
            }
        }

        stickyProductAddtocart.innerHTML = productAddtocartElement.innerHTML;
        stickyProductAddtocart.disabled = productAddtocartElement.disabled;

        document.addEventListener('shopifyProductVariantFetched', (event) => {
            var variant = event.detail.variant;

            if(productPriceElement.innerHTML){
                stickyProductPrice.innerHTML = productPriceElement.innerHTML
            }
            else{
                stickyProductPrice.innerHTML = ''
            }

        })
    }
}
customElements.define('sticky-bar', StickyBar)
