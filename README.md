# HOLDUP
Bryan Caskey, Ian Timchak, Justin Wendelboe
12/15/2024

## Server and Docker

- If you are running this on a local machine (undockerized), change the hostname in server.js to be 127.0.0.1.
- If you are composing a docker container (and running locally, not hosting the application), change the hostname in server.js to be 0.0.0.0.

## Dependencies

- run `npm install` in the project root to install dependencies.

## Project Structure

### public/

**favicon/**: Contains icons, graphics, and other miscelaneous files related to the front-end of the application.

**images/**: Contains images used by the front-end of the application.

**js/**: Contains various scripts used by the html files in the front-end.

**views/**: Contains `styles.css` and all of the html files used by the application.

### src/

**controllers/**: Contains javascripts files that handle the implementation of the services in this project.

**models/**: Contains `auth.js`, `mongo.js`, and `shemas.js`.

- `auth.js` defines all of the functions related to user Authentication and Authorization.
- `mongo.js` defines all functions that pass data to and from our MongoDB database.
- `schemas.js` defines the structure of all the data being held in our database.

**routes/**: Contains the files responsible for routing requests to access their corresponsiding services.

**.env**: Contains the MongoDB connection string and the JWT secret.

**server.js**: Defines the server startup and Express setup.

## Elevated user login information

**Owner: bryan**
- username: bryan
- password: Valid!123
- *Can also be found in an pre-request script in postman for `login`.
  You can comment and uncomment it to easily sign into the owner level user.*

**Admin: admin**
- username: admin
- password: Valid!123

**Setter: AmandaC**
- username: AmandaC
- password: Valid!123

**Member: Mikey**
- username: Mikey
- password: Valid!123

**Visitor: Andrew**
- username: Andrew
- password: Valid!123

## Postman scripts

We included a variety of post response scripts in our Postman collection to make running through
the test scripts simpler and easier.

- **signup**: Sets the environment variables for `username`, `email`, and `password` to the values
provided in the signup form.
- **login**: Sets the `JWTtoken` environment variable to the token obtained in the response.
- **getUserIdFromUserName**: Sets the `userID` environment variable to the `_id` obtained in the response.
- **getUserIdFromEmail**: Sets the `userID` environment variable to the `_id` obtained in the response.
- **grabPayload**: Sets the `userID` and `role` environment variable to those obtained in the response.
- **getAnnouncementList**: Sets the `announcementID` env var to the `_id` of the last entry in the response.
- **getReviewsOnRoute**: Sets the `reviewID` env var to the `_id` of the last entry in the response.
- **archiveRoute & unarchiveRote**: Sets the `isArchived` env var accordingly.
- **getLiveRoutes & getArchivedRoues**: Sets the `routeID` env var to the `_id` of the last entry in the response
  & sets `isArchived` accordingly.


