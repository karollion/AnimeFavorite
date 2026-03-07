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