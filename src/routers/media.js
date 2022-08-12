const express = require("express");
const router = new express.Router();

//upload media
router.post("/media");

//get a specific media by id
router.get("/media/:mediaId");

//delete a specific media by id
router.delete("/media/:mediaId");

//update a specific media by id
router.patch("/media/:mediaId");

module.exports = router;
