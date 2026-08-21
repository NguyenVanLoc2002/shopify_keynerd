if (!customElements.get('product-options')) {
class ProductOptionPicker extends HTMLElement{
    constructor(){
        super();

        
        // this.form = this.parentElement.querySelector('.product-options-form');
        this.section = this.closest('.product');
        this.productOptions = this.querySelectorAll('ul');
        this.productOptionsList = this.querySelectorAll('li');
        this.productDropdowns = this.querySelectorAll('.product-option-picker__dropdown');

        this.sectionId = this.section.dataset.sectionId;
        this.productUrl = this.dataset.productUrl;


        // Toggle Option dropdown
        for(let dropdown of this.productDropdowns){
            dropdown.addEventListener('click', (event) => {
                this.dropdown(dropdown, event);
            })

            document.addEventListener('click', (event) => {
                if (event.target !== dropdown && !dropdown.contains(event.target)) {
                    this.closeDropdown(dropdown)
                }
            })
        }


        document.body.addEventListener('click', (event) => {
            var option = event.target.closest('.product-option-picker__list-item')
            if( option && !option.classList.contains('disabled') && !option.classList.contains('chosen') ){

                // Option variant picker
                this.onClick(option);
            }
        })
        
        for (let productOption of this.productOptionsList){
            productOption.addEventListener('focus', () => {
                productOption.addEventListener('keyup', (event) => {
                    if(event.key === 'Enter'){
                        productOption.click();
                    }
                })
            });
        }

    }


    onClick(option){


        this.section = option.closest('.product');

        // Assign chosen option for the dropdown
        this.selectionPicker(option);


        this.productOptions = option.closest('product-options').querySelectorAll('ul');

        var optionProductUrl = option.querySelector('input').dataset.productUrl;


        var chosenOptionValues = '';
        this.productOptions.forEach(list => {
            for(let list_item of list.children){
                
                if( list_item.classList.contains('chosen') ){
                    var chosenOptionId = list_item.querySelector('input').dataset.id
                    var chosenOptionName = list.dataset.optionName

                    // this.chosenOptionsObject[chosenOptionName] = chosenOptionId;
                    chosenOptionValues = chosenOptionValues + chosenOptionId + ',';
                }
            }

        })
        chosenOptionValues = chosenOptionValues.slice(0, -1);

        

        var url = optionProductUrl + '?section_id=' + this.sectionId + '&option_values=' + chosenOptionValues;

        // console.log("optionProductUrl", optionProductUrl)

        fetch(url)
        .then((res) => res.text())
        .then((response) => {
            // console.log("res", response);

            // console.log("optionProductUrl", optionProductUrl);

            var parsed_response = new DOMParser().parseFromString(response, 'text/html');
            var variantId = parsed_response.querySelector('input[name="id"]').value;


            const resultsLazyloadImages = parsed_response.querySelectorAll('.lazy-loading-image');

            resultsLazyloadImages.forEach(imageContainer => {
                lazyloading(imageContainer);
            })

            // console.log("variant id", variantId);

            if(variantId.length <= 0 || this.productUrl !== optionProductUrl){

                this.section.innerHTML = parsed_response.querySelector('.product').innerHTML;

                this.productUrl = optionProductUrl
                var newUrl = new URL(window.location.origin + optionProductUrl);
                
            }
            else{

                var product_price = parsed_response.querySelector('.product-summary__price');
                var product_options = parsed_response.querySelector('product-options');
                var product_summary__product_form = parsed_response.querySelector('.product-summary__product-form');
                var pickup_availability = parsed_response.querySelector('pickup-availability');
                var pickup_summary__inventory = parsed_response.querySelector('.product-summary__inventory-qty');

                
                if(this.section.querySelector('pickup-availability')){
                    this.section.querySelector('pickup-availability').innerHTML = pickup_availability.innerHTML;
                }

                if(this.section.querySelector('.product-summary__inventory-qty')){
                    this.section.querySelector('.product-summary__inventory-qty').innerHTML = pickup_summary__inventory.innerHTML;
                }

                this.section.querySelector('.product-summary__product-form').innerHTML = product_summary__product_form.innerHTML;
                this.section.querySelector('product-options').innerHTML = product_options.innerHTML;
                this.section.querySelector('.product-summary__price').innerHTML = product_price.innerHTML;

            

                var newUrl = new URL(window.location.href);
            }


            // Changing image
            var productThumbails = this.section.querySelectorAll('.product-image-has-variant-ids')

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
                
            if( newUrl.searchParams.get('variant') !== null ){
                newUrl.searchParams.set('variant', variantId)
            }
            else{
                newUrl.searchParams.append('variant', variantId);
            }

            if(!Shopify.designMode){
                history.pushState({}, null, newUrl);
            }

            
            const event = new CustomEvent('product:variantChange', { detail: { id: variantId } });
            document.dispatchEvent(event);

            // return response.json();
        })
        .catch((error) => {
            throw error;
        });


    }

    selectionPicker(option){
        var currentDropdown = option.parentElement //event.target.parentElement;
        var currentDropdownListItems = currentDropdown.querySelectorAll('li');
        var chosenElements = currentDropdown.parentElement.parentElement.querySelectorAll('.product-option-picker-chosen > span, .product-option-picker-label > .product-option-picker-label--chosen');
        var chosenSwatchElement = currentDropdown.parentElement.parentElement.querySelector('.product-option-picker-chosen > .product-option-swatch')
        var chosenOptionSwatch = option.querySelector('.product-option-swatch');
        // console.log("chosen", chosenElements)
        
        for(let item of currentDropdownListItems){
            item.classList.remove('chosen');
        }
        option.classList.add('chosen');

        for(let chosen of chosenElements){
            chosen.innerText = option.textContent.trim()//event.target.innerText
        }
        
        if( chosenOptionSwatch ){
            // console.log("contains children", chosenOptionSwatch.children);
            var optionProductSwatchStyles = getComputedStyle(chosenOptionSwatch)
            var optionSwatchColor = optionProductSwatchStyles.getPropertyValue('--product-swatch-value');
            if( optionSwatchColor.length == 0 ){
                optionSwatchColor = option.dataset.optionValue
            }
            if( chosenSwatchElement ){
                chosenSwatchElement.innerHTML = chosenOptionSwatch.innerHTML;
                chosenSwatchElement.style.setProperty('--product-swatch-value', optionSwatchColor);
            }
        }
    }

    
    dropdown(dropdown, event){
        // console.log("dropdown", dropdown)
        // if( !dropdown.contains(document.activeElement) ){
            if( dropdown.classList.contains('active') ){
                this.closeDropdown(dropdown)
                dropdown.blur();
            }
            else{
                if( !dropdown.matches(':focus-within:not(:focus)') ){
                    this.openDropdown(dropdown)
                }
            }
        // }
        
        // dropdown.classList.contains('active') ? this.closeDropdown(dropdown) : this.openDropdown(dropdown);
        // console.log("active element", dropdown.matches(':focus-within:not(:focus)'))
    }

    openDropdown(dropdown){
        dropdown.classList.add('active')
    }
    closeDropdown(dropdown){
        dropdown.classList.remove('active')
    }

}


customElements.define( 'product-options', ProductOptionPicker )
}