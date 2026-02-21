const express = require('express');
const router = express.Router();
const AnimeController = require('../controllers/anime.controller');

// GET /api/animes
router.get('/animes', AnimeController.getAll);

// GET /api/animes/slug
router.get('/animes/slug/:slug', AnimeController.getBySlug)

// GET /api/animes/:id
router.get('/animes/:id', AnimeController.getOne);
/** 
// POST /api/animes
router.post('/', auth, isAdmin, AnimeController.create);

// PUT /api/animes/:id
router.put('/:id', auth, isAdmin, AnimeController.update);

// DELETE /api/animes/:id
router.delete('/:id', auth, isAdmin, AnimeController.remove);
*/

module.exports = router;