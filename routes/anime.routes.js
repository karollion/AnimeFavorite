/* =====================================================
   Anime Routes
   ===================================================== */

/**
 * @file anime.routes.js
 * @description Routes for Anime CRUD operations including 
 *              retrieval, creation, update, cover upload,
 *              and deletion. Includes auth & admin middleware.
 */

const express = require('express');
const router = express.Router();

const upload = require('../utils/upload');
const AnimeController = require('../controllers/anime.controller');
const auth = require("../utils/authMiddleware");
const admin = require("../utils/adminMiddleware");

/* =====================================================
   GET ANIME
   ===================================================== */

/**
 * @route   GET /api/animes
 * @desc    Get all anime with optional pagination, search, filters and sorting
 * @access  Public
 */
router.get('/', AnimeController.getAll);

/**
 * @route   GET /api/animes/slug/:slug
 * @desc    Get single anime by slug including seasons, characters, and reviews
 * @access  Public
 */
router.get('/slug/:slug', AnimeController.getBySlug);

/**
 * @route   GET /api/animes/:id
 * @desc    Get single anime by ID including seasons and characters
 * @access  Public
 */
router.get('/:id', AnimeController.getOne);

/* =====================================================
   CREATE / UPDATE / DELETE ANIME
   ===================================================== */

/**
 * @route   POST /api/animes
 * @desc    Create new anime
 * @access  Admin
 * @middleware auth, admin
 */
router.post('/', auth, admin, AnimeController.create);

/**
 * @route   PUT /api/animes/:id/cover
 * @desc    Update anime cover image
 * @access  Admin
 * @middleware auth, admin, file upload
 */
router.put(
  '/:id/cover',
  auth,
  admin,
  upload("anime_covers").single("cover"),
  AnimeController.updateCover
);

/**
 * @route   PUT /api/animes/:id
 * @desc    Update anime details
 * @access  Admin
 * @middleware auth, admin
 */
router.put('/:id', auth, admin, AnimeController.update);

/**
 * @route   DELETE /api/animes/:id
 * @desc    Soft delete anime
 * @access  Admin
 * @middleware auth, admin
 */
router.delete('/:id', auth, admin, AnimeController.remove);

/* =====================================================
   EXPORT ROUTER
   ===================================================== */

module.exports = router;