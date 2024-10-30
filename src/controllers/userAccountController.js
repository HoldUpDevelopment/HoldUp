const mongo = require('../models/mongo');

module.exports = {
    // POST Methods
    createAccount: (req, res) => {
        var reqBody = '';

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            response_body = {};
            var confirmation_id = await mongo.createListing("route_mngt", "users", reqBody);
            if (confirmation_id == false) {
                response_body = {
                    isValid: false,
                    id: 403
                }
            } else {
                response_body = {
                    isValid: true,
                    id: confirmation_id
                }
            }
            
            json_message = JSON.stringify(response_body);

            res.writeHead(202, { // Writing Response
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(response_body));
            res.end();
        });
    },

    

    // PUT Methods
    editAccountDetails: (req, res) => {
        var reqBody = '';

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            response_body = {};
            var confirmation = await mongo.updateListingByKey("route_mngt", "users", reqBody._id, reqBody.update);
            if (confirmation == false) {
                response_body = {
                    success: false,
                }
            } else {
                response_body = {
                    success: true,
                }
            }
            
            json_message = JSON.stringify(response_body);

            res.writeHead(200, { // Writing Response
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(response_body));
            res.end();
        });
    },

    // DELETE Methods
    deleteAccount: (req, res) => {
        var reqBody = '';

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            response_body = {};
            var confirmation = await mongo.deleteListingByKey("route_mngt", "users", reqBody._id);
            if (confirmation == false) {
                response_body = {
                    success: false,
                }
            } else {
                response_body = {
                    success: true,
                }
            }
            
            json_message = JSON.stringify(response_body);

            res.writeHead(200, { // Writing Response
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(response_body));
            res.end();
        });
    },

    // GET Methods
    getUserIdFromUserName: (req, res) => {
        var reqBody = '';

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            response_body = {};
            var confirmation = await mongo.findOneListingByKeyValue("route_mngt", "users", reqBody.name);
            if (confirmation == false) {
                response_body = {
                    success: false,
                    id: 403
                }
            } else {
                response_body = {
                    success: true,
                    id: confirmation.id
                }
            }
            
            json_message = JSON.stringify(response_body);

            res.writeHead(200, { // Writing Response
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(response_body));
            res.end();
        });
        
        response_body = {
            userid: 111222333
        };
        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    getRoutePacketFromID: (req, res) => {
        response_body = {
            username: "test-username",
            profile_picture: "pfp.jpg",
            displayname: "test-user",
        };
        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    getForumPacketFromID: (req, res) => {
        response_body = {
            username: "test-username",
            profile_picture: "pfp.jpg"
        };
        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    getSettingsFromID: (req, res) => {
        response_body = {
            username: "test-username",
            profile_picture: "pfp.png"
        };
        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    }
}