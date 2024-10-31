const {MongoClient, Collection, ObjectId} = require('mongodb');
const mongoose = require('mongoose');
var client;
var Admin = mongoose.mongo.Admin;

// Importing Schemas
const accountSchema = require('../models/accountSchema');

startConnection().catch(err => console.log(err));

async function startConnection() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://ian:TTN6oSvbr3Aj36io@holdupcluster0.cn20z.mongodb.net/?retryWrites=true&w=majority&appName=HoldUpCluster0";

    await mongoose.connect(uri);
    /*
    try {
        client = new MongoClient(uri);
        await client.connect();
        console.log(`Connected to ${uri}`);

        //Output databases
        listDatabases();
    } catch (e) {
        console.error(e);
    }
    */
}

async function listDatabases() {
    /*
    Mongoose doesn't seem to have any methods for directly getting the Databases list from the connection, so I 
    am using "Mongoose.mongo.admin" to use a list databases function I found here. It should work the same as before.
        - Bryan
    */

    new Admin(mongoose.db).listDatabases(function (err, result) {
        console.log('listDatabases succeeded');
        // database list stored in result.databases
        var databasesList = result.databases;
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    });
    /*
    databasesList = await client.db().admin().listDatabases();
    */
};


//Post 
async function createListing(dbName, collection, newListing) {
    /*
    The way this i sset up is that th eswitch statement switches on the name of the collection
    provided. If it is a valid collection, it attempts to create a document in that collection.
    If not, it uses the switch default and outputs that the collection name is incorrect.
    Currently I am unsure if this is handling errors correctly, but it does create documents.
        - Bryan
    */
    console.log(newListing);
    mongoose.connection.dbName = dbName; // Sets the database used by the mongoose connection

    switch (collection) {
        case "accounts":
            const Account = mongoose.model('Account', accountSchema.accountSchema);
            const doc = new Account(newListing);
            await doc.save();
            console.log('New listing created: ', doc);
            return doc._id;
        default:
            console.log('Collection not recognized in src/models/mongo.js');
            return false;
    }


    /*
    console.log(newListing);
    try{
        const result = await client.db(dbName).collection(collection).insertOne(newListing);
        console.log(`New listing created with the following id: ${result.insertedId}`);

        return result.insertedId;
    }catch (e){
        console.error(e);
        return false;
    }
    */
}

async function findOneListingByKeyValue(dbName, collection, nameOfListing) {
    mongoose.connection.dbName = dbName;

    switch (collection) {
        case "accounts":
            const Account = mongoose.model('Account', accountSchema.accountSchema);
            Account.findById(nameOfListing, function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Found document matching key: ", nameOfListing);
                    return doc;
                }
            });
    }

    /*
    const result = await client.db(dbName).collection(collection).findOne({ username: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        return (result)
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
        return (undefined)
    }
    */
}


/*
async function updateListingByKey(dbName, collection, listingKey, updatedListing, doUpsert) {
    const result = await client.db(dbName).collection(collection)
                        .updateOne({ _id: new ObjectId(listingKey) }, { $set: updatedListing }, {upsert: doUpsert});
    

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
    if (result.matchedCount != 0 && result.modifiedCount != 0){
        return true;
    }else{
        return false;
    }
}



async function deleteListingByKey(dbName, collection, listingKey) {
    const result = await client.db(dbName).collection(collection)
            .deleteOne({ _id: new ObjectId(listingKey) });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
    if (result.deletedCount == 0) {
        return false;
    } else {
        return true;
    }
*/

async function updateListingByKey(dbName, collection, listingKey, updatedListing, doUpsert) {
    mongoose.connection.dbName = dbName;

    switch (collection) {
        case "accounts":
            const Account = mongoose.model('Account', accountSchema.accountSchema);
            Account.findById(nameOfListing, function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Found document matching key: ", nameOfListing);
                    return doc;
                }
            });
    }
    
    /*
    const result = await client.db("route_mngt").collection("users")
        .updateOne({
            Name: nameOfListing
        }, {
            $set: updatedListing
        });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
    */
}

async function deleteListingByKey(dbName, collection, listingKey) {
    mongoose.connection.dbName = dbName;

    switch (collection) {
        case "accounts":
            const Account = mongoose.model('Account', accountSchema.accountSchema);
            Account.findById(nameOfListing, function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Found document matching key: ", nameOfListing);
                    return doc;
                }
            });

    }

    /*
    const result = await client.db("route_mngt").collection("users")
            .deleteOne({ Name: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
    */

}

async function closeConnection() {
    // Essentially the same as the standard mongo function.
    console.log(`Closing Connection to ${mongoose.connection}`);
    await mongoose.connection.close();
}

module.exports = {
    startConnection: startConnection,
    listDatabases: listDatabases,
    createListing: createListing,
    findOneListingByKeyValue: findOneListingByKeyValue,
    updateListingByKey: updateListingByKey,
    deleteListingByKey: deleteListingByKey,
    closeConnection: closeConnection
}