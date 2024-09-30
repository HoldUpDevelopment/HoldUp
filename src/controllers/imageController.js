public_path = 'public/';

module.exports = {
    okayuView: (req, res) => {
        console.log("huh");
        res.sendFile('images/okayufull.png', {
            root: public_path
        });
    },
    ascendView: (req, res) => {
        console.log("huh");
        res.sendFile('images/ascend.png', {
            root: public_path
        });
    },
}