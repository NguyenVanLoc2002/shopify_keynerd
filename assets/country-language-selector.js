if (!customElements.get('localization-form')) {

    class LocalizationForm extends HTMLElement {
        constructor() {
            super();
            this.elements = {
                input: this.querySelector('input[name="language_code"], input[name="country_code"]'),
                button: this.querySelector('button'),
                panel: this.querySelector('ul'),
            };
            this.elements.button.addEventListener('click', this.openSelector.bind(this));
            this.elements.button.addEventListener('focusout', this.closeSelector.bind(this));
            this.addEventListener('keyup', this.onContainerKeyUp.bind(this));

            this.querySelectorAll('a').forEach(item => item.addEventListener('click', this.onItemClick.bind(this)));

        }

        displayLocation(){
        }

        hidePanel() {
            this.elements.button.setAttribute('aria-expanded', 'false');
            this.elements.panel.setAttribute('hidden', true);
        }

        onContainerKeyUp(event) {
            if (event.code.toUpperCase() !== 'ESCAPE') return;

            this.hidePanel();
            this.elements.button.focus();
        }

        onItemClick(event) {
            event.preventDefault();
            const form = this.querySelector('form');
            this.elements.input.value = event.currentTarget.dataset.value;
            console.log("form", form, event.currentTarget.dataset.value, document.querySelector('#localization_form'));

            if (form) form.submit();

        }

        openSelector(event) {
            this.elements.button.focus();
            this.elements.panel.toggleAttribute('hidden');
            this.elements.button.setAttribute('aria-expanded', (this.elements.button.getAttribute('aria-expanded') === 'false').toString());


            var panelHeight = this.elements.panel.offsetHeight;
            var y = event.clientY;

            // if( y > panelHeight ){
            //     this.elements.panel.classList.add('place-above');
            // }
            // else if( (window.innerHeight - y) > panelHeight ){
            //     this.elements.panel.classList.add('place-below');
            // }
        }

        closeSelector(event) {
            const shouldClose = event.relatedTarget && event.relatedTarget.nodeName === 'BUTTON';
            if (event.relatedTarget === null || shouldClose) {
                this.hidePanel();
            }
            // this.elements.panel.classList.remove('place-above', 'place-below');
        }
    }

    customElements.define('localization-form', LocalizationForm);
    
}