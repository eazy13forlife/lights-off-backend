const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate");
const getAllUploads = require("../controllers/uploadsController");

//get all uploads by user
router.get("/uploads/me", authenticateMiddleware, getAllUploads);

module.exports = router;
