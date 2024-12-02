

$(document).ready(async function () {
    users = fetch(`${origin}/user/getUsers`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
        }
    }).then(response => response.json()).then(response => {
        count = 1;
        var users = response["users"]

        users.forEach(async user => {
            response = await fetch(`${origin}/user/getRoutePacketFromID?userId=${user._id}`, {
                method: "GET"
            })

            username = (await response.json()).username

            html = `<tr id="${user._id}">
          <th scope="row">${count}</th>
          <td id="u${count}">${user._id}</td>
          <td>${username}</td>
          <td><div class="dropdown">
          
            <a id="b${count}"class="btn top-0" role="button" data-bs-toggle="dropdown">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>
            </a>
                <ul class="dropdown-menu">
    <li><a id="edit${count}" class="dropdown-item" href="#">Edit</a></li>
    <li><a id="delete${count}" class="dropdown-item link-danger fw-bolder" href="#">Delete</a></li>
    </ul>
    
            </div>
        </td>
          </tr>`;

            document.getElementById("usersTable").insertAdjacentHTML('beforeend', html);

            //Asign press listener
            console.log(`#edit${count}`)
            $(`#edit${count}`).unbind("click").on('click', async function (e) {
                id = $($(this)).parent().parent().parent().parent().parent().attr("id");
                alert(`${id}`);
            });
            $(`#delete${count}`).unbind("click").on('click', async function (e) {
                id = $($(this)).parent().parent().parent().parent().parent().attr("id");
                alert(`Deleting user ${id}...`);
                var response = await fetch(`${origin}/user/deleteAccount?userId=${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
                    }
                })
            });
            count++;
        })

    });
});