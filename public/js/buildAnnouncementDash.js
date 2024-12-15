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

    return `<span class="badge text-bg-${style}" style="font-size: 9px;">${roleName}</span>`
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

        routeList = fetch(`${origin}/announcements/getAnnouncementList`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
            }
        }).then(response => response.json()).then(async response => {
            count = 1;
            var posts = await response["posts"]

            posts.forEach(async post => {
                response = await fetch(`${origin}/announcements/getAnnouncementDetails?announcementId=${post._id}`, {
                    method: "GET"
                })

                var body = await response.json();

                var title = body.Title;
                var authorId = body.Author;
                var postbody = body.Body;
                var date = parseDate(body.CreationDate);

                //get author details
                response = await fetch(`${origin}/user/getRoutePacketFromID?userId=${authorId}`, {
                    method: "GET"
                })

                user = await response.json();
                var authorName = user.username;
                var authorRole = user["gyms"]["ascend"];

                //////////////////////////////////////

                routeObjectHTML = `<tr id="${post._id}">
                        <th class=" align-middle" scope="row">${count}</th>
                        <td class="text-center align-middle" style="width: 0.2vw;" id="r${count}">${post._id}</td>
                        <td class="text-center text-truncate align-middle" style="max-width: 0.15vw;">${title}</td>
                        <td class="text-center align-middle" title="ID: ${authorId}">${makeRoleBadge(authorRole)} ${authorName}</td>
                        <td class="text-center text-truncate text-dark-emphasis align-middle" style="max-width: 0.15vw;">${postbody}</td>
                        <td class="text-center align-middle">${date}</td>
                        <td><div class="dropdown">

                        <a id="b${count}"class="btn top-0" role="button" data-bs-toggle="dropdown">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                        </svg>
                        </a>
                        <ul class="dropdown-menu">
                        <li><a id="edit${count}" class="dropdown-item" href="#">Edit post</a></li>
                        <li><a id="delete${count}" class="dropdown-item link-danger fw-bolder" href="#">Delete</a></li>
                        </ul>

                        </div>
                        </td>
                        </td>
                        </tr>`;

                //////////////////////////////////////

                $('#postTable').append(routeObjectHTML)

                //Save the route data we are obtaining to construct the modals and edit the route
                // $(`#edit${count}`).attr("data-name", name);
                // $(`#edit${count}`).attr("data-desc", desc);
                // $(`#edit${count}`).attr("data-type", body.Type);
                $(`#edit${count}`).attr("data-date", body.CreationDate);
                // $(`#edit${count}`).attr("data-grade", grade);


                //Asign press listener
                $(`#edit${count}`).unbind("click").on('click', async function (event) {
                    id = $(this).closest("tr").attr("id");

                    $('#editPostSubmit').attr("data-target", id);
                    $('#editPostSubmit').attr("data-date", $(this).attr("data-date"));

                    //Change title
                    titlehtml = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen me-2" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    Editting post '${id}'
                    `;

                    $('#e-postTitle').html(titlehtml);

                    //populate fields
                    $('#e-post-body-field').val(postbody)
                    $('#e-post-title-field').val(title)
                    $('#e-post-author-field').val(authorId)

                    $('#editPost').modal("show");
                });

                $(`#archive${count}`).unbind("click").on('click', async function (event) {
                    id = $(this).closest("tr").attr("id");
                    var response = await fetch(`${origin}/route/archiveRoute`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "routeid": id, "takedowndate": "huh" })
                    });

                    if (response.status != 202) {
                        alert("A problem has occurred, please try again");
                        return
                    }

                    location.reload();
                });
                $(`#delete${count}`).unbind("click").on('click', async function (event) {
                    id = $(this).closest("tr").attr("id");

                    $('#deletePostButton').attr("data-target", id);
                    $('#deletionTargetLabel').html(`Proceeding will permanently delete the post with the following ID: '${id}'.`);

                    $('#deleteWarning').modal("show");
                });

                count++;
            })

        })
    });

    // Change role Modal Behavior
    $('#editPostSubmit').unbind("click").on('click', async function (event) {
        target = $(this).attr("data-target")

        //Dont do anything if there isnt a target
        if (target == undefined) {
            return
        }

        const formData = new FormData(document.getElementById("editPostForm"));
        formData.append("creationDate", $(this).attr("data-date"))
        formData.append("targetId", target)
        const urlEncoded = new URLSearchParams(formData).toString();


        console.log(target)
        var response = await fetch(`${origin}/announcements/editAnnouncement`, {
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

        $('#editPost').modal("hide");
        location.reload();
    });

    //Delete Route Modal Behavior
    $('#deletePostButton').unbind("click").on('click', async function (event) {
        target = $(this).attr("data-target")
        if (target == undefined) {
            return
        } else {
            console.log(target)
            var response = await fetch(`${origin}/announcements/deleteAnnouncement?announcementId=${target}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
                }
            });
            alert("success");
            $('#deletePostButton').attr("data-target", undefined); //unset the data target
            location.reload();
        }
    });

    //unset the data target on delete modal hidden
    $('#deleteWarning').on('hidden.bs.modal', async function (event) {
        $('#deletePostButton').attr("data-target", undefined);
    });
});