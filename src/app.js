const http = require('node:http');
const express = require('express');
const hostname = '127.0.0.1' //Localhost
const port = 3000;

//Routes
const homePageRoutes = require('./routes/homePage');

const server = express();


server.use('/', homePageRoutes);

//Listen to server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}//`);
})