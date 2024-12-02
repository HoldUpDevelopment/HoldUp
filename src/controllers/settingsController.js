var root = 'public/views';

module.exports = {
    settingsJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('settingsPage.js', {
            root: 'public/js/'
        })
    }
}