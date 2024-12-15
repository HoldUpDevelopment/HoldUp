//const { ObjectId } = require('mongodb');
const mongo = require("../models/mongo");
const auth = require("../models/auth");
const gym = "ascend";
module.exports = {
  // POST Methods
  createAccount: (req, res) => {
    //deprecated
    var reqBody = "";

    req.on("data", function (chunk) {
      // reading the request into a var.
      reqBody += chunk.toString();
    });

    req.on("end", async () => {
      reqBody = JSON.parse(reqBody); // converting the request into a JSON object
      response_body = {};
      var confirmation_id = await mongo.createListing(
        "route_mngt",
        "users",
        reqBody
      );
      if (confirmation_id == false) {
        response_body = {
          isValid: false,
          _id: 403,
        };
        json_message = JSON.stringify(response_body);

        res.writeHead(403, {
          // Writing Response
          "Content-Type": "application/json",
        });
        res.write(JSON.stringify(response_body));
        res.end();
      } else {
        response_body = {
          isValid: true,
          _id: confirmation_id,
        };
        json_message = JSON.stringify(response_body);

        res.writeHead(202, {
          // Writing Response
          "Content-Type": "application/json",
        });
        res.write(JSON.stringify(response_body));
        res.end();
      }
    });
  },
  signup: async (req, res) => {
    //signup form submission
    //Body
    const { email, username, password } = req.body;
    console.log(`${email}, ${username}, ${password}`);

    //Secure the password for the database
    hashed = await auth.createHash(password);

    //Create a document with the required fields: email, username, password
    const docu = {
      email: email,
      username: username,
      password: hashed,
      gyms: {
        [gym]: 4,
      },
    };

    //Attempt to create a user
    try {
      const newID = await mongo.createListing("route_mngt", "users", docu);
      console.log(`Created user with ID: ${newID}`);
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: "Registration failed" });
    }
  },
  login: async (req, res) => {
    console.log("Received");
    const { userIdentifier, password } = req.body;

    //Retrieve user data
    const userObject = await mongo.findOneListingByKeyValue(
      "route_mngt",
      "users",
      userIdentifier,
      auth.isEmail(userIdentifier) ? "email" : "username"
    );
    try {
      var isCorrect;
      if (userObject != {}) {
        isCorrect = await auth.verifyPassword(password, userObject["password"]);
      } else {
        console.log(userObject);
        throw new Error(); //User not found
      }

      if (isCorrect) {
        console.log("Password and internal hash are validated!");
        //JWT
        const token = auth.signUser(userObject._id, userObject.gyms.get(gym));

        res.status(201).json({ message: "Login successful", token: token });
      } else {
        console.log("Password and internal hash are not validated!");
        res.status(401).json({ error: "Authentification failed" });
      }
    } catch (err) {
      console.log(err);
      console.log(
        `User with identifer '${userIdentifier}' not found in database.`
      );
      res.status(401).json({ error: "Authentification failed" });
    }
  },

  // PUT Methods
  editAccountDetails: async (req, res) => {
    const { userID } = auth.authorize(req, res); //user Authentification; retrieve userID
    if (!userID) return;

    response_body = {};
    await mongo.updateListingByKey("route_mngt", "users", userID, req.body);

    json_message = JSON.stringify(response_body);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.write(JSON.stringify(response_body));
    res.end();
  },

  // PUT Methods
  editUserRole: async (req, res) => {
    const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
    if (!userID) return;
    console.log(req.body);
    const { gymName, targetId, newRole } = req.body;

    try {
      var targetRole = await mongo.getRoleFromUserID(targetId);
      targetRole = targetRole["gyms"][gym];

      if (role < targetRole && role <= 1) {
        update = {
          gyms: {
            [gymName]: newRole,
          },
        };
        await mongo.updateListingByKey("route_mngt", "users", targetId, update);

        res.status(202).json({ message: "Role successfully changed" });

      } else {
        res.status(403).json({ message: "Insufficient Permissions" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Role Change Failure" });
    }
  },

  // DELETE Methods
  deleteAccount: async (req, res) => {
    const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
    if (!userID) return;

    const userId = req.query.userId;
    if (role <= 1 || userId == userID) {
      await mongo.deleteListingByKey("route_mngt", "users", userId);
      console.log(userId);
      res.status(201).json({ message: "User Successfuly Deleted" });
    } else {
      res.status(403).json({ message: "Access Denied" });
    }
  },

  // GET Methods

  //Perhaps more realistically, get list of users from username search. May need reworked
  getUserIdFromUserName: async (req, res) => {
    const userName = req.query.userName;
    var response_body = {};
    response_body["_id"] = await mongo.getIdByKeyValue(
      "route_mngt",
      "users",
      userName,
      "username"
    );

    json_message = JSON.stringify(response_body);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.write(JSON.stringify(response_body));
    res.end();
  },
  //getUserIdFromUserName but for Email
  getUserIdFromEmail: async (req, res) => {
    const email = req.query.email;
    var response_body = {};
    response_body["_id"] = await mongo.getIdByKeyValue(
      "route_mngt",
      "users",
      email,
      "email"
    );

    json_message = JSON.stringify(response_body);
    console.log(json_message);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.write(JSON.stringify(response_body));
    res.end();
  },
  //Gets the role of the active user (from their JWT token)
  getActiveUserRole: async (req, res) => {
    const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
    if (!userID) return;

    //Returns the role from the JWT, found above with auth.authorize(..)
    console.log(userID);
    console.log(role);
    res.status(200).json({ role: role });
  },
  //Gets information to be used when displaying a review. User name, profile picture, and display name.
  getRoutePacketFromID: async (req, res) => {
    const userId = req.query.userId;
    var response_body;
    response_body = await mongo.getRoutePacketFromUserId(userId);
    if (response_body == 404) {
      json_message = JSON.stringify(response_body);

      res.writeHead(404, {
        "Content-Type": "text",
      });
      res.write(`User with id \'${userId}\' was not found`);
      res.end();
    } else {
      json_message = JSON.stringify(response_body);

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.write(JSON.stringify(response_body));
      res.end();
    }
  },
  //Gets information to be used when displaying a review. User name and profile picture.
  //Maybe internally call the same search filter that getRoutePacketFromID does, and then just send a document with the first two values.
  getForumPacketFromID: async (req, res) => {
    const userId = req.query.userId;
    var response_body;
    response_body = await mongo.getForumPacketFromUserId(userId); //Needs custom DB call

    json_message = JSON.stringify(response_body);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.write(JSON.stringify(response_body));
    res.end();
  },
  //Send back the settings document in the users data
  getUserSettings: async (req, res) => {
    const { userID } = auth.authorize(req, res); //user Authentification; retrieve userID
    if (!userID) return;

    var response_body;
    console.log(userID);
    response_body = await mongo.getUserSettingsById(userID); //Needs custom DB call

    json_message = JSON.stringify(response_body);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.write(JSON.stringify(response_body));
    res.end();
  },
  //Gets email for the given id
  getEmailFromID: async (req, res) => {
    const userId = req.query.userId;
    var response_body = {};
    response_body = await mongo.getEmailByUserId(userId);

    json_message = JSON.stringify(response_body);
    console.log(json_message);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.write(JSON.stringify(response_body));
    res.end();
  },
  getUsers: async (req, res) => {
    const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
    if (!userID) return;
    if (role <= 1) {
      var response_body = await mongo.getListOfIDs("route_mngt", "users");
      res.status(200).json({ message: "Successful", users: response_body });
    } else {
      res.status(403).json({ message: "bruh you cannot rn" });
    }
  },
};
