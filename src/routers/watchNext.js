const express = require("express");
const router = new express.Router();

//get all watch next media
router.get("/watch-next");

//delete a specific media from watch next
router.delete("/watch-next/:mediaId");

//add a specific media to watch next
router.post("/watch-next/:mediaId");

module.exports = router;
