const Anime = require('../models/anime.model');
const Season = require('../models/season.model');
const Character = require('../models/character.model');
const cloudinary = require('../utils/cloudinary');

// ===============================
// GET ALL
// ===============================
exports.getAll = async (req, res) => {
  try {
    const animes = await Anime.find({ is_deleted: { $ne: true } })
      .sort({ createdAt: -1 });

    res.json(animes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===============================
// GET ONE BY ID
// ===============================
exports.getOne = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);

    if (!anime || anime.is_deleted) {
      return res.status(404).json({ message: "Anime not found" });
    }

    const seasons = await Season.find({ anime: anime._id })
      .sort({ season_number: 1 });

    const characters = await Character.find({ anime: anime._id });

    res.json({
      ...anime.toObject(),
      seasons,
      characters
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===============================
// GET BY SLUG
// ===============================
exports.getBySlug = async (req, res) => {
  try {
    const anime = await Anime.findOne({
      slug: req.params.slug,
      is_deleted: { $ne: true }
    });

    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    const seasons = await Season.find({ anime: anime._id })
      .sort({ season_number: 1 });

    const characters = await Character.find({ anime: anime._id });

    res.json({
      ...anime.toObject(),
      seasons,
      characters
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===============================
// CREATE
// ===============================
exports.create = async (req, res) => {
  try {
    const animeData = { ...req.body };

    if (req.file) {
      animeData.anime_cover = req.file.path;
      animeData.cover_public_id = req.file.filename;
    }

    const anime = await Anime.create(animeData);

    res.status(201).json(anime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// ===============================
// UPDATE COVER
// ===============================
exports.updateCover = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);

    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    if (anime.cover_public_id) {
      await cloudinary.uploader.destroy(anime.cover_public_id);
    }

    anime.anime_cover = req.file.path;
    anime.cover_public_id = req.file.filename;

    await anime.save();

    res.json(anime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===============================
// SOFT DELETE
// ===============================
exports.remove = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);

    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    if (anime.cover_public_id) {
      await cloudinary.uploader.destroy(anime.cover_public_id);
    }

    anime.is_deleted = true;
    anime.deleted_at = new Date();

    await anime.save();

    res.json({ message: 'Anime deleted (soft)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};