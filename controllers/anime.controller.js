const Anime = require('../models/anime.model');
const cloudinary = require('../utils/cloudinary')

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

// Load one anime by id
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

// Load one anime by slug
exports.getBySlug = async (req, res) => {
  try {
    const anime = await Anime.findOne({ slug: req.params.slug })
      .populate('seasons')
      .populate('characters')

    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' })
    }

    res.json(anime)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

// Create new anime
exports.create = async (req, res) => {
  try {
    const animeData = {
      ...req.body
    }

    if (req.file) {
      animeData.anime_cover = req.file.path
      animeData.cover_public_id = req.file.filename
    }

    const anime = await Anime.create(animeData)
    res.status(201).json(anime)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
};

// Update Anime
exports.updateCover = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id)
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' })
    }

    // usuń starą okładkę
    if (anime.cover_public_id) {
      await cloudinary.uploader.destroy(anime.cover_public_id)
    }

    // zapisz nową
    anime.anime_cover = req.file.path
    anime.cover_public_id = req.file.filename

    await anime.save()
    res.json(anime)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

// Remove anime
exports.remove = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id)

    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' })
    }

    // usuń obraz z Cloudinary
    if (anime.cover_public_id) {
      await cloudinary.uploader.destroy(anime.cover_public_id)
    }

    anime.is_deleted = true
    anime.deleted_at = new Date()

    await anime.save()

    res.json({ message: 'Anime deleted (soft)' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};