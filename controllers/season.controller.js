const Anime = require("../models/anime.model");
const Season = require("../models/season.model");

exports.addSeason = async (req, res) => {
  try {
    const season = await Season.create(req.body)

    await Anime.findByIdAndUpdate(req.params.animeId, {
      $push: { seasons: season._id }
    })

    res.status(201).json(season)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
};