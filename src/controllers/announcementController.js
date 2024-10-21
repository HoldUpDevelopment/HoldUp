module.exports = {
    // POST Methods
    createAnnouncement: (req, res) => {
        var reqBody;

        req.on('data', function(chunk) { // reading the request into a var.
            reqBody += chunk;
        });

        req.on('end', async () => {

            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            
            response_body = { // Creating Response and converting it to JSON string object.
                username: "test-username",
                profile_picture: "pfp.png"
            };
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
        var reqBody;

        req.on('data', function(chunk) { // reading the request into a var.
            reqBody += chunk;
        });

        req.on('end', async () => {

            reqBody = JSON.parse(reqBody); // converting the request into a JSON object
            
            response_body = { // Creating Response and converting it to JSON string object.
                username: "test-username",
                profile_picture: "pfp.png"
            };
            json_message = JSON.stringify(response_body);

            res.writeHead(200, { // Writing Response
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(response_body));
            res.end();
        });
    },

    // DELETE Methods
    deleteAnnouncement: (req, res) => {
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
    getAnnouncementDetails: (req, res) => {
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