module.exports = {
    homepageView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('Home.html', {
            root: 'public/'
        })
    }
}