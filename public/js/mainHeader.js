
const {
    host, hostname, href, origin, pathname, port, protocol, search
} = window.location

var state = false;

async function loginState() {
    const valid = await fetch(`${origin}/api/auth/grabPayload`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`,
        },
    });
    if (valid.ok) {
        const body = valid.json();
        state = true;
        return body;
    } else {
        return { role: 100 }
    }
}

async function getUserName(id) {
    var response = await fetch(`${origin}/user/getRoutePacketFromID?userId=${id}`, {
        method: "GET"
    })
    var body = await response.json();
    return username = body["username"];
}

async function submitFormHTTP(body) {
    var xmlHttp = new XMLHttpRequest();
    
    await xmlHttp.open("POST", `${origin}/route/createRoute`, false); // false for synchronous request
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
    const loggedOutElements = document.querySelectorAll('.logged-out');
    const loggedInElements = document.querySelectorAll('.logged-in');

    const userPayload = await loginState();
    const id = userPayload._id;
    const role = userPayload.role;
    $("#h").attr("data-userId", id);
    $("#h").attr("data-userRole", role);

    if (state) {
        loggedInElements.forEach(async element => {
            
            //Show elements
            $("#userName").html(await getUserName(id));
            if (element.classList.contains("role-setter")) {
                if (role <= 2) {
                    element.style.display = 'block';
                }
            } else {
                element.style.display = 'block';
            }
        })
    } else {
        loggedOutElements.forEach(element => {
            //Show elements
            element.style.display = 'block';
        })
    }

    $('#createRouteSubmit').unbind("click").on('click', async function (e) {
        e.preventDefault();
        console.log("submitting");

        const formData = new FormData(document.getElementById("routeCreationForm"));
        const urlEncoded = new URLSearchParams(formData).toString();

        await submitData(urlEncoded);
    })



});