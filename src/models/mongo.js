const {MongoClient, Collection, ObjectId} = require('mongodb');
var client;

async function startConnection(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://ian:TTN6oSvbr3Aj36io@holdupcluster0.cn20z.mongodb.net/?retryWrites=true&w=majority&appName=HoldUpCluster0";

    try {
        client = new MongoClient(uri);
        await client.connect();
        console.log(`Connected to ${uri}`);

        //Output databases
        listDatabases();
    } catch (e) {
        console.error(e);
    }
}

async function listDatabases(){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


//Post 
async function createListing(dbName, collection, newListing){
    console.log(newListing);
    try{
        const result = await client.db(dbName).collection(collection).insertOne(newListing);
        console.log(`New listing created with the following id: ${result.insertedId}`);

        return result.insertedId;
    }catch (e){
        console.error(e);
        return false;
    }
    
}

async function findOneListingByKeyValue(dbName, collection, listingKey) {
    const result = await client.db(dbName).collection(collection).findOne({_id: new ObjectId(listingKey)});

    if (result) {
        console.log(`Found a listing in the collection with the id '${listingKey}':`);
        return (result)
    } else {
        console.log(`No listings found with the id '${listingKey}'`);
        return (undefined)
    }
}

/*
async function updateListingByGivenKey(dbName, collection, nameOfListing, updatedListing, key) {
    if (key == "_id"){
        nameOfListing = new ObjectId(nameOfListing);
    }
    const result = await client.db(dbName).collection(collection)
                        .updateOne({ [key]: nameOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
    if (result.matchedCount != 0 && result.modifiedCount != 0){
        return true;
    }else{
        return false;
    }
}
*/

async function updateListingByKey(dbName, collection, listingKey, updatedListing) {
    const result = await client.db(dbName).collection(collection)
                        .updateOne({_id: new ObjectId(listingKey)}, { $set: updatedListing });

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