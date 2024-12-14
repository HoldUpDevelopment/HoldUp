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

function getGradeType(type) {
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


$(document).ready(async function () {
    active = fetch(`${origin}/user/getActiveUserRole`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
        }
    }).then(response => response.json()).then(response => {
        var activeRole = response["role"];

        //Populate the changeRole modal selector
        for (let i = 0; i < 5; i++) {

            if (activeRole < i) {
                $('#roleOptions').append(`<option value="${i}">${Roles[i]}</option>`)
            }
        }

        routeList = fetch(`${origin}/route/getLiveRoutes`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
            }
        }).then(response => response.json()).then(async response => {
            count = 1;
            var routes = await response["routes"]

            routes.forEach(async route => {
                response = await fetch(`${origin}/route/getRouteDetails?routeId=${route._id}`, {
                    method: "GET"
                })

                var body = await response.json();

                var name = body.Name;
                var desc = body.Description;
                var grade = body.Grade;
                var type = getType(body.Type);
                var typeStyle = getTypeStyle(body.Type);
                var gradeType = getGradeType(body.Type);
                var gradeStyle = getGradeStyle(grade, body.Type);
                var date = parseDate(body.CreationDate);
                //////////////////////////////////////

                routeObjectHTML = `<tr id="${route._id}">
                        <th class=" align-middle" scope="row">${count}</th>
                        <td class="text-center align-middle" id="r${count}">${route._id}</td>
                        <td class="text-center text-truncate align-middle" style="max-width: 0.15vw;">${name}</td>
                        <td class="text-center text-truncate text-dark-emphasis align-middle" style="max-width: 0.15vw;">${desc}</td>
                        <td class="text-center align-middle"><span class="${gradeStyle}">${gradeType}${grade}</span></td>
                        <td class="text-center align-middle"><span class="${typeStyle}">${type}</span></td>
                        <td class="text-center align-middle">${date}</td>
                        <td><div class="dropdown">

                        <a id="b${count}"class="btn top-0" role="button" data-bs-toggle="dropdown">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                        </svg>
                        </a>
                        <ul class="dropdown-menu">
                        <li><a id="edit${count}" class="dropdown-item" href="#">Edit route</a></li>
                        <li><a id="archive${count}" class="dropdown-item" href="#">Archive route</a></li>
                        <li><a id="delete${count}" class="dropdown-item link-danger fw-bolder" href="#">Delete</a></li>
                        </ul>

                        </div>
                        </td>
                        </td>
                        </tr>`;

                //////////////////////////////////////
                $('#routesTable').append(routeObjectHTML)

                //Asign press listener
                $(`#edit${count}`).unbind("click").on('click', async function (event) {
                    id = $(this).closest("tr").attr("id");
                });
                $(`#archive${count}`).unbind("click").on('click', async function (event) {
                    id = $(this).closest("tr").attr("id");
                    var response = await fetch(`${origin}/route/archiveRoute`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({"routeid": id, "takedowndate": "huh"})
                    });

                    if (response.status != 202) {
                        alert("A problem has occurred, please try again");
                        return 
                    }

                    location.reload();
                });
                $(`#delete${count}`).unbind("click").on('click', async function (event) {
                    id = $(this).closest("tr").attr("id");

                    $('#deleteRouteButton').attr("data-target", id);
                    $('#deletionTargetLabel').html(`Proceeding will permanently delete the route with the following ID: '${id}'.`);

                    $('#deleteWarning').modal("show");
                });

                count++;
            })

        })
    });

    //Delete Route Modal Behavior
    $('#deleteRouteButton').unbind("click").on('click', async function (event) {
        target = $(this).attr("data-target")
        if (target == undefined) {
            return
        } else {
            console.log(target)
            var response = await fetch(`${origin}/route/deleteLiveRoute?routeId=${target}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
                }
            });
            alert("success");
            $('#deleteRouteButton').attr("data-target", undefined); //unset the data target
            location.reload();
        }
    });

    //unset the data target on delete modal hidden
    $('#deleteWarning').on('hidden.bs.modal', async function (event) {
        $('#deleteRouteButton').attr("data-target", undefined);
    });
});