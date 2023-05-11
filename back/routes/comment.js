const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const { authenticateJWT, ensureLoggedIn, ensureCorrectUserOrAdminForComment } = require("../middleware/auth");

router.use(authenticateJWT);


// Get all comments for a specific manga
router.get("/:mangaId/comments", async (req, res, next) => {
    try {
      const comments = await Comment.getCommentsForManga(req.params.mangaId);
      return res.json(comments);
    } catch (err) {
      return next(err);
    }
  });
  
  
// Create a new comment
router.post("/", ensureLoggedIn, async (req, res, next) => {
    try {
      const comment = await Comment.create({ ...req.body, userId: res.locals.user.id });
      return res.status(201).json(comment);
    } catch (err) {
      return next(err);
    }
  });
  
  // Update a comment
  router.patch("/:id", ensureCorrectUserOrAdminForComment, async (req, res, next) => {
    try {
      const comment = await Comment.update(req.params.id, res.locals.user.id, req.body);
      return res.json(comment);
    } catch (err) {
      return next(err);
    }
  });
  
  // Delete a comment
  router.delete("/:id", ensureCorrectUserOrAdminForComment, async (req, res, next) => {
    try {
      await Comment.delete(req.params.id, res.locals.user.id);
      return res.json({ message: "Comment deleted" });
    } catch (err) {
      return next(err);
    }
  });
  
  module.exports = router;

  