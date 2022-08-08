const express = require("express");

const db = require("./db/index.js");

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log(db.query);
});

app.listen(port, () => {
  console.log("Lights off backend has started running on ");
});
