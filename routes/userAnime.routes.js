/* =====================================================
   UserAnime Routes
   ===================================================== */

/**
 * @file userAnime.routes.js
 * @description Routes for managing user's anime lists and relationships.
 *              Includes retrieval of all user anime, favorites, adding/updating relations, and removing from list.
 */

const express = require('express');
const router = express.Router();

const controller = require('../controllers/userAnime.controller');
const auth = require("../utils/authMiddleware");

/* =====================================================
   USER ANIME RETRIEVAL ENDPOINTS
   ===================================================== */

/**
 * @route   GET /api/user-anime/me/favorites
 * @desc    Get all favorite anime for the authenticated user
 * @access  Private
 * @middleware auth
 */
router.get('/me/favorites', auth, controller.getFavorites);

/**
 * @route   GET /api/user-anime/me
 * @desc    Get all anime entries (watched, planned, etc.) for the authenticated user
 * @access  Private
 * @middleware auth
 */
router.get('/me', auth, controller.getUserAnime);

/* =====================================================
   USER ANIME CREATE / UPDATE / DELETE ENDPOINTS
   ===================================================== */

/**
 * @route   POST /api/user-anime
 * @desc    Add a new anime to the user's list or update an existing entry
 * @access  Private
 * @middleware auth
 */
router.post('/', auth, controller.upsert);

/**
 * @route   DELETE /api/user-anime/:id
 * @desc    Remove an anime from the user's list by relation ID
 * @access  Private
 * @middleware auth
 */
router.delete('/:id', auth, controller.remove);

/* =====================================================
   EXPORT ROUTER
   ===================================================== */
module.exports = router;