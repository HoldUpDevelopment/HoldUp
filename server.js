const http = require('node:http');
const favicon = require('serve-favicon');
const express = require('express');
const hostname = '0.0.0.0'; //Localhost
const port = 3000;

//Routes
const webRouting = require('./src/routes/routeIndex');
const imageRoutes = require('./src/routes/image');
const dashboardRoutes = require('./src/routes/dashboard');
const userAccountRoutes = require('./src/routes/userAccountManagement');
const routeManagementRoutes = require('./src/routes/routeManagement');
const routeFeedbackRoutes = require('./src/routes/routeFeedback');
const announcementRoutes = require('./src/routes/announcements');
const forumManagementRoutes = require('./src/routes/forumManagement');
const authRoutes = require('./src/routes/authRoutes');

//Models
//Mongo
const mongo = require('./src/models/mongo');

const server = express();
server.use(favicon('./public/favicon/favicon.ico')); 
server.use('/', webRouting);
server.use('/images', imageRoutes);
server.use('/user', userAccountRoutes);
server.use('/api/auth', authRoutes); 
server.use('/route', routeManagementRoutes);
server.use('/feedback', routeFeedbackRoutes);
server.use('/announcements', announcementRoutes);
server.use('/forum', forumManagementRoutes);
server.use('/dashboard', dashboardRoutes)

//Listen to server
server.listen(port, hostname, async () => {
    console.log(`Server running at http://${hostname}:${port}//`);
    await mongo.startConnection();
})