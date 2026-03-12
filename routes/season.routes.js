/* =====================================================
   Season Routes
   ===================================================== */

/**
 * @file season.routes.js
 * @description Routes for managing anime seasons.
 *              Includes retrieval by anime, creation, update, cover upload, and soft deletion.
 */

const express = require("express");
const router = express.Router();

const upload = require('../utils/upload');
const season = require("../controllers/season.controller");
const auth = require("../utils/authMiddleware");
const admin = require("../utils/adminMiddleware");

/* =====================================================
   SEASON RETRIEVAL ENDPOINTS
   ===================================================== */

/**
 * @route   GET /api/seasons/anime/:animeId
 * @desc    Get all seasons for a specific anime, sorted by season number
 * @access  Public
 */
router.get("/anime/:animeId", season.getSeasonsByAnime);

/* =====================================================
   SEASON CREATE / UPDATE / DELETE ENDPOINTS
   ===================================================== */

/**
 * @route   POST /api/seasons
 * @desc    Create a new season for an anime
 * @access  Private (admin only)
 * @middleware auth, admin
 */
router.post("/", auth, admin, season.createSeason);

/**
 * @route   PUT /api/seasons/:id/cover
 * @desc    Update the cover image for a season
 * @access  Private (admin only)
 * @middleware auth, admin, upload
 */
router.put("/:id/cover", auth, admin, upload("season_covers").single("cover"), season.updateCover);

/**
 * @route   PUT /api/seasons/:id
 * @desc    Update season details (title, number, episodes, release date, notes)
 * @access  Private (admin only)
 * @middleware auth, admin
 */
router.put("/:id", auth, admin, season.updateSeason);

/**
 * @route   DELETE /api/seasons/:id
 * @desc    Soft delete a season by ID
 * @access  Private (admin only)
 * @middleware auth, admin
 */
router.delete("/:id", auth, admin, season.deleteSeason);

/* =====================================================
   EXPORT ROUTER
   ===================================================== */
module.exports = router;