const express = require('express');
const router = express.Router();

const upload = require('../utils/upload');
const AnimeController = require('../controllers/anime.controller');
const auth = require("../utils/authMiddleware");
const admin = require("../utils/adminMiddleware");

// ===============================
// GET ANIME
// ===============================
router.get('/', AnimeController.getAll);
router.get('/slug/:slug', AnimeController.getBySlug);
router.get('/:id', AnimeController.getOne);

// ===============================
// CREATE / UPDATE / DELETE
// ===============================
router.post('/', auth, admin, AnimeController.create);
router.put('/:id/cover', auth, admin, upload("anime_covers").single("cover"), AnimeController.updateCover);
router.put('/:id', auth, admin, AnimeController.update);
router.delete('/:id', auth, admin, AnimeController.remove);

module.exports = router;