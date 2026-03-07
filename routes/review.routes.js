const express = require("express")
const router = express.Router()

const review = require("../controllers/review.controller")
const auth = require("../utils/authMiddleware")

router.get("/anime/:animeId", review.getAnimeReviews)

router.post("/", auth, review.createReview)

router.delete("/:id", auth, review.deleteReview)

module.exports = router