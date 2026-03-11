const Season = require("../models/season.model");
const cloudinary = require("../utils/cloudinary");

const pick = require("../utils/pickAllowedFields");
const asyncHandler = require("../utils/asyncHandler");

/* =====================================================
   CREATE SEASON
   ===================================================== */

/**
 * Create new anime season
 *
 * @route   POST /api/seasons
 * @access  Admin
 *
 * Allowed fields are filtered using whitelist
 * to prevent mass assignment attacks.
 *
 * Example:
 * - Season 1
 * - Season 2
 * - Movie arc etc.
 */
exports.createSeason = asyncHandler(async (req, res) => {
  const allowed = [
    "anime",
    "title",
    "season_number",
    "episodes_count",
    "year",
    "release_date",
    "notes",
  ];

  const seasonData = pick(req.body, allowed);

  const season = await Season.create(seasonData);

  res.status(201).json(season);
});

/* =====================================================
   GET SEASONS BY ANIME
   ===================================================== */

/**
 * Get all seasons for a specific anime
 *
 * @route   GET /api/anime/:animeId/seasons
 * @access  Public
 *
 * Sorted by season_number ascending.
 *
 * Uses lean() for performance optimization
 * (returns plain JS objects instead of mongoose docs).
 */
exports.getSeasonsByAnime = asyncHandler(async (req, res) => {
  const seasons = await Season.find({
    anime: req.params.animeId,
  })
    .sort({ season_number: 1 })
    .lean();

  res.json(seasons);
});

/* =====================================================
   UPDATE SEASON COVER
   ===================================================== */

/**
 * Upload or replace season cover image
 *
 * @route   PUT /api/seasons/:id/cover
 * @access  Admin
 *
 * Flow:
 * 1. Validate uploaded file
 * 2. Remove old Cloudinary image
 * 3. Save new image metadata
 */
exports.updateCover = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  const season = await Season.findById(req.params.id);

  if (!season) {
    return res.status(404).json({
      message: "Season not found",
    });
  }

  /* ---------- REMOVE OLD COVER ---------- */
  if (season.cover_public_id) {
    await cloudinary.uploader.destroy(season.cover_public_id);
  }

  /* ---------- SAVE NEW COVER ---------- */
  season.season_cover = req.file.path;
  season.cover_public_id = req.file.filename;

  await season.save();

  res.json(season);
});

/* =====================================================
   UPDATE SEASON DATA
   ===================================================== */

/**
 * Update season metadata
 *
 * @route   PUT /api/seasons/:id
 * @access  Admin
 *
 * Updates only whitelisted fields.
 * Validators run automatically.
 */
exports.updateSeason = asyncHandler(async (req, res) => {
  const allowed = [
    "title",
    "season_number",
    "episodes_count",
    "release_date",
    "notes",
  ];

  const updates = pick(req.body, allowed);

  const season = await Season.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!season) {
    return res.status(404).json({
      message: "Season not found",
    });
  }

  res.json(season);
});

/* =====================================================
   SOFT DELETE SEASON
   ===================================================== */

/**
 * Soft delete season
 *
 * @route   DELETE /api/seasons/:id
 * @access  Admin
 *
 * Uses schema method:
 * - sets is_deleted = true
 * - sets deleted_at timestamp
 *
 * Data remains in DB for recovery/history.
 */
exports.deleteSeason = asyncHandler(async (req, res) => {
  const season = await Season.findById(req.params.id);

  if (!season) {
    return res.status(404).json({
      message: "Season not found",
    });
  }

  await season.softDelete();

  res.json({
    message: "Season deleted",
  });
});