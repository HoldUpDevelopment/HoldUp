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
    }
}