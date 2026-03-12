/* =====================================================
   Review Model
   ===================================================== */

/**
 * @file review.model.js
 * @description Mongoose schema and model for Review entities.
 *              Handles rating, review text, spoiler flag, and recalculation
 *              of anime average rating and review count. Includes soft delete.
 */

const mongoose = require('mongoose');
const Anime = require('./anime.model');
const softDelete = require("../utils/softDelete.plugin");

/* =====================================================
   SCHEMA DEFINITION
   ===================================================== */
const ReviewSchema = new mongoose.Schema(
  {
    /** Reference to the user who wrote the review */
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    /** Reference to the anime being reviewed */
    anime: { type: mongoose.Schema.Types.ObjectId, ref: "Anime", required: true },

    /** Rating given by the user (0-10) */
    rating: { type: Number, min: 0, max: 10, required: true },

    /** Optional text review */
    review_text: { type: String, trim: true },

    /** Flag indicating whether review contains spoilers */
    contains_spoilers: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* =====================================================
   INDEXES
   ===================================================== */
// Ensure one review per user per anime
ReviewSchema.index({ user: 1, anime: 1 }, { unique: true });

// Index for fast lookup by anime
ReviewSchema.index({ anime: 1 });
ReviewSchema.index({ anime: 1, createdAt: -1 });

/* =====================================================
   HELPER FUNCTION: Recalculate anime rating
   ===================================================== */
/**
 * Recalculate average rating and count of reviews for an anime
 * @param {ObjectId} animeId - ID of the anime to recalc
 */
async function recalcAnimeRating(animeId) {
  const stats = await mongoose.model("Review").aggregate([
    { $match: { anime: animeId, is_deleted: false } },
    {
      $group: {
        _id: "$anime",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avgRating = stats.length > 0
    ? Number(stats[0].avgRating.toFixed(2))
    : 0;

  const ratingCount = stats.length > 0
    ? stats[0].count
    : 0;

  await Anime.findByIdAndUpdate(animeId, {
    rating_avg: avgRating,
    rating_count: ratingCount,
  });
}

/* =====================================================
   MIDDLEWARE HOOKS
   ===================================================== */
// After saving a review → recalc anime rating
ReviewSchema.post("save", async function () {
  await recalcAnimeRating(this.anime);
});

// After soft deleting a review → recalc anime rating
ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await recalcAnimeRating(this.anime);
  }
);

// After updating a review → recalc anime rating
ReviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await recalcAnimeRating(doc.anime);
  }
});

/* =====================================================
   PLUGINS
   ===================================================== */
ReviewSchema.plugin(softDelete);

/* =====================================================
   EXPORT MODEL
   ===================================================== */
module.exports = mongoose.model('Review', ReviewSchema);