const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate");
const {
  addReview,
  editReview,
  getReviewsForMedia,
  deleteReview,
  getAllMyReviews,
  checkIfUserReviewedMedia,
} = require("../controllers/reviewsController");

//check if user reviewed media
router.head(
  "/reviews/:mediaId",
  authenticateMiddleware,
  checkIfUserReviewedMedia
);
//get all reviews for a specific media
router.get("/reviews/:mediaId", authenticateMiddleware, getReviewsForMedia);

//add a review for a specific media
router.post("/reviews/:mediaId", authenticateMiddleware, addReview);

//update a review for a specific media
router.patch("/reviews/:mediaId", authenticateMiddleware, editReview);

//delete a review for a specific media
router.delete("/reviews/:mediaId", authenticateMiddleware, deleteReview);

//get all reviews for current logged in user
router.get("/reviews", authenticateMiddleware, getAllMyReviews);

module.exports = router;
