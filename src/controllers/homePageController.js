var root = 'public/views';

module.exports = {
    homepageView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('index.html', {
            root: root
        })
    },
    dashboardView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('dashboard.html', {
            root: root
        })
    },
    stylesheet: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/css');
        res.sendFile('styles.css', {
            root: root
        })
    }
}