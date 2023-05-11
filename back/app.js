"use strict";

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const mangaRoutes = require("./routes/manga");
const usersRoutes = require("./routes/users");
const ratingRoutes = require('./routes/rating');
const commentRoutes = require("./routes/comment");
const favoritesRoutes = require("./routes/favorite");

const app = express();

function logRequests(req, res, next) {
  console.log(`${req.method} ${req.path}`);
  next();
}

app.use(cors());
app.use(express.json());
app.use(logRequests);
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/rating", ratingRoutes);
app.use("/manga", mangaRoutes);
app.use("/users", usersRoutes);
app.use("/comment", commentRoutes);
app.use("/favorites", favoritesRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
