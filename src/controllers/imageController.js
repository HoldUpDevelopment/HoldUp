public_path = 'public/';

module.exports = {
    ascendView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'image/png');
        res.sendFile('images/ascend.png', {
            root: public_path
        });
    },
    iconView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'image/svg+xml');
        res.sendFile('images/icon.svg', {
            root: public_path
        });
    },
    phView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'image/png');
        res.sendFile('images/placeholder.png', {
            root: public_path
        });
    },
}