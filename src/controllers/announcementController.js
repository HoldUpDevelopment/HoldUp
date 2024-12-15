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
    editAnnouncement: async (req, res) => {
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        //data
        const { title, author, body, creationDate, targetId } = req.body;

        const update = {
            Title: title,
            Author: author,
            Body: body,
            CreationDate: creationDate
        }

        if (role <= 2) {
            try {
                console.log(targetId);
                console.log(update);
                await mongo.updateListingByKey("route_mngt", "announcements", targetId, update);

                res.status(202).json({ message: "Post successfully editted" });
            } catch (err) {
                console.log(err)
                res.status(500).json({ error: "Editting process failed" });
            }
        } else {
            res.status(403).json({ message: "Insufficient Permissions" });
        }
    },

    // DELETE Methods
    deleteAnnouncement: async (req, res) => {
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        const announcementId = req.query.announcementId;
        if (role <= 1) {
            await mongo.deleteListingByKey("route_mngt", "announcements", announcementId);
            console.log(announcementId);
            res.status(201).json({ message: "Post Successfuly Deleted" });
        } else {
            res.status(403).json({ message: "Access Denied" })
        }
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
    getAnnouncementList: async (req, res) => {
        var response_body = await mongo.getListOfIDs("route_mngt", "announcements");
        res.status(200).json({ message: "Successful", posts: response_body });
    }
}