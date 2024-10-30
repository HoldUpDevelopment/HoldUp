const {MongoClient, Collection} = require('mongodb');
const mongoose = require('mongoose');
var client;
var Admin = mongoose.mongo.Admin;

// Importing Schemas
const accountSchema = require('src/models/accountSchema');
const Account = mongoose.model('Account', accountSchema);

startConnection().catch(err => console.log(err));

async function startConnection(){
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

async function listDatabases(){
    /*
    Mongoose doesn't seem to have any methods for directly getting the Databases list from the connection, so I 
    am using "Mongoose.mongo.admin" to use a list databases function I found here. It should work the same as before.
        - Bryan
    */

    new Admin(mongoose.db).listDatabases(function(err, result) {
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
async function createListing(dbName, collection, newListing){
    console.log(newListing);

    switch(collection) {
        case "accounts":
            const doc = new Account(newListing);
            await doc.save();
            console.log('New listing created: ' + doc);
        default:
            console.log('Collection not recognized in src/models/mongo.js');
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
    const result = await client.db(dbName).collection(collection).findOne({ username: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        return (result._id)
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
        return (undefined)
    }
}

async function updateListingByKey(dbName, collection, listingKey, updatedListing) {
    const result = await client.db("route_mngt").collection("users")
                        .updateOne({ Name: nameOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function deleteListingByKey(dbName, collection, listingKey) {
    const result = await client.db("route_mngt").collection("users")
            .deleteOne({ Name: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function closeConnection() {
    console.log(`Closing Connection to ${client}`);
    await client.close();
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