const express = require('express');
const mongo = require('../models/mongo');
const auth = require('../models/auth');

module.exports = {
    // POST Methods
    createRoute: async (req, res) => {

        //auth
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        //Body
        const { image, name, type, grade, description } = req.body;
        console.log(`${image}, ${name}, ${type}, ${grade}, ${description}`);

        //Create a document with the required fields
        const docu = {
            Name: name,
            Type: type - 1,
            Grade: grade,
            Description: description,
        }

        //Check the role of the requester
        if (role <= 2) {
            try {
                const newID = await mongo.createListing("route_mngt", "live_routes", docu);
                console.log(`Created user with ID: ${newID}`);
                res.status(201).json({ message: "Route created successfully" });
            } catch (err) {
                res.status(500).json({ error: "Registration failed" });
            }
        } else {
            res.status(403).json({ error: "Insufficient Permissions" });
        }
    },
    archiveRoute: async (req, res) => {
        //For Archiving a route, we take a live route and move it to the archived routes.

        //auth
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        const { routeid, takedowndate } = req.body;
        if (role <= 2) {
            try {
                var route_payload = await mongo.findOneListingByKeyValue("route_mngt", "live_routes", routeid, "_id");
            route_payload = JSON.parse(JSON.stringify(route_payload));
            delete route_payload["__v"];
            var confirmation_id = await mongo.createListing("route_mngt", "archived_routes", route_payload); //reqBody should have the object id of the live route
            await mongo.deleteListingByKey("route_mngt", "live_routes", routeid);

            if (!confirmation_id) {
                res.status(500).json({ error: "Archiving process failed" });
            } else {
                res.status(202).json({ message: "Route archived successfully" });
            }
            } catch (err) {
                res.status(500).json({ error: "Archiving process failed" });
            }
        } else {
            res.status(403).json({ error: "Insufficient Permissions" });
        }
    },
    unarchiveRoute: async (req, res) => {
        //auth
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        const { routeid } = req.body;
        if (role <= 2) {
            try {
                var route_payload = await mongo.findOneListingByKeyValue("route_mngt", "archived_routes", routeid, "_id");
            route_payload = JSON.parse(JSON.stringify(route_payload));
            delete route_payload["__v"];
            var confirmation_id = await mongo.createListing("route_mngt", "live_routes", route_payload); //reqBody should have the object id of the live route
            await mongo.deleteListingByKey("route_mngt", "archived_routes", routeid);

            if (!confirmation_id) {
                res.status(500).json({ error: "Archiving process failed" });
            } else {
                res.status(202).json({ message: "Route archived successfully" });
            }
            } catch (err) {
                res.status(500).json({ error: "Archiving process failed" });
            }
        } else {
            res.status(403).json({ error: "Insufficient Permissions" });
        }
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
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        const routeId = req.query.routeId;
        if (role <= 2) {
            await mongo.deleteListingByKey("route_mngt", "live_routes", routeId);
            console.log(routeId);
            res.status(201).json({ message: "Route Successfuly Deleted" });
        } else {
            res.status(403).json({ message: "Access Denied" })
        }
    },
    deleteArchivedRoute: async (req, res) => {
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        const routeId = req.query.routeId;
        if (role <= 2) {
            await mongo.deleteListingByKey("route_mngt", "archived_routes", routeId);
            console.log(routeId);
            res.status(201).json({ message: "Route Successfuly Deleted" });
        } else {
            res.status(403).json({ message: "Access Denied" })
        }
    },

    // GET Methods
    getLiveRoutes: async (req, res) => {
        var response_body = await mongo.getListOfIDs("route_mngt", "live_routes");
        res.status(200).json({ message: "Successful", routes: response_body });
    },
    getArchiveRoutes: async (req, res) => {
        var response_body = await mongo.getListOfIDs("route_mngt", "archived_routes");
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
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=3600'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    getRouteInfo: async (req, res) => { //May Be Obsolete
        const routeId = req.query.routeId;
        const isArchived = req.query.isArchived;
        var response_body = await mongo.getRouteInfo(routeId, isArchived === "true");

        res.status(200).json({ message: `Matched route with id ${routeId}`, routeData: response_body });
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