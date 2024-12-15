async function getAnnouncementList() {
  var xmlHttp = new XMLHttpRequest();
  await xmlHttp.open("GET", `${origin}/announcements/getAnnouncementList`, false); // false for synchronous request
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}

async function getAnnouncementData(announcementId) {
  var xmlHttp = new XMLHttpRequest();
  await xmlHttp.open(
    "GET",
    `${origin}/announcements/getAnnouncementDetails?announcementId=${announcementId}`,
    false
  ); // false for synchronous request
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}

async function getUserNameAndRole(id) {
  var response = await fetch(`${origin}/user/getRoutePacketFromID?userId=${id}`, {
    method: "GET"
  })
  var body = await response.json();
  return { "username": body["username"], "role": body["gyms"]["ascend"] };
}

function parseDate(input) {

  let parts = input.split('-');


  // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
  return `${parts[1]}/${parts[2].slice(0, 2)}/${parts[0]}`; // Note: months are 0-based
}

//roles 
const Roles = {
  0: "Owner",
  1: "Admin",
  2: "Setter",
  3: "Member",
  4: "Visitor",
  undefined: "N/A"
}

//create html for role badge on user name
function makeRoleBadge(role) {
  var roleName = Roles[role]
  var style;

  switch (role) {

    case 0:
      style = "dark"
      break;
    case 1:
      style = "warning"
      break;
    case 2:
      style = "info"
      break;
    case 3:
      style = "success"
      break;
    case 4:
      style = "light"
      break;
    default:
      style = "secondary"
  }

  return `<span class="ms badge text-bg-${style}" style="font-size: 9px;">${roleName}</span>`
}

$(document).ready(async function () {
  var documents = (await getAnnouncementList()).posts;
  console.log(JSON.stringify(documents));

  documents.forEach(async (announcement) => {
    var announcementData = (await getAnnouncementData(announcement._id));
    var postDate = parseDate(announcementData.CreationDate);

    var data = await getUserNameAndRole(announcementData.Author)
    console.log(announcementData);
    $("#newsList").append(
      `<div class="card">
            <div class="card-body">
              <div class="d-flex w-100 align-items-center justify-content-between">
                <a href="" class="h4 card-title link-primary fw-normal fst-italic">${announcementData.Title}</a>
                <small class="fst-italic text-black-50">${postDate}</small>
              </div>

              <div class="d-flex">
                <span>
                  Written by 
                </span>
                <div class="ms-1" style="background-color:rgb(255, 251, 198)">
                  <span class="fw-semibold">
                  ${data["username"]}
                </span>
                ${makeRoleBadge(data["role"])}
                </div>
              </div>

              <div>
                <p class="card-text text-black-50">
                  ${announcementData.Body}
                </p>
              </div>


            </div>
          </div>`
    );
  });
});
