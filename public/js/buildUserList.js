const Roles = {
    0: "Owner",
    1: "Admin",
    2: "Setter",
    3: "Member",
    4: "Visitor",
    undefined: "N/A"
}



$(document).ready(async function () {
    active = fetch(`${origin}/user/getActiveUserRole`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
        }
    }).then(response => response.json()).then(response => {
        var activeRole = response["role"];
        userList = fetch(`${origin}/user/getUsers`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
            }
        }).then(response => response.json()).then(async response => {
            count = 1;
            var users = await response["users"]
            console.log(users)

            users.forEach(async user => {
                response = await fetch(`${origin}/user/getRoutePacketFromID?userId=${user._id}`, {
                    method: "GET"
                })

                var body = await response.json()

                var username = body.username
                var role = body.gyms["ascend"]
                console.log(body)
                //////////////////////////////////////

                higherRoleHTML = `<tr id="${user._id}">
                        <th class=" align-middle" scope="row">${count}</th>
                        <td class="text-center align-middle" id="u${count}">${user._id}</td>
                        <td class="text-center align-middle">${username}</td>
                        <td class="text-center align-middle">${Roles[role]}</td>
                        <td><div class="dropdown">

                        </div>
                        </td>
                        </tr>`;

                //////////////////////////////////////

                lowerRoleHTML = `<tr id="${user._id}">
                        <th class=" align-middle" scope="row">${count}</th>
                        <td class="text-center align-middle" id="u${count}">${user._id}</td>
                        <td class="text-center align-middle">${username}</td>
                        <td class="text-center align-middle">${Roles[role]}</td>
                        <td><div class="dropdown">

                        <a id="b${count}"class="btn top-0" role="button" data-bs-toggle="dropdown">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                        </svg>
                        </a>
                        <ul class="dropdown-menu">
                        <li><a id="edit${count}" class="dropdown-item" href="#">Set Visitor</a></li>
                        <li><a id="delete${count}" class="dropdown-item link-danger fw-bolder" href="#">Delete</a></li>
                        </ul>

                        </div>
                        </td>
                        </tr>`;

                //////////////////////////////////////
                console.log(role)
                console.log(activeRole)
                if (role > activeRole || role == undefined) {
                    document.getElementById("usersTable").insertAdjacentHTML('beforeend', lowerRoleHTML);
                    console.log(`#edit${count}`)
                    //Asign press listener
                    $(`#edit${count}`).unbind("click").on('click', async function (e) {
                        id = $(this).closest("tr").attr("id");
                        var response = await fetch(`${origin}/user/editUserRole`, {
                            method: "PUT",
                            headers: {
                                "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({"gymName": "ascend", "targetId": id, "newRole": 4})
                        })
                        alert(`${id}`);
                        location.reload();
                    });
                    $(`#delete${count}`).unbind("click").on('click', async function (e) {
                        id = $(this).closest("tr").attr("id");
                        alert(`Deleting user ${id}...`);
                        var response = await fetch(`${origin}/user/deleteAccount?userId=${id}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
                            }
                        })

                        location.reload();
                    });
                } else {
                    document.getElementById("usersTable").insertAdjacentHTML('beforeend', higherRoleHTML);
                }
                
                count++;
            })

        })
    });
});