const jsonschema = require("jsonschema");
const express = require('express');
const Manga = require('../models/manga');
const router = express.Router();
const { BadRequestError } = require("../expressError");
const useMangaTitle= require("../schemas/mangaTitles.json");
const useMangaId = require("../schemas/mangaId.json");

  // GET route to get all manga titles
router.get('/titles', async (req, res) => {
  const { page, limit, order, searchQuery } = req.query;
  const [orderKey, orderValue] = order.split(":");

  try {
    const titles = await Manga.getAllTitles(page, limit, { [orderKey]: orderValue }, searchQuery);
    res.status(200).json(titles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving manga titles.' });
  }
});

  // GET route to get information about specific manga
router.get('/:id', async (req, res, next) => {
  try {
    const mangaId = req.params.id;
    console.log("Received request for manga ID:", mangaId);

    const manga = await Manga.getMangaById(mangaId);

    console.log("Returning manga data:", manga);
    res.json(manga);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
