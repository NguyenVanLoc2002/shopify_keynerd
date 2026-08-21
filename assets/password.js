console.log("Password scripts goes here")

// Password page
class PasswordModal extends HTMLElement{
    constructor(){
        super();


        document.addEventListener('click', (event) => {
            this.details = this.getElementsByTagName('details');
            for(let detail of this.details){
                if (event.target !== detail && !detail.contains(event.target)) {
                    detail.removeAttribute('open');
                }
            }
        })
        
    }
}
customElements.define('password-modal', PasswordModal)