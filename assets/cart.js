// console.log("cart goes here");


document.body.addEventListener('change', event => {
    // console.log("input changed", event);

    const productQty = event.target;
    const productQtyValue = parseInt(productQty.value);

    var cartProductSelector = '.cart-product';


    if(productQty.closest(cartProductSelector)){
        // console.log("input is under cart ")

        var updates = {
            [productQty.closest(cartProductSelector).dataset.itemId]: productQtyValue
        }


        var cartUpsell = document.querySelector('.cart-upsell')
        if(cartUpsell){
            var newCartUpsellId = cartUpsell.dataset.itemId;
            var newCartUpsellQty = cartUpsellQtyDetector(event);

            if(cartUpsell.querySelector('input[type="checkbox"]:checked')){
                updates[newCartUpsellId] = newCartUpsellQty;
            }
        }





        // console.log("updates", updates, "productQtyValue", productQtyValue)
        // let formData = {
        //     'id': productQty.closest(cartProductSelector).dataset.itemKey,
        //     'quantity': productQty.value
        // };


        if( parseInt(productQtyValue) > parseInt(productQty.getAttribute('max')) ){

            const product = productQty.closest('.cart-product');
            const productQtyPicker = productQty.closest('product-quantity-picker');
            const productTitle = product.querySelector('.cart-product-title').innerText;
            const textQtyError = productQty.dataset.textQtyError;

            const errorParagraph = productQtyPicker.nextElementSibling;
            const isErrorExist = errorParagraph.classList.contains('error')
            const newErrorHTML = '<p class="error">' + textQtyError.replace('%qty', productQty.getAttribute('max') + ' ' + productTitle + ' - ' + productQty.dataset.textVariant) + '</p>';

            if( isErrorExist ){
                errorParagraph.innerHTML = newErrorHTML;
            }
            else{
                productQtyPicker.insertAdjacentHTML('afterend', newErrorHTML)
            }

            return false;
        }


        
        ChangeCartJson(updates);

    }
});

document.body.addEventListener('click', event => {

    var cartProductSelector = '.cart-product';
    var cartRemoveProductSelector = '.cart-product-remove';

    if(event.target.closest(cartRemoveProductSelector)){
        event.preventDefault();

        var itemId = event.target.closest(cartProductSelector).dataset.itemId;

        var updates = {
            [itemId]: 0
        }

        var cartUpsell = document.querySelector('.cart-upsell')
        if(cartUpsell){
            var newCartUpsellId = cartUpsell.dataset.itemId;
            var newCartUpsellQty = cartUpsellQtyDetector(event, itemId);

            if(cartUpsell.querySelector('input[type="checkbox"]:checked')){
                updates[newCartUpsellId] = newCartUpsellQty;
            }
        }

        // let formData = {
        //     'id': event.target.closest(cartProductSelector).dataset.itemKey,
        //     'quantity': 0
        // };
        
        ChangeCartJson(updates);

    }
});


document.body.addEventListener('change', event => {

    var cartUpsellSelector = '.cart-upsell';
    var cartUpsell = event.target.closest(cartUpsellSelector);

    if(cartUpsell){
        // event.preventDefault();

        var cartUpsellItemId = cartUpsell.dataset.itemId
        var cartUpsellItemQty = cartUpsell.dataset.itemQty

        var updates = {
            [cartUpsellItemId]: cartUpsellItemQty
        }
        
        ChangeCartJson(updates);


    }
})

function cartUpsellQtyDetector(event, removeId = null){
    var cartProductSelector = '.cart-product';
    var cartProductsSelector = '.cart-products';

    const productQty = event.target;

    var cartProducts = productQty.closest(cartProductsSelector).querySelectorAll(cartProductSelector)
    var newQty = 0;
    var currentUpsellQty = 0;
    cartProducts.forEach(cartProduct => {

        if( removeId != cartProduct.dataset.itemId ){
            // console.log('qty value', cartProduct.querySelector('input[type="number"]').value);
            newQty += parseInt(cartProduct.querySelector('input[type="number"]').value)
        }
    })
    // console.log("new Qty", newQty);


    var cartUpsell = document.querySelector('.cart-upsell')
    var cartUpsellProductId = parseInt(cartUpsell.dataset.itemId);


    cartProducts.forEach(cartProduct => {
        if(cartProduct.dataset.itemId == cartUpsellProductId){
            currentUpsellQty = parseInt(cartProduct.querySelector('input[type="number"]').value);
        }
    });

    if(newQty <= 0){
        return newQty;
    }

    return newQty - currentUpsellQty;

}


function ChangeCartJson(updates){

    fetch(window.Shopify.routes.root + 'cart/update.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates })
    })
    .then(response => {
        return response.json();
    })
    .then(res => {
        // console.log("res update", res);

        AjaxCartUpdate(res, updates);

        AjaxCartKeyUpdate(res);

    })
    .catch((error) => {
        console.error('Error:', error);
    });

}

/* Use below codes to make cart update bug free */

// function ChangeCart(updates){

//     var itemKey = Object.keys(updates)[0];

//     var body = {
//         items: [
//             {
//                 id: parseInt(itemKey),
//                 quantity: updates[itemKey]
//             }
//         ],
//         sections: "cart-drawer"
//     }
//     console.log('body', body)
//     fetch(window.Shopify.routes.root + 'cart/update', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         // body: JSON.stringify({ body })
//         body: JSON.stringify({ updates })
//     })
//     .then(response => {
//         return response.text();
//     })
//     .then(res => {
//         // console.log("res update", res);

//         var parsed_response = new DOMParser().parseFromString(res, 'text/html');
//         var cart_drawer_contents = parsed_response.querySelector('.cart-drawer-contents');
//         var cart_contents = parsed_response.querySelector('.main-cart');

//         // console.log('cart_drawer_contents', cart_drawer_contents);


//         const cartDrawerLazyloadImages = cart_drawer_contents.querySelectorAll('.lazy-loading-image');
//         const cartLazyloadImages = cart_contents.querySelectorAll('.lazy-loading-image');
//         [...cartDrawerLazyloadImages, ...cartLazyloadImages].forEach(imageContainer => {
//             lazyloading(imageContainer);
//         })

//         if(document.querySelector('.cart-drawer-contents')){
//             document.querySelector('.cart-drawer-contents').innerHTML = cart_drawer_contents.innerHTML;
//         }
//         if(document.querySelector('.main-cart')){
//             document.querySelector('.main-cart').innerHTML = cart_contents.innerHTML;
//         }

//         fetch(window.Shopify.routes.root + 'cart.js')
//         .then(res => res.json())
//         .then(cart => {
//             document.querySelector('.cart-count').innerHTML = cart.item_count;
//         });


//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });

// }




function AjaxCartKeyUpdate(cart){
  
    var cartProductsSelector = '.cart-products';
    var cartProductsSections = document.querySelectorAll(cartProductsSelector);
    
    cartProductsSections.forEach(cartProductsSection => {
      var cartProducts = cartProductsSection.querySelectorAll('.cart-product');

      cart.items.forEach((cartItem, index) =>{
          cartProducts[index].dataset.itemKey = cartItem.key;
      })
    })
  
}

function AjaxCartUpdate(cart, updates){
    // console.log("updates", updates);

    var cart_count_elements = document.querySelectorAll('.cart-count');
    var cart_original_total_elements = document.querySelectorAll('.cart-original-total');
    var cart_total_elements = document.querySelectorAll('.cart-total');
    var cart_total_discounts_elements = document.querySelectorAll('.cart-totals-discounts')
    var cart_total_discounts_list_elements = document.querySelectorAll('.cart-totals-discounts-list')
    var cart_discount_elements = document.querySelectorAll('.cart-discount');
    var cart_products = document.querySelectorAll('.cart-product');
    // console.log("cart products", cart_products);

    var qty_input = '.product-quantity-picker-input';
    var line_total_selector = '.cart-product-line-price';
    var original_line_total_selector = '.cart-product-original-line-price';


    // Count update
    for(let cart_count of cart_count_elements){
        cart_count.innerHTML = cart.item_count
    }

    // Total update (before discount)
    for(let cart_total of cart_original_total_elements){
        var moneyFormat = document.body.dataset.moneyFormat;
        cart_total.innerHTML = Shopify.formatMoney(cart.original_total_price, moneyFormat)
    }

    // Discount update
    if(cart.total_discount != 0){
      for(let cart_total_discounts of cart_total_discounts_elements){
          if(!cart_total_discounts.classList.contains('cart-has-discount')){
            cart_total_discounts.classList.add('cart-has-discount');
          }
      }
    }
    else{
      for(let cart_total_discounts of cart_total_discounts_elements){
          cart_total_discounts.classList.remove('cart-has-discount');
      }
    }

  

    if(cart.cart_level_discount_applications.length > 0){
      cart.cart_level_discount_applications.forEach(function(discount, index){
        cart_total_discounts_list_elements.forEach(function(cart_total_discounts_list_element) {
          var list_items = cart_total_discounts_list_element.querySelectorAll('.cart-totals-discounts-list-item');
          
          if(!list_items[index].querySelector('span')){
            var list_item_span = document.createElement('span');
            list_items[index].appendChild(list_item_span);
          }
          list_items[index].querySelector('span').innerHTML = discount.discount_application.title
        })

      })
    }
    for(let cart_discount of cart_discount_elements){
        var moneyFormat = document.body.dataset.moneyFormat;
        cart_discount.innerHTML = Shopify.formatMoney(cart.total_discount, moneyFormat)
    }


    // Total update
    for(let cart_total of cart_total_elements){
        var moneyFormat = document.body.dataset.moneyFormat;
        cart_total.innerHTML = Shopify.formatMoney(cart.total_price, moneyFormat)
    }

    cart.items.forEach(item=>{
        var itemFound = false
        for( let cart_product of cart_products){
            if(cart_product.dataset.itemId == item.id){
                itemFound = true
            }
        }

        if(!itemFound){
            CartAddProduct(item)
        }
    })


    // var cart_products = document.querySelectorAll('.cart-product');
    for( let cart_product of cart_products){
        cart.items.forEach(item=>{
            var cart_product_qty = cart_product.querySelector(qty_input)
            var cart_product_line_total = cart_product.querySelector(line_total_selector)
            var cart_product_original_line_total = cart_product.querySelector(original_line_total_selector)
            
            Object.keys(updates).forEach((itemId) => {
                var itemQty = updates[itemId];
                if( itemId == item.id && cart_product.dataset.itemKey == item.key ){

                    // Qty update
                    cart_product_qty.value = item.quantity;

                    // Price update
                    if( cart_product_line_total ){
                        cart_product_line_total.innerHTML = Shopify.formatMoney(item.line_price, moneyFormat)
                    }
                    if( cart_product_original_line_total ){
                        cart_product_original_line_total.innerHTML = Shopify.formatMoney(item.original_line_price, moneyFormat)
                    }
                }

            })
        })

        Object.keys(updates).forEach((itemId) => {
            var itemQty = updates[itemId];
            // Remove product
            if( itemQty == 0 && itemId == cart_product.dataset.itemId ){
                console.log("itemQty", itemQty, itemId, cart_product.dataset.itemId, cart_product)
                cart_product.remove()
            }
        })
    }

    // Cart upsell checkbox
    var cartUpsellElements = document.querySelectorAll('.cart-upsell');
    cartUpsellElements.forEach(cartUpsell => {
        var cartUpsellProductId = parseInt(cartUpsell.dataset.itemId);
        var isCartUpsellFound = false;

        cart.items.forEach(item=>{
            // console.log("item id", item.id)
            // console.log("cartUpsellProductId", cartUpsellProductId)
            if( item.id === cartUpsellProductId ){
                isCartUpsellFound = true
            }
        })

        if(isCartUpsellFound){
            cartUpsell.querySelector('input[type="checkbox"]').checked = true
        }
        else{
            cartUpsell.querySelector('input[type="checkbox"]').checked = false
        }

        // Cart upsell qty update (if available)
        if(cartUpsell){
            // console.log("cart", cart.item_count);
            if(!isCartUpsellFound){
                cartUpsell.dataset.itemQty = cart.item_count
            }
            else{
                cartUpsell.dataset.itemQty = 0
            }
        }
    })

    // Free Shipping bar & text progress update
    var cart_free_shipping_elements = document.querySelectorAll('.cart-free-shipping');

    for(let cart_free_shipping of cart_free_shipping_elements){

        var moneyFormat = document.body.dataset.moneyFormat;

        var cart_free_shipping_bar = cart_free_shipping.querySelector('.cart-free-shipping-bar');
        var cart_free_shipping_text = cart_free_shipping.querySelector('.cart-free-shipping-text');
        var cart_free_shipping_text_balance = cart_free_shipping.querySelector('.cart-free-shipping-text-balance');
        
        var min_amount = parseInt(cart_free_shipping.dataset.minAmount);

        if(cart.original_total_price > min_amount){
            if(!cart_free_shipping_text.classList.contains('has-free-shipping')){
                cart_free_shipping_text.classList.add('has-free-shipping')
            }
        }
        else{
            cart_free_shipping_text.classList.remove('has-free-shipping')
        }
        
        // Free shipping bar text balance 
        var balance_amount = min_amount - cart.original_total_price
        var current_percentage = (cart.original_total_price * 100) / min_amount
        
        if(cart_free_shipping_text_balance){
            cart_free_shipping_text_balance.innerHTML  = Shopify.formatMoney(balance_amount, moneyFormat)
        }

        if(cart_free_shipping_bar){
            cart_free_shipping_bar.style.setProperty('--width', current_percentage);
            // console.log("percentage", ((cart.original_total_price * 100)/min_amount));
        }

    }
    
}



function CartAddProduct(newProduct){


    
    var cartUpsellElements = document.querySelectorAll('.cart-upsell');
    cartUpsellElements.forEach(cartUpsell => {
        // var cartUpsell = document.querySelector('.cart-upsell')
        cartUpsell.dataset.itemQty = 0
    });


    var getCartProductsSection = document.querySelectorAll('.cart-products');

    getCartProductsSection.forEach(getCartProducts => {

        var moneyFormat = document.body.dataset.moneyFormat;

        var getCartProduct = getCartProducts.querySelector('.cart-product:not(.cart-product-upsell').cloneNode(true);

        var cartProductThumbnail = getCartProduct.querySelector('.cart-product-thumbnail img');
        var cartProductThumbnailLink = getCartProduct.querySelector('.cart-product-thumbnail a');
        var cartProductTitleLink = getCartProduct.querySelector('.cart-product-title a');
        var cartProductPrice = getCartProduct.querySelector('.cart-product-price');
        var cartProductTotalPrice = getCartProduct.querySelector('.cart-product-line-price');
        var cartProductQty = getCartProduct.querySelector('.cart-product-qty input');
        var cartProductDl = getCartProduct.querySelector('dl');
        var cartProductSellingPlan = getCartProduct.querySelector('.cart-product-selling-plan');
        var cartProductDiscounts = getCartProduct.querySelector('.cart-product-discounts');
        
        
        
        getCartProduct.dataset.itemKey = newProduct.key
        getCartProduct.dataset.itemId = newProduct.id

        getCartProduct.classList.add('cart-product-upsell');
        
        if(cartProductThumbnail){
            cartProductThumbnail.setAttribute('src', newProduct.image);
            cartProductThumbnail.setAttribute('srcset', '');
        }
        if(cartProductThumbnailLink){
            cartProductThumbnailLink.setAttribute('href', newProduct.url);
        }
        if(cartProductTitleLink){
            cartProductTitleLink.setAttribute('href', newProduct.url);
            cartProductTitleLink.innerHTML = newProduct.title;
        }
        if(cartProductPrice){
            cartProductPrice.innerHTML = Shopify.formatMoney(newProduct.price, moneyFormat);
        }
        if(cartProductTotalPrice){
            cartProductTotalPrice.innerHTML = Shopify.formatMoney(newProduct.line_price, moneyFormat);
        }
        if(cartProductQty){
            cartProductQty.disabled = true;
            cartProductQty.value = newProduct.quantity;
        }

        if(cartProductDl){
            cartProductDl.remove();
        }
        if(cartProductSellingPlan){
            cartProductSellingPlan.remove();
        }
        if(cartProductDiscounts){
            cartProductDiscounts.remove();
        }
        getCartProduct.querySelector('.cart-product-remove').remove();


        // It's important to use prepend to replace item key.
        getCartProducts.prepend(getCartProduct);
    })


}

class ShippingCalculator extends HTMLElement {
    constructor() {
        super();

        this.shippingCountry = document.querySelector('.shipping-calculator-country');
        this.shippingProvince = document.querySelector('.shipping-calculator-province');
        this.shippingZip = document.querySelector('.shipping-calculator-zip');
        this.shippingSubmit = document.querySelector('.shipping-calculator-submit');

        this.shippingRates = document.querySelector('.shipping-rates');
        this.shippingRatesContent = document.querySelector('.shipping-rates-content');

        this.shippingCountry.addEventListener('change', () => {
            // shippingCountry
            // console.log("chosen select", shippingCountry.options[shippingCountry.selectedIndex]);
            var chosenCountry = this.shippingCountry.options[this.shippingCountry.selectedIndex];

            var shippingProvinceJSON = chosenCountry.dataset.provinces
            // console.log("shippingProvinceJSON", );

            this.generateOptionsFromJson(shippingProvinceJSON)

            // shippingProvince.innerHTML = ''
        })

        // console.log("shippingProvince.children", shippingProvince.children)

        if(this.shippingProvince.children){
            this.shippingProvince.closest('div').classList.add('hide');
        }

        this.fetchShippingRates();
    }

    generateOptionsFromJson = (jsonString) => {
        var jsonArray = JSON.parse(jsonString);
        // console.log("json", jsonString, jsonArray);
        this.shippingProvince.innerHTML = '';

        if(jsonArray.length > 0){
            this.shippingProvince.closest('div').classList.remove('hide');

            jsonArray.forEach(item => {
                const [value, text] = item;
                const option = document.createElement('option');
                option.value = value;
                option.textContent = text;

                this.shippingProvince.appendChild(option);
            });
        }
        else{
            this.shippingProvince.closest('div').classList.add('hide');
        }
    }

    fetchShippingRates = () => {

        this.shippingSubmit.addEventListener('click', () => {
            // console.log("values", this.shippingCountry.value, this.shippingProvince.value, this.shippingZip.value);

            var shippingAddress = {
                "shipping_address": {
                    "zip": this.shippingZip.value,
                    "country": this.shippingCountry.value,
                    "province": this.shippingProvince.value
                }
            }


            fetch(`${window.Shopify.routes.root}cart/shipping_rates.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shippingAddress)
            })
            .then(response => response.json())
            .then(res => {
                // console.log("res", res)

                this.processShippingRates(res);
            })
        })


    }

    processShippingRates = (res) => {
        console.log("res", res)
        var shippingRates = res.shipping_rates;

        this.shippingRatesContent.innerHTML = '';
        
        var shippingUlElement = document.createElement('ul');
        // console.log("Shipping rate will be processed here", shippingRates);

        if(shippingRates){
            shippingRates.forEach(shippingRate => {
                var moneyFormat = document.body.dataset.moneyFormat;
                var shippingRatePrice = Shopify.formatMoney(shippingRate.price, moneyFormat)

                var shippingliElement = document.createElement('li');
                shippingliElement.innerHTML = '<span>' + shippingRate.name + ': </span><span>' + shippingRatePrice + '</span>';

                // console.log("shippingliElement", shippingliElement)
                shippingUlElement.appendChild(shippingliElement)
            })


            this.shippingRatesContent.appendChild(shippingUlElement);
        
        }
        else{
            var shippingErrors = res.zip;
            shippingErrors.forEach(shippingError => {
                var shippingliElement = document.createElement('li');
                shippingliElement.innerHTML = shippingError
                shippingUlElement.appendChild(shippingliElement)
            })

            this.shippingRatesContent.appendChild(shippingUlElement);
        }

        // console.log("shippingUlElement", shippingUlElement);
        if(!this.shippingRates.classList.contains('active')){
            this.shippingRates.classList.add('active');
        }
    }
}

customElements.define('shipping-calculator', ShippingCalculator)


class CartRecommendation extends HTMLElement {
    constructor(){
        super();

        this.splideArrows = this.querySelector('.splide__arrows').cloneNode(true);
        this.splideProgress = this.querySelector('.splide__progress').cloneNode(true);
        
        // var sectionId = this.dataset.sectionId;
        this.columnsCount = parseInt(this.dataset.columnsCount);
        this.carousel = this.dataset.carousel === 'true';


        this.productsId = this.dataset.productsId.split(',');
        this.productsId = this.productsId.filter(n => n)

        this.limit = this.dataset.limit
        this.intent = this.dataset.intent

        // console.log('this.productsId', this.productsId)

        var recommendedProductsList = document.createElement('ul');
        recommendedProductsList.classList.add('product-recommendations-list');
        
        // this.appendChild(recommendedProductsList);
        this.innerHTML = recommendedProductsList.outerHTML;

        this.productIds = [];

        var index = 0;
        
        this.fetchProducts(this.productsId[index], index); 

        
    }

    fetchProducts = async (productId, index) => {

        return await fetch(window.Shopify.routes.root + `recommendations/products?product_id=${productId}&section_id=product-recommendations&limit=${this.limit}&intent=${this.intent}`)
            .then(response => response.text())
            .then((text) => {
                // console.log("res", text);

                if(text.length == 0){
                    return false;
                }

                var productIterationIndex = 0

                var productsIdIterationIndex = index + 1;

                var html = new DOMParser().parseFromString(text, 'text/html').querySelector('.shopify-section');
                // console.log("res dom", html)

                var products = html.querySelectorAll('.product');

                products.forEach((product, productIndex) => {
                    productIterationIndex = productIndex + 1;

                    var fetchedProductId = product.dataset.productId;

                    if(!this.productIds.includes(fetchedProductId)){

                        this.productIds.push(product.dataset.productId);

                        const productsLazyloadImages = product.querySelectorAll('.lazy-loading-image');
                        productsLazyloadImages.forEach(imageContainer => {
                            lazyloading(imageContainer);
                        })

                        if(this.querySelectorAll('li').length < this.limit){

                            const productsLazyloadImages = product.querySelectorAll('.lazy-loading-image');
                            productsLazyloadImages.forEach(imageContainer => {
                                lazyloading(imageContainer);
                            })

                            this.querySelector('.product-recommendations-list').appendChild(product);
                        }

                        if(this.querySelectorAll('li').length == this.limit ){
                            if(!this.querySelector('.product-recommendations-list').classList.contains('splide') && this.carousel){
                                // console.log("carousel to be initiated")
                                this.processCarousel();
                            } 
                        }
                    }
                })
                
                if(products.length == productIterationIndex && this.productsId.length == productsIdIterationIndex ){
                    if(!this.querySelector('.product-recommendations-list').classList.contains('splide') && this.carousel){
                        // console.log("carousel to be initiated")
                        this.processCarousel();
                    } 
                }

                if(productsIdIterationIndex < this.productsId.length){
                    this.fetchProducts(this.productsId[productsIdIterationIndex], productsIdIterationIndex); 
                }
            })
    }

    processCarousel = () => {

        // var carousel = this.dataset.carousel === 'true';
        var columnsOffset = this.dataset.columnsOffset === 'true';
        var carouselOptions = JSON.parse(this.dataset.options);

        var productsList = this.querySelector('.product-recommendations-list');
        var products = this.querySelectorAll('.product-recommendations-list li');

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
        productsListWrap.appendChild(this.splideArrows);

        if(this.splideProgress){
            productsListWrap.appendChild(this.splideProgress);
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
}
customElements.define('cart-recommendations', CartRecommendation)


// class CartRecommendation extends HTMLElement {
//     constructor(){
//         super();

//         this.splideArrows = this.querySelector('.splide__arrows').cloneNode(true);
//         this.splideProgress = this.querySelector('.splide__progress').cloneNode(true);
        
//         // var sectionId = this.dataset.sectionId;
//         this.columnsCount = parseInt(this.dataset.columnsCount);
//         this.carousel = this.dataset.carousel === 'true';


//         this.productsId = this.dataset.productsId.split(',');
//         this.limit = this.dataset.limit
//         this.intent = this.dataset.intent

//         this.recommendedProducts = '';

//         // console.log('this.productsId', this.productsId)
//         this.insertedProductsCount = 0;

//         var recommendedProductsList = document.createElement('ul');
//         recommendedProductsList.classList.add('product-recommendations-list');
        
//         // this.appendChild(recommendedProductsList);
//         this.innerHTML = recommendedProductsList.outerHTML;

//         this.productIds = [];

//         this.productsId.forEach( async (productId, index) => {

//             var fetchedProducts = await this.fetchProducts(productId); 

//             fetchedProducts.querySelectorAll('li').forEach(fetchedProduct => {

//                 if(this.querySelectorAll('li').length < this.limit){
//                     this.querySelector('.product-recommendations-list').appendChild(fetchedProduct);
//                     console.log("contains splide", this.querySelector('.product-recommendations-list').classList.contains('splide'));
//                 }
                
//                 // if(this.querySelectorAll('li').length > this.limit){
//                 //     if(this.carousel){
//                 //         // console.log("proceed to carousel")
//                 //         this.processCarousel()
//                 //     }
//                 // }
                

//             })

//             // this.insertedProductsCount = this.querySelectorAll('li').length;

//             // if(this.querySelectorAll('li').length > this.columnsCount){
//             if(this.insertedProductsCount > this.columnsCount){
//                 const index1 = index + 1;

//                 console.log("this.productsId.length", this.productsId.length, "index", index1)
//                 if(index1 == this.productsId.length){
//                     if(!this.querySelector('.product-recommendations-list').classList.contains('splide') && this.carousel){
//                         // console.log("carousel to be initiated")
//                         this.processCarousel();
//                     } 
//                 }
//             }


//             // console.log("product recommendation list", this.querySelectorAll('li'))
//             console.log("this.insertedProductsCount", this.insertedProductsCount)

//         })
        
//         console.log("recommendedProductsList", this.productIds, recommendedProductsList);

//     }

//     fetchProducts = async (productId) => {


//         return fetch(window.Shopify.routes.root + `recommendations/products?product_id=${productId}&section_id=product-recommendations&limit=${this.limit}&intent=${this.intent}`)
//             .then(response => response.text())
//             .then((text) => {
//                 // console.log("res", text);

//                 var html = new DOMParser().parseFromString(text, 'text/html').querySelector('.shopify-section');
//                 // console.log("res dom", html)


//                 var productsList = html.querySelector('ul');
//                 var products = html.querySelectorAll('.product');

//                 var newProductsList = document.createElement('ul');

//                 products.forEach(product => {

//                     var fetchedProductId = product.dataset.productId;

//                     if(!this.productIds.includes(fetchedProductId)){

//                         this.insertedProductsCount = this.insertedProductsCount + 1;
                    
//                         this.productIds.push(product.dataset.productId);
//                         // existingProducts.appendChild(product);

//                         const productsLazyloadImages = product.querySelectorAll('.lazy-loading-image');

//                         productsLazyloadImages.forEach(imageContainer => {
//                             lazyloading(imageContainer);
//                         })

//                         newProductsList.appendChild(product);

//                         console.log("this.querySelectorAll('li').length", this.querySelectorAll('li').length)
//                     }
//                 })

//                 return newProductsList;

//             })
//     }

//     processCarousel = () => {

//         // var carousel = this.dataset.carousel === 'true';
//         var columnsOffset = this.dataset.columnsOffset === 'true';
//         var carouselOptions = JSON.parse(this.dataset.options);

//         var productsList = this.querySelector('.product-recommendations-list');
//         var products = this.querySelectorAll('.product-recommendations-list li');

//         var productsListWrap = document.createElement('div');

//         for (const className of productsList.classList) {
//             productsListWrap.classList.add(className)
//         }

//         for (const product of products){
//             product.classList.add('splide__slide')
//         }

//         productsListWrap.classList.add('has-carousel');
//         productsListWrap.classList.add('splide');


//         var splideTrack = document.createElement('div');

//         splideTrack.classList.add('splide__track');


//         productsList.classList.add('splide__list');
//         productsList.classList.remove('product-recommendations-list');


//         splideTrack.appendChild(productsList);

//         productsListWrap.appendChild(splideTrack);
//         productsListWrap.appendChild(this.splideArrows);

//         if(this.splideProgress){
//             productsListWrap.appendChild(this.splideProgress);
//         }
        
//         // console.log("products list wrap", productsListWrap);
//         // carouselOptions = {};


//         if(columnsOffset){
//             productsListWrap.classList.add('has-carousel-columns-offset');

//             carouselOptions['autoWidth'] = true
//         }

//         carouselOptions['classes'] = {
//             // Add classes for arrows.
//             arrows: 'splide__arrows',
//             arrow : 'splide__arrow',
//             prev  : 'splide__arrow--prev',
//             next  : 'splide__arrow--next',
    
//             // // Add classes for pagination.
//             // pagination: 'splide__pagination your-class-pagination', // container
//             // page      : 'splide__pagination__page your-class-page', // each button
//         };
        
//         const splide = new Splide(productsListWrap, carouselOptions);

//         var splideBar = splide.root.querySelector( '.splide__progress-bar' );

//         if( splideBar ){
//             // Updates the bar width whenever the carousel moves:
//             splide.on( 'mounted move', function () {
//                 var end  = splide.Components.Controller.getEnd() + 1;
//                 var rate = Math.min( ( splide.index + 1 ) / end, 1 );
//                 splideBar.style.width = String( 100 * rate ) + '%';
//             } );
//         }

//         splide.mount();
        
//         this.appendChild(productsListWrap)
//     }
// }
// customElements.define('cart-recommendations', CartRecommendation)