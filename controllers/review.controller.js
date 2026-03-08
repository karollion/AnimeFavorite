const Review = require("../models/review.model")
const pick = require("../utils/pickAllowedFields")

// ===============================
// CREATE REVIEW
// ===============================
exports.createReview = async (req, res) => {
  try {

    const allowed = [
      "user",
      "anime",
      "rating",
      "review_text",
      "contains_spoilers"
    ]

    const reviewData = pick(req.body, allowed)

    const existing = await Review.findOne({
      anime: reviewData.anime,
      user: req.user.id
    })

    if (existing) {
      return res.status(409).json({ message: "You already reviewed this anime" })
    }

    const review = await Review.create({
      ...reviewData,
      user: req.user.id
    })

    await updateAnimeRating(review.anime)

    res.status(201).json(review)

  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}


// ===============================
// GET REVIEWS BY ANIME
// ===============================
exports.getAnimeReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      anime: req.params.animeId,
      is_deleted: { $ne: true }
    })
      .populate("user", "login avatar")
      .sort({ createdAt: -1 })

    res.json(reviews)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// SOFT DELETE REVIEW
// ===============================
exports.deleteReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    review.is_deleted = true
    review.deleted_at = new Date()

    await review.save()

    await updateAnimeRating(review.anime)

    res.json({ message: "Review deleted" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ===============================
// UPDATE ANIME RATING FUNCTION
// ===============================
async function updateAnimeRating(animeId) {

  const stats = await Review.aggregate([
    { $match: { anime: animeId, is_deleted: { $ne: true } } },
    {
      $group: {
        _id: "$anime",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ])

  if (stats.length > 0) {

    await Anime.findByIdAndUpdate(animeId, {
      rating_avg: stats[0].avgRating,
      rating_count: stats[0].count
    })

  } else {

    await Anime.findByIdAndUpdate(animeId, {
      rating_avg: 0,
      rating_count: 0
    })

  }
}