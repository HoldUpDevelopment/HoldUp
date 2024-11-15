//Default warning message declarations:
var usernameHtmlDefault = `Username must be:
              <div class="fw-normal">4-20 characters long,</div>
              <div class="fw-normal">Only contain letters, numbers, dots, or underscores,</div>
              <div class="fw-normal">Can not start or end with a dot or underscore,</div>
              <div class="fw-normal">Can not have consecutive dots or zeros</div>`;

var emailHtmlDefault = `Enter a valid Email address
              <div class="fw-normal">(valid@email.com)</div>`;

var submitSpinner = `<div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
                </div>`;

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

const {
    host, hostname, href, origin, pathname, port, protocol, search
  } = window.location
//Perhaps secure this with API keys in the future!!!!
//HTTP Requests
async function usernameHTTP(username) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/user/getUserIdFromUserName?userName=${username}`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

async function emailHTTP(email) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/user/getUserIdFromEmail?email=${email}`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

async function submitFormHTTP(body) {
    var xmlHttp = new XMLHttpRequest();
    
    await xmlHttp.open("POST", `${origin}/api/user/signup`, false); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.send(body);
    return xmlHttp.responseText;
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//Password validation
function passwordIsValid(password) {
    var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return re.test(password);
}

//Email validation
function emailIsValid(email) {
    //holy email regex
    var re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/;
    return re.test(email);
}

//Username validation
function usernameIsValid(username) {
    var re = /^(?=[a-zA-Z0-9._-]{4,20}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/;
    return re.test(username);
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//Validators
function validateTOC(valRef) {
    if (!$("#tocCheckbox").is(':checked')) {
        $("#tocCheckbox").addClass('is-invalid');
        valRef.isValid = false;
    }
}
async function validateEmail(valRef) {
    var passedChecks = true;
    if ($("#email-input").val() == "") { //check if there is anything
        $("#email-input-warning").html("<div class=\"fw-normal\">* This field is required</div>");
        $("#username-input").addClass('is-invalid');
        $("#email-input").removeClass('is-valid');
        valRef.isValid = false;
        passedChecks = false;
    } else if (!emailIsValid($("#email-input").val()) && passedChecks) { //check Regex
        $("#email-input").addClass('is-invalid');
        $("#email-input").removeClass('is-valid');
        $("#email-input-warning").html(emailHtmlDefault);
        valRef.isValid = false;
        passedChecks = false;

    } else {
        //checkDatabase
        var checkEmailInDB = await emailHTTP($("#email-input").val());
        if (checkEmailInDB._id != 404) { //A username was not found in the user database
            $("#email-input-warning").html("<div class=\"fw-normal\">This email is already in use</div>");
            $("#email-input").addClass('is-invalid');
            $("#email-input").removeClass('is-valid');
            valRef.isValid = false;
            passedChecks = false;
        }
    }
    if (passedChecks) {
        $("#email-input").removeClass('is-invalid');
        $("#email-input").addClass('is-valid');
    }
}
async function validateUsername(valRef) {
    var passedChecks = true;
    if ($("#username-input").val() == "") { //check if there is anything
        $("#username-input-warning").html("<div class=\"fw-normal\">* This field is required</div>");
        $("#username-input").addClass('is-invalid');
        $("#username-input").removeClass('is-valid');
        valRef.isValid = false;
        passedChecks = false;
    } else if (!usernameIsValid($("#username-input").val()) && passedChecks) { //check Regex
        $("#username-input").addClass('is-invalid');
        $("#username-input").removeClass('is-valid');
        $("#username-input-warning").html(usernameHtmlDefault);
        valRef.isValid = false;
        passedChecks = false;

    } else { //check database
        //checkDatabase
        var checkUsernameInDB = await usernameHTTP($("#username-input").val());
        if (checkUsernameInDB._id != 404) { //A username was not found in the user database
            $("#username-input-warning").html("<div class=\"fw-normal\">This username is already in use</div>");
            $("#username-input").addClass('is-invalid');
            $("#username-input").removeClass('is-valid');
            valRef.isValid = false;
            passedChecks = false;
        }
    }
    if (passedChecks) {
        $("#username-input").removeClass('is-invalid');
        $("#username-input").addClass('is-valid');
    }
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//password and re-enter functions for updating dynamically
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

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

async function submitData(formdata) {
    $("#submit-button").html(submitSpinner);

    //Submit the data
    console.log("Sending...");
    var response = await submitFormHTTP(formdata);
    console.log(response);
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

//Runs the code on the page
(() => {
    'use strict'

    //////////////////////////////////////////////////////////////////

    const formFields = document.querySelectorAll('.form-validator');
    //Sign Up Form Submission
    var form = document.getElementById("signup-form");//This is using JQuery functionality. Jquery must be loaded into the HTML for it to compile
    form.addEventListener('submit', async event => { //Submit event listener for form
        var validityReference = { isValid: true };
        Array.from(formFields).forEach(field => {
            if (field.value == "") {
                field.classList.add('is-invalid');
            }
            if (field.classList.contains('is-invalid')) {
                validityReference.isValid = false;
            }
        })
        validateTOC(validityReference);
        validateEmail(validityReference);
        validateUsername(validityReference);

        if (!validityReference.isValid) {
            console.log("NOT VALID");
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            const formData = new FormData(document.getElementById("signup-form"));
            const urlEncoded = new URLSearchParams(formData).toString();
            
            await submitData(urlEncoded);
            alert("successful");
        }
        //form.classList.add('was-validated');
    }, false)

    //////////////////////////////////////////////////////////////////

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
        if (emailField.classList.contains('is-invalid') && emailIsValid($("#email-input").val())) {
            $("#email-input").removeClass("is-invalid");
        }
    }, false)

    //Username listener
    var userField = document.getElementById("username-input");
    userField.addEventListener("change", event => {
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

