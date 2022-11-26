const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate");
const {
  addToWatchNext,
  deleteFromWatchNext,
  getAllWatchNext,
  checkMediaInWatchNext,
  searchInWatchNext,
} = require("../controllers/watchNextController");

router.head(
  "/watch-next/exists/:mediaId",
  authenticateMiddleware,
  checkMediaInWatchNext
);

//get all watch next media
router.get("/watch-next", authenticateMiddleware, getAllWatchNext);

router.get("/watch-next/search", authenticateMiddleware, searchInWatchNext);

//delete a specific media from watch next
router.delete(
  "/watch-next/:mediaId",
  authenticateMiddleware,
  deleteFromWatchNext
);

//add a specific media to watch next
router.post("/watch-next/:mediaId", authenticateMiddleware, addToWatchNext);

module.exports = router;
