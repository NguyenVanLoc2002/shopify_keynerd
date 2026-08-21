

function updateURLState(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
}

function updatePagination(searchParams){
    // console.log("updating pagination", searchParams);

    var paginationLinks = document.querySelectorAll('.products-pagination a');

    var existingSearchParams = new URLSearchParams(searchParams);

    for( let link of paginationLinks ){

        var searchParamsArray = {};
        var urlBase = link.getAttribute('href').split('?')[0];
        var url = link.getAttribute('href').split('?')[1];
        var urlParams = new URLSearchParams(url);
       
        for(const entry of urlParams.entries()) {
            searchParamsArray[entry[0]] = entry[1];
        }

        for(const existingEntry of existingSearchParams.entries()){
            searchParamsArray[decodeURIComponent(existingEntry[0])] = decodeURIComponent(existingEntry[1]);
        }

        var newUrlParams = new URLSearchParams(searchParamsArray).toString();
        var newUrl = urlBase + '?' + newUrlParams;

        link.setAttribute('href', newUrl)
    }


}


// Filters & Sorting
class ProductFilters extends HTMLElement{
    constructor(){
        super();


        // To check is element added
        // if (!customElements.get('quick-add-modal')) {

        // }

        this.form = this.querySelector('form');
        this.details = this.getElementsByTagName('details');
        this.submitButtons = this.querySelectorAll('button[type="submit"]')

        this.filterDrawerToggle = this.querySelector('.facet-filters-toggle');
        this.filterDrawerContent = this.querySelector('.facet-filters-content');
        this.filterDrawerOverlay = this.querySelector('.facet-filters-form-overlay');
        this.filterDrawerClose = this.querySelector('.facet-filters-list-close');

        // Mobile filter Drawer
        this.mobileFilterClick();

        // Close filter dropdown when out of range
        // this.filterClose();

        // Ajax Filter
        this.ajaxFilter();

        // Price Range filter
        var priceSliderBase = document.querySelector('.price-range-handle-base');
        if(priceSliderBase){
            this.priceRangeSlider();
        }
    }

    mobileFilterClick = () => {
        this.filterDrawerToggle.addEventListener('click', (e) => {
            e.preventDefault();
            
            if( this.filterDrawerContent.classList.contains('active') ){
                this.filterDrawerContent.classList.remove('active');
            }
            else{
                this.filterDrawerContent.classList.add('active');
            }
        })

        document.addEventListener('click', (event) => {
            // this.details = this.getElementsByTagName('details');
            // for(let detail of this.details){
            var filterDrawerClose = document.querySelector('.facet-filters-list-close');
            if (event.target == filterDrawerClose || filterDrawerClose.contains(event.target)) {
                this.filterDrawerContent.classList.remove('active');
            }
            // }
        })

        this.filterDrawerOverlay.addEventListener('click', (e) => {
            // e.preventDefault();
            // console.log("clicked close")
            this.filterDrawerContent.classList.remove('active');
            
        })
    }

    


    filterClose = () => {
        document.addEventListener('click', (event) => {
            this.details = this.getElementsByTagName('details');
            for(let detail of this.details){
                if (event.target !== detail && !detail.contains(event.target)) {
                    detail.removeAttribute('open');
                }
            }
        })
    }

    ajaxFilter = () => {

        document.addEventListener('change', (event) => {
            var filterInputElements = this.querySelectorAll('input[type="checkbox"], input[type="number"]');
            filterInputElements.forEach(filterInputElement => {

                if (event.target == filterInputElement || filterInputElement.contains(event.target)) {
                    // console.log("change triggered");
                    this.ajaxFiltering(event);
                }
            })
        })

        document.addEventListener('keyup', (event) => {
            if(event.key == 'Enter'){   
                
                var filterInputElements = this.querySelectorAll('.filter-group-display__list-item');
                filterInputElements.forEach(filterInputElement => {
                    if (event.target == filterInputElement || filterInputElement.contains(event.target)) {
                        // console.log("change triggered");
                        filterInputElement.querySelector('input[type="checkbox"], input[type="number"]').click();
                    }
                })
            }
        })

        var filterPriceRangeMin = this.querySelector('.price-range-handle-min');
        var filterPriceRangeMax = this.querySelector('.price-range-handle-max');


        document.addEventListener('keyup', (event) => {
            var focusedMin = this.querySelector('.price-range-handle-min:focus-visible');
            var focusedMax = this.querySelector('.price-range-handle-max:focus-visible');
            if(event.key == 'Tab'){
                if(focusedMin){
                    this.isDraggingMin = true 
                    this.isDraggingMax = false 
                }
                if(focusedMax){
                    this.isDraggingMax = true 
                    this.isDraggingMin = false 
                }

                if(focusedMin == null && focusedMax == null){
                    this.isDraggingMax = false 
                    this.isDraggingMin = false 
                }
            }

            if(event.key == 'Enter'){
                if(focusedMin || focusedMax){
                    this.ajaxFiltering(event);
                }
            }
        });

        // document.addEventListener('keyup', (event) => {
        //     if(event.key == 'Enter'){
        //         var focusedMin = this.querySelector('.price-range-handle-min:focus-visible');
        //         var focusedMax = this.querySelector('.price-range-handle-max:focus-visible');
        //         if(focusedMin){
        //             console.log("now in min focus")
        //             this.isDraggingMin = true 
        //             this.isDraggingMax = false 
        //         }
        //         if(focusedMax){
        //             console.log("now in max focus");
        //             this.isDraggingMax = true 
        //             this.isDraggingMin = false 
        //         }

        //     }
        // });
       
        var priceSliderBase = document.querySelector('.price-range-handle-base');
        if(priceSliderBase){
            var priceSliderWidth = priceSliderBase.offsetWidth
            var currentOffset = 0
            var currentOffsetLeft = 0
            var currentOffsetRight = 240
            document.addEventListener('keydown', (event) => { 
                if(event.key == 'ArrowLeft'){   
                    if(this.isDraggingMin){
                        currentOffset = currentOffset - 10;
                    }
                    if(this.isDraggingMax){
                        currentOffset = currentOffset + 10;
                    }
                    // currentOffsetRight = currentOffsetRight - 10;
                    // currentOffsetLeft = currentOffsetLeft - 10;
                    // console.log("currentOffset L", currentOffsetRight, this.isDraggingMin, this.isDraggingMax)
                    // if(this.isDraggingMin){
                    //     currentOffset = currentOffsetLeft
                    // }
                    // this.onMove(event, currentOffsetRight);
                    // this.onMove(event, currentOffset);
                    // var filterPriceRangeMax = this.querySelector('.price-range-handle-max');
                
                    // if (event.target == filterPriceRangeMax || filterPriceRangeMax.contains(event.target)) {
                    //     this.isDraggingMax = true 
                    // }
                }

                if(event.key == 'ArrowRight'){    
                    if(this.isDraggingMin){
                        currentOffset = currentOffset + 10;
                    }
                    if(this.isDraggingMax){
                        currentOffset = currentOffset - 10;
                    }
                    // currentOffsetRight = currentOffsetRight + 10;
                    // currentOffsetLeft = currentOffsetLeft + 10;
                    // console.log("currentOffset R", currentOffsetLeft, this.isDraggingMin, this.isDraggingMax)
                    // if(this.isDraggingMax){
                    //     currentOffset = currentOffsetRight
                    // }
                    // this.onMove(event, currentOffsetLeft);
                    // var filterPriceRangeMin = this.querySelector('.price-range-handle-min');

                    // if (event.target == filterPriceRangeMin || filterPriceRangeMin.contains(event.target)) {
                    //     this.isDraggingMin = true 
                    // }

                }
                
                if(this.isDraggingMin){
                    this.onMove(event, currentOffset);
                }
                if(this.isDraggingMax){
                    this.onMove(event, (priceSliderWidth - currentOffset));
                }
            })
        }

    }


    getParams(){

        const formData = new FormData(this.form);
        return new URLSearchParams(formData).toString();
        
    }


    getUrlParams = () => {
        Shopify.queryParams = [];
        var queryParams = [];
        if(window.location.search.length) {
            
          for(var aKeyValue, i = 0, aCouples = window.location.search.substring(1).split('&'); i < aCouples.length; i++) {
            aKeyValue = aCouples[i].split('=');
            if (aKeyValue.length > 1) {
                if( aKeyValue[1].length > 0 ){

                    if( aKeyValue[0] != 'page' ){
                        queryParams.push({ key: decodeURIComponent(aKeyValue[0]), value: decodeURIComponent(aKeyValue[1])});
                    }
                }
            }
          }
        }

        var formParams = this.getParams();

        var getSearchParam = document.querySelector("[name='q']");
        if(getSearchParam){
          Shopify.queryParams.push({ key: decodeURIComponent('q'), value: decodeURIComponent(getSearchParam.value)});
        }

        if(formParams.length) {
            for(var aKeyValue, i = 0, aCouples = formParams.split('&'); i < aCouples.length; i++) {
                aKeyValue = aCouples[i].split('=');
                if (aKeyValue.length > 1) {
                    Shopify.queryParams.push({ key: decodeURIComponent(aKeyValue[0]), value: decodeURIComponent(aKeyValue[1])});
                }
            }
        }
        // console.log("query params", queryParams)
        // console.log("shopify query params", Shopify.queryParams)

        // var combinedQueryParams = [...queryParams, ...Shopify.queryParams];
        var combinedQueryParams = [...Shopify.queryParams];
        var params = '';

        combinedQueryParams.forEach((param, index) => {
            params += `${param['key']}=${param['value']}`; 

            if( (index + 1) != combinedQueryParams.length ){
                params += `&`;
            }
        })

        // console.log("params", params)

        return params;
    }

    ajaxFiltering = (event) => {


        var searchParams = this.getUrlParams();
        // console.log("search params", searchParams);

        var productsSelector = '.products';
        var filtersSelector = '.facet-filters';
        var productsSection = document.querySelector(productsSelector);
        var filtersSection = document.querySelector(filtersSelector);

        var productsSectionId = productsSection.dataset.id
        var filtersSectionId = filtersSection.dataset.id


        var priceSliderBase = document.querySelector('.price-range-handle-base');
        if(priceSliderBase){
            var handleMin = filtersSection.querySelector('.filter-group-display__price-range-slider-handle--min');
            var handleMax = filtersSection.querySelector('.filter-group-display__price-range-slider-handle--max');
            var currentHandleMinWidth = handleMin.style.width;
            var currentHandleMaxWidth = handleMax.style.width;
        }

        // var productsCountSelector = '.facet-filters-count'
        // var productsCount = document.querySelector(productsCountSelector + '> span');


        fetch(`${window.location.pathname}?section_id=${filtersSectionId}&${searchParams}`)
            .then(response => {
                // console.log("response", response)
                return response.text()
            })
            .then((text) => {

                // Insert products
                this.insertFilteredFacets(text);

                // Set Price filter width
                if(priceSliderBase){
                    this.setPriceFilterHandleWidth(currentHandleMinWidth, currentHandleMaxWidth);
                }

            });
        fetch(`${window.location.pathname}?section_id=${productsSectionId}&${searchParams}`)
            .then(response => {
                // console.log("response", response)
                return response.text()
            })
            .then((text) => {

                // Insert products
                this.insertFilteredProducts(text);

                // Update Addressbar URL
                updateURLState(searchParams)
        
                // Closing dropdown
                this.closeDropdown(event);

                // Closing Drawer
                this.filterDrawerContent.classList.remove('active');

            });
    }

    closeDropdown = (event) => {
        var detail = event.target.closest('details')
        if( detail ){
            detail.removeAttribute('open');
        }
    }

    insertFilteredFacets = (text) => {

        // console.log("response", text);

        var filtersSelector = '.facet-filters';
        var filtersSection = document.querySelector(filtersSelector + ' .filter-form');
        var filtersCountSection = document.querySelector('.facet-filters-count');

        const html = document.createElement('div');
        html.innerHTML = text;
        const newFiltersSection = html.querySelector(filtersSelector + ' .filter-form');
        const newFiltersCountSection = html.querySelector('.facet-filters-count');

        // console.log("products length", productsSection.childElementCount);
        
        filtersSection.innerHTML = newFiltersSection.innerHTML;
        filtersCountSection.innerHTML = newFiltersCountSection.innerHTML;

        const resultsLazyloadImages = filtersSection.querySelectorAll('.lazy-loading-image');

        resultsLazyloadImages.forEach(imageContainer => {
            lazyloading(imageContainer);
        })
    }

    insertFilteredProducts = (text) => {

        // console.log("response", text);

        var productsSelector = '.products';
        var productsSection = document.querySelector(productsSelector);

        const html = document.createElement('div');
        html.innerHTML = text;
        const newProductsSection = html.querySelector(productsSelector);

        // console.log("products length", productsSection.childElementCount);

        productsSection.innerHTML = newProductsSection.innerHTML;

        const resultsLazyloadImages = productsSection.querySelectorAll('.lazy-loading-image');

        resultsLazyloadImages.forEach(imageContainer => {
            lazyloading(imageContainer);
        })
        
    }

    setPriceFilterHandleWidth = (currentHandleMinWidth, currentHandleMaxWidth) => {

        var filtersSelector = '.facet-filters';
        var filtersSection = document.querySelector(filtersSelector + ' .filter-form');

        var handleMin = filtersSection.querySelector('.filter-group-display__price-range-slider-handle--min');
        var handleMax = filtersSection.querySelector('.filter-group-display__price-range-slider-handle--max');

        // this.minPriceElement = this.querySelector('.filter-group-display__price-range-from input[type="number"]');
        // this.maxPriceElement = this.querySelector('.filter-group-display__price-range-to input[type="number"]');

        handleMin.style.width = currentHandleMinWidth;
        handleMax.style.width = currentHandleMaxWidth;
    }


    priceRangeSlider = () => {

        this.isDraggingMin = false,
        this.isDraggingMax = false,
        this.isOutofRange = false;


        document.addEventListener('mouseup', (event) => { 

            this.handle = this.querySelector('.filter-group-display__price-range-slider');
            this.handleMin = this.querySelector('.filter-group-display__price-range-slider-handle--min');
            this.handleMax = this.querySelector('.filter-group-display__price-range-slider-handle--max');

            this.minPriceElement = this.querySelector('.filter-group-display__price-range-from input[type="number"]');
            this.maxPriceElement = this.querySelector('.filter-group-display__price-range-to input[type="number"]');

            this.minPrice = this.minPriceElement.getAttribute('min');
            this.maxPrice = this.maxPriceElement.getAttribute('max');


            this.minWidth = this.handleMin.offsetWidth;
            this.maxWidth = this.handleMax.offsetWidth;
            this.handleWidth = this.handle.offsetWidth;

            this.priceRange = this.maxPrice - this.minPrice;
            
            this.sliderPosition = {
                top: this.handle.getBoundingClientRect().top + window.scrollY, 
                left: this.handle.getBoundingClientRect().left + window.scrollX, 
            };


            if (event.target == this.handleMin || this.handleMin.contains(event.target)) {
                this.isDraggingMin = false 

                this.ajaxFiltering(event);
            }
            if (event.target == this.handleMax || this.handleMax.contains(event.target)) {
                this.isDraggingMax = false 

                this.ajaxFiltering(event);
            }

        });
        document.addEventListener('mousedown', (event) => { 

            this.handleMin = this.querySelector('.filter-group-display__price-range-slider-handle--min');
            this.handleMax = this.querySelector('.filter-group-display__price-range-slider-handle--max');

            if (event.target == this.handleMin || this.handleMin.contains(event.target)) {
                this.isDraggingMin = true 
            }
            if (event.target == this.handleMax || this.handleMax.contains(event.target)) {
                this.isDraggingMax = true 
            }
        });

        document.addEventListener('touchend', (event) => { 

            this.handle = this.querySelector('.filter-group-display__price-range-slider');
            this.handleMin = this.querySelector('.filter-group-display__price-range-slider-handle--min');
            this.handleMax = this.querySelector('.filter-group-display__price-range-slider-handle--max');

            this.minPriceElement = this.querySelector('.filter-group-display__price-range-from input[type="number"]');
            this.maxPriceElement = this.querySelector('.filter-group-display__price-range-to input[type="number"]');

            this.minPrice = this.minPriceElement.getAttribute('min');
            this.maxPrice = this.maxPriceElement.getAttribute('max');


            this.minWidth = this.handleMin.offsetWidth;
            this.maxWidth = this.handleMax.offsetWidth;
            this.handleWidth = this.handle.offsetWidth;

            this.priceRange = this.maxPrice - this.minPrice;
            
            this.sliderPosition = {
                top: this.handle.getBoundingClientRect().top + window.scrollY, 
                left: this.handle.getBoundingClientRect().left + window.scrollX, 
            };

            if (event.target == this.handleMin || this.handleMin.contains(event.target)) {
                this.isDraggingMin = false 

                this.ajaxFiltering(event);
            }
            if (event.target == this.handleMax || this.handleMax.contains(event.target)) {
                this.isDraggingMax = false 

                this.ajaxFiltering(event);
            }
        });
        document.addEventListener('touchstart', (event) => { 

            this.handleMin = this.querySelector('.filter-group-display__price-range-slider-handle--min');
            this.handleMax = this.querySelector('.filter-group-display__price-range-slider-handle--max');

            if (event.target == this.handleMin || this.handleMin.contains(event.target)) {
                this.isDraggingMin = true 
            }

            if (event.target == this.handleMax || this.handleMax.contains(event.target)) {
                this.isDraggingMax = true 
            }
        });


        document.addEventListener('mousemove', (e) => this.onMove(e));
        document.addEventListener('touchmove', (e) => this.onMove(e));

        document.addEventListener('mouseup', (e) => { this.onMouseUp(); })
        document.addEventListener('touchend', (e) => { this.onMouseUp(); })
        document.addEventListener('mousedown', (e) => { e.key == "Escape" && this.onMouseUp(); });

    }

    onMove = (e, offsetX = null) => {

        if( !(this.isDraggingMax == true || this.isDraggingMin == true) ){
            return false;
        }
        // console.log("on move triggered correctly", e);

        var type = e.type;
        var pageX = e.pageX;
        if(offsetX == null){
            offsetX = e.offsetX;
        }

        if (type === "touchmove") {
            var touch = e.touches[0] || e.changedTouches[0];
            var touchOffset = 34;
            offsetX = touch.pageX - touchOffset;

        }
        // console.log("offset price slider", offsetX)

        this.handle = this.querySelector('.filter-group-display__price-range-slider');
        this.handleMin = this.querySelector('.filter-group-display__price-range-slider-handle--min');
        this.handleMax = this.querySelector('.filter-group-display__price-range-slider-handle--max');

        this.minPriceElement = this.querySelector('.filter-group-display__price-range-from input[type="number"]');
        this.maxPriceElement = this.querySelector('.filter-group-display__price-range-to input[type="number"]');

        this.minPrice = this.minPriceElement.getAttribute('min');
        this.maxPrice = this.maxPriceElement.getAttribute('max');



        this.minWidth = this.handleMin.offsetWidth;
        this.maxWidth = this.handleMax.offsetWidth;
        this.handleWidth = this.handle.offsetWidth;

        this.priceRange = this.maxPrice - this.minPrice;
        
        this.sliderPosition = {
            top: this.handle.getBoundingClientRect().top + window.scrollY, 
            left: this.handle.getBoundingClientRect().left + window.scrollX, 
        };


        this.isOutofRange = (this.sliderPosition.left > pageX || (this.handleWidth + this.sliderPosition.left) <= pageX) ? true : false;

        var width = Math.floor((this.priceRange * offsetX) / this.handleWidth) + parseFloat(this.minPrice);

        if (this.isDraggingMax == true && this.minWidth < offsetX && this.isOutofRange == false) {
            this.handleMax.style.width = offsetX * 100 / this.handleWidth + '%';
            this.maxPriceElement.setAttribute('val', width);
            this.maxPriceElement.value = width;
        }

        if (this.isDraggingMin == true && this.maxWidth > offsetX && this.isOutofRange == false) {
            this.handleMin.style.width = offsetX * 100 / this.handleWidth + '%';
            this.minPriceElement.setAttribute('val', width);
            this.minPriceElement.value = width;
        }

        this.minWidth = this.handleMin.offsetWidth;
        this.maxWidth = this.handleMax.offsetWidth;

    }

    onMouseUp = () => {
        this.isDraggingMin = false;
        this.isDraggingMax = false;

    }
}
customElements.define('facet-filters', ProductFilters)



class SortingDropdown extends HTMLElement{
    constructor(){
        super();

        this.dropdownToggle = this.querySelector('.facet-filters-sorting-default');
        this.sortOptions = this.querySelectorAll('li');

        this.dropdownToggle.addEventListener('click', (e)=> {
            this.onClick();
        })

        document.addEventListener('click', (event) => {
            if (event.target !== this && !this.contains(event.target)) {
                this.close()
            }
        })
        
        for( let option of this.sortOptions ){
            option.addEventListener('click', (e) => {
                this.onOptionClick(option);
            });
        }

        document.addEventListener('keyup', (event) => {
            if(event.key == 'Enter'){
                for( let option of this.sortOptions ){
                    if (event.target == option && option.contains(event.target)) {
                        this.onOptionClick(option);
                    }
                }
            }
        })
    }

    onClick = () => {
        if( this.classList.contains('active') ){
            this.close();
        }
        else{
            this.open();
        }
    }

    open = () => {
        this.classList.add('active');
    }

    close = () => {
        this.classList.remove('active');
    }

    onOptionClick = (option) => {
        var value = option.dataset.value;
        // console.log("changed", value);

        var queryParams = {};
        if(window.location.search.length) {
            
          for(var aKeyValue, i = 0, aCouples = window.location.search.substring(1).split('&'); i < aCouples.length; i++) {
            aKeyValue = aCouples[i].split('=');
            if (aKeyValue.length > 1) {
                queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
            }
          }
        }

        queryParams.sort_by = value;

        this.ajaxSorting(queryParams);
    }

    ajaxSorting = (queryParams) => {

        var productsSelector = '.products'
        var productsSection = document.querySelector(productsSelector);
        var productsSectionId = productsSection.dataset.id

        var searchParams = new URLSearchParams(queryParams).toString().replace(/\+/g, '%20');
        
        fetch(`${window.location.pathname}?section_id=${productsSectionId}&${searchParams}`)
        .then(response => {
            return response.text()
        })
        .then((text) => {

            for( let option of this.sortOptions ){
              if( option.dataset.value == queryParams.sort_by ){
                this.dropdownToggle.querySelector('span').innerHTML = option.innerHTML
              }
            }

            const html = document.createElement('div');
            html.innerHTML = text;
            const newProductsSection = html.querySelector(productsSelector);
            
            productsSection.innerHTML = newProductsSection.innerHTML;

            const resultsLazyloadImages = productsSection.querySelectorAll('.lazy-loading-image');

            resultsLazyloadImages.forEach(imageContainer => {
                lazyloading(imageContainer);
            })

            updateURLState(searchParams)

            updatePagination(searchParams);


            this.close();

        });
    }

}

customElements.define('sorting-dropdown', SortingDropdown)


function ajaxPagination(params, productsPagination) {

    var productsSelector = '.products'
    var section = document.querySelector(productsSelector);

    fetch(`${window.location.pathname}?${params}`)
        .then(response => {
            return response.text()
        })
        .then((text) => {

            const html = document.createElement('div');
            html.innerHTML = text;
            const productsSection = html.querySelector(productsSelector);

            if( productsPagination.dataset.paginationChoice == '2' || productsPagination.dataset.paginationChoice == '3' ){
                
                productsSection.querySelectorAll('li').forEach(li => {
                    section.querySelector('ul').append(li);
                })
                
                var infiniteButton = document.querySelector('.products-pagination-infinite');
                infiniteButton.dataset.currentPage = html.querySelector('.products-pagination-infinite').dataset.currentPage;

                infiniteButton.disabled = false;

                if(infiniteButton.dataset.currentPage >= infiniteButton.dataset.totalPages){
                    infiniteButton.classList.add('hide');
                }

                if(productsPagination.dataset.paginationChoice == '3'){
                    infiniteButton.classList.add('inactive');
                }

            }
            else{
                section.innerHTML = productsSection.innerHTML;

                updateURLState(params)

                document.querySelector('.section-products').scrollIntoView({
                    behavior: "instant"
                })
            }

            // Lazyload iamges
            const resultsLazyloadImages = section.querySelectorAll('.lazy-loading-image');

            resultsLazyloadImages.forEach(imageContainer => {
                lazyloading(imageContainer);
            })

        });

}

class ProductsPagination extends HTMLElement {
    constructor(){
        super();

        if(this.dataset.paginationChoice == '2' || this.dataset.paginationChoice == '3'){
            // Pagination Infinite scroll
            this.paginationInfiniteScroll();
        }
        else{
            // Pagination Numbers
            this.paginationNumbers();
        }

        // // Ajax Pagination
        // this.ajaxPagination();
    }


    paginationNumbers = () => {

        var paginationLinks = this.querySelectorAll('.products-pagination a');

        for( let link of paginationLinks ){
            link.addEventListener('click', (e) => {
                e.preventDefault();

                var href = link.getAttribute('href');
                var searchParams = href.replace(window.location.pathname + '?', '');

                if (Shopify.designMode) {
                    var pathToReplace = window.location.href.split('?')[0];
                    var searchParams = href.replace(pathToReplace + '?', '');
                }

                // Ajax Pagination
                ajaxPagination(searchParams, this);
            });
        }
    }

    paginationInfiniteScroll = () => {

        var infiniteButton = this.querySelector('.products-pagination-infinite:not(:disabled)');

        infiniteButton.addEventListener('click', (e) => {
            e.preventDefault();

            var newPage = parseInt(infiniteButton.dataset.currentPage) + 1;

            var searchParams = 'page=' + newPage;

            var getParams = window.location.href.split('?');

            if(getParams != ''){
                searchParams = searchParams + "&" + getParams[1];
            }
        
            // console.log("searchParams", searchParams);

            infiniteButton.disabled = true;

            // Ajax Pagination
            ajaxPagination(searchParams, this);

        })

         window.addEventListener('scroll', function() {

            var productsPagination = document.querySelector('products-pagination');
            var infiniteButton = productsPagination.querySelector('.products-pagination-infinite:not(:disabled)');

            if(infiniteButton){
                if(productsPagination.dataset.paginationChoice == '3' && infiniteButton.dataset.currentPage != '1' && parseInt(infiniteButton.dataset.currentPage) < parseInt(infiniteButton.dataset.totalPages)){
                    var windowHeight = window.innerHeight;
                    var elementOffset = 100;

                    var elementPosition = infiniteButton.getBoundingClientRect();
                    if ((elementPosition.bottom + elementOffset) <= windowHeight) {
                        // console.log("triggered infintie scrk=oll")

                        var newPage = parseInt(infiniteButton.dataset.currentPage) + 1;


                        var searchParams = 'page=' + newPage;

                        var getParams = window.location.href.split('?');

                        if(getParams != ''){
                            searchParams = searchParams + "&" + getParams[1];
                        }
                    
                        // console.log("searchParams", searchParams);

                        infiniteButton.disabled = true;

                        // Ajax Pagination
                        ajaxPagination(searchParams, productsPagination);
                    }
                }
            }
         });
        
    }



    ajaxPagination = () => {
        
        var paginationLinks = document.querySelectorAll('.products-pagination a');

        var productsSelector = '.products'
        var section = document.querySelector(productsSelector);

        for( let link of paginationLinks ){
            link.addEventListener('click', (e) => {
                e.preventDefault();

                var href = link.getAttribute('href');
                var searchParams = href.replace(window.location.pathname + '?', '');
                
                if (Shopify.designMode) {
                    var pathToReplace = window.location.href.split('?')[0];
                    var searchParams = href.replace(pathToReplace + '?', '');
                }

                fetch(`${window.location.pathname}?${searchParams}`)
                    .then(response => {
                        return response.text()
                    })
                    .then((text) => {

                        const html = document.createElement('div');
                        html.innerHTML = text;
                        const productsSection = html.querySelector(productsSelector);
                        
                        section.innerHTML = productsSection.innerHTML;

                        const resultsLazyloadImages = section.querySelectorAll('.lazy-loading-image');

                        resultsLazyloadImages.forEach(imageContainer => {
                            lazyloading(imageContainer);
                        })

                        updateURLState(searchParams)


                        document.querySelector('.section-products').scrollIntoView({
                            behavior: "instant"
                        })

                    });

            })
        }

    }
}

customElements.define( 'products-pagination', ProductsPagination )