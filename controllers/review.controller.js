const Review = require("../models/review.model");
const Anime = require("../models/anime.model");

const pick = require("../utils/pickAllowedFields");
const asyncHandler = require("../utils/asyncHandler");

/* =====================================================
   CREATE REVIEW
   ===================================================== */

/**
 * Create new review for an anime
 *
 * @route   POST /api/reviews
 * @access  Authenticated user
 *
 * Rules:
 * - one user can review anime only once
 * - fields filtered via whitelist
 * - user taken from session (never from client)
 *
 * Security:
 * prevents impersonation & mass assignment.
 */
exports.createReview = asyncHandler(async (req, res) => {
  const allowed = [
    "anime",
    "rating",
    "review_text",
    "contains_spoilers",
  ];

  const reviewData = pick(req.body, allowed);

  /* ---------- CHECK DUPLICATE REVIEW ---------- */
  const existing = await Review.findOne({
    anime: reviewData.anime,
    user: req.session.user.id,
  });

  if (existing) {
    return res.status(409).json({
      message: "You already reviewed this anime",
    });
  }

  /* ---------- CREATE REVIEW ---------- */
  const review = await Review.create({
    ...reviewData,
    user: req.session.user.id,
  });

  res.status(201).json(review);
});

/* =====================================================
   GET REVIEWS BY ANIME
   ===================================================== */

/**
 * Get all reviews for specific anime
 *
 * @route   GET /api/anime/:animeId/reviews
 * @access  Public
 *
 * Includes:
 * - user login
 * - user avatar
 *
 * Optimized using lean() for faster reads.
 */
exports.getAnimeReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    anime: req.params.animeId,
  })
    .populate("user", "login avatar")
    .sort({ createdAt: -1 })
    .lean();

  res.json(reviews);
});

/* =====================================================
   SOFT DELETE REVIEW
   ===================================================== */

/**
 * Soft delete review
 *
 * @route   DELETE /api/reviews/:id
 * @access  Owner or Admin (middleware should verify)
 *
 * Uses schema softDelete():
 * - sets is_deleted = true
 * - sets deleted_at timestamp
 */
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      message: "Review not found",
    });
  }

  await review.softDelete();

  res.json({ message: "Review deleted" });
});