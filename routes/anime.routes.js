const express = require('express');
const router = express.Router();

const uploadPhotoAnime = require('../utils/uploadPhotoAnime')
const AnimeController = require('../controllers/anime.controller');

// ===============================
// GET ANIME
// ===============================
router.get('/', AnimeController.getAll);
router.get('/slug/:slug', AnimeController.getBySlug)
router.get('/:id', AnimeController.getOne);

// ===============================
// CREATE / UPDATE / DELETE
// ===============================
router.post('/', AnimeController.create);
router.put('/:id/cover', uploadPhotoAnime.single('cover'), AnimeController.updateCover);
//router.put('/:id', AnimeController.update);
router.delete('/:id', AnimeController.remove)

module.exports = router;