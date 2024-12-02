
async function submitFormHTTP(body) {
    var xmlHttp = new XMLHttpRequest();
    
    await xmlHttp.open("POST", `${origin}/announcements/createAnnouncement`, false); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('jwt')}`);
    xmlHttp.send(body);
    return {
        status: xmlHttp.status,
        body: xmlHttp.response
    };
}

async function submitData(urlEncoded){
    var response = await submitFormHTTP(urlEncoded);
    console.log(response);
    console.log(response.status);
    if (response.status == 201) {
        window.location.reload();
    }
}

$(document).ready(async function () {
    $('#createAnnouncementSubmit').unbind("click").on('click', async function (e) {
        e.preventDefault();
        console.log("submitting");

        const formData = new FormData(document.getElementById("postCreationForm"));
        const urlEncoded = new URLSearchParams(formData).toString();

        await submitData(urlEncoded);
    })
});