module.exports = {
    // POST Methods
    createAccount: (req, res) => {

        var reqBody;

        req.on('data', function (chunk) { // reading the request into a var.
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
    editAccountDetails: (req, res) => {
        var reqBody;

        req.on('data', function (chunk) { // reading the request into a var.
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
    deleteAccount: (req, res) => {
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
    },

    // GET Methods
    getUserIdFromUserName: (req, res) => {
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