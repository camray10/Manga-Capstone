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
    const mangaId = req.params.mangaId; // Directly get mangaId as a string
    console.log("Router mangaId:", mangaId);
    const ratings = await Rating.findAll(mangaId);
    return res.json({ ratings });
  } catch (err) {
    return next(err);
  }
});


  
// DELETE route to remove a rating
router.delete('/user/:userId/manga/:mangaId', ensureLoggedIn, async function (req, res, next) {
  console.log('Inside DELETE route');
  try {
    console.log('Before remove');
    const { userId, mangaId } = req.params;
    await Rating.remove(userId, mangaId);
    console.log('After remove');
    return res.json({ message: 'Rating deleted' });
  } catch (err) {
    return next(err);
  }
});









  

module.exports = router;
