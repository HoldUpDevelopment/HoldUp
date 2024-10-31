const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    username: {
        type: String
    },
    displayname: String,
    fullname: String,
    email: String,
    password: String,
    settings: {
        type: Map,
        of: String
    }
});

module.exports = {
    accountSchema: accountSchema
};