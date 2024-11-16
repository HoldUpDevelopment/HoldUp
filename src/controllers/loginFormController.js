module.exports = {
    loginView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('login.html', {
            root: 'public/views/'
        })
    },
    signupView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('signup.html', {
            root: 'public/views/'
        })
    },
    loginJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('login.js', {
            root: 'public/js/'
        })
    },
    signupJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('signup.min.js', {
            root: 'public/js/'
        })
    }
}