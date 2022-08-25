const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate");
const { addToSeen, deleteFromSeen } = require("../controllers/seenController");

//get all seen media by user
router.get("/seen");

//add a specific media to post
router.post("/seen/:mediaId", authenticateMiddleware, addToSeen);

//delete a specific media from seen
router.delete("/seen/:mediaId", authenticateMiddleware, deleteFromSeen);

module.exports = router;
