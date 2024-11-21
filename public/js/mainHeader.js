
const {
    host, hostname, href, origin, pathname, port, protocol, search
  } = window.location

var state = false;

async function loginState() {
    const valid = await fetch(`${origin}/api/auth/grabUserId`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`,
        },
    });
    if (valid.ok) {
        const body = valid.json();
        state = true;
        return body._id;
    }
}

(async () => {
    const loggedOutElements = document.querySelectorAll('.logged-out');
    const loggedInElements = document.querySelectorAll('.logged-in');
    
    const UserId = await loginState();

    if (state) {
        loggedInElements.forEach(element => {
            //Show elements
            element.style.display = 'block';
        })
    } else {
        loggedOutElements.forEach(element => {
            //Show elements
            element.style.display = 'block';
        })
    }

})()