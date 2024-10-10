public_path = 'public/';

module.exports = {
    ascendView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'image/png');
        res.sendFile('images/ascend.png', {
            root: public_path
        });
    },
}