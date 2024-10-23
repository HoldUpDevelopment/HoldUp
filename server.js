const http = require('node:http');
const favicon = require('serve-favicon');
const express = require('express');
const hostname = '127.0.0.1'; //Localhost
const port = 3000;

//Routes
const homePageRoutes = require('./src/routes/homePage');
const imageRoutes = require('./src/routes/image');
const userAccountRoutes = require('./src/routes/userAccountManagement');
const routeManagementRoutes = require('./src/routes/routeManagement');
const routeFeedbackRoutes = require('./src/routes/routeFeedback');
const announcementRoutes = require('./src/routes/announcements');
const forumManagementRoutes = require('./src/routes/forumManagement');

//Models
//Mongo
const mongo = require('./src/models/mongo');
mongo.startConnection();

const server = express();
server.use(favicon('./public/favicon.ico')); 
server.use('/', homePageRoutes);
server.use('/images', imageRoutes);
server.use('/user', userAccountRoutes);
server.use('/route', routeManagementRoutes);
server.use('/feedback', routeFeedbackRoutes);
server.use('/announcements', announcementRoutes);
server.use('/forum', forumManagementRoutes);

//Listen to server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}//`);
})