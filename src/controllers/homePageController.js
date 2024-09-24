module.exports = {
    homepageView: (req, res) => {
        res.sendFile('Home.html', {
            root: 'public/'
        })
    }
}