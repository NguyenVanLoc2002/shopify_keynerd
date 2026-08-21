// console.log('Cart drawer contents goes here');


class CartDrawer extends HTMLElement {
    constructor() {
        super();

        this.cartDrawerToggle = document.querySelector('.section-header-cart-drawer-toggle');
        this.cartDrawer = this;
        this.cartDrawerClose = this.querySelector('.cart-drawer-close');
        this.cartDrawerOverlay = this.querySelector('.cart-drawer-overlay');
        this.cartDrawerEmptyRedirect = this.querySelector('.cart-drawer-empty-footer');

        this.setAttribute('tabindex', '-1');

        if(this.cartDrawerToggle){
            this.cartDrawerToggle.addEventListener('click', (event) => this.onClick(event))
        }

        this.cartDrawerClose.addEventListener('click', () => this.close())
        this.cartDrawerClose.addEventListener('keyup', (event) => this.onCloseKeypress(event))
        this.cartDrawerOverlay.addEventListener('click', () => this.close())


        document.addEventListener('keyup', (event) => {
            if(event.key === 'Escape'){
                this.close();
            }
        })

        document.addEventListener('click', (event) => {
            if(event.target == document.querySelector('.cart-drawer-close') || document.querySelector('.cart-drawer-close').contains(event.target)){
                this.close()
            }
        })

        if( this.cartDrawerEmptyRedirect ){
            this.cartDrawerEmptyRedirect.addEventListener('click', () => this.close())
        }

        this.previousElement = this.cartDrawerToggle
    }

    onClick(event) {

        event.preventDefault();

        this.open()
    }

    onCloseKeypress(event){
        if (event.key === 'Enter') {

            this.close();
            
            // this.cartDrawerToggle.focus();

            // var quickviewElement = document.querySelector('.popup-modal-quickview:not(.inactive)');
            // if(quickviewElement){
            //     quickviewElement.querySelector('button[type="submit"]').focus();
            // }
        }
    }

    open() {
        this.previousElement = ( document.activeElement || this.cartDrawerToggle );

        this.cartDrawer.setAttribute('aria-hidden', 'false');
        this.cartDrawer.classList.add('active');

        setTimeout(() => {
            this.querySelector('a[href]').focus();
        }, 100)
    }
    close() {

        // this.cartDrawerToggle.focus();
        this.previousElement.focus();
            
        this.cartDrawer.setAttribute('aria-hidden', 'true');
        this.cartDrawer.classList.remove('active')

        var quickviewElement = document.querySelector('.popup-modal-quickview:not(.inactive)');
        if(quickviewElement){
            quickviewElement.querySelector('button[type="submit"]').focus();
        }
    }

}

customElements.define('cart-drawer', CartDrawer);