async function getRouteList() {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/route/getLiveRoutes`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

async function getRouteData(routeId) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/route/getRouteInfo?routeId=${routeId}&isArchived=false`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

async function getRouteDetails(routeId) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/route/getRouteDetails?routeId=${routeId}&isArchived=false`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
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
        return `badge text-bg-primary`;
    }

    return `badge text-bg-danger`;
}

function getGradeType(grade, type) {
    if (type == 0) {
        return `V`;
    }
    return `5.`;
}

function getGradeStyle(grade, type) {
    if (type == 0) {
        switch (grade) {
            case 0:
            case 1:
            case 2:
                return `badge text-bg-success`;
            case 3:
            case 4:
            case 5:
                return `badge text-bg-warning`;
            case 6:
            case 7:
            case 8:
                return `badge text-bg-danger`;
            default:
                return `badge text-bg-dark`;
        }
    }
    else {
        return `badge text-bg-secondary`;
    }
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

    return `<span class="ms-1 badge text-bg-${style}" style="font-size: 9px;">${roleName}</span>`
}


function getRatingHTML(rating) {
    var c1 = "";
    var c2 = "";
    var c3 = "";
    var c4 = "";
    var c5 = "";
    
    switch (rating) {
        case 1:
            c1 = "checked";
            break;
        case 2:
            c1 = "checked";
            c2 = "checked";
            break;
        case 3:
            c1 = "checked";
            c2 = "checked";
            c3 = "checked";
            break;
        case 4:
            c1 = "checked";
            c2 = "checked";
            c3 = "checked";
            c4 = "checked";
            break;
        case 5:
            c1 = "checked";
            c2 = "checked";
            c3 = "checked";
            c4 = "checked";
            c5 = "checked";
            break;
    }

    return `
        <span class="fa fa-star ${c1}"></span>
        <span class="fa fa-star ${c2}"></span>
        <span class="fa fa-star ${c3}"></span>
        <span class="fa fa-star ${c4}"></span>
        <span class="fa fa-star ${c5}"></span>
    `;
}

$(document).ready(async function () {
    var documents = (await getRouteList()).routes;

    var lastViewed = "";

    documents.forEach(async route => {
        var routeData = (await getRouteData(route._id)).routeData;
        var routeDate = parseDate(routeData.CreationDate);
        var grade = routeData.Grade;
        var type = routeData.Type;
        $("#routeList").append(
            `<button id="${routeData._id}" class="route-button list-group-item list-group-item-action py-3 lh-sm">
            <div class="d-flex w-100 align-items-center justify-content-between">
              <strong class="text-truncate mb-1">${routeData.Name}</strong>
              <small class="fst-italic">${routeDate}</small>
            </div>
            <div class="d-flex w-100 align-items-center justify-content-between">
              <small class="grade fst-italic ${getGradeStyle(grade, routeData.Type)}">${getGradeType(grade, type)}${grade}
              </small>
              <small class="grade ${getTypeStyle(routeData.Type)}">${getType(routeData.Type)}</small>
            </div>
          </button>`
        );



        //Populate main info
        $(`#${routeData._id}`).unbind("click").on('click', async function (event) {
            event.preventDefault();

            //dont show if it is the same object
            var current = $(this).attr('id');
            if (lastViewed == current) {
                return
            }
            lastViewed = current;

            $('#mainContent').empty()


            // var mymodal = $('#routeView');
            // var mBody = mymodal.find('.modal-body');
            // var mTitle = mymodal.find('.modal-title');
            var button = $(this);
            var id = button.attr("id");
            $('#createReviewSubmit').attr("data-target", id)

            var clonedElement = $("#template").contents().clone();
            var gradeTypeName = clonedElement.find("#gradeTypeName");
            var date = clonedElement.find("#date");
            var author = clonedElement.find("#uploader");
            var description = clonedElement.find("#routeDescription");
            var scorecard = clonedElement.find("#reviewScorecard")
            var reviewTable = clonedElement.find("#reviewList")
            var rating = scorecard.find("#ratingInfo");
            var bar1 = scorecard.find(".bar-1");
            var bar2 = scorecard.find(".bar-2");
            var bar3 = scorecard.find(".bar-3");
            var bar4 = scorecard.find(".bar-4");
            var bar5 = scorecard.find(".bar-5");

            //route info
            var routeData = await getRouteDetails(id);
            var name = routeData.Name;
            var desc = routeData.Description;
            var routegrade = routeData.Grade;
            var routetype = getType(routeData.Type);
            var routetypeStyle = getTypeStyle(routeData.Type);
            var routegradeType = getGradeType(routeData.Type);
            var routegradeStyle = getGradeStyle(grade, routeData.Type);
            var routedate = parseDate(routeData.CreationDate);
            var gtnHTML = `
            <div id="grade" class="${routegradeStyle} fst-italic me-2" style="font-size: 18px;">${routegradeType}${routegrade}</div>
            <div id="type" class="${routetypeStyle} fst-italic me-2" style="font-size: 18px;">${routetype}</div>
            <h3 id="name" class="mt-2 fw-semibold">${name}</h3>
            `;

            gradeTypeName.append(gtnHTML);
            date.append(routedate);
            author.append("...");
            description.append(desc);


            //review info
            reviewCount = await fetch(`${origin}/feedback/getReviewCount?routeId=${route._id}&isArchived=false`, {
                method: "GET"
            })
            reviewCount = await reviewCount.json();
            routeRating = await fetch(`${origin}/feedback/getRouteRating?routeId=${route._id}&isArchived=false`, {
                method: "GET"
            })
            routeRating = await routeRating.json();
            var rRating = routeRating.rating;
            if (routeRating.rating == undefined) rRating = 0;
            rating.html(`${Math.round(rRating * 100) / 100} average based on ${reviewCount.review_count} review(s).`);



            //user reviews
            var reviewList = await fetch(`${origin}/feedback/getReviewsOnRoute?routeId=${route._id}`, {
                method: "GET"
            })
            var body = await reviewList.json();
            var reviews = body.reviews;

            reviews.forEach(async review => {
                var response = await fetch(`${origin}/feedback/getReviewDetails?reviewId=${review}`, {
                    method: "GET"
                })
                var body = await response.json();

                var author = body.Author;
                var authorData = await fetch(`${origin}/user/getRoutePacketFromID?userId=${author}`, {
                    method: "GET"
                })
                var authorData = await authorData.json();
                var authorName = authorData["username"];
                var role = authorData["gyms"]["ascend"];
                var Body = body.Body;
                var Rating = body.Rating;
                var Verbose = body.Verbose;

                var html;
                if (Verbose) {
                    html = `
                            <div class="m-3 reviewWidth">
                            <img src="https://img.icons8.com/?size=100&id=107049&format=png&color=000000"
                            style="background-color: #f8f9fa;" alt="mdo" width="32" height="32" class="rounded-circle">
                            <span>${authorName}${makeRoleBadge(role)}</span>
                            <div class="d-flex border-bottom"><span class="me-2">${getRatingHTML(Rating)}</span></div>
                            <span>${Body}</span>
                            </div>
                        `
                } else {
                    html = `
                            <div class="m-3 reviewWidth">
                            <img src="https://img.icons8.com/?size=100&id=107049&format=png&color=000000"
                            style="background-color: #f8f9fa;" alt="mdo" width="32" height="32" class="rounded-circle">
                            <span>${authorName}${makeRoleBadge(role)}</span>
                            <div class="d-flex border-bottom"><span class="me-2">${getRatingHTML(Rating)}</span></div>
                            </div>
                        `
                }

                reviewTable.append(html)
            });





            var barStyle = "bg-primary";
            if (routeData.Type != 0) {
                barStyle = "bg-danger";
            }
            bar1.addClass(barStyle);
            bar2.addClass(barStyle);
            bar3.addClass(barStyle);
            bar4.addClass(barStyle);
            bar5.addClass(barStyle);




            //show template
            $('#mainContent').append(clonedElement)
            
        });
    });



});

