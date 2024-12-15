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

    return `<span class="badge rounded-pill text-bg-${style}">${roleName}</span>`
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

        userList = fetch(`${origin}/user/getUsers`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
            }
        }).then(response => response.json()).then(async response => {
            count = 1;
            var users = await response["users"]

            users.forEach(async user => {
                response = await fetch(`${origin}/user/getRoutePacketFromID?userId=${user._id}`, {
                    method: "GET"
                })

                var body = await response.json()

                var username = body.username
                var role = body.gyms["ascend"]
                //////////////////////////////////////

                higherRoleHTML = `<tr id="${user._id}">
                        <th class=" align-middle" scope="row">${count}</th>
                        <td class="text-center align-middle" id="u${count}">${user._id}</td>
                        <td class="text-center align-middle">${username}</td>
                        <td class="text-center align-middle">${makeRoleBadge(role)}</td>
                        <td><div class="dropdown">

                        </div>
                        </td>
                        </tr>`;

                //////////////////////////////////////

                lowerRoleHTML = `<tr id="${user._id}">
                        <th class=" align-middle" scope="row">${count}</th>
                        <td class="text-center align-middle" id="u${count}">${user._id}</td>
                        <td class="text-center align-middle">${username}</td>
                        <td id="role${user._id}" class="text-center align-middle">${makeRoleBadge(role)}</td>
                        <td><div class="dropdown">

                        <a id="b${count}"class="btn top-0" role="button" data-bs-toggle="dropdown">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                        </svg>
                        </a>
                        <ul class="dropdown-menu">
                        <li><a id="edit${count}" class="dropdown-item" href="#">Change role</a></li>
                        <li><a id="delete${count}" class="dropdown-item link-danger fw-bolder" href="#">Delete</a></li>
                        </ul>

                        </div>
                        </td>
                        </tr>`;

                //////////////////////////////////////
                if (role > activeRole || role == undefined) {
                    document.getElementById("usersTable").insertAdjacentHTML('beforeend', lowerRoleHTML);



                    //Asign press listener
                    $(`#edit${count}`).unbind("click").on('click', async function (e) {
                        id = $(this).closest("tr").attr("id");


                        $('#changeRoleButton').attr("data-target", id);
                        $('#changeRole').modal("show");
                    });
                    $(`#delete${count}`).unbind("click").on('click', async function (e) {
                        id = $(this).closest("tr").attr("id");

                        $('#deleteUserButton').attr("data-target", id);
                        $('#deletetionTargetLabel').html(`Proceeding will permanently delete the user with the following ID: '${id}'.`);

                        $('#deleteWarning').modal("show");
                    });
                } else {
                    document.getElementById("usersTable").insertAdjacentHTML('beforeend', higherRoleHTML);
                }

                count++;
            })

        })
    });

    //Change role Modal Behavior
    $('#changeRoleButton').unbind("click").on('click', async function (event) {
        target = $(this).attr("data-target")
        value = $('#roleOptions').val();

        //Dont do anything if there isnt a target
        if (target == undefined) {
            return
        }

        //Alert a role must be selected
        if (value == -1) {
            alert("Please select a role")
            return
        }

        console.log(target)
        var response = await fetch(`${origin}/user/editUserRole`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "gymName": "ascend", "targetId": target, "newRole": value })
        });

        if (response.status != 202) {
            alert("A problem has occurred, please try again");
            return
        }

        $(`#role${target}`).html(Roles[value])
        $('#changeRole').modal("hide");
        // location.reload();
    });

    //Delete User Modal Behavior
    $('#deleteUserButton').unbind("click").on('click', async function (event) {
        target = $(this).attr("data-target")
        if (target == undefined) {
            return
        } else {
            console.log(target)
            var response = await fetch(`${origin}/user/deleteAccount?userId=${target}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
                }
            });
            alert("success");
            $('#deleteUserButton').attr("data-target", undefined); //unset the data target
            location.reload();
        }
    });

    //unset the data target on delete modal hidden
    $('#deleteWarning').on('hidden.bs.modal', async function (event) {
        $('#deleteUserButton').attr("data-target", undefined);
    });
    //unset the data target on role modal hidden
    $('#changeRole').on('hidden.bs.modal', async function (event) {
        $('#changeRoleButton').attr("data-target", undefined);
    });
});