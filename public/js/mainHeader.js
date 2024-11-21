
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
        return body;
    }
}

(async () => {
    const loggedOutElements = document.querySelectorAll('.logged-out');
    const loggedInElements = document.querySelectorAll('.logged-in');
    
    const userPayload = await loginState();
    const role = userPayload.role;

    if (state) {
        loggedInElements.forEach(element => {
            //Show elements
            
            if (element.classList.contains("role-setter")) {
                if (role <= 2) {
                    element.style.display = 'block';
                }
            } else {
                element.style.display = 'block';
            }
        })
    } else {
        loggedOutElements.forEach(element => {
            //Show elements
            element.style.display = 'block';
        })
    }

    

})()