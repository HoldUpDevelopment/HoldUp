const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongo = require('../models/mongo');

const secret = process.env.JWT_SECRET;

//Generates a bcrypt hash representation of the given plaintext. Uses 10 salting rounds.
async function createHash(plaintext) {
    const salt = await bcrypt.genSalt();
    const hashedString = await bcrypt.hash(plaintext, salt);

    return hashedString;
}

//Compares a given plain text and hashed value
// * incoming: plaintext password
// * stored: saved hash in database
async function verifyPassword(incoming, stored) {
    return passwordMatched = await bcrypt.compare(incoming, stored);
}

//Performs a regex on a string, determining whether it is an email address or not.
function isEmail(string) {
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/.test(string);
}

//Generates a JWT and returns it.
//https://hasura.io/blog/best-practices-of-using-jwt-with-graphql
//Potential idea to look into
//https://www.reddit.com/r/node/comments/17conpk/comment/k5u4hfs/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
function signUser(userID) {
    const token = jwt.sign({ userID: userID }, secret, { expiresIn: '15m' });
    console.log(`Token generated for '${userID}'`);
    return token;
}

//Validates the given JWT information
/**
 * @name verifyToken
 * @param { jwt } token A JWT token with a complete header and payload
 * @returns { object } the success and data or an error if success is `false`
 */
function verifyToken(token) {
    // invalid token - synchronous
    try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
    } catch (err) {
        // err
        return { success: false, error: err.message };
    }
}

//Authorization
/**
 * @name authorize
 * @param { HTTPRequest } req The request object of the given HTTP method
 * @param { HTTPResponse } res The response object of the given HTTP method
 * @returns { object } A JSON object containing the userID and userRole.
 * @description
 * `authorize` validates the jwt token passed in the Authorization header of the given http request.
 * Use this authorization when needing to use userId to perform actions in the request controller
 * 
 * Example:
    `js const { userID } = auth.authorize(req, res);
    if (!userID) return;`
 */
function authorizeRequest(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        res.end();
        return false
    }

    const result = verifyToken(token);
    if (!result.success) {
        res.status(403).json({ error: result.error });
        res.end();
        return false
    }

    return result.data;
}

async function retrieveUserID(req, res) {
    const { userID } = authorizeRequest(req, res);
    if (!userID) return;

    var response_body;
    response_body = {_id: userID}

    json_message = JSON.stringify(response_body);

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(response_body));
    res.end();
}


/**
 * Provides functionality for both Authentification and Authorization.
 */
module.exports = {
    createHash: createHash,
    verifyPassword: verifyPassword,
    isEmail: isEmail,
    signUser: signUser,
    authorize: authorizeRequest,
    retrieveUserID: retrieveUserID,
}