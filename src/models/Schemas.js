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

const userSchema = new mongoose.Schema({
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

const reviewSchema = new mongoose.Schema({
    Title: String,
    Body: String,
    RouteId: Number,
    Author: String,
    CreationDate: Date,
    Rating: Number,
    Verbose: Boolean,
    Media: {
        type: Map,
        of: Mixed
    }
});

const liveRouteSchema = new mongoose.Schema({
    Name: String,
    Authors: {
        type: Map,
        of: String
    },
    CreationDate: Date,
    Description: String,
    Grade: Number,
    Location: {
        type: Map,
        of: String
    },
    Type: Number,
    Visibility: Boolean
});

const archiveRouteSchema = new mongoose.Schema({
    Name: String,
    Authors: {
        type: Map,
        of: String
    },
    CreationDate: Date,
    Description: String,
    Grade: Number,
    Location: {
        type: Map,
        of: String
    },
    Type: Number,
    Visibility: Boolean
});

const announcementSchema = new mongoose.Schema({
    Title: String,
    Author: String,
    Body: String,
    CreationDate: Date,
    ExpirationDate: Date,
    ForumLink: String
});

module.exports = {
    accounts: accountSchema,
    announcements: announcementSchema,
    archived_routes: archiveRouteSchema,
    live_routes: liveRouteSchema,
    reviews: reviewSchema,
    users: userSchema
};