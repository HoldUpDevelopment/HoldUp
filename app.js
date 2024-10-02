const http = require('node:http');
const favicon = require('serve-favicon');
const express = require('express');
const hostname = '127.0.0.1'; //Localhost
const port = 3000;

//Routes
const homePageRoutes = require('./src/routes/homePage');
const imageRoutes = require('./src/routes/image');

const server = express();
server.use(favicon('./public/favicon.ico')); 
server.use('/', homePageRoutes);
server.use('/', imageRoutes);

//Listen to server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}//`);
})