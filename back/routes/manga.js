const jsonschema = require("jsonschema");
const express = require('express');
const Manga = require('../models/manga');
const router = express.Router();
const { BadRequestError } = require("../expressError");
const useMangaTitle= require("../schemas/mangaTitles.json");
const useMangaId = require("../schemas/mangaId.json");

router.get('/titles', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const mangaList = await Manga.getAllTitles(page, limit);
    
    const validator = jsonschema.validate(mangaList, useMangaTitle);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    res.json(mangaList);
  } catch (error) {
    next(error);
  }
});


router.get('/:mangaId', async (req, res, next) => {
  try {
    const mangaId = req.params.mangaId;
    const manga = await Manga.getMangaById(mangaId);

    const validator = jsonschema.validate(req.body, useMangaId);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    res.json(manga);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
