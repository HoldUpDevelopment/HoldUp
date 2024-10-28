const mongo = require('../models/mongo');

module.exports = {
    // POST Methods
    createRoute: (req, res) => {
        var reqBody = '';

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            response_body = {};
            var confirmation_id = await mongo.createListing("route_mngt", "live_routes", reqBody);
            if (confirmation_id == false) {
                response_body = {
                    isValid: false,
                    id: 403
                }
                json_message = JSON.stringify(response_body);

                res.writeHead(403, { // Writing Response
                    'Content-Type': 'application/json'
                });
                res.write(JSON.stringify(response_body));
                res.end();
            } else {
                response_body = {
                    isValid: true,
                    id: confirmation_id
                }
                json_message = JSON.stringify(response_body);

                res.writeHead(202, { // Writing Response
                    'Content-Type': 'application/json'
                });
                res.write(JSON.stringify(response_body));
                res.end();
            }
        });
    },
    archiveRoute: (req, res) => {
        //For Archiving a route, we take a live route and move it to the archived routes.
        var reqBody = '';

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            response_body = {};
            status_code = 0;

            var route_payload = await mongo.findOneListingByKeyValue("route_mngt", "live_routes", reqBody.routeid)
            var confirmation_id = await mongo.createListing("route_mngt", "archived_routes", route_payload); //reqBody should have the object id of the live route
            await mongo.deleteListingByKey("route_mngt", "live_routes", reqBody.routeid);
            
            if (confirmation_id == false) {
                response_body = {
                    isValid: false,
                    id: 500
                };
                status_code = 500;
            } else {
                response_body = {
                    isValid: true,
                    id: confirmation_id
                };
                status_code = 202;
            }


            json_message = JSON.stringify(response_body);
            res.writeHead(status_code, { // Writing Response
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(response_body));
            res.end();
        });
    },
    unarchiveRoute: (req, res) => {
        var reqBody = '';

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            response_body = {};
            status_code = 0;

            var route_payload = await mongo.findOneListingByKeyValue("route_mngt", "archived_routes", reqBody.routeid)
            var confirmation_id = await mongo.createListing("route_mngt", "live_routes", route_payload); //reqBody should have the object id of the live route
            await mongo.deleteListingByKey("route_mngt", "archived_routes", reqBody.routeid);

            if (confirmation_id == false) {
                response_body = {
                    isValid: false,
                    id: 500
                };
                status_code = 500;
            } else {
                response_body = {
                    isValid: true,
                    id: confirmation_id
                };
                status_code = 202;
            }


            json_message = JSON.stringify(response_body);
            res.writeHead(status_code, { // Writing Response
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(response_body));
            res.end();
        });
    },

    // PUT Methods
    editRouteDetails: (req, res) => {
        var reqBody = '';

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            response_body = {};

            json_message = JSON.stringify(response_body);

            res.writeHead(200, { // Writing Response
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(response_body));
            res.end();
        });
    },

    // DELETE Methods
    deleteLiveRoute: (req, res) => {
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
    deleteArchiveRoute: (req, res) => {
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
    deleteRoute: (req, res) => {
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

    // GET Methods
    getRouteDetails: (req, res) => {
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
    getRouteInfo: (req, res) => {
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
    getRouteMapData: (req, res) => {
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
    getAuthorRoutes: (req, res) => {
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
    }
}