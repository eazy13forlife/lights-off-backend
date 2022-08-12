const express = require("express");
const router = new express.Router();

//get all favorites of signed in user
router.get("/favorites");

//add media to favorites
router.post("/favorites/:mediaId");

//delete specific media from favorites
router.delete("/favorites/:mediaId");

module.exports = router;
