const express = require("express");
const router = new express.Router();

//get all uploads by user
router.get("/uploads/me");

module.exports = router;
