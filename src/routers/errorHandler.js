const express = require("express");
const router = new express.Router();

router.use((error, req, res, next) => {
  res.status(500).send("Something went wrong");
});

module.exports = router;
