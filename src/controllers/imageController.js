module.exports = {
    okayuView: (req, res) => {
        console.log("huh");
        res.sendFile('images/okayufull.png', {
            root: 'public/'
        });
    },
    ascendView: (req, res) => {
        console.log("huh");
        res.sendFile('images/ascend.png', {
            root: 'public/'
        });
    }
}