const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/CatchAsync");
const reviews = require("../controllers/reviews");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview)); 
router.delete("/:reviewID", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;