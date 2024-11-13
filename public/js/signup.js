

//Password validation
function passwordIsValid(password) {
    var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return re.test(password);
}

function emailIsValid(email) {
    //holy email regex
    var re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return re.test(email);
}

function usernameIsValid(username) {
    var re = /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    return re.test(username);
}

function checkPasswordFieldChanged(form) {
        if ($("#password-input").val() != $("#check-password-input").val() || $("#check-password-input").val() == "") {
            $("#check-password-input").removeClass("is-valid");
            $("#check-password-input").addClass("is-invalid");
            form.classList.remove('was-validated');
        } else {
            $("#check-password-input").removeClass("is-invalid");
            $("#check-password-input").addClass("is-valid");
        }
}

function passwordFieldChanged(form) {
    if (!passwordIsValid($("#password-input").val())) {
        $("#password-input").addClass("is-invalid");
        form.classList.remove('was-validated');
    } else {
        $("#password-input").removeClass("is-invalid");
        $("#password-input").addClass("is-valid");
    }
}

//Runs the code on the page
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
    const formFields = document.querySelectorAll('.form-validator');


    var form = document.getElementById("signup-form");//This is using JQuery functionality. Jquery must be loaded into the HTML for it to compile
    form.addEventListener('submit', event => { //Submit event listener for form
        console.log(`${form.id} was submitted`);

        var isValid = true;
        Array.from(formFields).forEach(field => {
            if (field.value == "" ) {
                console.log(field.id);
                field.classList.add('is-invalid');
            }
            if (field.classList.contains('is-invalid')) {
                isValid = false;
            }
        })
        if (!$("#tocCheckbox").is(':checked')) {
            isValid = false;
            $("#tocCheckbox").addClass('is-invalid');
        }

        if (!isValid) {
            console.log("NOT VALID");
            event.preventDefault();
            event.stopPropagation();
        }

        //form.classList.add('was-validated');
    }, false)

    //Password listener
    var passwordField = document.getElementById("password-input");
    passwordField.addEventListener("change", event => {
        passwordFieldChanged(form);
        checkPasswordFieldChanged(form);
    }, false)

    //Re-enter password listener
    var checkPassField = document.getElementById("check-password-input");
    checkPassField.addEventListener("change", event => {
        checkPasswordFieldChanged(form);
    }, false)

    //Email listener
    var emailField = document.getElementById("email-input");
    emailField.addEventListener("change", event => {
        console.log("Changed email field");
        if (userField.classList.contains('is-invalid') && emailIsValid($("#email-input").val())) {
            $("#email-input").removeClass("is-invalid");
        }
    }, false)

    //Username listener
    var userField = document.getElementById("username-input");
    userField.addEventListener("change", event => {
        console.log("Changed username field");
        if (userField.classList.contains('is-invalid') && usernameIsValid($("#username-input").val())) {
            $("#username-input").removeClass("is-invalid");
        }
    }, false)

    //Checkbox listener
    var tocBox = document.getElementById("tocCheckbox");
    tocBox.addEventListener("change", event => {
        if ($('#tocCheckbox').is(':checked')) {
            $("#tocCheckbox").removeClass('is-invalid');
        }
    }, false)
})();

