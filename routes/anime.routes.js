const express = require('express');
const router = express.Router();
const uploadPhotoAnime = require('../utils/uploadPhotoAnime')
const AnimeController = require('../controllers/anime.controller');

// GET /api/animes
router.get('/animes', AnimeController.getAll);

// GET /api/animes/slug
router.get('/animes/slug/:slug', AnimeController.getBySlug)

// GET /api/animes/:id
router.get('/animes/:id', AnimeController.getOne);

// POST /api/animes
router.post('/animes', uploadPhotoAnime.single('cover'), AnimeController.create);

//router.post('/', auth, isAdmin, AnimeController.create);

// PUT /api/animes/:id
router.put('/animes/:id/cover', uploadPhotoAnime.single('cover'), AnimeController.updateCover);
//router.put('/:id', auth, isAdmin, AnimeController.update);

// DELETE /api/animes/:id
router.delete('/animes/:id', AnimeController.remove)


module.exports = router;