function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

async function userInfoHTTP(userId) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/user/getRoutePacketFromID?userId=${userId}`, false); // false for synchronous request
    //xmlHttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('jwt')}`); //Use this when needing to perform user session actions
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}
async function settingsHTTP(userId) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/user/getUserSettings`, false); // false for synchronous request
    xmlHttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('jwt')}`);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}
async function emailHTTP(userId) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/user/getEmailFromID?userId=${userId}`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

(() => {
    'use strict'

    //////////////////////////////////////////////////////////////////

    async function loadData() {
        var userId = "6737d294c5d9c32503414e08"; // temp
        var user_info = await userInfoHTTP(userId);

        var usernameDisplay = document.getElementById("username");
        usernameDisplay.innerText = user_info.username;

        var user_settings = await settingsHTTP(userId);
        user_settings = user_settings.settings

        var user_email = await emailHTTP(userId);
        var emailDisplay = document.getElementById("email");
        emailDisplay.innerText = user_email.email;

        var username = getCookie("Username");
        if (username == "") {
            setCookie("Username",user_info.username,1);
            username = getCookie("Username")
        }
        console.log(`Username cookie: ${username}`)
        var email = getCookie("Email");
        if (email == "") {
            setCookie("Email",user_email.email,1);
            email = getCookie("Email");
        }
        console.log(`Email cookie: ${email}`)

        const iterate = (obj) => {
            const stack = [obj];
            while (stack?.length > 0) {
              const currentObj = stack.pop();
              Object.keys(currentObj).forEach(key => {
                if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
                  stack.push(currentObj[key]);
                } else {
                    $("#settingsList").append('<li class="list-group-item">'+key+'='+currentObj[key]+'</li>');
                }
              });
            }
        };
        iterate(user_settings);
    }
    loadData();
})();