const mongoose = require("mongoose");
var Admin = mongoose.mongo.Admin;

// Importing Schemas
const Schemas = require("./schemas");

// Model Dictionary
var Models = {};

Models["users"] = mongoose.model("users", Schemas.users);
Models["announcements"] = mongoose.model("announcements", Schemas.announcements);
Models["reviews"] = mongoose.model("reviews", Schemas.reviews);
Models["live_routes"] = mongoose.model("live_routes", Schemas.live_routes);
Models["archived_routes"] = mongoose.model("archived_routes", Schemas.archived_routes);
Models["accounts"] = mongoose.model("accounts", Schemas.accounts);

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// MONGO CONNECTION FUNCTIONS

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// Initializes connection to MongoDB through Mongoose.
/**
 * @description Initializes connection to mongoDB and initializes mongoose models.
 */
async function startConnection() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri =
    `mongodb+srv://${process.env.MONGO_SECRET}@holdupcluster0.cn20z.mongodb.net/?retryWrites=true&w=majority&appName=HoldUpCluster0`;
  try {
    await mongoose.connect(uri, {dbName: "route_mngt"});
    //listDatabases();
    //return true;
  } catch {
    //return false;
    console.log(`did not create database connections`);
  }
}


/**
 * @description Closes the connection to the mongoDB.
 */
async function closeConnection() {
  // Essentially the same as the standard mongo function.
  console.log(`Closing Connection to ${mongoose.connection}.`);
  await mongoose.connection.close();
}


// returns a list of databases (should be {gyms, test, route_mngt})
async function listDatabases() {
  new Admin(mongoose.connection.db).listDatabases(function (err, result) {
    console.log("listDatabases succeeded");
    // database list stored in result.databases
    var databasesList = result.databases;
    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  });
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// GENERALIZED CRUD OPERATIONS

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Creates and uploads the supplied document to the mongoDB 
 * @param {String} dbName name of database
 * @param {String} collection name of database collection
 * @param {JSON} newListing JSON document containing the new database listing
 * @returns The document's `_id`. If creation was unsucessful, returns an error message.
 */
async function createListing(dbName, collection, newListing) {
  console.log(newListing);
  mongoose.connection.useDb(dbName);

  try {
    const Model = Models[collection];
    console.log("hi");
    console.log(newListing);
    var doc = await new Model(newListing).save().then().catch(); //Catch key indexing errors in asynchronous calls.
    console.log(doc);
    console.log("Created Listing with _id: ", doc._id);
    return doc._id;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Updates a document in the mongoDB.
 * @param {String} dbName name of database
 * @param {String} collection name of database collection
 * @param {String|Number|ObjectId} listingKey the `_id` property of the listing being updated
 * @param {JSON} updatedListing A document containing the updated information
 * @param {Boolean} doUpsert If true, creates a listing with the specified information 
 * if no document was not found. The default is `false`.
 */
async function updateListingByKey(
  dbName,
  collection,
  listingKey,
  updatedListing,
  doUpsert = false
) {
  mongoose.connection.useDb(dbName);

  const Model = Models[collection];
  try {
    result = await Model.updateOne({_id: listingKey}, updatedListing, {upsert: doUpsert})
    console.log(`Updated ${result.modifiedCount} document(s).`);
    
  } catch (err) {
    console.log(err);
  }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * @descripton Deletes a document in the mongoDB.
 * @param {String} dbName name of database
 * @param {String} collection name of database collection
 * @param {String|Number|ObjectId} listingKey the `_id` property of the listing being deleted
 */
async function deleteListingByKey(dbName, collection, listingKey) {
  mongoose.connection.useDb(dbName);

  const Model = Models[collection];
  console.log("Entered")
  try {
    result = await Model.deleteOne({_id: listingKey})
    console.log(`Deleted ${result.deletedCount} document(s).`);
    
  } catch (err) {
    console.log(err);
  }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Searches for a document in the mongoDB by a specified key/value pair.
 * @param {String} dbName name of database
 * @param {String} collection name of database collection
 * @param {String} listingQuery the value of the listing you are serching
 * @param {String} listingKey name of key to search by
 * @returns A mongoose document. If unsucessful, returns an empty set.
 */
async function findOneListingByKeyValue(dbName, collection, listingQuery, listingKey) {
  mongoose.connection.useDb(dbName);

  const Model = Models[collection];
  

  try {
    result = await Model.findOne({[listingKey]: listingQuery})
    if (result == null) {
      console.log(`No document found with key matching ${listingQuery}`);
      return {};
    } else {
      console.log(`Found document with key matching ${listingQuery}`);
      return result;
    }
  } catch (err) {
    console.log(err);
    return {};
  }
}


/**
 * @description Searches for multiple document in the mongoDB matching the specified key/value pair.
 * @param {String} dbName name of database
 * @param {String} collection name of database collection
 * @param {String} listingQuery the value of the listing you are serching
 * @param {String} listingKey name of key to search by
 * @returns A set of mongoose document. If unsucessful, returns an empty set.
 */
async function findManyListingsByKeyValue(dbName, collection, listingQuery, listingKey) {
  mongoose.connection.useDb(dbName);

  const Model = Models[collection];
  try {
    result = await Model.findMany({[listingKey]: listingQuery})
    if (result == null) {
      console.log(`No documents found with key matching ${listingQuery}`);
      return {};
    } else {
      console.log(`Found ${result.length} documents with key matching ${listingQuery}`);
      return result;
    }
    } catch (err) {
      console.log(err);
      return {};
    }
}


/**
 * @description Searches the mongoDB for a document matching the provided key/value
 * pair, and returns its `_id`.
 * @param {String} dbName name of database
 * @param {String} collection name of database collection
 * @param {String} listingQuery value used to find document (EX: `fakeBryan`)
 * @param {String} listingKey key used with query value (EX: `username`)
 * @returns Returns a document's `_id` if it was found, if not returns `404`.
 */
async function getIdByKeyValue(dbName, collection, listingQuery, listingKey) {
  mongoose.connection.useDb(dbName);

  const Model = Models[collection];
  try {
    result = await Model.findOne({[listingKey]: listingQuery})
    if (result == null) {
      throw new mongoose.Error.DocumentNotFoundError(listingQuery);
    }
    console.log(`Found document with key matching ${listingQuery}`);
    return result._id;
  } catch (err) {
    console.log(err);
    return 404;
  }
}

/**
 * @description gets a complete list of the IDs of all documents in a collection
 * @param {String} dbName name of database
 * @param {String} collection name of database collection
 * @returns JSON object with the `_id` field of all documents in `collection`.
 * Returns an empty set if no documents were found.
 */
async function getListOfIDs(dbName, collection) {
  mongoose.connection.useDb(dbName);

  const Model = Models[collection];
  try {
    result = await Model.find({}, `_id`);
    if (result == null) {
      console.log(`No documents found in collection ${collection}`);
      return {};
    } else {
      console.log(`Found ${result.length} documents in collection ${collection}`);
      return result;
    }
    } catch (err) {
      console.log(err);
      return {};
    }
}


/**
 * @param {String} dbName name of database
 * @param {String} collection name of database collection
 * @param {String|Number|ObjectId} listingQuery the `_id` of the document you want to search
 * @param {String} searchKey the name of the key field you want to retrieve (EX: email)
 * @returns JSON object with the supplied listing's `searchKey`.
 * Returns `404` if no document matching `listingQuery` was not found.
 */
async function getFieldFromListingById(dbName, collection, listingQuery, searchKey) {
  mongoose.connection.useDb(dbName);

  const Model = Models[collection];
  try {
    result = await Model.findOne({_id: listingQuery}, searchKey);
    console.log(result);
    console.log(`Found document with id ${listingQuery}`);
    return(result);
  } catch (err) {
    console.log(err);
    return 404;
  }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// USER SPECIFIC FUNCTIONS

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Gets a User's username, displayname, and profile picture.
 * @param {String|Number|ObjectId} userId the `_id` property of the user being searched
 * @returns Returns a JSON with the specified user's `username`, `displayname`,
 * `pfp`, and `gyms: roles`.
 * If no matching user was found, returns `404`.
 */
async function getRoutePacketFromUserId(userId) {
  mongoose.connection.useDb('route-mngt');

  const Model = Models["users"];
  try {
    result = await Model.findById(userId, `displayname username gyms`).lean();
    //returnBody
    result["pfp"]="";
    
    console.log(`Found user with id ${userId}`);
    
    return result;
  } catch (err) {
    console.log(err);
    return 404;
  }
}


/**
 * @description Gets a User's username and profile picture.
 * @param {String|Number|ObjectId} userId the `_id` property of the user being searched
 * @returns Returns a JSON with the specified user's `username` and `pfp`.
 * If no matching user was found, returns `404`.
 */
async function getForumPacketFromUserId(userId) {
  mongoose.connection.useDb('route-mngt');

  const Model = Models["users"];
  try {
    result = await Model.findById(userId, `username`).lean();
    //returnBody
    result["pfp"]="";
    
    console.log(`Found user with id ${userId}`);

    return result;
  } catch (err) {
    console.log(err);
    return 404;
  }
}


/**
 * @description Searches the mongoDB for a user's settings.
 * @param {String|Number|ObjectId} userId the `_id` property of the user being searched
 * @returns {Object} Returns a user's `settings` given their `_id`. 
 * Returns `404` if the user was not found
 */
async function getUserSettingsById(userId) {
  mongoose.connection.useDb('route-mngt');

  const Model = Models["users"];
  try {
    result = await Model.findById(userId, 'settings');
    if (result == null) {
      throw new mongoose.Error.DocumentNotFoundError(userId);
    }
    console.log(`Found user with id ${userId}`);
    return result;
  } catch (err) {
    console.log(err);
    return 404;
  }
}

/**
 * @description Searches the mongoDB for a user and returns its `email`.
 * @param {String|Number|ObjectId} userId the `_id` property of the user being searched
 * @returns Returns a user's `email` if it was found, if not returns `404`.
 */
async function getEmailByUserId(userId) {
  mongoose.connection.useDb('route-mngt');

  const Model = Models["users"];
  try {
    result = await Model.findById(userId, 'email');
    if (result == null) {
      throw new mongoose.Error.DocumentNotFoundError(userId);
    }
    console.log(`Found user with id ${userId}`);
    return result;
  } catch (err) {
    console.log(err);
    return 404;
  }
}


/**
 * @description Gets a User's role from their ID.
 * @param {String|Number|ObjectId} userId the `_id` property of the user being searched
 * @returns Returns a JSON with the specified user's `gyms` and their matching roles.
 * If no matching user was found, returns `404`.
 */
async function getRoleFromUserID(userId) {
  mongoose.connection.useDb('route-mngt');

  const Model = Models["users"];
  try {
    result = await Model.findById(userId, `gyms`).lean();
    //returnBody
    
    console.log(`Found user with id ${userId}`);
    return result;
  } catch (err) {
    console.log(err);
    return 404;
  }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// ROUTE SPECIFIC FUNCTIONS

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {String} routeId The `_id` of the route you are searching for.
 * @param {Boolean} isArchived Specifies whether or not the route is live or archived.
 * Default is `false`.
 * @returns Mongoose document containing the route's `Name`, `CreationDate`, `Grade`,
 * and `Type`.
 */
async function getRouteInfo(
  routeId, isArchived = false
) {
  mongoose.connection.useDb("route-mngt");
  var Model;
  if (isArchived) {
    Model = Models["archived_routes"];
  } else {
    Model = Models["live_routes"];
  }
  try {
    result = await Model.findOne({_id: routeId}, `Name CreationDate Grade Type`)
    console.log("Found Document");
    return result;
  } catch (err) {
    console.log(err);
  }
}

/**
 * 
 * @param {String} dbName name of database
 * @param {String} routeId The `_id` of the route you are updating.
 * @param {Number} rating The new value you are updating the route's `Rating`
 *  property to match.
 * @param {Boolean} isArchived Specifies whether or not the route is live or archived.
 * Default is `false`.
 */
async function updateRouteRating(dbName, routeId, rating, isArchived = false) {
  mongoose.connection.useDb(dbName);


  if (isArchived) {
    Model = Models["archived_routes"];
  } else {
    Model = Models["live_routes"];
  }

  try {
    const route = await Model.findById(routeId)
    if (!route) {
      throw new Error(`Route with ID ${routeId} not found`);
    }

    route.Rating = rating;

    await route.save();
    console.log(`Updated route rating for route ${routeId}`);
  } catch(err) {
    
    console.log(err);
    throw(err)
  }
}

/**
 * 
 * @param {String} routeId The `_id` of the route you are updating.
 * @param {Boolean} isArchived Specifies whether or not the route is live or archived.
 * Default is `false`.
 * @returns Mongoose document containing the `Reviews` array of the route.
 */
async function getRouteReviews(
  routeId, isArchived = false
) {
  mongoose.connection.useDb("route-mngt");
  var Model;
  if (isArchived) {
    Model = Models["archived_routes"];
  } else {
    Model = Models["live_routes"];
  }
  try {
    result = await Model.findOne({_id: routeId}, `Reviews`)
    console.log("Found Document");
    return result;
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description Deprecated?
 * @param {String} dbName name of database
 * @param {String} routeId The `_id` of the route you are updating.
 * @param {Boolean} isArchived Specifies whether or not the route is live or archived.
 * Default is `false`.
 * @returns Mongoose document containing the `Reviews` array of the route.
 */
async function getListOfReviewsForRoute(dbName, routeId, isArchived = false) {
  mongoose.connection.useDb(dbName);

  var Model;
  if (isArchived) {
    Model = Models["archived_routes"];
  } else {
    Model = Models["live_routes"];
  }

  try {
    result = await Model.findOne({_id: routeId}, `Reviews`);
    if (result == null) {
      console.log(`No reviews found for routeID ${routeId}`);
      return {};
    } else {
      console.log(`Found reviews for routeID ${routeId}`);
      return result;
    }
  } catch(err) {
    console.log(err);
    return {};
  }
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

module.exports = {
  //MONGO Connection
  startConnection: startConnection,
  closeConnection: closeConnection,
  listDatabases: listDatabases,
  

  //Generalized CRUD Functions:
  //POST
  createListing: createListing,
  //PUT
  updateListingByKey: updateListingByKey,
  //DELETE
  deleteListingByKey: deleteListingByKey,
  //GET
  findOneListingByKeyValue: findOneListingByKeyValue,
  findManyListingsByKeyValue: findManyListingsByKeyValue,
  getIdByKeyValue: getIdByKeyValue,
  getListOfIDs: getListOfIDs,
  getFieldFromListingById: getFieldFromListingById,


  //USER Functions
  getRoutePacketFromUserId: getRoutePacketFromUserId,
  getForumPacketFromUserId: getForumPacketFromUserId,
  getUserSettingsById: getUserSettingsById,
  getEmailByUserId: getEmailByUserId,
  getRoleFromUserID: getRoleFromUserID,

  //ROUTE Functions
  getRouteInfo: getRouteInfo,
  updateRouteRating: updateRouteRating,
  getRouteReviews: getRouteReviews,
  getListOfReviewsForRoute: getListOfReviewsForRoute,
};