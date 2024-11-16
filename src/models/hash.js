const bcrypt = require('bcrypt');

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

module.exports = {
    createHash: createHash,
    verifyPassword: verifyPassword
}