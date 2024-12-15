var submitSpinner = `<div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
                </div>`;

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
function setLoginData(token) {
    sessionStorage.setItem("jwt", token);
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

async function loginHTTP(username, password) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("POST", `${origin}/api/auth/login`, false); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(JSON.stringify({userIdentifier: username, password: password}));
    return {
        status: xmlHttp.status,
        body: xmlHttp.response
    };
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

async function submitLogin(validityReference) {
    $("#submit-button").html(submitSpinner);
    const response = await loginHTTP($("#username-input").val(), $("#password-input").val());
    const body = JSON.parse(response.body);

    if (response.status == 201) { //Success
        validityReference.isValid = true;

        //Bootstrap form styling
        $("#password-input").removeClass('is-invalid');
        $("#username-input").removeClass('is-invalid');
        $("#password-input").addClass('is-valid');
        $("#username-input").addClass('is-valid');
        console.log(body.message);

        //Token
        const { token, username } = body;
        setLoginData(token);

    } else if (response.status == 401) { //Authentification failed
        validityReference.isValid = false;

        //Bootstrap form styling
        $("#submit-button").html(`Login`);
        $("#username-input").addClass('is-invalid');
        $("#password-input").addClass('is-invalid');
        console.log(body.error);
    }
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//Runs the code on the page
$(document).ready(async function () {
    'use strict'
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    let redir = params.redir;

    const formFields = document.querySelectorAll('.form-validator');
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
            window.location.href = `${origin}${redir}`; //Navigate to the login page!
        }
        //form.classList.add('was-validated');
    }, false)
});