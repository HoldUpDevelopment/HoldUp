
async function loginHTTP(username, password) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/api/user/login?userIdentifier=${username}&password=${password}`, false); // false for synchronous request
    xmlHttp.send(null);
    return {
        status: xmlHttp.status,
        body: xmlHttp.responseText.toString()
    };
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//Email validation
function isEmail(string) {
    //holy email regex
    var re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/;
    return re.test(string);
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

async function submitLogin(validityReference) {
    var loginRequest = await loginHTTP($("#username-input").val(), $("#password-input").val());

    if (loginRequest.status == 200) {
        $("#password-input").removeClass('is-invalid');
        $("#username-input").removeClass('is-invalid');
        $("#password-input").addClass('is-valid');
        $("#username-input").addClass('is-valid');
        alert("Correct Password!");
        validityReference.isValid = true;
    } else if (loginRequest.status == 404) {
        validityReference.isValid = false;
        $("#password-input").removeClass('is-invalid');
        $("#username-input").addClass('is-invalid');
        console.log(loginRequest.body);
    } else {
        validityReference.isValid = false;
        $("#username-input").removeClass('is-invalid');
        $("#password-input").addClass('is-invalid');
        console.log(loginRequest.body);
    }
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//Runs the code on the page
(() => {
    'use strict'

    //////////////////////////////////////////////////////////////////

    const formFields = document.querySelectorAll('.form-validator');
    //Sign Up Form Submission
    var form = document.getElementById("login-form");//This is using JQuery functionality. Jquery must be loaded into the HTML for it to compile
    form.addEventListener('submit', async event => { //Submit event listener for form
        var validityReference = { isValid: true };
        Array.from(formFields).forEach(field => { //Check if there are empty fields
            if (field.value == "") {
                field.classList.add('is-invalid');
            }
            if (field.classList.contains('is-invalid')) {
                validityReference.isValid = false;
            }
        })

        //Login
        await submitLogin(validityReference);

        if (!validityReference.isValid) {
            console.log("NOT VALID");
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            
            window.location.href = `${origin}/dashboard`; //Navigate to the login page!
        }
        //form.classList.add('was-validated');
    }, false)

    //////////////////////////////////////////////////////////////////
})();