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
    gyms: {
        type: [String],
        default: []
    },
    settings: {
        profile_picture: {
            type: String,
            default: "apple-touch-icon.png",
            alias: 'pfp'
        },
        notifications: { // Might be better to create a separate schema
            activities: {// if we start adding more settings.
                type: Boolean,
                default: true
            },
            announcements: {
                type: Boolean,
                default: true
            }
        },
        theme: {
            type: String,
            enum: {
                values: ["light", "dark"],
                message: `{VALUE} is not supported`
            },
            default: "light"
        },
        accessibility: {
            high_contrast: {
                type: Boolean,
                default: false
            },
            large_text: {
                type: Boolean,
                default: false
            }
        },
        language: {
            type: String,
            default: "en"
        }
    }
});

const reviewSchema = new mongoose.Schema({
    Title: String,
    Body: String,
    RouteId: Number,
    Author: String,
    CreationDate: {
        type: Date,
        default: Date.now
    },
    Rating: Number,
    Verbose: Boolean,
    Media: {
        type: Map,
        of: []
    }
});

const routeSchema = new mongoose.Schema({
    Name: String,
    Authors: {
        type: [String],
        default: []
    },
    CreationDate: {
        type: Date,
        default: Date.now
    },
    Description: String,
    Grade: Number,
    Location: {
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        }
    },
    Type: Number,
    Visibility: Boolean
});

const announcementSchema = new mongoose.Schema({
    Title: String,
    Author: String,
    Body: String,
    CreationDate: {
        type: Date,
        default: Date.now
    },
    ExpirationDate: Date,
    ForumLink: String
});

module.exports = {
    accounts: accountSchema,
    announcements: announcementSchema,
    archived_routes: routeSchema,
    live_routes: routeSchema,
    reviews: reviewSchema,
    users: userSchema
};