function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
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

var languages = ["English","Français","Español","Deutsch"];
var themes = ["light","dark"];

async function userInfoHTTP(userId) {
  var xmlHttp = new XMLHttpRequest();
  await xmlHttp.open("GET", `${origin}/user/getRoutePacketFromID?userId=${userId}`, false); // false for synchronous request
  //xmlHttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('jwt')}`); //Use this when needing to perform user session actions
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}
async function getSettingsHTTP(userId) {
  var xmlHttp = new XMLHttpRequest();
  await xmlHttp.open("GET", `${origin}/user/getUserSettings`, false); // false for synchronous request
  xmlHttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('jwt')}`);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}
async function editSettingsHTTP(settings) {
  var xmlHttp = new XMLHttpRequest();
  await xmlHttp.open("PUT", `${origin}/user/editAccountDetails`, false); // false for synchronous request
  xmlHttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('jwt')}`);
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.send(JSON.stringify(settings));
  return JSON.parse(xmlHttp.responseText);
}
async function emailHTTP(userId) {
  var xmlHttp = new XMLHttpRequest();
  await xmlHttp.open("GET", `${origin}/user/getEmailFromID?userId=${userId}`, false); // false for synchronous request
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

async function decodeUserID() {
  var xmlHttp = new XMLHttpRequest();
  await xmlHttp.open("GET", `${origin}/api/auth/grabPayload`, false); // false for synchronous request
  xmlHttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('jwt')}`);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}

(() => {
  'use strict'

  //////////////////////////////////////////////////////////////////

  async function loadData() {
    const userId = (await decodeUserID())._id; // temp
    console.log(userId);
    console.log("Huh")
    const user_info = await userInfoHTTP(userId);

    var usernameDisplay = document.getElementById("username");
    usernameDisplay.innerText = user_info.username;

    var user_settings = await getSettingsHTTP(userId);
    user_settings = user_settings.settings

    var user_email = await emailHTTP(userId);
    var emailDisplay = document.getElementById("email");
    emailDisplay.innerText = user_email.email;

    var username = getCookie("Username");
    if (username == "") {
      setCookie("Username", user_info.username, 1);
      username = getCookie("Username")
    }
    console.log(`Username cookie: ${username}`)
    var email = getCookie("Email");
    if (email == "") {
      setCookie("Email", user_email.email, 1);
      email = getCookie("Email");
    }
    console.log(`Email cookie: ${email}`)

    document.getElementById("save-button").addEventListener('click', async event => {
      var newSettings = {
        settings: {
          notifications: {
            activities: $("#settings-checkbox-activities").is(':checked'),
            announcements: $("#settings-checkbox-announcements").is(':checked')
          },
          accessibility: {
            high_contrast: $("#settings-checkbox-high_contrast").is(':checked'),
            large_text: $("#settings-checkbox-large_text").is(':checked')
          },
          profile_picture: $("#settings-box-profile_picture").val(),
          theme: $("#selectionMenu-theme option:selected").text(),
          language: $("#selectionMenu-language option:selected").text()
        }
      }
      console.log(newSettings);
      const response = await editSettingsHTTP(newSettings);
      alert("Settings successfully saved!");
    });

    const iterate = (obj) => {
      const stack = [obj];
      while (stack?.length > 0) {
        const currentObj = stack.pop();
        Object.keys(currentObj).forEach(key => {
          if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
            stack.push(currentObj[key]);
          } else {
            if (typeof currentObj[key] === 'boolean'){
              var checked = ``;
              if (currentObj[key] == true){
                checked = `checked`
              }
              var element = `
              <div class="form-check mb-1">
                <input type="checkbox" class="form-check-input" id="settings-checkbox-${key}" ${checked}>
                <label for="settings-check-box">${key}</label>
              </div>`;
              $("#settingsList").append(element);
            } else if (key == 'theme' || key == 'language'){
                var optionsString = ``
                if (key == 'theme'){
                  themes.forEach((theme,index) => {
                    optionsString = optionsString+`<option value="${index}">${theme}</option>`;
                  });
                } else if (key == 'language'){
                  languages.forEach((language,index) => {
                    optionsString = optionsString+`<option value="${index}">${language}</option>`;
                  });
                }
                var element = `
                <select class="form-select" id="selectionMenu-${key}">
                  <option selected="">${key}</option>
                  ${optionsString}
                </select>`;
                $("#settingsList").append(element);
            } else if (key == 'profile_picture'){
              var element = `
              <div class="mb-1">
                <label class="form-label" for="settings-box-profile_picture">Profile Picture</label>
                <input type="file" disabled class="form-control" id="settings-box-profile_picture">
              </div>`;
              $("#settingsList").append(element);
            } else{
              var element = `
              <div class="form-floating mb-1">
                <input type="text" select multiple class="form-control form-validator" id="settings-box-${key}" placeholder="Setting1" required>
                <label for="settings-box">${key}</label>
              </div>`;
              $("#settingsList").append(element);
            }
            $("#settingsList").append('<div class="p-1"></div>');
          }
        });
      }
    };
    iterate(user_settings);
  }
  loadData();
})();