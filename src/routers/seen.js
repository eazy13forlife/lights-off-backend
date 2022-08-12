const express = require("express");
const router = new express.Router();

//get all seen media by user
router.get("/seen");

//add a specific media to post
router.post("/seen/:mediaId");

//delete a specific media from seen
route.delete("/seen/:mediaId");

module.exports = router;
