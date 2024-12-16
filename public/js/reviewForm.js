
async function submitFormHTTP(body) {
    var xmlHttp = new XMLHttpRequest();
    
    await xmlHttp.open("POST", `${origin}/feedback/createReview`, false); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('jwt')}`);
    xmlHttp.send(body);
    return {
        status: xmlHttp.status,
        body: xmlHttp.response
    };
}

async function submitData(urlEncoded, routeId){
    var response = await submitFormHTTP(urlEncoded);
    console.log(response);
    console.log(response.status);
    if (response.status == 201) {
        window.location.href = `${window.location.protocol}//${window.location.host}${window.location.pathname}?view=${routeId}`;
    } else {
        alert("Please log in to make a review.");
    }

    
}

$(document).ready(async function () {
    $('#createReviewSubmit').unbind("click").on('click', async function (event) {
        event.preventDefault();
        console.log("submitting");
        
        var routeTarget = $(this).attr("data-target");

        const formData = new FormData(document.getElementById("reviewCreationForm"));
        formData.append("targetId", routeTarget)
        formData.append("isVerbose", true)
        if (formData.get("description") == "") {
            formData.set("isVerbose", false)
        }

        const urlEncoded = new URLSearchParams(formData).toString();

        await submitData(urlEncoded, routeTarget);
    })
});