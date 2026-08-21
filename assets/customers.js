console.log("customers page");

var customerForgotLink = document.querySelector('.customers-forgot-link')
var customerForgotLinkCancel = document.querySelector('.customers-forgot-link-cancel')


if( customerForgotLink ){
    customerForgotLink.addEventListener('click', function(e){
        e.preventDefault();

        document.querySelector('.customers-login').classList.remove('active');
        document.querySelector('.customers-forgot').classList.add('active');
    })
}

if( customerForgotLinkCancel ){
    customerForgotLinkCancel.addEventListener('click', function(e){
        e.preventDefault();

        document.querySelector('.customers-login').classList.add('active');
        document.querySelector('.customers-forgot').classList.remove('active');
    })
}


// Customer addresses
var addressNewToggle = document.querySelector('.customer-addresses-add-new-form-toggle');
var addressNewForm = document.querySelector('.customer-addresses-add-new-form');
var addressNewFormResetBtns = document.querySelectorAll('.customer-addresses-btn-reset');

if( addressNewToggle ){
    addressNewToggle.addEventListener('click', function(){
        if( addressNewForm.classList.contains('active') ){
            addressNewForm.classList.remove('active');
        }
        else{
            addressNewForm.classList.add('active');
        }
    })
}

for( let reset of addressNewFormResetBtns ){
    reset.addEventListener('click', function(e){
        e.preventDefault();

        e.target.closest('.customer-addresses-form').classList.remove('active')
    })
}

var addressEditToggles = document.querySelectorAll('.customer-addresses-edit-form-toggle')
for( let toggle of addressEditToggles ){
    toggle.addEventListener('click', function(){
        // console.log("edit form", toggle.parentElement.previousElementSibling);
        var form = toggle.parentElement.previousElementSibling;
        if( form.classList.contains('active') ){
            form.classList.remove('active');
        }
        else{
            form.classList.add('active');
        }
    })
}

// Address delete
var addressDeleteBtns = document.querySelectorAll('.customer-addresses-btn-delete');
if( addressDeleteBtns.length > 0 ){
    for(let deleteBtn of addressDeleteBtns){
        deleteBtn.addEventListener('click', function(e){
            e.preventDefault();

            if(confirm(deleteBtn.dataset.confirmMessage)){
                deleteBtn.closest('form').submit();
            }
        });
    }
}

// Country selector
function countrySelectionHandler(select){

    for( let i = 0; i < select.children.length; i++ ){
        var option = select.children[i];
        var selectedValue = false;

        if( !select.selectedIndex ){
            selectedValue = select.dataset.default
        }
        else{
            selectedValue = select.children[select.selectedIndex].value
        }
        // console.log("selectedIndex", selectedValue)
        if( option.getAttribute('value') == selectedValue ){
            select.selectedIndex = i;

            var countryProvincesSelect = select.closest('form').querySelector('select[name="address[province]"]');
            var countryProvincesOptions = select.closest('form').querySelectorAll('select[name="address[province]"] option');
            
            var countryProvinces = JSON.parse(option.dataset.provinces);

            if( countryProvinces.length > 0 ){

                countryProvincesSelect.innerHTML = '';
                countryProvincesSelect.closest('label').classList.add('active');
                
                countryProvinces.forEach(province => {
                    var option = document.createElement("option");
                    option.text = province[1];
                    option.value = province[0];

                    countryProvincesSelect.add(option);
                });
            }
            else{
                countryProvincesSelect.closest('label').classList.remove('active');
                if( countryProvincesOptions.length > 0 ){
                    countryProvincesOptions.forEach(option => option.remove());
                }
            }
        }
    }
}

var addressSelectors = document.querySelectorAll('select[name="address[country]"]');
for(let select of addressSelectors){
    countrySelectionHandler(select);

    select.addEventListener('change', function(){
        countrySelectionHandler(select);
    })
}

