async function getRouteList() {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/route/getArchivedRoutes`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

async function getRouteData(routeId) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/route/getRouteInfo?routeId=${routeId}&isArchived=true`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

async function getRouteDetails(routeId) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/route/getRouteDetails?routeId=${routeId}&isArchived=true`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}


// parse a date in yyyy-mm-dd format
function parseDate(input) {

    let parts = input.split('-');


    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return `${parts[1]}/${parts[2].slice(0, 2)}/${parts[0]}`; // Note: months are 0-based
}

function getType(type) {
    if (type == 0) {
        return `Boulder`;
    }

    return `Sport`;
}

function getTypeStyle(type) {
    if (type == 0) {
        return `text-primary fst-italic fw-bold`;
    }

    return `text-danger fst-italic fw-bold`;
}

function getGradeType(grade, type) {
    if (type == 0) {
        return `V`;
    }
    return `5.`;
}

function getGradeStyle(grade, type) {
    switch (grade) {
        case 0:
        case 1:
        case 2:
            return `text-success`;
        case 3:
        case 4:
        case 5:
            return `text-warning`;
        case 6:
        case 7:
        case 8:
            return `text-danger`;
        default:
            return `text-secondary`;
    }
}

$(document).ready(async function() {
    var documents = (await getRouteList()).routes;
    console.log(JSON.stringify(documents));

    documents.forEach(async route => {
        var routeData = (await getRouteData(route._id)).routeData;
        var routeDate = parseDate(routeData.CreationDate);
        var grade = routeData.Grade;
        var type = routeData.Type;
        console.log(routeData);
        $("#routeList").append(
            `<button id="${routeData._id}" class="route-button list-group-item list-group-item-action py-3 lh-sm">
            <div class="d-flex w-100 align-items-center justify-content-between">
              <strong class="mb-1">${routeData.Name}</strong>
              <small class="fst-italic">${routeDate}</small>
            </div>
            <div class="d-flex w-100 align-items-center justify-content-between">
              <small class="grade fst-italic fw-normal text-black-50">${getGradeType(grade, type)}<strong class="grade ${getGradeStyle(grade, routeData.Type)} fst-italic fw-bold">${grade}</strong>
              </small>
              <small class="grade ${getTypeStyle(routeData.Type)}">${getType(routeData.Type)}</small>
            </div>
          </button>`
        );

        $(`#${routeData._id}`).unbind("click").on('click', async function (e) {
            e.preventDefault();
            var mymodal = $('#routeView');
            var mBody = mymodal.find('.modal-body');
            var mTitle = mymodal.find('.modal-title');
            var button = $(this);
            var id = button.attr("id");
    
            var routeData = await getRouteDetails(id);
    
            mTitle.html(routeData.Name);
            mBody.html(routeData.Description)
            mymodal.modal('show');
    
        });
    });
});

