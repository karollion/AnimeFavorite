const Season = require("../models/season.model")

exports.createSeason = async (req, res) => {
  try {

    const season = new Season(req.body)

    await season.save()

    res.status(201).json(season)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getSeasonsByAnime = async (req, res) => {
  try {

    const seasons = await Season.find({
      anime: req.params.animeId,
      is_deleted: false
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

    const season = await Season.findById(req.params.id);

    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    if (season.cover_public_id) {
      await cloudinary.uploader.destroy(season.cover_public_id);
    }

    season.season_cover = req.file.path;
    season.cover_public_id = req.file.filename;

    await season.save();

    res.json(season);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSeason = async (req, res) => {
  try {

    const season = await Season.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(season)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteSeason = async (req, res) => {
  try {

    await Season.findByIdAndUpdate(req.params.id, {
      is_deleted: true,
      deleted_at: new Date()
    })

    res.json({ message: "Season deleted" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}