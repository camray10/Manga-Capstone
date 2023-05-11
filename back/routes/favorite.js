const express = require('express');
const router = express.Router();
const Favorites = require('../models/favorite');
const { authenticateJWT, ensureLoggedIn } = require("../middleware/auth");

router.use(authenticateJWT);

router.get("/:userId/favorites", ensureLoggedIn, async (req, res, next) => {
    try {
      console.log("Received User ID:", req.params.userId); // Add this line
      const favorites = await Favorites.findAll(req.params.userId);
      return res.json(favorites);
    } catch (err) {
      return next(err);
    }
  });
  

// Add a favorite
router.post("/",  async (req, res, next) => {
    try {
      const { userId, mangaId } = req.body;
      const favorite = await Favorites.add({ userId, mangaId });
      return res.status(201).json(favorite);
    } catch (err) {
      return next(err);
    }
  });
  

// Remove a favorite
router.delete("/:userId/:mangaId", ensureLoggedIn, async (req, res, next) => {
  try {
    await Favorites.remove(req.params.userId, req.params.mangaId);
    return res.json({ message: "Favorite deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
