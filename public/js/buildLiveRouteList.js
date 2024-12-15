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
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    let viewValue = params.view;

    var documents = (await getRouteList()).routes;
    var counter = 0; //Used for resolving the list load process.
    var lastViewed = "";

    //editModal behavior
    //Change role Modal Behavior
    $('#editReviewSubmit').unbind("click").on('click', async function (event) {
        target = $(this).attr("data-target")
        value = $('#eRating').val();

        //Dont do anything if there isnt a target
        if (target == undefined) {
            return
        }

        const formData = new FormData(document.getElementById("editReviewForm"));
        formData.append("creationDate", $(this).attr("data-date"))
        formData.append("targetId", target)
        formData.append("isVerbose", true)
        if (formData.get("description") == "") {
            formData.set("isVerbose", false)
        }
        console.log(formData)
        const urlEncoded = new URLSearchParams(formData).toString();


        console.log(target)
        var response = await fetch(`${origin}/feedback/editReview`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlEncoded
        });

        if (response.status != 202) {
            alert("A problem has occurred, please try again");
            return
        }

        $('#editRoute').modal("hide");
        location.reload();
    });


    //deleteReview modal behavior
    $('#deleteReviewButton').unbind("click").on('click', async function (event) {
        target = $(this).attr("data-target")
        if (target == undefined) {
            return
        } else {
            console.log(target)
            var response = await fetch(`${origin}/feedback/deleteReview?reviewId=${target}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
                }
            });
            alert("Review deleted successfully");
            $('#deleteReviewButton').attr("data-target", undefined); //unset the data target
            location.reload();
        }
    });

    //unset the data target on delete modal hidden
    $('#deleteWarning').on('hidden.bs.modal', async function (event) {
        $('#deleteReviewButton').attr("data-target", undefined);
    });



    //generate route content
    var process = await new Promise((resolve, reject) => {
        documents.forEach(async route => {
            var routeData = (await getRouteData(route._id)).routeData;
            var routeDate = parseDate(routeData.CreationDate);
            var grade = routeData.Grade;
            var type = routeData.Type;
            $("#routeList").append(
                `<button id="${routeData._id}" class="route-button list-group-item list-group-item-action py-3 lh-sm">
                <div class="d-flex w-100 align-items-center justify-content-between">
                  <strong class="text-truncate mb-1">${routeData.Name} </strong>
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
                //Change route query parameters after switching route. Style points.
                window.history.pushState("routeList", "Live Routes", `${window.location.pathname}?view=${current}`);

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
                var routegradeType = getGradeType(0, routeData.Type);
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


                //user reviews
                var reviewList = await fetch(`${origin}/feedback/getReviewsOnRoute?routeId=${route._id}`, {
                    method: "GET"
                })
                var body = await reviewList.json();
                var reviews = body.reviews;

                var scorecardSnapshot = {
                    "Total": reviewCount.review_count,
                    "Sum": 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                }

                async function tabulate() {

                    var process = await new Promise((resolve, reject) => {
                        var itemsProcessed = 0;
                        console.log(itemsProcessed)
                        console.log(reviewCount.review_count)
                        reviews.forEach(async review => {
                            try {
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
                                scorecardSnapshot[Rating] += 1;
                                scorecardSnapshot["Sum"] += Rating;
                                var Verbose = body.Verbose;

                                var html;
                                if (Verbose) {
                                    html = `
                                            <div id="rv${review}" class=" p-2 m-3 reviewWidth">
                                            <img src="https://img.icons8.com/?size=100&id=107049&format=png&color=000000"
                                            style="background-color: #f8f9fa;" alt="mdo" width="32" height="32" class="rounded-circle">
                                            <span>${authorName}${makeRoleBadge(role)}</span>
                                            <div class="d-flex border-bottom"><span class="me-2">${getRatingHTML(Rating)}</span></div>
                                            <span>${Body}</span>
                                            </div>
                                        `
                                } else {
                                    html = `
                                            <div id="rv${review}" class="p-2 m-3 reviewWidth">
                                            <img src="https://img.icons8.com/?size=100&id=107049&format=png&color=000000"
                                            style="background-color: #f8f9fa;" alt="mdo" width="32" height="32" class="rounded-circle">
                                            <span>${authorName}${makeRoleBadge(role)}</span>
                                            <div class="d-flex"><span class="me-2">${getRatingHTML(Rating)}</span></div>
                                            </div>
                                        `
                                }

                                reviewTable.append(html)
                                var userId = $("#h").attr("data-userId");
                                var userRole = $("#h").attr("data-userRole");
                                var deletable = false;
                                var editable = false;
                                if (userRole <= 1 || userId == author) deletable = true;
                                if (userId == author) editable = true;
                                if (deletable) {
                                    var rev = reviewTable.find(`#rv${review}`)
                                    rev.addClass("border");
                                    var options = $("#options").contents().clone();
                                    var delButton = options.find("#delButton")

                                    //set delButton onClick
                                    delButton.unbind("click").on('click', async function (event) {
                                        $('#deleteReviewButton').attr("data-target", review);
                                        $('#deletionTargetLabel').html(`Proceeding will permanently delete the review with the following ID: '${review}', written by '${authorName}'`);

                                        $('#deleteWarning').modal("show");
                                    });

                                    rev.append(options)
                                    if (editable) {
                                        var edButton = $("#edButton").contents().clone();

                                        edButton.attr("data-rating", Rating);
                                        edButton.attr("data-date", body.CreationDate);

                                        //set edButton onClick
                                        edButton.unbind("click").on('click', async function (event) {

                                            var type = $(this).attr("data-rating");

                                            $('#e1').prop("selected", false)
                                            $('#e2').prop("selected", false)
                                            $('#e3').prop("selected", false)
                                            $('#e4').prop("selected", false)
                                            $('#e5').prop("selected", false)
                                            switch (type) {
                                                case "1":
                                                    $('#e1').prop("selected", true)
                                                    break;
                                                case "2":
                                                    $('#e2').prop("selected", true)
                                                    break;
                                                case "3":
                                                    $('#e3').prop("selected", true)
                                                    break;
                                                case "4":
                                                    $('#e4').prop("selected", true)
                                                    break;
                                                case "5":
                                                    $('#e5').prop("selected", true)
                                                    break;
                                            }

                                            $('#e-review-desc-field').val(Body)

                                            $('#editReviewSubmit').attr("data-target", review);
                                            $('#editReviewSubmit').attr("data-date", $(this).attr("data-date"));
                                            $('#editReview').modal("show");
                                        });

                                        options.append(edButton)
                                    }
                                }


                                itemsProcessed++;
                                if (itemsProcessed == reviewCount.review_count) {
                                    resolve();
                                }
                            } catch (err) {
                                itemsProcessed++;
                                if (itemsProcessed == reviewCount.review_count) {
                                    resolve();
                                }
                            }

                        });
                        if (itemsProcessed == reviewCount.review_count) {
                            resolve();
                        }
                    });


                    bar1.css("width", `${scorecardSnapshot[1] * 100 / scorecardSnapshot["Total"]}%`);
                    bar2.css("width", `${scorecardSnapshot[2] * 100 / scorecardSnapshot["Total"]}%`);
                    bar3.css("width", `${scorecardSnapshot[3] * 100 / scorecardSnapshot["Total"]}%`);
                    bar4.css("width", `${scorecardSnapshot[4] * 100 / scorecardSnapshot["Total"]}%`);
                    bar5.css("width", `${scorecardSnapshot[5] * 100 / scorecardSnapshot["Total"]}%`);
                    scorecard.find("#b1Count").html(`<div>${scorecardSnapshot[1]}</div>`);
                    scorecard.find("#b2Count").html(`<div>${scorecardSnapshot[2]}</div>`);
                    scorecard.find("#b3Count").html(`<div>${scorecardSnapshot[3]}</div>`);
                    scorecard.find("#b4Count").html(`<div>${scorecardSnapshot[4]}</div>`);
                    scorecard.find("#b5Count").html(`<div>${scorecardSnapshot[5]}</div>`);


                    //total rating
                    var starTotal = Math.round((scorecardSnapshot["Sum"] / scorecardSnapshot["Total"]) * 100) / 100;
                    if (scorecardSnapshot["Total"] == 0) starTotal = 0;
                    console.log("here")
                    rating.html(`${starTotal} star average based on ${reviewCount.review_count} review(s).`);
                    var solid = Math.floor(starTotal);
                    for (let i = solid; i > 0; i--) {
                        scorecard.find(`#star${i}`).addClass("checked")
                    }

                    //Show partial filling of star
                    if (solid != 5) {
                        var semifill = Math.floor((starTotal - solid) * 100);
                        var semi = scorecard.find(`#star${solid + 1}`);
                        semi.css("color", "transparent");
                        semi.css("background", `linear-gradient(90deg, orange ${semifill - 5}%, #212529 ${semifill + 5}%)`);
                        semi.css("background-clip", "text");
                    }

                    return;
                }
                tabulate();

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


            counter++;
            if (counter == documents.length) resolve();
        });

    });

    $(`#${viewValue}`).trigger('click');
});

