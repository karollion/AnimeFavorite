const Anime = require("../models/anime.model");
const Season = require("../models/season.model");
const Character = require("../models/character.model");

const cloudinary = require("../utils/cloudinary");
const pick = require("../utils/pickAllowedFields");
const asyncHandler = require("../utils/asyncHandler");

/* =====================================================
   GET ALL ANIME
   ===================================================== */

/**
 * Get paginated anime list with filters & search
 *
 * @route   GET /api/anime
 * @access  Public
 *
 * Query params:
 * - page
 * - limit
 * - search (text index)
 * - type
 * - genres (comma separated)
 * - category
 * - world
 * - sort (rating | title | newest)
 *
 * Response:
 * {
 *   page,
 *   totalPages,
 *   totalItems,
 *   items: Anime[]
 * }
 */
exports.getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const query = {};

  /* ================= SEARCH ================= */

  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  /* ================= FILTERS ================= */

  if (req.query.type) query.type = req.query.type;

  if (req.query.genres) {
    query.genres = {
      $in: req.query.genres.split(",").map(g => g.toLowerCase()),
    };
  }

  if (req.query.category) {
    query.categories = req.query.category.toLowerCase();
  }

  if (req.query.world) query.world = req.query.world;

  /* ================= SORT ================= */

  let sort = { createdAt: -1 };

  if (req.query.sort === "rating") sort = { rating_avg: -1 };
  if (req.query.sort === "title") sort = { title: 1 };

  /* ================= QUERY ================= */

  const total = await Anime.countDocuments(query);

  const animes = await Anime.find(query)
    .select(
      "title slug anime_cover rating_avg rating_count type age_rating"
    )
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  res.json({
    page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    items: animes,
  });
});

/* =====================================================
   GET ONE BY ID
   ===================================================== */

/**
 * Get single anime with seasons and characters
 *
 * @route   GET /api/anime/:id
 * @access  Public
 */
exports.getOne = asyncHandler(async (req, res) => {
  const anime = await Anime.findById(req.params.id)
    .populate({
      path: "characters",
      match: { is_deleted: { $ne: true } },
    })
    .populate({
      path: "seasons",
      options: { sort: { season_number: 1 } },
    })
    .populate({
      path: "reviews",
      match: { is_deleted: { $ne: true } },
      options: { sort: { createdAt: -1 }, limit: 10 },
      populate: {
        path: "user",
        select: "login slug avatar",
      },
    })
    .lean();

  if (!anime) {
    return res.status(404).json({ message: "Anime not found" });
  }

  res.json(anime);
});

/* =====================================================
   GET BY SLUG (AGGREGATION VIEW)
   ===================================================== */

/**
 * Get full anime page using slug
 * Includes:
 * - seasons
 * - characters
 * - latest reviews
 * - rating statistics
 *
 * @route   GET /api/anime/slug/:slug
 * @access  Public
 */
exports.getBySlug = asyncHandler(async (req, res) => {
  const result = await Anime.aggregate([
    { $match: { slug: req.params.slug } },

    /* ---------- SEASONS ---------- */
    {
      $lookup: {
        from: "seasons",
        localField: "_id",
        foreignField: "anime",
        as: "seasons",
      },
    },
    {
      $set: {
        seasons: {
          $sortArray: {
            input: {
              $filter: {
                input: "$seasons",
                as: "s",
                cond: { $ne: ["$$s.is_deleted", true] },
              },
            },
            sortBy: { season_number: 1 },
          },
        },
      },
    },

    /* ---------- CHARACTERS ---------- */
    {
      $lookup: {
        from: "characters",
        localField: "_id",
        foreignField: "anime",
        as: "characters",
      },
    },
    {
      $set: {
        characters: {
          $filter: {
            input: "$characters",
            as: "c",
            cond: { $ne: ["$$c.is_deleted", true] },
          },
        },
      },
    },

    /* ---------- REVIEWS ---------- */
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "anime",
        as: "reviews",
      },
    },

    /* populate user inside reviews */
    {
      $lookup: {
        from: "users",
        localField: "reviews.user",
        foreignField: "_id",
        as: "review_users",
      },
    },

    {
      $set: {
        reviews: {
          $map: {
            input: "$reviews",
            as: "r",
            in: {
              $mergeObjects: [
                "$$r",
                {
                  user: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$review_users",
                          as: "u",
                          cond: { $eq: ["$$u._id", "$$r.user"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },

    {
      $set: {
        reviews: {
          $slice: [
            {
              $sortArray: {
                input: "$reviews",
                sortBy: { createdAt: -1 },
              },
            },
            10,
          ],
        },
      },
    },

    /* ---------- REVIEW STATS ---------- */
    {
      $set: {
        rating_count: { $size: "$reviews" },
        rating_avg: {
          $cond: [
            { $gt: [{ $size: "$reviews" }, 0] },
            { $avg: "$reviews.rating" },
            0,
          ],
        },
      },
    },

    {
      $unset: "review_users",
    },
  ]);

  if (!result.length) {
    return res.status(404).json({ message: "Anime not found" });
  }
  //console.log (result[0])
  res.json(result[0]);
});

/* =====================================================
   CREATE ANIME
   ===================================================== */

/**
 * Create new anime (admin only)
 *
 * @route   POST /api/anime
 * @access  Admin
 */
exports.create = asyncHandler(async (req, res) => {
  const allowed = [
    "title",
    "original_title",
    "age_rating",
    "type",
    "world",
    "genres",
    "categories",
    "description_short",
  ];

  const animeData = pick(req.body, allowed);

  const existing = await Anime.findOne({ title: animeData.title });
  if (existing) {
    return res.status(409).json({ message: "Anime already exists" });
  }

  if (req.file) {
    animeData.anime_cover = req.file.path;
    animeData.cover_public_id = req.file.filename;
  }

  const anime = await Anime.create(animeData);

  res.status(201).json(anime);
});

/* =====================================================
   UPDATE COVER
   ===================================================== */

/**
 * Update anime cover image
 *
 * - deletes old Cloudinary image
 * - saves new uploaded image
 *
 * @route   PUT /api/anime/:id/cover
 * @access  Admin
 */
exports.updateCover = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const anime = await Anime.findById(req.params.id);
  if (!anime) {
    return res.status(404).json({ message: "Anime not found" });
  }

  if (anime.cover_public_id) {
    await cloudinary.uploader.destroy(anime.cover_public_id);
  }

  anime.anime_cover = req.file.path;
  anime.cover_public_id = req.file.filename;

  await anime.save();

  res.json(anime);
});

/* =====================================================
   UPDATE ANIME DATA
   ===================================================== */

/**
 * Update anime metadata (without cover)
 *
 * @route   PUT /api/anime/:id
 * @access  Admin
 */
exports.update = asyncHandler(async (req, res) => {
  const allowed = [
    "title",
    "original_title",
    "age_rating",
    "type",
    "world",
    "genres",
    "categories",
    "description_short",
  ];

  const updates = pick(req.body, allowed);

  const anime = await Anime.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!anime) {
    return res.status(404).json({ message: "Anime not found" });
  }

  res.json(anime);
});

/* =====================================================
   SOFT DELETE
   ===================================================== */

/**
 * Soft delete anime
 *
 * - removes Cloudinary cover
 * - marks document as deleted
 *
 * @route   DELETE /api/anime/:id
 * @access  Admin
 */
exports.remove = asyncHandler(async (req, res) => {
  const anime = await Anime.findById(req.params.id);

  if (!anime) {
    return res.status(404).json({ message: "Anime not found" });
  }

  if (anime.cover_public_id) {
    await cloudinary.uploader.destroy(anime.cover_public_id);
  }

  await anime.softDelete();

  res.json({ message: "Anime deleted (soft)" });
});