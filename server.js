const http = require('node:http');
const favicon = require('serve-favicon');
const express = require('express');
const hostname = '127.0.0.1'; //Localhost
const port = 3000;

//Routes
const webRouting = require('./src/routes/routeIndex');
const imageRoutes = require('./src/routes/image');
const userAccountRoutes = require('./src/routes/userAccountManagement');
const routeManagementRoutes = require('./src/routes/routeManagement');
const routeFeedbackRoutes = require('./src/routes/routeFeedback');
const announcementRoutes = require('./src/routes/announcements');
const forumManagementRoutes = require('./src/routes/forumManagement');

//Models
//Mongo
const mongo = require('./src/models/mongo');

//middleware
middle = express.urlencoded({ extended: true });

const server = express();
server.use(favicon('./public/favicon.ico')); 
server.use('/', webRouting);
server.use('/images', imageRoutes);
server.use('/user', userAccountRoutes);
server.use('/api/user', middle, userAccountRoutes);
server.use('/route', routeManagementRoutes);
server.use('/feedback', routeFeedbackRoutes);
server.use('/announcements', announcementRoutes);
server.use('/forum', forumManagementRoutes);

//Listen to server
server.listen(port, hostname, async () => {
    console.log(`Server running at http://${hostname}:${port}//`);
    await mongo.startConnection();
})