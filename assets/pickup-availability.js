
class PickupAvailability extends HTMLElement {
    constructor(){
        super();

        this.productVariantSelectors = document.querySelectorAll('.product-variants-selector > select');
        this.PickupAvailabilities = document.querySelectorAll('pickup-availability');


        for(let pickupAvailability of this.PickupAvailabilities){
            document.addEventListener('click', (event) => {
                var isButton = event.target.classList.contains('pickup-availability-information__button');
                var isClose = event.target.classList.contains('pickup-availability-panel__close');

                if( !isClose && event.target.parentElement ){
                    isClose = event.target.parentElement.classList.contains('pickup-availability-panel__close')
                }
                
                if(isButton){
                    this.onClick(event, pickupAvailability);
                }

                if(isClose){
                    this.closeClick(pickupAvailability);
                }

                if (event.target !== pickupAvailability && !pickupAvailability.contains(event.target)) {
                    this.closeClick(pickupAvailability)
                }
            })

        }

        this.productVariantSelectors.forEach(productVariantSelector => {
            productVariantSelector.addEventListener('change', () => {
                
                this.onVariantChange(productVariantSelector)
            })
        })


    }

    onClick(event, pickupAvailability){

        var panel = pickupAvailability.querySelector('.pickup-availability-panel');

        if( panel ){
            panel.classList.add('active');

            var panelHeight = panel.offsetHeight;
            var x = event.clientX, 
            y = event.clientY;

            if( y > panelHeight ){
                panel.classList.add('place-above');
            }
            else if( (window.innerHeight - y) > panelHeight ){
                panel.classList.add('place-below');
            }
            else{
                panel.classList.add('place-center');
            }
        }

    }

    closeClick(pickupAvailability){

        var panel = pickupAvailability.querySelector('.pickup-availability-panel');

        if( panel ){
            panel.classList.remove('active');
            panel.classList.remove('place-above', 'place-below', 'place-center');
        }
    }

    onVariantChange(productVariantSelector){
        var selectedIndex = productVariantSelector.selectedIndex;
        var variantId = productVariantSelector[selectedIndex].getAttribute('value');

        var pickupAvailability = productVariantSelector.closest('.product').querySelector('pickup-availability')

        fetch(`/variants/${variantId}/?section_id=pickup-availability`)
            .then(response => response.text())
            .then(text => {
                // console.log("pickup res", text);
                var html = new DOMParser().parseFromString(text, 'text/html').querySelector('.shopify-section');


                pickupAvailability.innerHTML = html.innerHTML;


            })
            .catch(e => {
                console.error(e);
            });
    }
}

customElements.define( 'pickup-availability', PickupAvailability );

