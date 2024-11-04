const { ObjectId } = require('mongodb');
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
                    _id: 403
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
                    _id: confirmation_id
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



    // PUT Methods
    editAccountDetails: (req, res) => {
        var reqBody = '';

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object\
            var response_body = {};

            const userId = req.query.userId;
            await mongo.updateListingByKey("route_mngt", "users", userId, reqBody);

            json_message = JSON.stringify(response_body);

            res.writeHead(200, { // Writing Response
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(response_body));
            res.end();
        });
    },

    // DELETE Methods
    deleteAccount: async (req, res) => {
        const userId = req.query.userId;
        var response_body = {};
        await mongo.deleteListingByKey("route_mngt", "users", userId);

        json_message = JSON.stringify(response_body);

        res.writeHead(200, { // Writing Response
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();

    },

    // GET Methods
    //Perhaps more realistically, get list of users from username search. May need reworked
    getUserIdFromUserName: async (req, res) => {
        const userName = req.query.userName;
        var response_body;
        response_body = await mongo.findOneListingByKeyValue("route_mngt", "users", userName, "username") //Needs custom search field, get this implemented

        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    //Gets information to be used when displaying a review. User name, profile picture, and display name.
    getRoutePacketFromID: async (req, res) => {
        const userId = req.query.userId;
        var response_body;
        response_body = await mongo.findOneListingByKeyValue("route_mngt", "users", userId, "_id") //Needs custom DB call

        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    //Gets information to be used when displaying a review. User name and profile picture.
    //Maybe internally call the same search filter that getRoutePacketFromID does, and then just send a document with the first two values.
    getForumPacketFromID: async (req, res) => {
        const userId = req.query.userId;
        var response_body;
        response_body = await mongo.findOneListingByKeyValue("route_mngt", "users", userId, "_id") //Needs custom DB call

        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    //Send back the settings document in the users data
    getSettingsFromID: async (req, res) => {
        const userId = req.query.userId;
        var response_body;
        response_body = await mongo.findOneListingByKeyValue("route_mngt", "users", userId, "_id") //Needs custom DB call

        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    }
}