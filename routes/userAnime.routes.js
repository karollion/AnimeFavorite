const express = require('express');
const router = express.Router();

const controller = require('../controllers/userAnime.controller');
const auth = require("../utils/authMiddleware");

// ===============================
// GET
// ===============================
router.get('/me/favorites', auth, controller.getFavorites);
router.get('/me', auth, controller.getUserAnime);

// ===============================
// CREATE / UPDATE / DELETE
// ===============================
router.post('/', auth, controller.upsert);
router.delete('/:id', controller.remove);

module.exports = router;