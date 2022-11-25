const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate");
const {
  getAllFavorites,
  addToFavorites,
  deleteFromFavorites,
  checkMediaInFavorites,
  searchInFavorites,
} = require("../controllers/favoritesController");

//get all favorites of signed in user. Takes in page query param
router.get("/favorites/", authenticateMiddleware, getAllFavorites);

//search for favorites of signed in user. Takes in page query param and the title of media
router.get("/favorites/search", authenticateMiddleware, searchInFavorites);

router.head(
  "/favorites/exists/:mediaId",
  authenticateMiddleware,
  checkMediaInFavorites
);

//add media to favorites
router.post("/favorites/:mediaId", authenticateMiddleware, addToFavorites);

//delete specific media from favorites
router.delete(
  "/favorites/:mediaId",
  authenticateMiddleware,
  deleteFromFavorites
);

module.exports = router;
