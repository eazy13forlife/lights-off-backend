const express = require("express");

const db = require("./db/index.js");
const usersRouter = require("./routers/users");
const mediaRouter = require("./routers/media");
const favoritesRouter = require("./routers/favorites");
const reviewsRouter = require("./routers/reviews");
const seenRouter = require("./routers/seen");
const uploadsRouter = require("./routers/uploads");
const watchNextRouter = require("./routers/watchNext");
const errorHandler = require("./routers/errorHandler");

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());

app.use(usersRouter);

app.use(mediaRouter);

app.use(favoritesRouter);

app.use(reviewsRouter);

app.use(seenRouter);

app.use(uploadsRouter);

app.use(watchNextRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log("Lights off backend has started running on ");
});
