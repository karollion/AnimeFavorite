const Anime = require('../models/anime.model');
const Season = require('../models/season.model');
const Character = require('../models/character.model');
const cloudinary = require('../utils/cloudinary');
const pick = require("../utils/pickAllowedFields");

// ===============================
// GET ALL + PAGINATION + SEARCH
// search po tytule
// filtr genre
// filtr type
// filtr world
// filtr categories
// pagination
// sortowanie
// ===============================
exports.getAll = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const query = {}

    // ===============================
    // SEARCH
    // ===============================

    if (req.query.search) {
      query.$text = { $search: req.query.search }
    }

    // ===============================
    // FILTER TYPE
    // ===============================

    if (req.query.type) {
      query.type = req.query.type
    }

    // ===============================
    // FILTER GENRE
    // ===============================

    if (req.query.genres) {
      const genres = req.query.genres
        .split(",")
        .map(g => g.toLowerCase())
      query.genres = { $in: genres }
    }

    // ===============================
    // FILTER CATEGORY
    // ===============================

    if (req.query.category) {
      query.categories = req.query.category.toLowerCase()
    }

    // ===============================
    // FILTER WORLD
    // ===============================

    if (req.query.world) {
      query.world = req.query.world
    }

    // ===============================
    // SORT
    // ===============================

    let sort = { createdAt: -1 }

    if (req.query.sort === "rating") {
      sort = { rating_avg: -1 }
    }

    if (req.query.sort === "title") {
      sort = { title: 1 }
    }

    // ===============================
    // QUERY
    // ===============================

    const total = await Anime.countDocuments(query)

    const animes = await Anime.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: animes
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


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

    const result = await Anime.aggregate([

      // ===============================
      // MATCH ANIME
      // ===============================

      {
        $match: {
          slug: req.params.slug,
        }
      },

      // ===============================
      // SEASONS
      // ===============================

      {
        $lookup: {
          from: "seasons",
          localField: "_id",
          foreignField: "anime",
          as: "seasons"
        }
      },

      {
        $addFields: {
          seasons: {
            $sortArray: {
              input: "$seasons",
              sortBy: { season_number: 1 }
            }
          }
        }
      },

      // ===============================
      // CHARACTERS
      // ===============================

      {
        $lookup: {
          from: "characters",
          localField: "_id",
          foreignField: "anime",
          as: "characters"
        }
      },

      {
        $addFields: {
          characters: {
            $filter: {
              input: "$characters",
              as: "char",
              cond: { $ne: ["$$char.is_deleted", true] }
            }
          }
        }
      },

      // ===============================
      // REVIEWS
      // ===============================

      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "anime",
          as: "reviews"
        }
      },

      {
        $addFields: {
          reviews: {
            $slice: [
              {
                $filter: {
                  input: "$reviews",
                  as: "review",
                  cond: { $ne: ["$$review.is_deleted", true] }
                }
              },
              10
            ]
          }
        }
      },

      // ===============================
      // REVIEW STATS
      // ===============================

      {
        $addFields: {
          rating_count: { $size: "$reviews" },
          rating_avg: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $avg: "$reviews.rating" },
              0
            ]
          }
        }
      },

      // ===============================
      // OPTIONAL SORT REVIEWS
      // ===============================

      {
        $addFields: {
          reviews: {
            $sortArray: {
              input: "$reviews",
              sortBy: { createdAt: -1 }
            }
          }
        }
      }

    ])

    if (!result.length) {
      return res.status(404).json({ message: "Anime not found" })
    }

    res.json(result[0])

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ===============================
// CREATE
// ===============================
exports.create = async (req, res) => {
  try {
    const allowed = [
      "title",
      "original_title",
      "age_rating",
      "type",
      "world",
      "genres",
      "categories",
      "description_short"
    ]

    const animeData = pick(req.body, allowed);

    const existing = await Anime.findOne({ title: animeData.title })

    if (existing) {
      return res.status(409).json({ message: "Anime already exists" })
    }
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
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

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
// UPDATE ANIME
// ===============================
exports.update = async (req, res) => {
  try {

    const allowed = [
      "title",
      "original_title",
      "age_rating",
      "type",
      "world",
      "genres",
      "categories",
      "description_short"
    ]

    const updates = pick(req.body, allowed)

    const anime = await Anime.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )

    if (!anime) {
      return res.status(404).json({ message: "Anime not found" })
    }

    res.json(anime)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


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

    await anime.softDelete();

    res.json({ message: 'Anime deleted (soft)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};