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

function parseDate(input) {

  let parts = input.split('-');


  // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
  return `${parts[1]}/${parts[2].slice(0, 2)}/${parts[0]}`; // Note: months are 0-based
}

$(document).ready(async function () {
  var documents = (await getAnnouncementList()).routes;
  console.log(JSON.stringify(documents));

  documents.forEach(async (announcement) => {
    var announcementData = (await getAnnouncementData(announcement._id));
    var postDate = parseDate(announcementData.CreationDate);

    console.log(announcementData);
    $("#newsList").append(
      `<div class="card">
            <div class="card-body">
              <div class="d-flex w-100 align-items-center justify-content-between">
                <a href="" class="h4 card-title link-primary fw-normal fst-italic">${announcementData.Title}</a>
                <small class="fst-italic text-black-50">${postDate}</small>
              </div>

              <div>
                <text>
                  Written by ${announcementData.Author}
                </text>
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
