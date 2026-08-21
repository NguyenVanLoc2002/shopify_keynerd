class PredictiveSearch extends HTMLElement {
    constructor() {
        super();

        this.predictiveSearchForm = this.querySelector('form');
        this.input = this.querySelector('input[type="search"]');
        this.predictiveSearchResults = this.querySelector('#predictive-search-results');

        this.searchDropdownContainer = this.querySelector('.search-dropdown-container');
        this.recommendationProducts = this.querySelector('.search-dropdown-recommendations');

        this.input.addEventListener('input', this.debounce((event) => {
            this.onChange(event);
        }, 300).bind(this));
    }

    onChange() {
        const searchTerm = this.input.value.trim();

        if (!searchTerm.length) {
            this.close();
            return;
        }
        let searchTerms = {};

        const formElements = Array.from(this.predictiveSearchForm);

        formElements.forEach(element => {
            if (element.name.length) {
                searchTerms[element.name] = element.value;
            }
        });

        const stringifySearchTerms = JSON.stringify(searchTerms);
        const paramsSearchTerms = stringifySearchTerms.slice(1, -1).replace(/","/g, '"&"').replace(/:/g, '=').replace(/"/g, '');

        this.getSearchResults(paramsSearchTerms);
    }

    getSearchResults(searchTerms) {
        // console.log("search terms", searchTerms, window.Shopify.routes);

        // fetch(window.Shopify.routes.root + 'search/suggest?' + searchTerms)
        fetch(`${window.Shopify.routes.root}search/suggest?${searchTerms}&section_id=predictive-search`)
            .then((response) => {
                // console.log("res", response)

                if (!response.ok) {
                    var error = new Error(response.status);
                    this.close();
                    throw error;
                }

                return response.text();
            })
            .then((res) => {
                // console.log("res", res);
                const resultsMarkup = new DOMParser().parseFromString(res, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;


                this.predictiveSearchResults.innerHTML = resultsMarkup;


                const resultsLazyloadImages = this.predictiveSearchResults.querySelectorAll('.lazy-loading-image');

                resultsLazyloadImages.forEach(imageContainer => {
                    lazyloading(imageContainer);
                })


                // this.appendChild(resultsMarkup)
                this.open();
            })
            .catch((error) => {
                this.close();
                throw error;
            });
    }

    open() {
        this.searchDropdownContainer.classList.add('has-predictive-search-results');
        // this.predictiveSearchResults.style.display = 'block';

        if(this.recommendationProducts){
            this.recommendationProducts.classList.add('inactive');
        }
    }

    close() {
        this.searchDropdownContainer.classList.remove('has-predictive-search-results');
        // this.predictiveSearchResults.style.display = 'none';

        if(this.recommendationProducts){
            this.recommendationProducts.classList.remove('inactive');
        }
    }

    debounce(fn, wait) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }
}

customElements.define('predictive-search', PredictiveSearch);
