const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate");
const {
  addMedia,
  getMedia,
  deleteMedia,
  updateMedia,
  checkMediaInDatabase,
} = require("../controllers/mediaController");

//upload media
router.post("/media", authenticateMiddleware, addMedia);

router.head(
  "/media/exists/:mediaId",
  authenticateMiddleware,
  checkMediaInDatabase
);
//get a specific media by id
router.get("/media/:mediaId", authenticateMiddleware, getMedia);

//delete a specific media by id
router.delete("/media/:mediaId", authenticateMiddleware, deleteMedia);

//update a specific media by id
router.patch("/media/:mediaId", authenticateMiddleware, updateMedia);

module.exports = router;
