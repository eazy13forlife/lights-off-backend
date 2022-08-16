const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate");
const {
  addMedia,
  getMedia,
  deleteMedia,
} = require("../controllers/mediaController");

//upload media
router.post("/media", authenticateMiddleware, addMedia);

//get a specific media by id
router.get("/media/:mediaId", authenticateMiddleware, getMedia);

//delete a specific media by id
router.delete("/media/:mediaId", authenticateMiddleware, deleteMedia);

//update a specific media by id
router.patch("/media/:mediaId");

module.exports = router;
