const Anime = require('../models/anime.model');

// Load all animes
exports.getAll = async (req, res) => {
  try {
    const animes = await Anime.find()
      .populate({ path: "characters", select: "name role image_url" })
      .populate({ path: "seasons", select: "season_number title year" })
      .sort({ createdAt: -1 })

    res.json(animes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

// Load one anime
exports.getOne = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id)
      .populate("characters")
      .populate("seasons")

    if (!anime) {
      return res.status(404).json({ message: "Anime not found" })
    }

    res.json(anime)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

exports.getBySlug = async (req, res) => {
  const anime = await Anime.findOne({ slug: req.params.slug })
    .populate('characters')
    .populate('seasons')

  if (!anime) {
    return res.status(404).json({ message: 'Anime not found' })
  }

  res.json(anime)
};