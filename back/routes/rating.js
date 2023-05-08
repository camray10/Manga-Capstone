const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');
const { authenticateJWT, ensureLoggedIn, ensureCorrectUserOrAdminForRating } = require("../middleware/auth");

router.use(authenticateJWT);

// POST route to add a rating
router.post("/", ensureCorrectUserOrAdminForRating, async function (req, res, next) {
  try {
    const { userId, mangaId, score } = req.body;
    const rating = await Rating.add({ userId, mangaId, score });
    return res.json({ rating });
  } catch (err) {
    return next(err);
  }
});


  
// GET route to get all ratings for a manga
router.get('/:mangaId', async function(req, res, next) {
  try {
    const mangaId = parseInt(req.params.mangaId); // Convert mangaId to an integer
    console.log("Router mangaId:", mangaId);
    const ratings = await Rating.findAll(mangaId);
    return res.json({ ratings });
  } catch (err) {
    return next(err);
  }
});

  
  // DELETE route to remove a rating
  router.delete('/:id', ensureLoggedIn, async function(req, res, next) {
    try {
      const { id } = req.params;
      await Rating.remove(id);
      return res.json({ message: 'Rating deleted' });
    } catch (err) {
      return next(err);
    }
  });
  

module.exports = router;
