const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate");
const {
  addToSeen,
  deleteFromSeen,
  getAllSeen,
  checkMediaInSeen,
  searchInSeen,
} = require("../controllers/seenController");

//check if a specific media is already in our user_seen table
router.head("/seen/exists/:mediaId", authenticateMiddleware, checkMediaInSeen);

//search for a media in user's seen list
router.get("/seen/search", authenticateMiddleware, searchInSeen);

//get all seen media by user
router.get("/seen", authenticateMiddleware, getAllSeen);

//add a specific media to post
router.post("/seen/:mediaId", authenticateMiddleware, addToSeen);

//delete a specific media from seen
router.delete("/seen/:mediaId", authenticateMiddleware, deleteFromSeen);

module.exports = router;
