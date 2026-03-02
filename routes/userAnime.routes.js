const express = require('express');
const router = express.Router();
const controller = require('../controllers/userAnime.controller');
const auth = require('../utils/authMiddleware')

router.post('/', auth, controller.upsert);
router.get('/me/favorites', auth, controller.getFavorites);
router.get('/me', auth, controller.getUserAnime);
router.delete('/:id', controller.remove);

module.exports = router;