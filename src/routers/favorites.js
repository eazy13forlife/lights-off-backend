const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate");
const {
  getAllFavorites,
  addToFavorites,
  deleteFromFavorites,
} = require("../controllers/favoritesController");

//get all favorites of signed in user
router.get("/favorites");

//add media to favorites
router.post("/favorites/:mediaId", authenticateMiddleware, addToFavorites);

//delete specific media from favorites
router.delete("/favorites/:mediaId");

module.exports = router;
