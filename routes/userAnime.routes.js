const express = require('express');
const router = express.Router();
const controller = require('../controllers/userAnime.controller');

router.post('/', controller.upsert);
router.get('/:userId', controller.getUserAnime);
router.get('/:userId/favorites', controller.getFavorites);
router.delete('/:id', controller.remove);

module.exports = router;