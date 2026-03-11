const Season = require("../models/season.model");
const cloudinary = require("../utils/cloudinary");
const pick = require("../utils/pickAllowedFields");
const asyncHandler = require("../utils/asyncHandler");

// ===============================
// CREATE SEASON
// ===============================
exports.createSeason = asyncHandler(async (req, res) => {
  const allowed = [
    "anime",
    "title",
    "season_number",
    "episodes_count",
    "year",
    "release_date",
    "notes"
  ]

  const seasonData = pick(req.body, allowed)

  const season = await Season.create(seasonData)

  res.status(201).json(season)
});


// ===============================
// GET SEASONS BY ANIME
// ===============================
exports.getSeasonsByAnime = asyncHandler(async (req, res) => {
  const seasons = await Season.find({ anime: req.params.animeId,})
    .sort({ season_number: 1 })
    .lean();

  res.json(seasons)
});


// ===============================
// UPDATE COVER
// ===============================
exports.updateCover = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  const season = await Season.findById(req.params.id)

  if (!season) {
    return res.status(404).json({ message: "Season not found" })
  }

  if (season.cover_public_id) {
    await cloudinary.uploader.destroy(season.cover_public_id)
  }

  season.season_cover = req.file.path
  season.cover_public_id = req.file.filename

  await season.save()

  res.json(season)
});


// ===============================
// UPDATE SEASON
// ===============================
exports.updateSeason = asyncHandler(async (req, res) => {
  const allowed = [
    "title",
    "season_number",
    "episodes_count",
    "release_date",
    "notes"
  ]

  const updates = pick(req.body, allowed)

  const season = await Season.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  )

  if (!season) {
    return res.status(404).json({ message: "Season not found" })
  }

  res.json(season)
});


// ===============================
// SOFT DELETE SEASON
// ===============================
exports.deleteSeason = asyncHandler(async (req, res) => {
  const season = await Season.findById(req.params.id)

  if (!season) {
    return res.status(404).json({ message: "Season not found" })
  }

  await season.softDelete();

  res.json({ message: "Season deleted" })
});