const express = require('express');
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

            var route_payload = await mongo.findOneListingByKeyValue("route_mngt", "live_routes", reqBody.routeid, "_id");
            route_payload = JSON.parse(JSON.stringify(route_payload));
            delete route_payload["__v"];
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

            var route_payload = await mongo.findOneListingByKeyValue("route_mngt", "archived_routes", reqBody.routeid, "_id")
            route_payload = JSON.parse(JSON.stringify(route_payload));
            delete route_payload["__v"];
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
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object\
            response_body = {};

            const isArchived = req.query.isArchived;
            const routeId = req.query.routeId;

            if (isArchived === 'true') {
                await mongo.updateListingByKey("route_mngt", "archived_routes", routeId, reqBody, false);
            } else {
                await mongo.updateListingByKey("route_mngt", "live_routes", routeId, reqBody, false);
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
    deleteLiveRoute: async (req, res) => {
        const routeId = req.query.routeId;

        response_body = {};
        await mongo.deleteListingByKey("route_mngt", "live_routes", routeId);

        json_message = JSON.stringify(response_body);
        console.log();

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    deleteArchiveRoute: async (req, res) => {
        const routeId = req.query.routeId;

        response_body = {};
        await mongo.deleteListingByKey("route_mngt", "archived_routes", routeId);

        json_message = JSON.stringify(response_body);
        console.log();

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },

    // GET Methods
    getLiveRoutes: async(req, res) => {
        var response_body = await mongo.getListOfIDs("route_mngt", "live_routes");
        res.status(200).json({ message: "Successful", routes: response_body });
    },
    getRouteDetails: async (req, res) => {
        const routeId = req.query.routeId;
        const isArchived = req.query.isArchived;
        var response_body;
        if (isArchived === 'true') {
            response_body = await mongo.findOneListingByKeyValue("route_mngt", "archived_routes", routeId, "_id")
        } else {
            response_body = await mongo.findOneListingByKeyValue("route_mngt", "live_routes", routeId, "_id")
        }
        
        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    getRouteInfo: (req, res) => { //May Be Obsolete
        const routeId = req.query.routeId;
        const isArchived = req.query.isArchived;
        //var response_body = ;
        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
             'Content-Type': 'application/json'
        });
        res.write(JSON.stringify({}));
        res.end();
    },
    //Check the excel for details
    getRouteMapData: async (req, res) => {
        const routeId = req.query.routeId;
        var response_body = await mongo.getFieldFromListingById("route_mngt", "live_routes", routeId, "Location"); //Needs custom DB call
        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    //Check the excel for details
    getAuthorRoutes: async (req, res) => {
        const authorId = req.query.authorId;
        var response_body = await mongo.findManyListingsByKeyValue("route_mngt", "live_routes", authorId, "Authors"); //Needs custom DB call
        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    }
}