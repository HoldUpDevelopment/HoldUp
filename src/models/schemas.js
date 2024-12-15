const mongoose = require('mongoose');

// accountSchema deprecated. Used for test database only.
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
        type: String,
        match: /^(?=[a-zA-Z0-9._-]{4,20}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/,
        unique: true,
        message: `{VALUE} is an invalid username`
    },
    email: {
        type: String,
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/,
        unique: true,
        message: `{VALUE} is not in a valid email format` 
    },
    password: String,
    displayname: {
        type: String,
        default: ""
    },
    fullname: {
        type: String,
        default: ""
    },
    gyms: {
        type: Map,
        of: Number,
        /*
         * Roles:
         * 0 = owner
         * 1 = admin
         * 2 = setter
         * 3 = member
         * 4 = visitor
        */
        min: 0,
        max: 4,
        default: [],
        message: `{VALUE} is not within range for user roles.` 
    },
    settings: {
        profile_picture: {
            type: String,
            default: "",
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
}, {
    collation: {locale: 'en', strength: 2}
});

const reviewSchema = new mongoose.Schema({
    Title: {
        type: String,
        default: ""
    },
    Body: {
        type: String,
        default: ""
    },
    RouteId: {
        type: String,
        default: ""
    },
    Author: {
        type: String,
        default: ""
    },
    CreationDate: {
        type: Date,
        default: Date.now
    },
    Rating: {
        type: Number,
        default: 5
    },
    Verbose: {
        type: Boolean,
        default: false
    },
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
    Description: {
        type: String,
        default: "",
        maxLength: 200
    },
    Grade: {
        type: Number,
        letter: String,
        default: 0
    },
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
    Type: {
        type: Number, // 0 means boulder, 1 means sport
        default: 0
    },
    Visibility: {
        type: Boolean,
        default: true
    },
    Reviews: {
        type: [String],
        default: []
    }
});

const announcementSchema = new mongoose.Schema({
    Title: {
        type: String,
        default: ""
    },
    Author: {
        type: String,
        default: ""
    },
    Body: {
        type: String,
        default: ""
    },
    CreationDate: {
        type: Date,
        default: Date.now
    },
    ExpirationDate: {
        type: Date,
        default: "",
    },
    ForumLink: {
        type: String,
        default: ""
    }
});

//currently stored in the "holdup_gyms" db
const gymSchema = new mongoose.Schema({
    Name: {
        type: String,
        default: ""
    },
    Admins: {
        type: [String],
        default: []
    },
    Routes: {
        type: [String],
        default: []
    },
    A: {
        type: [String],
        default: [],
        alias: "Announcements"
    }
});

module.exports = {
    accounts: accountSchema,
    announcements: announcementSchema,
    archived_routes: routeSchema,
    live_routes: routeSchema,
    reviews: reviewSchema,
    users: userSchema,
    gyms: gymSchema
};