const express = require('express');
const router = express.Router();
const uploadPhotoAnime = require('../utils/uploadPhotoAnime')
const AnimeController = require('../controllers/anime.controller');

// GET /api/animes
router.get('/', AnimeController.getAll);

// GET /api/animes/slug
router.get('/slug/:slug', AnimeController.getBySlug)

// GET /api/animes/:id
router.get('/:id', AnimeController.getOne);

// POST /api/animes
router.post('/', uploadPhotoAnime.single('cover'), AnimeController.create);

//router.post('/', auth, isAdmin, AnimeController.create);

// PUT /api/animes/:id
router.put('/:id/cover', uploadPhotoAnime.single('cover'), AnimeController.updateCover);

//router.put('/:id', auth, isAdmin, AnimeController.update);

// DELETE /api/animes/:id
router.delete('/:id', AnimeController.remove)


module.exports = router;