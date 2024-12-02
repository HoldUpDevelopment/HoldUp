var root = 'public/views';

module.exports = {
    homepageView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('index.html', {
            root: root
        })
    },
    settingsView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('usersettings.html', {
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
    dashboard_usersView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('users.html', {
            root: root
        })
    },
    announcementView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('announcements.html', {
            root: root
        })
    },
    routeListView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('routeHomepage.html', {
            root: root
        })
    },
    dashboardJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('dashboard.js', {
            root: 'public/js/'
        })
    },
    mainHeaderJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('mainHeader.js', {
            root: 'public/js/'
        })
    },
    buildRouteListJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('buildRouteList.js', {
            root: 'public/js/'
        })
    },
    buildAnnouncementListJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('buildAnnouncementList.js', {
            root: 'public/js/'
        })
    },
    announcementFormJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('announcementForm.js', {
            root: 'public/js/'
        })
    },
    buildUserListJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('buildUserList.js', {
            root: 'public/js/'
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