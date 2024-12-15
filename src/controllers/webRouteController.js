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
    dashboard_routesView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('routes.html', {
            root: root
        })
    },
    dashboard_archiveView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('archive.html', {
            root: root
        })
    },
    dashboard_postsView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('posts.html', {
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
    archiveView: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/html');
        res.sendFile('routeArchive.html', {
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
    buildLiveRouteListJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('buildLiveRouteList.js', {
            root: 'public/js/'
        })
    },
    buildArchiveRouteListJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('buildArchiveRouteList.js', {
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
    buildUserDashJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('buildUserDash.js', {
            root: 'public/js/'
        })
    },
    buildRouteDashJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('buildRouteDash.js', {
            root: 'public/js/'
        })
    },
    buildArchiveDashJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('buildArchiveDash.js', {
            root: 'public/js/'
        })
    },
    buildAnnouncementDashJS: (req, res) => {
        res.status(200); //OK
        res.set('Content-Type', 'text/javascript');
        res.sendFile('buildAnnouncementDash.js', {
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