const { MongoClient, Collection } = require("mongodb");
const mongoose = require("mongoose");
var client;
var Admin = mongoose.mongo.Admin;

// Importing Schemas
const Schemas = require("./schemas");

async function startConnection() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri =
    "mongodb+srv://ian:TTN6oSvbr3Aj36io@holdupcluster0.cn20z.mongodb.net/?retryWrites=true&w=majority&appName=HoldUpCluster0";
  try {
    await mongoose.connect(uri);
    //return true;
  } catch {
    //return false;
  }
}

async function listDatabases() {
  /*
    Mongoose doesn't seem to have any methods for directly getting the Databases list from the connection, so I 
    am using "Mongoose.mongo.admin" to use a list databases function I found here. It should work the same as before.
        - Bryan
    */
  // returns a list of databases (should be {gyms, test, route_mngt})

  new Admin(mongoose.db).listDatabases(function (err, result) {
    console.log("listDatabases succeeded");
    // database list stored in result.databases
    var databasesList = result.databases;
    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  });
}

//Post
async function createListing(dbName, collection, newListing) {
  /*
    The way this i sset up is that th eswitch statement switches on the name of the collection
    provided. If it is a valid collection, it attempts to create a document in that collection.
    If not, it uses the switch default and outputs that the collection name is incorrect.
    Currently I am unsure if this is handling errors correctly, but it does create documents.
        - Bryan
    */
  // Parameters:
  //  dbName -> name of database (string)
  //  collection -> name of database collection (string)
  //  newListing -> JSON document of the new database listing
  console.log(newListing);
  mongoose.connection.dbName = dbName;

  try {
    const Model = mongoose.model(collection, Schemas[collection]);
    var doc = new Model(newListing);
    doc.save();
    console.log("Created Listing with _id: ", doc._id);
    return doc;
  } catch {
    console.log("Could not create document");
    return false;
  }
}

async function findOneListingByKeyValue(dbName, collection, listingKey) {
  // returns document if it was found, if not returns false.
  // Parameters:
  //  dbName -> name of database (string)
  //  collection -> name of database collection (string)
  //  listingKey -> ObjectId of listing (can be String, Number, or Object)
  mongoose.connection.dbName = dbName;

  const Model = mongoose.model(collection, Schemas[collection]);
  Model.findById(listingKey, function (err, doc) {
    if (err) {
      console.log(err);
      return false;
    } else {
      console.log("Found document matching key: ", listingKey);
      return doc;
    }
  });
}

async function updateListingByKey(
  dbName,
  collection,
  listingKey,
  updatedListing,
  doUpsert = false
) {
  // returns updated document if successful; returns false if unsuccessful.
  // Parameters:
  //  dbName -> name of database (string)
  //  collection -> name of database collection (string)
  //  listingKey -> ObjectId of listing (can be String, Number, or Object)
  //  updatedListing -> JSON document to update listing with
  //  doUpsert -> If true, will create the document if it is not found. Default is false.
  mongoose.connection.dbName = dbName;

  const Model = mongoose.model(collection, Schemas[collection]);
  Model.findByIdandUpdate(
    listingKey,
    updatedListing,
    (options.upsert = doUpsert),
    function (err, doc) {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log("Updated document matching key: ", listingKey);
        return doc;
      }
    }
  );
}

async function deleteListingByKey(dbName, collection, listingKey) {
  // Returns true if listing is deleted, false if error occurred.
  // Parameters:
  //  dbName -> name of database (string)
  //  collection -> name of database collection (string)
  //  listingKey -> ObjectId of listing (can be String, Number, or Object)
  mongoose.connection.dbName = dbName;

  const Model = mongoose.model(collection, Schemas[collection]);
  Model.findByIdandDelete(listingKey, function (err, doc) {
    if (err) {
      console.log(err);
      return false;
    } else {
      console.log("Deleted document matching key: ", listingKey);
      return true;
    }
  });
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
  closeConnection: closeConnection,
};
