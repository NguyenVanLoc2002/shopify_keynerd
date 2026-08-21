// console.log('Header drawer contents goes here');



class HeaderDrawer extends HTMLElement {
    constructor() {
        super();

        this.HeaderDrawer = this;
        this.HeaderDrawerToggle = this.querySelector('.header-drawer-toggle');
        this.HeaderDrawerDetails = this.querySelector('.header-drawer-details');
        this.subMenuItemIcons = this.querySelectorAll('.header-drawer-main-menu-item-icon');
        this.subMenuItemToggles = this.querySelectorAll('.header-drawer-main-menu-subitems-panel__title');
        // this.subMenuItemIcons = this.querySelectorAll('.header-drawer-main-menu-item-icon');
        // this.HeaderDrawerClose = this.querySelector('.cart-drawer-close');
        // this.HeaderDrawerOverlay = this.querySelector('.cart-drawer-overlay');

        this.HeaderDrawerToggle.addEventListener('click', (event) => this.onClick(event))

        // this.HeaderDrawerClose.addEventListener('click', () => this.close())
        // this.HeaderDrawerOverlay.addEventListener('click', () => this.close())


        document.addEventListener('click', (event) => {
            const headerDrawer = this.HeaderDrawer;
            if (event.target !== headerDrawer && !headerDrawer.contains(event.target)) {
                this.close()
            }
        })


        for(let subMenuItemIcon of this.subMenuItemIcons ){
            subMenuItemIcon.addEventListener('click', () => this.subMenuClick(subMenuItemIcon))
        }

        for(let subMenuItemToggle of this.subMenuItemToggles){
            subMenuItemToggle.addEventListener('click', () => this.subMenuToggleClick(subMenuItemToggle))
        }


        window.addEventListener('scroll', () => {
            // console.log("this", this);

            if(this.classList.contains('active')){
                var headerDrawerDetails = document.querySelector('.header-drawer-details');
                var headerDrawerAdditionalOffset = Math.ceil(headerDrawerDetails.getBoundingClientRect().top);
                this.style.setProperty('--header-drawer-details-additional-offset', headerDrawerAdditionalOffset + 'px');
            }
        })

    }

    onClick(event) {
        event.preventDefault();

        if( this.classList.contains('active') ){
            this.close();
        }
        else{
            this.open()
        }
    }

    open() {
        // this.HeaderDrawerDetails.style.display = 'flex';
        this.HeaderDrawerDetails.classList.add('visible');

        setTimeout(() => {
            this.HeaderDrawer.classList.add('active')
        }, 50);
    }
    close() {
        this.HeaderDrawer.classList.remove('active')

        setTimeout(() => {
            // this.HeaderDrawerDetails.style.display = 'none';
            this.HeaderDrawerDetails.classList.remove('visible');
        }, 300);
    }

    subMenuClick(subMenuItemIcon){

        const subMenuItem = subMenuItemIcon.parentNode.parentNode;
        
        this.HeaderDrawerDetails.classList.add('inactive');
        subMenuItem.classList.contains('active') ? subMenuItem.classList.remove('active') : subMenuItem.classList.add('active')
    }

    subMenuToggleClick(subMenuItemIcon){
        
        const subMenuItem = subMenuItemIcon.parentNode.parentNode;
        
        this.HeaderDrawerDetails.classList.remove('inactive');
        subMenuItem.classList.remove('active')
    }

}

customElements.define('header-drawer', HeaderDrawer);