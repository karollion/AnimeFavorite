const UserAnime = require("../models/userAnime.model");
const Anime = require("../models/anime.model");

const asyncHandler = require("../utils/asyncHandler");

/* =====================================================
   ADD OR UPDATE USER ↔ ANIME RELATION
   ===================================================== */

/**
 * Create or update user-anime relation (UPSERT)
 *
 * @route   POST /api/user-anime
 * @access  Authenticated user
 *
 * Allows user to:
 * - set watch status
 * - rate anime
 * - mark as favorite
 *
 * Logic:
 * 1. Verify anime exists
 * 2. Check if relation already exists
 * 3. Update existing OR create new record
 */
exports.upsert = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;
  const { anime, favorite_anime, rating, status } = req.body;

  /* ---------- VALIDATE ANIME ---------- */
  const animeExists = await Anime.exists({
    _id: anime,
    is_deleted: { $ne: true },
  });

  if (!animeExists) {
    return res.status(404).json({
      message: "Anime not found",
    });
  }

  /* ---------- CHECK EXISTING RELATION ---------- */
  let userAnime = await UserAnime.findOne({
    user: userId,
    anime,
  });

  /* ---------- UPDATE EXISTING ---------- */
  if (userAnime) {
    userAnime.favorite_anime =
      favorite_anime ?? userAnime.favorite_anime;

    userAnime.rating = rating ?? userAnime.rating;
    userAnime.status = status ?? userAnime.status;

    await userAnime.save();

    return res.json(userAnime);
  }

  /* ---------- CREATE NEW RELATION ---------- */
  userAnime = await UserAnime.create({
    user: userId,
    anime,
    favorite_anime,
    rating,
    status,
  });

  res.status(201).json(userAnime);
});

/* =====================================================
   GET USER ANIME LIST
   ===================================================== */

/**
 * Get all anime associated with logged user
 *
 * @route   GET /api/user-anime
 * @access  Authenticated user
 *
 * Returns user's anime list with populated anime data.
 * Soft-deleted anime are automatically excluded.
 */
exports.getUserAnime = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;

  const list = await UserAnime.find({
    user: userId,
  })
    .populate({
      path: "anime",
      match: { is_deleted: { $ne: true } },
    })
    .sort({ createdAt: -1 })
    .lean();

  res.json(list);
});

/* =====================================================
   GET FAVORITE ANIME
   ===================================================== */

/**
 * Get user's favorite anime list
 *
 * @route   GET /api/user-anime/favorites
 * @access  Authenticated user
 *
 * Response is flattened for frontend convenience:
 * returns anime object merged with user rating/status.
 */
exports.getFavorites = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;

  const favorites = await UserAnime.find({
    user: userId,
    favorite_anime: true,
  })
    .populate({
      path: "anime",
      match: { is_deleted: { $ne: true } },
    })
    .select("anime rating status")
    .lean();

  /* ---------- CLEAN RESPONSE ---------- */
  const cleaned = favorites
    .filter((f) => f.anime) // remove soft-deleted anime
    .map((f) => ({
      ...f.anime,
      rating: f.rating,
      status: f.status,
    }));

  res.json(cleaned);
});

/* =====================================================
   REMOVE ANIME FROM USER LIST
   ===================================================== */

/**
 * Remove anime from user's list
 *
 * @route   DELETE /api/user-anime/:id
 * @access  Authenticated user
 *
 * User can delete only their own relation.
 */
exports.remove = asyncHandler(async (req, res) => {
  const relation = await UserAnime.findOne({
    _id: req.params.id,
    user: req.session.user.id,
  });

  if (!relation) {
    return res.status(404).json({
      message: "Relation not found",
    });
  }

  await relation.deleteOne();

  res.json({
    message: "Removed from user list",
  });
});