const express = require('express');
const router = express.Router();
const AnimeController = require('../controllers/anime.controller');

// GET /api/animes
router.get('/', AnimeController.getAll);

// GET /api/animes/:id
router.get('/:id', AnimeController.getOne);

module.exports = router;