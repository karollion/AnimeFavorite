const UserAnime = require("../models/userAnime.model");
const Anime = require("../models/anime.model");
const mongoose = require("mongoose");

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
    // Change the favorite flag only when it was provided.
    if (favorite_anime !== undefined) {
      userAnime.favorite_anime = favorite_anime;
    }

    // Change the watch status only when it was provided.
    if (status !== undefined) {
      userAnime.status = status;
    }

    /*
     * Update the rating only when the request explicitly contains
     * the rating property. This prevents a favorite/status update
     * from accidentally overwriting the user's existing rating.
     *
     * null or an empty string means that the user wants to remove
     * their rating.
     */
    if (Object.prototype.hasOwnProperty.call(req.body, 'rating')) {
      if (rating === null || rating === '') {
        userAnime.rating = undefined;
      } else {
        const numericRating = Number(rating);

        if (
          !Number.isFinite(numericRating) ||
          numericRating < 1 ||
          numericRating > 10
        ) {
          return res.status(400).json({
            message: 'Rating must be a number between 1 and 10.',
          });
        }

        userAnime.rating = Math.round(numericRating);
      }
    }

    await userAnime.save();

    return res.json(userAnime);
  }

  /* ---------- CREATE NEW RELATION ---------- */
  const newRelation = {
    user: userId,
    anime,
  };

  // Add only the fields that the client actually provided.
  // This prevents omitted fields from being saved as undefined.
  if (favorite_anime !== undefined) {
    newRelation.favorite_anime = favorite_anime;
  }

  if (status !== undefined) {
    newRelation.status = status;
  }

  if (rating !== undefined && rating !== null && rating !== '') {
    const numericRating = Number(rating);

    if (!Number.isFinite(numericRating) ||
        numericRating < 1 ||
        numericRating > 10) {
      return res.status(400).json({
        message: 'Rating must be a number between 1 and 10.',
      });
    }

    newRelation.rating = Math.round(numericRating);
  }

  userAnime = await UserAnime.create(newRelation);

  return res.status(201).json(userAnime);
});


/* =====================================================
   GET ANIME COMMUNITY STATISTICS
   ===================================================== */

/**
 * Get community statistics for a specific anime.
 *
 * @route   GET /api/user-anime/stats/:animeId
 * @access  Public
 *
 * Returns the number of users assigned to each watch status,
 * the total number of user-anime relations, and the number
 * of users who marked the anime as a favorite.
 */
exports.getAnimeStats = asyncHandler(async (req, res) => {
  const { animeId } = req.params;

  /* ---------- VALIDATE ANIME ID ---------- */
  if (!mongoose.isValidObjectId(animeId)) {
    return res.status(400).json({
      message: "Invalid anime ID",
    });
  }

  /* ---------- CHECK ANIME EXISTS ---------- */
  const animeExists = await Anime.exists({
    _id: animeId,
    is_deleted: { $ne: true },
  });

  if (!animeExists) {
    return res.status(404).json({
      message: "Anime not found",
    });
  }

  /* ---------- AGGREGATE USER STATISTICS ---------- */
  const results = await UserAnime.aggregate([
    {
      $match: {
        anime: new mongoose.Types.ObjectId(animeId),
      },
    },
    {
      $group: {
        _id: null,
      
        // Liczba wszystkich relacji użytkowników z tym anime.
        total: { $sum: 1 },
      
        // Liczba użytkowników, którzy dodali anime do ulubionych.
        favorites: {
          $sum: {
            $cond: [{ $eq: ["$favorite_anime", true] }, 1, 0],
          },
        },
      
        // Średnia wyłącznie z faktycznie wystawionych ocen.
        // MongoDB pomija brakujące wartości rating.
        ratingAvg: { $avg: "$rating" },
      
        // Liczba faktycznie wystawionych ocen.
        // Samo dodanie anime do listy nie zwiększa tego licznika.
        ratingCount: {
          $sum: {
            $cond: [
              { $isNumber: "$rating" },
              1,
              0,
            ],
          },
        },
      
        notWatched: {
          $sum: {
            $cond: [{ $eq: ["$status", "not watched"] }, 1, 0],
          },
        },
      
        planned: {
          $sum: {
            $cond: [{ $eq: ["$status", "planned"] }, 1, 0],
          },
        },
      
        watching: {
          $sum: {
            $cond: [{ $eq: ["$status", "watching"] }, 1, 0],
          },
        },
      
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
      
        suspended: {
          $sum: {
            $cond: [{ $eq: ["$status", "suspended"] }, 1, 0],
          },
        },
      
        abandoned: {
          $sum: {
            $cond: [{ $eq: ["$status", "abandoned"] }, 1, 0],
          },
        },
      },
    }
  ]);

  /* ---------- RETURN ZERO COUNTS WHEN NO USERS EXIST ---------- */
  const stats = results[0] || {
    total: 0,
    favorites: 0,
  
    // Brak ocen oznacza brak średniej, a nie ocenę 0.
    ratingAvg: null,
    ratingCount: 0,
  
    notWatched: 0,
    planned: 0,
    watching: 0,
    completed: 0,
    suspended: 0,
    abandoned: 0,
  };
  
  delete stats._id;
  
  res.json(stats);
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