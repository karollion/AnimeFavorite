/* =====================================================
   Review Routes
   ===================================================== */

/**
 * @file review.routes.js
 * @description Routes for managing anime reviews.
 *              Includes retrieval by anime, creation, and soft deletion.
 */

const express = require("express");
const router = express.Router();

const review = require("../controllers/review.controller");
const auth = require("../utils/authMiddleware");

/* =====================================================
   REVIEW RETRIEVAL ENDPOINTS
   ===================================================== */

/**
 * @route   GET /api/reviews/anime/:animeId
 * @desc    Get all reviews for a specific anime
 * @access  Public
 */
router.get("/anime/:animeId", review.getAnimeReviews);

/* =====================================================
   REVIEW CREATE / DELETE ENDPOINTS
   ===================================================== */

/**
 * @route   POST /api/reviews
 * @desc    Create a new review for an anime
 * @access  Private (authenticated users)
 * @middleware auth
 */
router.post("/", auth, review.createReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Soft delete a review by ID
 * @access  Private (authenticated users)
 * @middleware auth
 */
router.delete("/:id", auth, review.deleteReview);

/* =====================================================
   EXPORT ROUTER
   ===================================================== */

module.exports = router;