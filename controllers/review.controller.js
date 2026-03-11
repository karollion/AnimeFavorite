const Review = require("../models/review.model");
const Anime = require("../models/anime.model");
const pick = require("../utils/pickAllowedFields");
const asyncHandler = require("../utils/asyncHandler");

// ===============================
// CREATE REVIEW
// ===============================
exports.createReview = asyncHandler(async (req, res) => {
  const allowed = [
    "anime",
    "rating",
    "review_text",
    "contains_spoilers"
  ]

  const reviewData = pick(req.body, allowed)

  const existing = await Review.findOne({
    anime: reviewData.anime,
    user: req.session.user.id
  })

  if (existing) {
    return res.status(409).json({ message: "You already reviewed this anime" })
  }

  const review = await Review.create({
    ...reviewData,
    user: req.session.user.id
  })

  res.status(201).json(review)
});


// ===============================
// GET REVIEWS BY ANIME
// ===============================
exports.getAnimeReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    anime: req.params.animeId,
  })
    .populate("user", "login avatar")
    .sort({ createdAt: -1 })
    .lean();

  res.json(reviews)
});


// ===============================
// SOFT DELETE REVIEW
// ===============================
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)

  if (!review) {
    return res.status(404).json({ message: "Review not found" })
  }

  await review.softDelete();

  res.json({ message: "Review deleted" })
});