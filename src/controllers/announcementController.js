const mongo = require('../models/mongo');
const auth = require('../models/auth');

module.exports = {
    // POST Methods
    createAnnouncement: async (req, res) => {
        
        //auth
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        //Body
        const { title, body } = req.body;
        console.log(`${title}, ${body}`);

        //Create a document with the required fields
        const docu = {
            Title: title,
            Body: body,
            Author: userID,
        }

        //Check the role of the requester
        if (role <= 2) {
            try {
                const newID = await mongo.createListing("route_mngt", "announcements", docu);
                console.log(`Created announcement with ID: ${newID}`);
                res.status(201).json({ message: "Post created successfully" });
            } catch (err) {
                res.status(500).json({ error: "Registration failed" });
            }
        } else {
            res.status(403).json({ error: "Insufficient Permissions" });
        }
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