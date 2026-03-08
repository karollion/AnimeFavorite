const Season = require("../models/season.model")
const cloudinary = require("../utils/cloudinary")
const pick = require("../utils/pickAllowedFields")

// ===============================
// CREATE SEASON
// ===============================
exports.createSeason = async (req, res) => {
  try {

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

  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}


// ===============================
// GET SEASONS BY ANIME
// ===============================
exports.getSeasonsByAnime = async (req, res) => {
  try {

    const seasons = await Season.find({
      anime: req.params.animeId,
      is_deleted: { $ne: true }
    }).sort({ season_number: 1 })

    res.json(seasons)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// UPDATE COVER
// ===============================
exports.updateCover = async (req, res) => {
  try {

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

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// UPDATE SEASON
// ===============================
exports.updateSeason = async (req, res) => {
  try {

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

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// SOFT DELETE SEASON
// ===============================
exports.deleteSeason = async (req, res) => {
  try {

    const season = await Season.findById(req.params.id)

    if (!season) {
      return res.status(404).json({ message: "Season not found" })
    }

    season.is_deleted = true
    season.deleted_at = new Date()

    await season.save()

    res.json({ message: "Season deleted" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}