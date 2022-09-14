const express = require("express");
const cors = require("cors");

const usersRouter = require("./routers/users");
const mediaRouter = require("./routers/media");
const favoritesRouter = require("./routers/favorites");
const reviewsRouter = require("./routers/reviews");
const seenRouter = require("./routers/seen");
const uploadsRouter = require("./routers/uploads");
const watchNextRouter = require("./routers/watchNext");
const errorHandler = require("./routers/errorHandler");

const app = express();

app.use(
  cors({
    allowedHeaders: ["Content-Type", "authorization", "Accept"],
    origin: "http://localhost:3000",
    preflightContinue: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use(usersRouter);

app.use(mediaRouter);

app.use(favoritesRouter);

app.use(reviewsRouter);

app.use(seenRouter);

app.use(uploadsRouter);

app.use(watchNextRouter);

app.use(errorHandler);

module.exports = app;
