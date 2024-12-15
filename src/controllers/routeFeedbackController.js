const mongo = require('../models/mongo');
const auth = require('../models/auth');

module.exports = {
    // POST Methods
    createReview: async (req, res) => {
        console.log("Received");
        console.log(req.body);

        //auth
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        //Body
        const { rating, description, targetId, isVerbose } = req.body;

        //Create a document with the required fields
        const docu = {
            Body: description,
            RouteId: targetId,
            Rating: parseInt(rating),
            Author: userID,
            Verbose: (isVerbose === 'true')
        }

        //Check the role of the requester
        try {
            const newID = await mongo.createListing("route_mngt", "reviews", docu);
            console.log(`Created review with ID: ${newID}`);

            var routeReviews = (await mongo.getRouteReviews(targetId))["Reviews"];
            routeReviews.push(newID.toString());

            const routeUpdate = {
                Reviews: routeReviews
            }
            await mongo.updateListingByKey("route_mngt", "live_routes", targetId, routeUpdate);

            var currentRating = (await mongo.getFieldFromListingById("route_mngt", "live_routes", targetId, 'Rating'))["Rating"];
            if (currentRating == undefined) {
                currentRating = 0;
            }
            var newRating = ((currentRating * (routeReviews.length - 1)) + parseInt(rating)) / routeReviews.length;
            await mongo.updateRouteRating("route_mngt", targetId, newRating, false);

            res.status(201).json({ message: "Review created successfully" });
        } catch (err) {
            res.status(500).json({ error: "Rating process failed" });
        }
    },

    // PUT Methods
    editReview: async (req, res) => {
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        //data
        const { rating, description, creationDate, targetId, isVerbose } = req.body;

        const update = {
            Rating: rating,
            Body: description,
            Verbose: isVerbose,
            CreationDate: creationDate
        }

        const authorId = (await mongo.getFieldFromListingById("route_mngt", "reviews", targetId, "Author"))["Author"];

        if (userID == authorId) {
            try {
                console.log(targetId);
                console.log(update);
                await mongo.updateListingByKey("route_mngt", "reviews", targetId, update);

                res.status(202).json({ message: "Review successfully editted" });
            } catch (err) {
                console.log(err)
                res.status(500).json({ error: "Editting process failed" });
            }
        } else {
            res.status(403).json({ message: "Insufficient Permissions" });
        }
    },

    // DELETE Methods
    deleteReview: async (req, res) => {
        const { userID, role } = auth.authorize(req, res); //user Authentification; retrieve userID
        if (!userID) return;

        console.log("/////////////////////// DELETE ROUTE //////////////////////")
        const reviewId = req.query.reviewId;
        try {
            const authorId = (await mongo.getFieldFromListingById("route_mngt", "reviews", reviewId, "Author"))["Author"];
            const routeId = (await mongo.getFieldFromListingById("route_mngt", "reviews", reviewId, "RouteId"))["RouteId"];
            if (role <= 1 || userID == authorId) {

                var routeReviews = await mongo.getListOfReviewsForRoute("route_mngt", routeId, false);
                routeReviews = routeReviews[["Reviews"]]
                const index = routeReviews.indexOf(reviewId);
                routeReviews.splice(index, 1);

                const routeUpdate = {
                    Reviews: routeReviews
                }
                await mongo.deleteListingByKey("route_mngt", "reviews", reviewId);
                await mongo.updateListingByKey("route_mngt", "live_routes", routeId, routeUpdate);

                console.log("/////////////////////// DELETE ROUTE //////////////////////")
                res.status(201).json({ message: "Review Successfuly Deleted" });
            } else {
                console.log("/////////////////////// DELETE ROUTE //////////////////////")
                res.status(403).json({ message: "Access Denied" })
            }
        } catch (err) {
            console.log(err)
            console.log("/////////////////////// DELETE ROUTE //////////////////////")
            res.status(500).json({ error: "Review deletion failed" });
        }

    },

    // GET Methods
    getReviewDetails: async (req, res) => {
        const reviewId = req.query.reviewId
        var response_body;
        response_body = await mongo.findOneListingByKeyValue("route_mngt", "reviews", reviewId, "_id") //Needs custom search field, get this implemented

        json_message = JSON.stringify(response_body);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.write(JSON.stringify(response_body));
        res.end();
    },
    getReviewCount: async (req, res) => {
        const routeId = req.query.routeId;
        const isArchived = req.query.isArchived === 'true';
        var routeReviews = (await mongo.getListOfReviewsForRoute("route_mngt", routeId))["Reviews"];
        try {
            res.status(200).json({ message: `Matched route with id ${routeId}`, review_count: routeReviews.length });
        } catch (err) {
            res.status(500).json({ message: `Internal server error`, error: err });
        }
        
    },
    getRouteRating: async (req, res) => {
        const routeId = req.query.routeId;
        const isArchived = req.query.isArchived === 'true';
        var currentRating;
        if (!isArchived) {
            currentRating = (await mongo.getFieldFromListingById("route_mngt", "live_routes", routeId, 'Rating'))["Rating"];
        } else {
            currentRating = (await mongo.getFieldFromListingById("route_mngt", "live_routes", routeId, 'Rating'))["Rating"];
        }

        res.status(200).json({ message: `Matched route with id ${routeId}`, rating: currentRating });
    },
    getReviewsOnRoute: async (req, res) => {
        const routeId = req.query.routeId

        var response_body = await mongo.getListOfReviewsForRoute("route_mngt", routeId);
        res.status(200).json({ message: "Successful", reviews: response_body["Reviews"] });
    },
}