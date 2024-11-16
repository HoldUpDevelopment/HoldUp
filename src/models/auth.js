const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

function isEmail(string) {
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/.test(string);
}

function signUser(userID) {
    const token = jwt.sign();
}

module.exports = {
    createHash: createHash,
    verifyPassword: verifyPassword,
    isEmail: isEmail,
}