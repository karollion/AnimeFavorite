const Anime = require("../models/anime.model");
const Season = require("../models/season.model");

exports.addSeason = async (req, res) => {
  try {
    const season = await Season.create(req.body)

    res.status(201).json(season)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
};