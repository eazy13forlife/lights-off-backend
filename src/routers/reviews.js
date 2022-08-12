const express = require("express");
const router = new express.Router();

//get all reviews for a specific media
router.get("/reviews/:mediaId");

//add a review for a specific media
router.post("/reviews/:mediaId");

//update a review for a specific media
router.patch("/reviews/:mediaId");

//delete a review for a specific media
router.delete("/reviews/:mediaId");

//get all reviews for current logged in user
router.get("/reviews/me");

module.exports = router;
