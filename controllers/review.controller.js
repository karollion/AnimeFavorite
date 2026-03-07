const Review = require("../models/review.model")

exports.createReview = async (req, res) => {
  try {

    const review = new Review({
      ...req.body,
      user: req.user.id
    })

    await review.save()

    res.status(201).json(review)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getAnimeReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      anime: req.params.animeId,
      is_deleted: false
    })
      .populate("user", "login avatar")

    res.json(reviews)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id)

    review.is_deleted = true
    review.deleted_at = new Date()

    await review.save()

    res.json({ message: "Review deleted" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}