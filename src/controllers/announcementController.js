const mongo = require('../models/mongo');

module.exports = {
    // POST Methods
    createAnnouncement: (req, res) => {
        var reqBody = '';

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            response_body = {};
            var confirmation_id = await mongo.createListing("route_mngt", "announcements", reqBody);
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
    editAnnouncement: (req, res) => {
        var reqBody = '';
        const query = req.query.announcementId

        req.on('data', function (chunk) { // reading the request into a var.
            reqBody += chunk.toString();
        });

        req.on('end', async () => {
            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            response_body = {};
            var confirmation = await mongo.updateListingByKey("route_mngt", "announcements",query, reqBody);
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
    deleteAnnouncement: async (req, res) => {
        const query = req.query.announcementId

        response_body = {};
        var confirmation = await mongo.deleteListingByKey("route_mngt", "announcements", query);
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
    },

    // GET Methods
    getAnnouncementDetails: async (req, res) => {
        const announcementId = req.query.announcementId
        var response_body;
        response_body = await mongo.findOneListingByKeyValue("route_mngt", "announcements", announcementId, "_id") //Needs custom search field, get this implemented

        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    getAnnouncementList: async(req, res) => {
        var response_body = await mongo.getListOfIDs("route_mngt", "announcements");
        res.status(200).json({ message: "Successful", routes: response_body });
    }
}